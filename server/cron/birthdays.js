import cron from 'node-cron';
import { dbFetch, dbInsert } from '../lib/supabase.js';

export function startBirthdayCron() {
  // Run every day at 8:00 AM
  cron.schedule('0 8 * * *', async () => {
    console.log('[CRON] Running daily birthday check...');
    await checkAndNotifyBirthdays();
  });
}

export async function checkAndNotifyBirthdays() {
  try {
    const today = new Date();
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // Fetch active employees
    const employees = await dbFetch('Employees', 'id, Full_name, date_of_birth', { status: 'Active' });
    if (!employees || employees.length === 0) return;

    // Find birthday people (today up to 3 days from now)
    const birthdayPeople = employees.filter(emp => {
      if (!emp.date_of_birth) return false;
      const dob = new Date(emp.date_of_birth);
      
      // Calculate their birthday this year
      const nextBirthday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
      
      const diffTime = nextBirthday - todayDateOnly;
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      // Include if birthday is within 0 to 3 days
      return diffDays >= 0 && diffDays <= 3;
    });

    if (birthdayPeople.length === 0) {
      console.log('[CRON] No upcoming birthdays within 3 days.');
      return { success: true, count: 0 };
    }

    // Fetch all system users
    const allUsers = await dbFetch('sys_users', 'id, employee_id', { is_active: true });

    let count = 0;
    for (const birthdayBoy of birthdayPeople) {
      console.log(`[CRON] Generating notifications for ${birthdayBoy.Full_name}'s birthday...`);
      
      const dob = new Date(birthdayBoy.date_of_birth);
      const bdayDay = dob.getDate();
      
      const title = 'Upcoming Birthday! 🎂';
      const message = `${bdayDay} ရက်နေ့က ${birthdayBoy.Full_name} ရဲ့မွေးနေ့ပါ Birthday wish လုပ်ဖို့ မမေ့ပါနဲ့`;

      // Notify everyone EXCEPT the birthday boy
      const recipients = allUsers.filter(u => u.employee_id !== birthdayBoy.id);
      
      for (const user of recipients) {
        await dbInsert('system_notifications', {
          recipient_user_id: user.id,
          title: title,
          message: message,
          link_url: '/portal',
          is_read: false,
          created_at: new Date().toISOString()
        });
        count++;
      }
    }
    console.log(`[CRON] Birthday notifications sent: ${count}`);
    return { success: true, count };
  } catch (err) {
    console.error('[CRON] Error in birthday check:', err);
    return { success: false, error: err.message };
  }
}
