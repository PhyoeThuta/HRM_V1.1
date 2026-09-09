import { supabaseAdmin } from '../lib/supabase.js';

export const crmPackagesService = {
  async createPackage(customerId, packageData) {
    const { data, error } = await supabaseAdmin.schema('crm').from('customer_packages')
      .insert({ customer_id: customerId, ...packageData })
      .select()
      .single();
    if (error) throw new Error(`Database error creating package: ${error.message}`);
    return data;
  },

  async updatePackage(packageId, packageData) {
    const { data, error } = await supabaseAdmin.schema('crm').from('customer_packages')
      .update(packageData)
      .eq('id', packageId)
      .select()
      .single();
    if (error) throw new Error(`Database error updating package: ${error.message}`);
    return data;
  },

  async deletePackage(packageId) {
    const { error } = await supabaseAdmin.schema('crm').from('customer_packages')
      .delete()
      .eq('id', packageId);
    if (error) throw new Error(`Database error deleting package: ${error.message}`);
    return true;
  },

  async pausePackage(packageId) {
    // Get customer_id before pausing
    const { data: pkg, error: pkgFetchErr } = await supabaseAdmin.schema('crm').from('customer_packages')
      .select('customer_id').eq('id', packageId).single();
    if (pkgFetchErr) throw new Error(`Failed to fetch package: ${pkgFetchErr.message}`);

    const { data, error } = await supabaseAdmin.schema('crm').from('customer_packages')
      .update({ status: 'Paused' })
      .eq('id', packageId)
      .select().single();
    if (error) throw new Error(`Failed to pause package: ${error.message}`);
    
    // Auto-remove any pending daily orders for this customer from today onwards
    const today = new Date().toISOString().split('T')[0];
    await supabaseAdmin.from('operations_orders')
      .delete()
      .eq('customer_id', pkg.customer_id)
      .gte('date', today)
      .eq('delivery_status', 'PENDING');

    return { package: data, customerId: pkg.customer_id };
  },

  async notifyPause(customerId) {
    // Fetch customer info for notification
    const { data: cust } = await supabaseAdmin.schema('crm').from('customers')
      .select('full_name').eq('id', customerId).single();

    // Create system notification for BBD admins & bosses
    const notifs = ['admin', 'boss', 'operations'].map(role => ({
      recipient_role: role,
      title: 'Customer Package Paused ⏸️',
      message: `${cust?.full_name || 'A customer'}'s package was paused. Pending deliveries removed.`,
      link_url: `/crm/customers/${customerId}`,
      is_read: false,
      created_at: new Date().toISOString()
    }));
    await supabaseAdmin.from('system_notifications').insert(notifs);
  },

  async resumePackage(packageId, daysPaused) {
    const { data: pkg, error: pkgErr } = await supabaseAdmin.schema('crm').from('customer_packages')
      .select('expires_at, customer_id').eq('id', packageId).single();
    if (pkgErr) throw new Error(`Failed to fetch package: ${pkgErr.message}`);
    
    let newExpiry = pkg.expires_at;
    let daysToShift = 0;
    if (daysPaused && pkg.expires_at) {
      daysToShift = parseInt(daysPaused);
      const expDate = new Date(pkg.expires_at);
      expDate.setDate(expDate.getDate() + daysToShift);
      newExpiry = expDate.toISOString().split('T')[0];
    }

    const { data, error } = await supabaseAdmin.schema('crm').from('customer_packages')
      .update({ status: 'Active', expires_at: newExpiry })
      .eq('id', packageId)
      .select().single();
    if (error) throw new Error(`Failed to resume package: ${error.message}`);
    
    // THE RIPPLE EFFECT
    if (daysToShift > 0 && pkg.customer_id) {
       const { data: upcomingPkgs } = await supabaseAdmin.schema('crm').from('customer_packages')
         .select('id, start_date, expires_at')
         .eq('customer_id', pkg.customer_id)
         .in('status', ['Upcoming', 'Active'])
         .gt('start_date', pkg.expires_at); 
       
       if (upcomingPkgs && upcomingPkgs.length > 0) {
         for (const upkg of upcomingPkgs) {
            if (upkg.start_date && upkg.expires_at) {
               const startD = new Date(upkg.start_date);
               startD.setDate(startD.getDate() + daysToShift);
               const expD = new Date(upkg.expires_at);
               expD.setDate(expD.getDate() + daysToShift);
               
               await supabaseAdmin.schema('crm').from('customer_packages')
                 .update({
                   start_date: startD.toISOString().split('T')[0],
                   expires_at: expD.toISOString().split('T')[0]
                 })
                 .eq('id', upkg.id);
            }
         }
       }
    }
    return data;
  }
};
