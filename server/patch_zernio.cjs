const fs = require('fs');
const path = require('path');

const targetFile = path.resolve('c:/Users/Phyoe/Desktop/hrm_react/server/routes/operations.js');
let content = fs.readFileSync(targetFile, 'utf8');

// 1. Add sendDeliveryZernioMessage helper function
const helperLogic = `
async function sendDeliveryZernioMessage(customerId, orderId) {
  try {
    const { data: customer } = await supabaseAdmin.schema('crm').from('customers').select('full_name, facebook_name').eq('id', customerId).single();
    if (!customer) return;

    let { data: inquiries } = await supabaseAdmin.schema('crm').from('inquiries').select('id').eq('customer_id', customerId);
    if ((!inquiries || inquiries.length === 0) && customer.facebook_name) {
      const { data: fbInquiries } = await supabaseAdmin.schema('crm').from('inquiries').select('id').ilike('prospect_name', customer.facebook_name);
      if (fbInquiries && fbInquiries.length > 0) inquiries = fbInquiries;
    }
    if (!inquiries || inquiries.length === 0) return;

    const inquiryIds = inquiries.map(i => i.id);
    const { data: prospectMsgs } = await supabaseAdmin.schema('crm').from('inquiries_messages').select('metadata').in('inquiry_id', inquiryIds).eq('sender_type', 'prospect').not('metadata', 'is', null).order('created_at', { ascending: false }).limit(1);

    if (!prospectMsgs || prospectMsgs.length === 0) return;
    const meta = prospectMsgs[0].metadata;
    const conversationId = meta?.message?.conversationId || meta?.conversationId;
    if (!conversationId) return;

    const zernioApiKey = process.env.ZERNIO_API_KEY;
    if (!zernioApiKey) return;

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const feedbackLink = \`\${frontendUrl}/feedback/\${customerId}\`;

    const text = \`မင်္ဂလာပါရှင့်။ ယနေ့အတွက် Busy Boss Diet ရဲ့ နေ့လယ်စာ/ညစာ လေး ပို့ဆောင်ပေးပြီးပါပြီ။ အရသာနဲ့ ပတ်သက်ပြီးဖြစ်စေ၊ Delivery နဲ့ ပတ်သက်ပြီးဖြစ်စေ အထွေထွေ ကိစ္စတွေအတွက်ဖြစ်စေ အကြံပြုလိုပါက (သို့မဟုတ်) တိုင်ကြားလိုပါက အောက်ပါ Link လေးမှတစ်ဆင့် ဝင်ရောက်ရေးသားနိုင်ပါတယ်ရှင့် 👇\\n\\n\${feedbackLink}\`;

    const zernioUrl = \`https://zernio.com/api/v1/inbox/conversations/\${conversationId}/messages\`;
    await fetch(zernioUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${zernioApiKey}\` },
      body: JSON.stringify({
        accountId: process.env.ZERNIO_ACCOUNT_ID || '6a4c8e0e9d9472faaea1c230',
        content: text,
        messageType: 'text',
        isPrivate: false
      })
    });
    console.log(\`[ZERNIO] Sent delivery feedback link to customer \${customerId}\`);
  } catch (err) {
    console.error('[ZERNIO DELIVERY ERROR]', err.message);
  }
}
`;

if (!content.includes('sendDeliveryZernioMessage')) {
  // Insert helper right before the batch-status endpoint
  content = content.replace("router.put('/orders/batch-status', async (req, res) => {", helperLogic + "\\nrouter.put('/orders/batch-status', async (req, res) => {");
}

// 2. Add to batch-status
const batchEndTarget = `            }
          }
        }
      }
    }
    
    return res.json({ success: true, updatedCount: updatedOrders?.length || 0 });`;

const batchEndReplace = `            }
          }
        }
        // SEND AUTOMATED MESSENGER FEEDBACK LINK
        sendDeliveryZernioMessage(order.customer_id, order.id);
      }
    }
    
    return res.json({ success: true, updatedCount: updatedOrders?.length || 0 });`;

content = content.replace(batchEndTarget, batchEndReplace);

// 3. Add to /:id/status
const singleStatusTarget = `          count,
          daily_menus (`;
          
const singleStatusReplace = `          customer_id,
          count,
          daily_menus (`;

content = content.replace(singleStatusTarget, singleStatusReplace);

const singleEndTarget = `          }
        }
      }
    }
    
    return res.json(result);`;

const singleEndReplace = `          }
        }
        
        // SEND AUTOMATED MESSENGER FEEDBACK LINK
        sendDeliveryZernioMessage(orderDetails.customer_id, id);
      }
    }
    
    return res.json(result);`;

content = content.replace(singleEndTarget, singleEndReplace);

fs.writeFileSync(targetFile, content);
console.log('Successfully added sendDeliveryZernioMessage to operations.js');
