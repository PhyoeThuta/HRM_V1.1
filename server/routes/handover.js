import express from 'express';
import multer from 'multer';
import { supabase, dbFetch, dbFetchOne, dbInsert, dbUpdate } from '../lib/supabase.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';
import {
  enrichHandover,
  recalcHandoverCompletion,
  syncKnowledgeTransferFromHandover,
  createHandoverForOffboarding,
  createHandoverForLongLeave,
  createReturnHandover,
  getActiveHandoversForOutgoing,
  getActiveHandoversForIncoming,
  getTerminalHandoversForOutgoing,
  getTerminalHandoversForIncoming,
  getSuccessorAckSummary,
  handoverRequiresSuccessorAck,
  notifyLeaveHandoverWaived,
  summarizeHandoverForList,
  filterHandoversList,
  getHandoversForEmployee,
  isActiveHandover,
  notifyUser,
  auditLog,
} from '../lib/handoverHelpers.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(verifyToken);

const adminRoles = ['boss', 'hr_manager', 'general_manager', 'admin'];

function isAdmin(user) {
  return user && adminRoles.includes(user.role);
}

async function loadHandoverDetail(handoverId) {
  const handover = await dbFetchOne('employee_handovers', '*', { id: handoverId });
  if (!handover) return null;
  await enrichHandover(handover);
  const items = await dbFetch('handover_items', '*', { handover_id: handoverId }, { order: 'sort_order', ascending: true });
  const attachments = await dbFetch('handover_attachments', '*', { handover_id: handoverId });
  const employees = await dbFetch('Employees', 'id,Full_name,employee_id', { status: 'Active' });
  const successor_ack = await getSuccessorAckSummary(handoverId);
  handover.successor_ack = successor_ack;
  return { handover, items, attachments, employees, successor_ack };
}

// GET /api/handover — admin list with filters
router.get('/', requireAdmin, async (req, res) => {
  try {
    const { status = 'all', trigger_type, employee_id, limit = '50', offset = '0' } = req.query;
    let handovers = await dbFetch('employee_handovers', '*', {}, { order: 'created_at', ascending: false });
    handovers = filterHandoversList(handovers, { status, trigger_type, employee_id });

    const total = handovers.length;
    const off = Math.max(0, parseInt(offset, 10) || 0);
    const lim = Math.min(200, Math.max(1, parseInt(limit, 10) || 50));
    const page = handovers.slice(off, off + lim);

    const summaries = [];
    for (const h of page) {
      await enrichHandover(h);
      const items = await dbFetch('handover_items', 'id', { handover_id: h.id });
      summaries.push(summarizeHandoverForList(h, items.length));
    }

    return res.json({ handovers: summaries, total, limit: lim, offset: off });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// GET /api/handover/portal/history/outgoing — completed/waived/cancelled outgoing
router.get('/portal/history/outgoing', async (req, res) => {
  try {
    const empId = req.user.employee_id;
    if (!empId) return res.json({ handovers: [] });

    const terminal = await getTerminalHandoversForOutgoing(empId);
    const handovers = [];
    for (const h of terminal) {
      const detail = await loadHandoverDetail(h.id);
      if (detail) {
        handovers.push({ handover: detail.handover, items: detail.items, attachments: detail.attachments });
      }
    }
    return res.json({ handovers });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// GET /api/handover/portal/history/incoming — completed/waived/cancelled incoming
router.get('/portal/history/incoming', async (req, res) => {
  try {
    const empId = req.user.employee_id;
    if (!empId) return res.json({ handovers: [] });

    const terminal = await getTerminalHandoversForIncoming(empId);
    const handovers = [];
    for (const h of terminal) {
      const detail = await loadHandoverDetail(h.id);
      if (detail) {
        handovers.push({ handover: detail.handover, items: detail.items, attachments: detail.attachments });
      }
    }
    return res.json({ handovers });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// GET /api/handover/employee/:employeeId — admin employee handover history
router.get('/employee/:employeeId', requireAdmin, async (req, res) => {
  try {
    const emp = await dbFetchOne('Employees', 'id,Full_name', { id: req.params.employeeId });
    if (!emp) return res.status(404).json({ error: 'Employee not found' });
    const data = await getHandoversForEmployee(req.params.employeeId);
    return res.json({ employee: emp, ...data });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// GET /api/handover/portal/outgoing — active outgoing handovers (exit + leave coverage/return)
router.get('/portal/outgoing', async (req, res) => {
  try {
    const empId = req.user.employee_id;
    if (!empId) return res.json({ handovers: [], handover: null, items: [], attachments: [] });

    const active = await getActiveHandoversForOutgoing(empId);
    const handovers = [];
    for (const h of active) {
      const detail = await loadHandoverDetail(h.id);
      if (detail) handovers.push(detail);
    }

    const first = handovers[0] || null;
    return res.json({
      handovers,
      handover: first?.handover || null,
      items: first?.items || [],
      attachments: first?.attachments || [],
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// GET /api/handover/portal/incoming — active successor handovers
router.get('/portal/incoming', async (req, res) => {
  try {
    const empId = req.user.employee_id;
    if (!empId) return res.json({ handovers: [] });

    const active = await getActiveHandoversForIncoming(empId);
    const result = [];
    for (const h of active) {
      await enrichHandover(h);
      const items = await dbFetch('handover_items', '*', { handover_id: h.id }, { order: 'sort_order', ascending: true });
      result.push({ handover: h, items });
    }
    return res.json({ handovers: result });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// GET /api/handover/offboarding/:offboardingId
router.get('/offboarding/:offboardingId', requireAdmin, async (req, res) => {
  try {
    const ob = await dbFetchOne('corporate_offboarding', '*', { id: req.params.offboardingId });
    if (!ob) return res.status(404).json({ error: 'Offboarding not found' });

    let handoverId = ob.handover_id;
    if (!handoverId) {
      const h = await dbFetchOne('employee_handovers', 'id', { offboarding_id: ob.id });
      handoverId = h?.id;
    }
    if (!handoverId) {
      return res.json({ handover: null, items: [], attachments: [], employees: await dbFetch('Employees', 'id,Full_name,employee_id', { status: 'Active' }) });
    }

    const detail = await loadHandoverDetail(handoverId);
    return res.json(detail);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/handover/offboarding/:offboardingId/create — backfill handover
router.post('/offboarding/:offboardingId/create', requireAdmin, async (req, res) => {
  try {
    const ob = await dbFetchOne('corporate_offboarding', '*', { id: req.params.offboardingId });
    if (!ob) return res.status(404).json({ error: 'Offboarding not found' });
    if (ob.handover_id) {
      const detail = await loadHandoverDetail(ob.handover_id);
      return res.json({ success: true, ...detail });
    }

    const handover = await createHandoverForOffboarding(ob, req.user.id);
    if (!handover) return res.status(500).json({ error: 'Failed to create handover' });

    await auditLog(req, 'CREATE', `Created handover for offboarding ${ob.id}`);
    const detail = await loadHandoverDetail(handover.id);
    return res.json({ success: true, ...detail });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// GET /api/handover/leave/:leaveId
router.get('/leave/:leaveId', requireAdmin, async (req, res) => {
  try {
    const leave = await dbFetchOne('Leave_Request', '*', { id: req.params.leaveId });
    if (!leave) return res.status(404).json({ error: 'Leave request not found' });

    const employees = await dbFetch('Employees', 'id,Full_name,employee_id', { status: 'Active' });
    let coverage = null;
    let coverageDetail = null;
    let returnHandover = null;
    let returnDetail = null;

    if (leave.coverage_handover_id) {
      coverageDetail = await loadHandoverDetail(leave.coverage_handover_id);
      coverage = coverageDetail?.handover || null;
    }
    if (leave.return_handover_id) {
      returnDetail = await loadHandoverDetail(leave.return_handover_id);
      returnHandover = returnDetail?.handover || null;
    }

    return res.json({
      leave,
      coverage,
      coverageDetail,
      returnHandover,
      returnDetail,
      employees,
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/handover/leave/:leaveId/coverage
router.post('/leave/:leaveId/coverage', requireAdmin, async (req, res) => {
  try {
    const leave = await dbFetchOne('Leave_Request', '*', { id: req.params.leaveId });
    if (!leave) return res.status(404).json({ error: 'Leave request not found' });

    const { successor_employee_id } = req.body;
    const result = await createHandoverForLongLeave(leave, {
      successorEmployeeId: successor_employee_id,
      createdByUserId: req.user.id,
    });
    if (result.error) return res.status(400).json({ error: result.error });

    await auditLog(req, 'CREATE', `Coverage handover for leave ${leave.id}`);
    const detail = await loadHandoverDetail(result.handover.id);
    return res.json({ success: true, warning: result.warning || null, ...detail });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/handover/leave/:leaveId/return
router.post('/leave/:leaveId/return', requireAdmin, async (req, res) => {
  try {
    const leave = await dbFetchOne('Leave_Request', '*', { id: req.params.leaveId });
    if (!leave) return res.status(404).json({ error: 'Leave request not found' });
    if (!leave.coverage_handover_id) {
      return res.status(400).json({ error: 'No coverage handover for this leave' });
    }

    const parent = await dbFetchOne('employee_handovers', '*', { id: leave.coverage_handover_id });
    if (!parent) return res.status(404).json({ error: 'Coverage handover not found' });

    const result = await createReturnHandover(parent, req.user.id);
    if (result.error) return res.status(400).json({ error: result.error });

    await auditLog(req, 'CREATE', `Return handover for leave ${leave.id}`);
    const detail = await loadHandoverDetail(result.handover.id);
    return res.json({ success: true, ...detail });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// GET /api/handover/:id
router.get('/:id', async (req, res) => {
  try {
    const detail = await loadHandoverDetail(req.params.id);
    if (!detail) return res.status(404).json({ error: 'Not found' });

    const empId = req.user.employee_id;
    const canView =
      isAdmin(req.user) ||
      detail.handover.outgoing_employee_id === empId ||
      detail.handover.successor_employee_id === empId;
    if (!canView) return res.status(403).json({ error: 'Access denied' });

    return res.json(detail);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// PUT /api/handover/:id/successor — assign successor (admin)
router.put('/:id/successor', requireAdmin, async (req, res) => {
  try {
    const { successor_employee_id, successor_type } = req.body;
    const handover = await dbFetchOne('employee_handovers', '*', { id: req.params.id });
    if (!handover) return res.status(404).json({ error: 'Not found' });

    const updates = {
      successor_employee_id: successor_employee_id || null,
      successor_type: successor_type || (successor_employee_id ? 'existing' : 'new_hire'),
      status: successor_employee_id ? 'in_progress' : 'pending_successor',
      updated_at: new Date().toISOString(),
    };
    await dbUpdate('employee_handovers', req.params.id, updates);

    if (successor_employee_id) {
      const enriched = await dbFetchOne('Employees', 'Full_name', { id: handover.outgoing_employee_id });
      const outgoingName = enriched?.Full_name || 'a colleague';
      await notifyUser(
        successor_employee_id,
        'Handover assigned to you',
        `You have been assigned as successor for ${outgoingName}. Please review the handover checklist.`,
        '/portal/handover/incoming'
      );
      await notifyUser(
        handover.outgoing_employee_id,
        'Complete your handover',
        'A successor has been assigned. Please complete your handover checklist.',
        '/portal/handover/outgoing'
      );
    }

    await auditLog(req, 'UPDATE', `Assigned successor on handover ${req.params.id}`);
    const detail = await loadHandoverDetail(req.params.id);
    return res.json({ success: true, ...detail });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// PUT /api/handover/:id/items/:itemId — update item notes/status
router.put('/:id/items/:itemId', async (req, res) => {
  try {
    const handover = await dbFetchOne('employee_handovers', '*', { id: req.params.id });
    if (!handover) return res.status(404).json({ error: 'Not found' });

    const item = await dbFetchOne('handover_items', '*', { id: req.params.itemId, handover_id: req.params.id });
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const empId = req.user.employee_id;
    const isOutgoing = handover.outgoing_employee_id === empId;
    if (!isOutgoing && !isAdmin(req.user)) {
      return res.status(403).json({ error: 'Only outgoing employee or admin can edit items' });
    }

    const d = req.body;
    const updates = { updated_at: new Date().toISOString() };
    if (d.outgoing_notes !== undefined) updates.outgoing_notes = d.outgoing_notes;
    if (d.description !== undefined) updates.description = d.description;
    if (d.status !== undefined) {
      updates.status = d.status;
      updates.completed_at = ['done', 'not_applicable'].includes(d.status) ? new Date().toISOString() : null;
    }
    if (d.evidence_url !== undefined) updates.evidence_url = d.evidence_url;

    await dbUpdate('handover_items', req.params.itemId, updates);

    if (handover.status === 'pending_successor' || handover.status === 'draft') {
      await dbUpdate('employee_handovers', req.params.id, { status: 'in_progress', updated_at: new Date().toISOString() });
    }

    await recalcHandoverCompletion(req.params.id);
    const detail = await loadHandoverDetail(req.params.id);
    return res.json({ success: true, ...detail });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/handover/:id/items/:itemId/acknowledge — successor ack
router.post('/:id/items/:itemId/acknowledge', async (req, res) => {
  try {
    const handover = await dbFetchOne('employee_handovers', '*', { id: req.params.id });
    if (!handover) return res.status(404).json({ error: 'Not found' });

    if (handover.successor_employee_id !== req.user.employee_id && !isAdmin(req.user)) {
      return res.status(403).json({ error: 'Only successor can acknowledge' });
    }

    await dbUpdate('handover_items', req.params.itemId, {
      successor_acknowledged: true,
      successor_ack_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    const detail = await loadHandoverDetail(req.params.id);
    return res.json({ success: true, ...detail });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/handover/:id/submit — outgoing submits for review
router.post('/:id/submit', async (req, res) => {
  try {
    const handover = await dbFetchOne('employee_handovers', '*', { id: req.params.id });
    if (!handover) return res.status(404).json({ error: 'Not found' });

    if (handover.outgoing_employee_id !== req.user.employee_id && !isAdmin(req.user)) {
      return res.status(403).json({ error: 'Only outgoing employee can submit' });
    }

    const { allRequiredDone, pct } = await recalcHandoverCompletion(req.params.id);
    if (!allRequiredDone) {
      return res.status(400).json({ error: `Complete all required items first (${pct}% done)` });
    }

    await dbUpdate('employee_handovers', req.params.id, {
      status: 'pending_review',
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (handover.successor_employee_id) {
      await notifyUser(
        handover.successor_employee_id,
        'Handover ready for your acknowledgment',
        'The outgoing employee has submitted their handover. Please review each item and acknowledge receipt before HR approval.',
        '/portal/handover/incoming'
      );
    }

    const reviewLink = handover.leave_request_id ? '/leave' : '/offboarding';
    await dbInsert('system_notifications', {
      recipient_role: 'hr_manager',
      title: 'Handover submitted for review',
      message: `Handover from employee is ready for manager/HR approval.`,
      link_url: reviewLink,
      is_read: false,
      created_at: new Date().toISOString(),
    });

    await auditLog(req, 'UPDATE', `Handover ${req.params.id} submitted for review`);
    const detail = await loadHandoverDetail(req.params.id);
    return res.json({ success: true, ...detail });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/handover/:id/approve — manager/admin approves
router.post('/:id/approve', requireAdmin, async (req, res) => {
  try {
    const handover = await dbFetchOne('employee_handovers', '*', { id: req.params.id });
    if (!handover) return res.status(404).json({ error: 'Not found' });

    if (!['pending_review', 'in_progress'].includes(handover.status)) {
      return res.status(400).json({ error: `Cannot approve handover in status: ${handover.status}` });
    }

    if (handoverRequiresSuccessorAck(handover)) {
      const ack = await getSuccessorAckSummary(req.params.id);
      if (!ack.allAcked) {
        return res.status(400).json({
          error: `Acting successor must acknowledge all handover items first (${ack.acked}/${ack.total} acknowledged). They can do this from Portal → Incoming Handover.`,
          successor_ack: ack,
        });
      }
    }

    await dbUpdate('employee_handovers', req.params.id, {
      status: 'completed',
      approved_by_user_id: req.user.id,
      approved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    await syncKnowledgeTransferFromHandover(req.params.id);

    if (handover.successor_employee_id) {
      await notifyUser(handover.successor_employee_id, 'Handover approved', 'The handover has been approved. You may proceed with your new responsibilities.', '/portal/handover/incoming');
    }
    await notifyUser(handover.outgoing_employee_id, 'Handover approved', 'Your handover has been approved by management.', '/portal/handover/outgoing');

    await auditLog(req, 'APPROVE', `Handover ${req.params.id} approved`);
    const detail = await loadHandoverDetail(req.params.id);
    return res.json({ success: true, ...detail });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/handover/:id/waive — skip handover requirement
router.post('/:id/waive', requireAdmin, async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason?.trim()) return res.status(400).json({ error: 'Waiver reason required' });

    const handover = await dbFetchOne('employee_handovers', '*', { id: req.params.id });
    if (!handover) return res.status(404).json({ error: 'Not found' });

    await dbUpdate('employee_handovers', req.params.id, {
      status: 'waived',
      waived_by_user_id: req.user.id,
      waived_at: new Date().toISOString(),
      waived_reason: reason.trim(),
      updated_at: new Date().toISOString(),
    });

    if (handover.offboarding_id) {
      await dbUpdate('corporate_offboarding', handover.offboarding_id, {
        handover_required: false,
        handover_waived_reason: reason.trim(),
        handover_waived_by: req.user.id,
        knowledge_transfer: true,
        updated_at: new Date().toISOString(),
      });
    }

    await syncKnowledgeTransferFromHandover(req.params.id);
    await notifyLeaveHandoverWaived(handover, reason.trim());
    await auditLog(req, 'WAIVE', `Handover ${req.params.id} waived: ${reason}`);
    const detail = await loadHandoverDetail(req.params.id);
    return res.json({ success: true, ...detail });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/handover/:id/upload — file upload
router.post('/:id/upload', upload.single('file'), async (req, res) => {
  try {
    const handover = await dbFetchOne('employee_handovers', '*', { id: req.params.id });
    if (!handover) return res.status(404).json({ error: 'Not found' });

    const empId = req.user.employee_id;
    if (handover.outgoing_employee_id !== empId && !isAdmin(req.user)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const fileExt = req.file.originalname.split('.').pop();
    const fileName = `${req.params.id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;

    const buckets = ['handover_documents', 'leave_documents'];
    let publicUrl = null;
    for (const bucket of buckets) {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, req.file.buffer, { contentType: req.file.mimetype, upsert: false });
      if (!error) {
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
        publicUrl = urlData.publicUrl;
        break;
      }
    }
    if (!publicUrl) return res.status(500).json({ error: 'Failed to upload file to storage' });

    const itemId = req.body.handover_item_id || null;
    const attachment = await dbInsert('handover_attachments', {
      handover_id: req.params.id,
      handover_item_id: itemId || null,
      uploaded_by_user_id: req.user.id,
      file_name: req.file.originalname,
      file_url: publicUrl,
      file_type: req.file.mimetype,
      created_at: new Date().toISOString(),
    });

    if (itemId) {
      await dbUpdate('handover_items', itemId, {
        evidence_url: publicUrl,
        status: 'done',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      await recalcHandoverCompletion(req.params.id);
    }

    const detail = await loadHandoverDetail(req.params.id);
    return res.json({ success: true, attachment, ...detail });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

export default router;
