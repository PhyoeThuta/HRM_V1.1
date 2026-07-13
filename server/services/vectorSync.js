import cron from 'node-cron';
import { supabaseAdmin } from '../lib/supabase.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "text-embedding-004" }); // Standard Gemini embedding model

/**
 * Generate a 768-dimensional embedding for a text string
 */
async function generateEmbedding(text) {
  if (!process.env.GEMINI_API_KEY) return null;
  try {
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error('[VectorSync] Embedding Error:', error);
    return null;
  }
}

/**
 * Generic sync function for a table
 */
async function syncTable(schemaName, tableName, formatContentFn) {
  console.log(`[VectorSync] Syncing ${schemaName}.${tableName}...`);
  try {
    // 1. Fetch all records (In a real system, you'd fetch only updated_at > last_sync_time)
    // To keep it simple for the MVP, we'll fetch all and upsert. 
    // Supabase will overwrite if content is the same, but it's safe.
    const { data: records, error } = await supabaseAdmin.schema(schemaName).from(tableName).select('*');
    if (error) throw error;
    if (!records || records.length === 0) return;

    // 2. Fetch existing vectors from ai_knowledge_base to avoid regenerating if not needed
    const { data: existingVectors } = await supabaseAdmin
      .from('ai_knowledge_base')
      .select('source_id, updated_at')
      .eq('source_table', `${schemaName}.${tableName}`);
    
    const existingMap = new Map();
    if (existingVectors) {
      existingVectors.forEach(v => existingMap.set(v.source_id, new Date(v.updated_at).getTime()));
    }

    let updatedCount = 0;

    for (const record of records) {
      const recordUpdatedAt = record.updated_at ? new Date(record.updated_at).getTime() : Date.now();
      const existingUpdatedAt = existingMap.get(String(record.id));

      // Skip if already synced and not updated
      // If the record doesn't have an updated_at, it will always be treated as new unless we just rely on presence
      if (existingUpdatedAt && recordUpdatedAt <= existingUpdatedAt) {
        continue;
      }

      const contentText = formatContentFn(record);
      if (!contentText) continue;

      const embedding = await generateEmbedding(contentText);
      if (!embedding) continue;

      // Upsert to AI knowledge base
      const { error: upsertErr } = await supabaseAdmin.from('ai_knowledge_base').upsert({
        source_table: `${schemaName}.${tableName}`,
        source_id: String(record.id),
        content: contentText,
        embedding: embedding,
        updated_at: record.updated_at || new Date().toISOString()
      }, { onConflict: 'source_table,source_id' });

      if (upsertErr) {
        console.error(`[VectorSync] Error upserting ${tableName}:${record.id}`, upsertErr);
      } else {
        updatedCount++;
      }
      
      // Delay to avoid hitting rate limits
      await new Promise(r => setTimeout(r, 300));
    }
    
    console.log(`[VectorSync] ${schemaName}.${tableName} sync complete. Updated ${updatedCount} records.`);
  } catch (err) {
    console.error(`[VectorSync] Failed to sync ${schemaName}.${tableName}:`, err);
  }
}

/**
 * Format functions to turn database rows into readable AI context
 */
const formatters = {
  customer: (c) => `Customer Name: ${c.full_name}, Code: ${c.customer_code}, Age: ${c.age}, Gender: ${c.gender}, Phone: ${c.phone}. Notes: ${c.notes || 'None'}.`,
  menu: (m) => `Menu Item: ${m.name_en} (${m.name_mm}), Code: ${m.code}, Price: $${m.sales_prices}.`,
  item: (i) => `Inventory Item: ${i.name_eng} (${i.name_mm}), Code: ${i.item_code}, Category: ${i.category}, Unit: ${i.unit_of_measure}.`
};

/**
 * Main sync job
 */
export async function runVectorSync() {
  if (!process.env.GEMINI_API_KEY) {
    console.log('[VectorSync] Skipped - GEMINI_API_KEY is not configured.');
    return;
  }
  console.log('[VectorSync] Starting background sync...');
  
  await syncTable('crm', 'customers', formatters.customer);
  await syncTable('operations', 'menus', formatters.menu);
  await syncTable('inventory', 'items', formatters.item);
  
  console.log('[VectorSync] Background sync finished.');
}

// Start the cron job (Runs every 30 minutes)
export function startVectorSyncCron() {
  console.log('[VectorSync] Cron job scheduled (Every 30 minutes).');
  // First run 10 seconds after server starts to populate MVP data
  setTimeout(runVectorSync, 10000);
  
  // Then schedule every 30 minutes
  cron.schedule('*/30 * * * *', () => {
    runVectorSync();
  });
}
