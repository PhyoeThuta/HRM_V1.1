import { supabaseAdmin } from '../../../config/supabaseAdmin.js';

/**
 * Validates a bot linking code and links the LINE user ID to the corresponding system user.
 * @param {string} code The linking code (e.g., A7X9B2)
 * @param {string} lineUserId The LINE user ID to link
 * @returns {Promise<{success: boolean, user: object, error: string}>}
 */
export async function linkLineAccount(code, lineUserId) {
  try {
    // 1. Find the user with this linking code
    const { data: user, error: findError } = await supabaseAdmin
      .from('sys_users')
      .select('id, full_name, bot_linking_code')
      .eq('bot_linking_code', code)
      .single();

    if (findError || !user) {
      console.warn(`[LINE LINKING] Invalid or expired code: ${code}`);
      return { success: false, error: 'invalid_code' };
    }

    // 2. Update the user with the LINE user ID and clear the code
    const { error: updateError } = await supabaseAdmin
      .from('sys_users')
      .update({ 
        line_user_id: lineUserId,
        bot_linking_code: null // Prevent reuse
      })
      .eq('id', user.id);

    if (updateError) {
      console.error(`[LINE LINKING] Error updating user: ${updateError.message}`);
      return { success: false, error: 'update_failed' };
    }

    return { success: true, user };
  } catch (error) {
    console.error(`[LINE LINKING EXCEPTION]`, error);
    return { success: false, error: 'server_error' };
  }
}

/**
 * Generates a random alphanumeric code of specified length.
 */
function generateRandomCode(length = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluded I, 1, O, 0 for readability
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Generates and assigns a new bot linking code to a user.
 * @param {string} userId The system user ID
 * @returns {Promise<string>} The generated code
 */
export async function generateBotLinkingCode(userId) {
  const newCode = generateRandomCode(6);
  
  const { error } = await supabaseAdmin
    .from('sys_users')
    .update({ bot_linking_code: newCode })
    .eq('id', userId);

  if (error) {
    throw new Error(`Failed to generate linking code: ${error.message}`);
  }
  
  return newCode;
}
