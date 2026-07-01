import { dbFetch, dbFetchOne, dbInsert, dbUpdate } from './supabase.js';

export const DEFAULT_HANDOVER_ITEMS = [
  { title: 'Role summary', category: 'knowledge_transfer', owner_role: 'outgoing', sort_order: 1, is_required: true },
  { title: 'Daily & weekly responsibilities', category: 'knowledge_transfer', owner_role: 'outgoing', sort_order: 2, is_required: true },
  { title: 'Open projects & tasks', category: 'pending_work', owner_role: 'outgoing', sort_order: 3, is_required: true },
  { title: 'Pending approvals you own', category: 'pending_work', owner_role: 'outgoing', sort_order: 4, is_required: false },
  { title: 'Key internal contacts', category: 'clients_contacts', owner_role: 'outgoing', sort_order: 5, is_required: true },
  { title: 'Key external contacts (clients/vendors)', category: 'clients_contacts', owner_role: 'outgoing', sort_order: 6, is_required: false },
  { title: 'Important file & folder locations', category: 'documents', owner_role: 'outgoing', sort_order: 7, is_required: true },
  { title: 'Handover document upload', category: 'documents', owner_role: 'outgoing', sort_order: 8, is_required: true },
  { title: 'Systems & tools used', category: 'systems_access', owner_role: 'outgoing', sort_order: 9, is_required: true },
  { title: 'Training / shadowing given to successor', category: 'knowledge_transfer', owner_role: 'outgoing', sort_order: 10, is_required: true },
  { title: 'Common issues & how to solve them', category: 'knowledge_transfer', owner_role: 'outgoing', sort_order: 11, is_required: false },
  { title: 'Outstanding expenses or company assets in your care', category: 'pending_work', owner_role: 'outgoing', sort_order: 12, is_required: false },
];

export async function seedHandoverItems(handoverId) {
  for (const item of DEFAULT_HANDOVER_ITEMS) {
    await dbInsert('handover_items', {
      handover_id: handoverId,
      title: item.title,
      category: item.category,
      owner_role: item.owner_role,
      sort_order: item.sort_order,
      is_required: item.is_required,
      status: 'pending',
      created_at: new Date().toISOString(),
    });
  }
}

export async function recalcHandoverCompletion(handoverId) {
  const items = await dbFetch('handover_items', '*', { handover_id: handoverId });
  if (!items.length) return { pct: 0, allRequiredDone: false };

  const required = items.filter(i => i.is_required !== false);
  const requiredDone = required.filter(i => i.status === 'done' || i.status === 'not_applicable');
  const pct = required.length
    ? Math.round((requiredDone.length / required.length) * 100)
    : 100;

  await dbUpdate('employee_handovers', handoverId, {
    completion_pct: pct,
    updated_at: new Date().toISOString(),
  });

  return { pct, allRequiredDone: requiredDone.length === required.length, items };
}

export async function enrichHandover(handover) {
  if (!handover) return null;
  const employees = await dbFetch('Employees', 'id,Full_name,employee_id,Manager_id');
  const empMap = Object.fromEntries(employees.map(e => [e.id, e]));

  handover.outgoing_name = empMap[handover.outgoing_employee_id]?.Full_name || '—';
  handover.outgoing_code = empMap[handover.outgoing_employee_id]?.employee_id || '—';
  handover.successor_name = handover.successor_employee_id
    ? (empMap[handover.successor_employee_id]?.Full_name || '—')
    : null;
  handover.successor_code = handover.successor_employee_id
    ? (empMap[handover.successor_employee_id]?.employee_id || '—')
    : null;

  return handover;
}

export async function syncKnowledgeTransferFromHandover(handoverId) {
  const handover = await dbFetchOne('employee_handovers', '*', { id: handoverId });
  if (!handover || !handover.offboarding_id) return;

  if (handover.status === 'completed' || handover.status === 'waived') {
    await dbUpdate('corporate_offboarding', handover.offboarding_id, {
      knowledge_transfer: true,
      updated_at: new Date().toISOString(),
    });

    const ktTasks = await dbFetch('offboarding_case_tasks', 'id,task_name,category,status', { offboarding_id: handover.offboarding_id });
    for (const t of ktTasks) {
      if (
        t.category === 'Knowledge Transfer' ||
        (t.task_name && (t.task_name.includes('Knowledge Transfer') || t.task_name.includes('Handover')))
      ) {
        if (t.status !== 'Completed') {
          await dbUpdate('offboarding_case_tasks', t.id, {
            status: 'Completed',
            completed_at: new Date().toISOString(),
          });
        }
      }
    }
  }
}

export async function createHandoverForOffboarding(offboarding, createdByUserId) {
  const effectiveDate = offboarding.last_working_date || offboarding.last_working_day || null;
  let handoverDeadline = null;
  if (effectiveDate) {
    const d = new Date(effectiveDate);
    d.setDate(d.getDate() - 3);
    handoverDeadline = d.toISOString().slice(0, 10);
  }

  const handover = await dbInsert('employee_handovers', {
    outgoing_employee_id: offboarding.employee_id,
    trigger_type: 'exit',
    offboarding_id: offboarding.id,
    effective_date: effectiveDate,
    handover_deadline: handoverDeadline,
    status: 'pending_successor',
    successor_type: 'existing',
    created_by_user_id: createdByUserId || null,
    created_at: new Date().toISOString(),
  });

  if (!handover) return null;

  await seedHandoverItems(handover.id);

  await dbUpdate('corporate_offboarding', offboarding.id, {
    handover_id: handover.id,
    handover_required: true,
    updated_at: new Date().toISOString(),
  });

  return handover;
}

export async function isHandoverBlockingSettlement(offboarding) {
  if (offboarding?.handover_required === false) return false;
  if (!offboarding?.handover_id) return false;

  const handover = await dbFetchOne('employee_handovers', 'status', { id: offboarding.handover_id });
  if (!handover) return true;
  return !['completed', 'waived'].includes(handover.status);
}

export async function notifyUser(employeeId, title, message, linkUrl = '/portal') {
  if (!employeeId) return;
  const user = await dbFetchOne('sys_users', 'id', { employee_id: employeeId });
  if (!user) return;
  await dbInsert('system_notifications', {
    recipient_user_id: user.id,
    title,
    message,
    link_url: linkUrl,
    is_read: false,
    created_at: new Date().toISOString(),
  });
}

export async function auditLog(req, action, details) {
  await dbInsert('sys_audit_logs', {
    user_id: req.user?.id,
    user_name: req.user?.full_name || req.user?.username,
    action,
    module: 'Handover',
    details,
    created_at: new Date().toISOString(),
  }).catch(console.error);
}
