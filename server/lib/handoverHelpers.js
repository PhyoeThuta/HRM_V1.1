import { dbFetch, dbFetchOne, dbInsert, dbUpdate } from './supabase.js';

export const TERMINAL_HANDOVER_STATUSES = ['completed', 'waived', 'cancelled'];

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

export const LONG_LEAVE_COVERAGE_ITEMS = [
  { title: 'Role summary while on leave', category: 'knowledge_transfer', owner_role: 'outgoing', sort_order: 1, is_required: true },
  { title: 'Active projects / deadlines during leave', category: 'pending_work', owner_role: 'outgoing', sort_order: 2, is_required: true },
  { title: 'Key contacts to handle', category: 'clients_contacts', owner_role: 'outgoing', sort_order: 3, is_required: true },
  { title: 'Systems / access acting person needs', category: 'systems_access', owner_role: 'outgoing', sort_order: 4, is_required: true },
  { title: 'Daily routines / SOP links', category: 'knowledge_transfer', owner_role: 'outgoing', sort_order: 5, is_required: true },
  { title: 'Pending approvals to watch', category: 'pending_work', owner_role: 'outgoing', sort_order: 6, is_required: false },
  { title: 'Shadowing / walkthrough completed', category: 'knowledge_transfer', owner_role: 'outgoing', sort_order: 7, is_required: true },
  { title: 'Notes for acting employee', category: 'other', owner_role: 'outgoing', sort_order: 8, is_required: true },
];

export const LONG_LEAVE_RETURN_ITEMS = [
  { title: 'What changed during coverage period', category: 'knowledge_transfer', owner_role: 'outgoing', sort_order: 1, is_required: true },
  { title: 'New issues or open items', category: 'pending_work', owner_role: 'outgoing', sort_order: 2, is_required: true },
  { title: 'Files / updates to review', category: 'documents', owner_role: 'outgoing', sort_order: 3, is_required: true },
  { title: 'Access to revoke from acting employee', category: 'systems_access', owner_role: 'outgoing', sort_order: 4, is_required: true },
  { title: 'Handover meeting date', category: 'other', owner_role: 'outgoing', sort_order: 5, is_required: true },
];

export function getHandoverKind(handover) {
  if (!handover) return 'unknown';
  if (handover.trigger_type === 'exit') return 'exit';
  if (handover.parent_handover_id) return 'return';
  if (handover.trigger_type === 'temporary_coverage') return 'coverage';
  return handover.trigger_type || 'unknown';
}

export function getHandoverLabel(handover) {
  const kind = getHandoverKind(handover);
  if (kind === 'exit') return 'Exit handover';
  if (kind === 'coverage') return 'Coverage handover (long leave)';
  if (kind === 'return') return 'Return handover';
  return 'Handover';
}

function computeHandoverDeadline(effectiveDate) {
  if (!effectiveDate) return null;
  const d = new Date(effectiveDate);
  d.setDate(d.getDate() - 3);
  const today = new Date().toISOString().slice(0, 10);
  return d.toISOString().slice(0, 10) < today ? today : d.toISOString().slice(0, 10);
}

export async function seedHandoverItems(handoverId, items = DEFAULT_HANDOVER_ITEMS) {
  // for (const item of items) {
  //   await dbInsert('handover_items', {
  //     handover_id: handoverId,
  //     title: item.title,
  //     category: item.category,
  //     owner_role: item.owner_role,
  //     sort_order: item.sort_order,
  //     is_required: item.is_required,
  //     status: 'pending',
  //     created_at: new Date().toISOString(),
  //   });
  // }
  const insertPromises = items.map(item => {
    return dbInsert('handover_items', {
      handover_id: handoverId,
      title: item.title,
      category: item.category,
      owner_role: item.owner_role,
      sort_order: item.sort_order,
      is_required: item.is_required,
      status: 'pending',
      created_at: new Date().toISOString(),
    });
  });
  await Promise.all(insertPromises);
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
  handover.handover_kind = getHandoverKind(handover);
  handover.handover_label = getHandoverLabel(handover);

  if (handover.leave_request_id) {
    const leave = await dbFetchOne('Leave_Request', 'start_date,end_date,status', { id: handover.leave_request_id });
    if (leave) {
      handover.leave_start = leave.start_date;
      handover.leave_end = leave.end_date;
      handover.leave_status = leave.status;
    }
  } else {
    const leave = await dbFetchOne('Leave_Request', 'start_date,end_date,status', { coverage_handover_id: handover.id });
    const returnLeave = leave ? null : await dbFetchOne('Leave_Request', 'start_date,end_date,status', { return_handover_id: handover.id });
    const linked = leave || returnLeave;
    if (linked) {
      handover.leave_start = linked.start_date;
      handover.leave_end = linked.end_date;
      handover.leave_status = linked.status;
      if (!handover.leave_request_id) handover.leave_request_id = linked.id;
    }
  }

  return handover;
}

export function isActiveHandover(h) {
  return h && !TERMINAL_HANDOVER_STATUSES.includes(h.status);
}

export function isTerminalHandoverStatus(status) {
  return TERMINAL_HANDOVER_STATUSES.includes(status);
}

export function canReplaceCoverageHandover(existing) {
  return existing && ['waived', 'cancelled'].includes(existing.status);
}

export function canStartCoverageHandover(leave, coverageHandover) {
  if (leave.status !== 'Approved') return false;
  if (!leave.coverage_handover_id || !coverageHandover) return true;
  return canReplaceCoverageHandover(coverageHandover);
}

export async function getLinkedLeaveHandovers(leave) {
  const linked = [];
  if (leave.coverage_handover_id) {
    const h = await dbFetchOne('employee_handovers', '*', { id: leave.coverage_handover_id });
    if (h) linked.push({ ...h, handover_kind: getHandoverKind(h) });
  }
  if (leave.return_handover_id) {
    const h = await dbFetchOne('employee_handovers', '*', { id: leave.return_handover_id });
    if (h) linked.push({ ...h, handover_kind: getHandoverKind(h) });
  }
  return linked;
}

export async function getActiveLinkedLeaveHandovers(leave) {
  const linked = await getLinkedLeaveHandovers(leave);
  return linked.filter(h => isActiveHandover(h));
}

export function isLeaveLinkedHandover(handover) {
  return !!(handover?.leave_request_id || (handover?.trigger_type === 'temporary_coverage' && !handover?.offboarding_id));
}

export async function notifyLeaveHandoverWaived(handover, reason) {
  if (!isLeaveLinkedHandover(handover)) return;
  const label = getHandoverKind(handover) === 'return' ? 'Return handover' : 'Leave coverage handover';
  const msg = `${label} was waived by HR: ${reason}`;
  await notifyUser(handover.outgoing_employee_id, 'Handover waived', msg, '/portal');
  if (handover.successor_employee_id) {
    await notifyUser(handover.successor_employee_id, 'Handover waived', msg, '/portal');
  }
}

export async function detachTerminalHandoversFromLeave(leave) {
  const linked = await getLinkedLeaveHandovers(leave);
  for (const h of linked) {
    if (isTerminalHandoverStatus(h.status) && h.leave_request_id === leave.id) {
      await dbUpdate('employee_handovers', h.id, {
        leave_request_id: null,
        updated_at: new Date().toISOString(),
      });
    }
  }
}

export async function getActiveHandoversForOutgoing(employeeId) {
  const all = await dbFetch('employee_handovers', '*', { outgoing_employee_id: employeeId });
  return all.filter(isActiveHandover);
}

export async function getActiveHandoversForIncoming(employeeId) {
  const all = await dbFetch('employee_handovers', '*', { successor_employee_id: employeeId });
  return all.filter(isActiveHandover);
}

function sortHandoversNewestFirst(a, b) {
  const dateA = a.approved_at || a.waived_at || a.updated_at || a.created_at || '';
  const dateB = b.approved_at || b.waived_at || b.updated_at || b.created_at || '';
  return String(dateB).localeCompare(String(dateA));
}

export async function getTerminalHandoversForOutgoing(employeeId) {
  const all = await dbFetch('employee_handovers', '*', { outgoing_employee_id: employeeId });
  return all.filter(h => isTerminalHandoverStatus(h.status)).sort(sortHandoversNewestFirst);
}

export async function getTerminalHandoversForIncoming(employeeId) {
  const all = await dbFetch('employee_handovers', '*', { successor_employee_id: employeeId });
  return all.filter(h => isTerminalHandoverStatus(h.status)).sort(sortHandoversNewestFirst);
}

export function summarizeHandoverForList(handover, itemCount = null) {
  return {
    id: handover.id,
    handover_kind: handover.handover_kind || getHandoverKind(handover),
    handover_label: handover.handover_label || getHandoverLabel(handover),
    status: handover.status,
    trigger_type: handover.trigger_type,
    outgoing_employee_id: handover.outgoing_employee_id,
    successor_employee_id: handover.successor_employee_id,
    outgoing_name: handover.outgoing_name,
    outgoing_code: handover.outgoing_code,
    successor_name: handover.successor_name,
    successor_code: handover.successor_code,
    effective_date: handover.effective_date,
    leave_start: handover.leave_start,
    leave_end: handover.leave_end,
    completion_pct: handover.completion_pct ?? 0,
    approved_at: handover.approved_at,
    waived_at: handover.waived_at,
    waived_reason: handover.waived_reason,
    created_at: handover.created_at,
    item_count: itemCount,
  };
}

export async function getHandoversForEmployee(employeeId) {
  const [outgoingAll, incomingAll] = await Promise.all([
    dbFetch('employee_handovers', '*', { outgoing_employee_id: employeeId }),
    dbFetch('employee_handovers', '*', { successor_employee_id: employeeId }),
  ]);
  const sortFn = (a, b) => sortHandoversNewestFirst(a, b);
  outgoingAll.sort(sortFn);
  incomingAll.sort(sortFn);
  for (const h of [...outgoingAll, ...incomingAll]) await enrichHandover(h);

  const outgoingSummaries = outgoingAll.map(h => summarizeHandoverForList(h));
  const incomingSummaries = incomingAll.map(h => summarizeHandoverForList(h));

  return {
    outgoing: outgoingSummaries,
    incoming: incomingSummaries,
    counts: {
      outgoing_active: outgoingAll.filter(isActiveHandover).length,
      outgoing_completed: outgoingAll.filter(h => h.status === 'completed').length,
      incoming_active: incomingAll.filter(isActiveHandover).length,
      incoming_completed: incomingAll.filter(h => h.status === 'completed').length,
    },
  };
}

export function filterHandoversList(handovers, { status, trigger_type, employee_id } = {}) {
  let result = handovers;
  if (status === 'active') {
    result = result.filter(isActiveHandover);
  } else if (status && status !== 'all') {
    result = result.filter(h => h.status === status);
  }
  if (trigger_type) {
    result = result.filter(h => h.trigger_type === trigger_type);
  }
  if (employee_id) {
    result = result.filter(
      h => h.outgoing_employee_id === employee_id || h.successor_employee_id === employee_id
    );
  }
  return result;
}

/** Items the returning/acting successor must acknowledge before HR can approve */
export async function getSuccessorAckSummary(handoverId) {
  const items = await dbFetch('handover_items', '*', { handover_id: handoverId });
  const needsAck = items.filter(i => i.status === 'done' || i.status === 'not_applicable');
  const acked = needsAck.filter(i => i.successor_acknowledged);
  return {
    total: needsAck.length,
    acked: acked.length,
    allAcked: needsAck.length > 0 && acked.length === needsAck.length,
    pending: needsAck.filter(i => !i.successor_acknowledged),
  };
}

export function handoverRequiresSuccessorAck(handover) {
  return !!(handover?.successor_employee_id);
}

export async function validateHandoverApproval(handover) {
  if (!handover) return { ok: false, error: 'Handover not found' };
  if (handover.status !== 'pending_review') {
    return {
      ok: false,
      error: 'Handover must be submitted for review before HR approval. The outgoing employee completes the checklist and submits from Portal → My Handovers.',
    };
  }
  if (handoverRequiresSuccessorAck(handover)) {
    const ack = await getSuccessorAckSummary(handover.id);
    if (ack.total === 0) {
      return {
        ok: false,
        error: 'No completed items to acknowledge yet. Outgoing employee must fill and submit the checklist first.',
        successor_ack: ack,
      };
    }
    if (!ack.allAcked) {
      return {
        ok: false,
        error: `Successor must acknowledge all handover items first (${ack.acked}/${ack.total} acknowledged). They can do this from Portal → Incoming Handover.`,
        successor_ack: ack,
      };
    }
  }
  return { ok: true };
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

  const handover = await dbInsert('employee_handovers', {
    outgoing_employee_id: offboarding.employee_id,
    trigger_type: 'exit',
    offboarding_id: offboarding.id,
    effective_date: effectiveDate,
    handover_deadline: computeHandoverDeadline(effectiveDate),
    status: 'pending_successor',
    successor_type: 'existing',
    created_by_user_id: createdByUserId || null,
    created_at: new Date().toISOString(),
  });

  if (!handover) return null;

  await seedHandoverItems(handover.id, DEFAULT_HANDOVER_ITEMS);

  await dbUpdate('corporate_offboarding', offboarding.id, {
    handover_id: handover.id,
    handover_required: true,
    updated_at: new Date().toISOString(),
  });

  return handover;
}

export async function getOffboardingWarningForEmployee(employeeId) {
  if (!employeeId) return null;
  const ob = await dbFetchOne('corporate_offboarding', 'id,last_working_date', { employee_id: employeeId });
  if (!ob) return null;
  return {
    code: 'employee_in_offboarding',
    message:
      'This employee has an active offboarding case. Leave and offboarding will run in parallel — continue tracking laptop return, NDA, exit interview, and settlement on Offboarding.',
    offboarding_id: ob.id,
    last_working_date: ob.last_working_date || null,
  };
}

export async function createHandoverForLongLeave(leave, { successorEmployeeId, createdByUserId }) {
  if (!successorEmployeeId) return { error: 'Acting successor is required' };
  if (leave.status !== 'Approved') return { error: 'Leave must be approved before starting coverage handover' };
  if (leave.coverage_handover_id) {
    const existing = await dbFetchOne('employee_handovers', 'id,status', { id: leave.coverage_handover_id });
    if (existing) {
      if (existing.status === 'completed') {
        return { error: 'Coverage handover is already completed for this leave' };
      }
      if (isActiveHandover(existing)) {
        return { error: 'An active coverage handover already exists for this leave' };
      }
      if (!canReplaceCoverageHandover(existing)) {
        return { error: 'Coverage handover already exists for this leave' };
      }
    }
  }

  const startDate = (leave.start_date || '').slice(0, 10);
  const endDate = (leave.end_date || '').slice(0, 10);

  const handover = await dbInsert('employee_handovers', {
    outgoing_employee_id: leave.employee_id,
    successor_employee_id: successorEmployeeId,
    successor_type: 'temporary',
    trigger_type: 'temporary_coverage',
    leave_request_id: leave.id,
    effective_date: startDate || null,
    expected_return_date: endDate || null,
    handover_deadline: computeHandoverDeadline(startDate),
    status: 'in_progress',
    created_by_user_id: createdByUserId || null,
    created_at: new Date().toISOString(),
  });

  if (!handover) return { error: 'Failed to create coverage handover' };

  await seedHandoverItems(handover.id, LONG_LEAVE_COVERAGE_ITEMS);

  await dbUpdate('Leave_Request', leave.id, {
    coverage_handover_id: handover.id,
  });

  const acting = await dbFetchOne('Employees', 'Full_name', { id: successorEmployeeId });
  const actingName = acting?.Full_name || 'colleague';
  await notifyUser(
    leave.employee_id,
    'Coverage handover started',
    `Please complete your handover checklist before your leave. Acting cover: ${actingName}.`,
    '/portal/handover/outgoing'
  );
  await notifyUser(
    successorEmployeeId,
    'Acting coverage assigned',
    'You have been assigned to cover during a colleague\'s leave. Review the handover when ready.',
    '/portal/handover/incoming'
  );

  const warning = await getOffboardingWarningForEmployee(leave.employee_id);
  return { handover, warning };
}

export async function createReturnHandover(parentHandover, createdByUserId) {
  if (!parentHandover || getHandoverKind(parentHandover) !== 'coverage') {
    return { error: 'Parent must be a completed coverage handover' };
  }
  if (parentHandover.status !== 'completed') {
    return { error: 'Coverage handover must be completed before starting return handover' };
  }
  if (!parentHandover.successor_employee_id) {
    return { error: 'Coverage handover has no acting employee' };
  }

  const leave = parentHandover.leave_request_id
    ? await dbFetchOne('Leave_Request', '*', { id: parentHandover.leave_request_id })
    : null;

  if (leave?.return_handover_id) {
    return { error: 'Return handover already exists for this leave' };
  }

  const today = new Date().toISOString().slice(0, 10);
  const endDate = (leave?.end_date || parentHandover.expected_return_date || '').slice(0, 10);
  if (endDate && endDate > today) {
    return { error: 'Return handover can only start after leave end date' };
  }

  const handover = await dbInsert('employee_handovers', {
    outgoing_employee_id: parentHandover.successor_employee_id,
    successor_employee_id: parentHandover.outgoing_employee_id,
    successor_type: 'temporary',
    trigger_type: 'temporary_coverage',
    leave_request_id: parentHandover.leave_request_id || null,
    parent_handover_id: parentHandover.id,
    effective_date: today,
    expected_return_date: null,
    handover_deadline: today,
    status: 'in_progress',
    created_by_user_id: createdByUserId || null,
    created_at: new Date().toISOString(),
  });

  if (!handover) return { error: 'Failed to create return handover' };

  await seedHandoverItems(handover.id, LONG_LEAVE_RETURN_ITEMS);

  if (leave) {
    await dbUpdate('Leave_Request', leave.id, { return_handover_id: handover.id });
  }

  await notifyUser(
    parentHandover.successor_employee_id,
    'Return handover started',
    'Please document what changed during your acting coverage period.',
    '/portal/handover/outgoing'
  );
  await notifyUser(
    parentHandover.outgoing_employee_id,
    'Welcome back — review return handover',
    'Your acting colleague has prepared a return handover. Please review and acknowledge.',
    '/portal/handover/incoming'
  );

  return { handover };
}

export async function enrichLeaveWithHandoverFlags(leave, handoverMap = {}) {
  const coverage = leave.coverage_handover_id ? handoverMap[leave.coverage_handover_id] : null;
  const ret = leave.return_handover_id ? handoverMap[leave.return_handover_id] : null;

  leave.coverage_handover_status = coverage?.status || null;
  leave.return_handover_status = ret?.status || null;
  leave.coverage_handover_pct = coverage?.completion_pct ?? null;
  leave.return_handover_pct = ret?.completion_pct ?? null;

  const today = new Date().toISOString().slice(0, 10);
  const endDate = (leave.end_date || '').slice(0, 10);

  leave.can_start_coverage = canStartCoverageHandover(leave, coverage);

  leave.can_start_return =
    coverage?.status === 'completed' &&
    !leave.return_handover_id &&
    (!endDate || endDate <= today);

  leave.has_coverage_handover = !!leave.coverage_handover_id;
  leave.has_return_handover = !!leave.return_handover_id;
  leave.can_view_coverage_history = !!leave.coverage_handover_id;
  leave.can_view_return_history = !!leave.return_handover_id;
  leave.coverage_handover_is_terminal = coverage ? isTerminalHandoverStatus(coverage.status) : false;
  leave.return_handover_is_terminal = ret ? isTerminalHandoverStatus(ret.status) : false;

  const activeLinked = [];
  if (coverage && isActiveHandover(coverage)) {
    activeLinked.push({ ...coverage, kind: 'coverage' });
  }
  if (ret && isActiveHandover(ret)) {
    activeLinked.push({ ...ret, kind: 'return' });
  }
  leave.has_active_leave_handover = activeLinked.length > 0;
  leave.can_delete_leave = activeLinked.length === 0;
  if (!leave.can_delete_leave) {
    const first = activeLinked[0];
    leave.delete_blocked_reason =
      `Cannot delete while ${first.kind} handover is active (${first.status?.replace(/_/g, ' ')}). Waive or complete the handover first.`;
  } else {
    leave.delete_blocked_reason = null;
  }

  return leave;
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
