require('dotenv').config();

async function updateRole() {
  const url = `${process.env.SUPABASE_URL}/rest/v1/sys_users?username=eq.cnx-0028`;
  const key = process.env.SUPABASE_KEY;

  try {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ role: 'manager' })
    });
    
    const data = await res.json();
    console.log('Update result:', data);
  } catch (err) {
    console.error('Error updating role:', err);
  }
}

updateRole();
