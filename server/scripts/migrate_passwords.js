import { supabase } from '../lib/supabase.js';
import bcryptjs from 'bcryptjs';

async function migratePasswords() {
  console.log('Starting password migration...');
  let migratedCount = 0;
  let errorCount = 0;
  let alreadyMigratedCount = 0;

  const { data: users, error } = await supabase.from('sys_users').select('id, username, password_hash');
  
  if (error) {
    console.error('Failed to fetch users:', error);
    process.exit(1);
  }

  console.log(`Found ${users.length} users. Migrating...`);

  for (const user of users) {
    let stored = user.password_hash || '';
    
    // Check if already bcrypt (starts with $2b$ or $2a$)
    // Or if it starts with MUST_CHANGE: and the rest is bcrypt
    let isAlreadyMigrated = false;
    let actualHash = stored;
    let prefix = '';
    
    if (stored.startsWith('MUST_CHANGE:')) {
      prefix = 'MUST_CHANGE:';
      actualHash = stored.substring(12);
    }
    
    if (actualHash.startsWith('$2b$') || actualHash.startsWith('$2a$')) {
      isAlreadyMigrated = true;
    }
    
    if (isAlreadyMigrated) {
      alreadyMigratedCount++;
      continue; // Skip
    }

    // Now actualHash is a plain SHA256 string. We hash it with bcrypt.
    try {
      const newBcryptHash = bcryptjs.hashSync(actualHash, 10);
      const finalHash = prefix + newBcryptHash;

      const { error: updateError } = await supabase
        .from('sys_users')
        .update({ password_hash: finalHash })
        .eq('id', user.id);

      if (updateError) {
        console.error(`Failed to update user ${user.username}:`, updateError);
        errorCount++;
      } else {
        migratedCount++;
      }
    } catch (e) {
      console.error(`Error hashing password for user ${user.username}:`, e);
      errorCount++;
    }
  }

  console.log('Migration completed.');
  console.log(`Successfully migrated: ${migratedCount}`);
  console.log(`Already migrated: ${alreadyMigratedCount}`);
  console.log(`Failed: ${errorCount}`);
}

migratePasswords().catch(console.error);
