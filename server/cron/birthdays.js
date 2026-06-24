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
    // Target date: exactly 3 days from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3);
    
    // We only care about Month and Day
    const targetMonth = targetDate.getMonth() + 1; // 1-12
    const targetDay = targetDate.getDate(); // 1-31

    // Fetch active employees
    const employees = await dbFetch('Employees', 'id, Full_name, date_of_birth', { status: 'Active' });
    if (!employees || employees.length === 0) return;

    // Find birthday people
    const birthdayPeople = employees.filter(emp => {
      if (!emp.date_of_birth) return false;
      const dob = new Date(emp.date_of_birth);
      return (dob.getMonth() + 1 === targetMonth) && (dob.getDate() === targetDay);
    });

    if (birthdayPeople.length === 0) {
      console.log('[CRON] No upcoming birthdays in 3 days.');
      return { success: true, count: 0 };
    }

    // Fetch all system users
    const allUsers = await dbFetch('sys_users', 'id, employee_id', { is_active: true });

    let count = 0;
    for (const birthdayBoy of birthdayPeople) {
      console.log(`[CRON] Generating notifications for ${birthdayBoy.Full_name}'s birthday...`);
      
      const targetDateStr = targetDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const title = 'Upcoming Birthday! 🎂';
      const message = `On ${targetDateStr}, it will be ${birthdayBoy.Full_name}'s birthday! Don't forget to send them a wish!`;

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
