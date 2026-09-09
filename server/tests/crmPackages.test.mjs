import { supabaseAdmin } from '../lib/supabase.js';
import { crmPackagesService } from '../services/crmPackagesService.js';
import { packageBodySchema } from '../schemas/crmPackagesSchema.js';

async function runTests() {
  console.log('🧪 Starting Integration Test for CRM Packages...');
  let testCustomerId = null;
  let testPackageId = null;

  try {
    // 1. Create a dummy customer
    console.log('➡️ Creating dummy customer...');
    const { data: customer, error: custErr } = await supabaseAdmin.schema('crm').from('customers')
      .insert({ customer_code: 'TEST-999', full_name: 'TEST_USER_DO_NOT_USE', phone: '09123456789' })
      .select().single();
    if (custErr) throw custErr;
    testCustomerId = customer.id;
    console.log('✅ Dummy customer created:', testCustomerId);

    // 2. Validate package data using Zod
    console.log('➡️ Testing Zod validation...');
    const rawData = {
      name: 'Test Plan',
      duration: '1 Month',
      meal_type: 'LUNCH ONLY',
      meal_count: 24,
      amount: 50000,
      start_date: '2026-09-09',
      expires_at: '2026-10-09'
    };
    const validatedData = packageBodySchema.parse(rawData);
    console.log('✅ Validation passed');

    // 3. Create Package via Service
    console.log('➡️ Creating package via service...');
    const pkg = await crmPackagesService.createPackage(testCustomerId, validatedData);
    testPackageId = pkg.id;
    console.log('✅ Package created:', testPackageId);

    // 4. Pause Package
    console.log('➡️ Pausing package...');
    const pauseResult = await crmPackagesService.pausePackage(testPackageId);
    if (pauseResult.package.status !== 'Paused') throw new Error('Package status is not Paused');
    console.log('✅ Package paused successfully');

    // 5. Resume Package (Shift by 5 days)
    console.log('➡️ Resuming package (+5 days)...');
    const resumedPkg = await crmPackagesService.resumePackage(testPackageId, 5);
    if (resumedPkg.status !== 'Active') throw new Error('Package status is not Active');
    if (resumedPkg.expires_at !== '2026-10-14') throw new Error(`Expiry shift failed. Expected 2026-10-14, got ${resumedPkg.expires_at}`);
    console.log('✅ Package resumed and expiry date correctly shifted to 2026-10-14');

    console.log('🎉 All CRM Package tests passed successfully!');

  } catch (err) {
    console.error('❌ Test Failed:', err.message || err);
    if (err.errors) console.error('Zod Validation Errors:', err.errors);
  } finally {
    // Cleanup
    if (testCustomerId) {
      console.log('🧹 Cleaning up test data...');
      await supabaseAdmin.schema('crm').from('customers').delete().eq('id', testCustomerId);
      console.log('✅ Cleanup complete.');
    }
    process.exit(0);
  }
}

runTests();
