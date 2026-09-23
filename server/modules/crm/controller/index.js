import * as crmService from '../service/index.js';

export async function getLevelSettings(req, res) {
  try {
    const data = await crmService.getAllLevelSettings();
    return res.json(data);
  } catch (e) {
    console.error('[CRM GET LEVEL SETTINGS]', e.message);
    return res.status(e.status || 500).json({ error: e.message });
  }
}

export async function upsertLevelSetting(req, res) {
  try {
    const result = await crmService.upsertLevelSetting(req.body);
    return res.json(result);
  } catch (e) {
    console.error('[CRM POST LEVEL SETTING]', e.message);
    return res.status(e.status || 500).json({ error: e.message });
  }
}

export async function deleteLevelSetting(req, res) {
  try {
    await crmService.deleteLevelSetting(req.params.id);
    return res.json({ success: true });
  } catch (e) {
    console.error('[CRM DELETE LEVEL SETTING]', e.message);
    return res.status(e.status || 500).json({ error: e.message });
  }
}

// ──────────────────────────────────────────────────────────────────
// PACKAGES (MASTER CATALOG)
// ──────────────────────────────────────────────────────────────────

export async function getPackages(req, res) {
  try {
    const data = await crmService.getAllPackages();
    return res.json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

export async function createPackage(req, res) {
  try {
    const { name, duration, price } = req.body;
    const data = await crmService.createPackage({ name, duration, price });
    return res.status(201).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

export async function updatePackage(req, res) {
  try {
    const { name, duration, price } = req.body;
    await crmService.updatePackage(req.params.id, { name, duration, price });
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

export async function deletePackage(req, res) {
  try {
    await crmService.deletePackage(req.params.id);
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

// ──────────────────────────────────────────────────────────────────
// FORM SETTINGS
// ──────────────────────────────────────────────────────────────────

export async function getFormSettings(req, res) {
  try {
    const data = await crmService.getFormSettings();
    res.json(data);
  } catch (err) {
    console.error('[GET FORM SETTINGS ERROR]', err);
    res.status(500).send('Internal Error');
  }
}

export async function upsertFormSettings(req, res) {
  try {
    const data = await crmService.upsertFormSettings(req.body.schema);
    res.json(data);
  } catch (err) {
    console.error('[PUT FORM SETTINGS ERROR]', err);
    res.status(500).send('Internal Error');
  }
}

// ──────────────────────────────────────────────────────────────────
// FEEDBACKS
// ──────────────────────────────────────────────────────────────────

export async function getAllFeedbacks(req, res) {
  try {
    const data = await crmService.getAllFeedbacks();
    return res.json(data);
  } catch (e) {
    console.error('[CRM GET ALL FEEDBACKS]', e.message);
    return res.status(500).json({ error: e.message });
  }
}

export async function deleteFeedback(req, res) {
  try {
    await crmService.deleteFeedback(req.params.id);
    return res.json({ success: true, message: 'Feedback deleted successfully' });
  } catch (e) {
    console.error('[CRM DELETE FEEDBACK]', e.message);
    return res.status(500).json({ error: e.message });
  }
}

export async function getWeeklyFeedbacks(req, res) {
  try {
    const combined = await crmService.getWeeklyFeedbacks();
    res.json(combined);
  } catch (err) {
    console.error('[GET WEEKLY/DAILY FEEDBACKS ERROR]', err);
    res.status(500).json({ error: err.message });
  }
}

export async function resolveFeedback(req, res) {
  try {
    await crmService.resolveFeedback(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ──────────────────────────────────────────────────────────────────
// DASHBOARDS / SEGMENTS
// ──────────────────────────────────────────────────────────────────

export async function deductKitchenMeals(req, res) {
  try {
    const deductedCount = await crmService.deductKitchenMeals();
    return res.json({ success: true, message: `Deducted 1 meal from ${deductedCount} active packages.` });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

export async function getKitchenDashboard(req, res) {
  try {
    const targetDate = req.query.date || new Date().toISOString().split('T')[0];
    const data = await crmService.getKitchenDashboard(targetDate);
    return res.json(data);
  } catch (e) {
    console.error('[CRM KITCHEN DASHBOARD]', e);
    return res.status(500).json({ error: e.message });
  }
}

export async function getDashboard(req, res) {
  try {
    const data = await crmService.getDashboard();
    return res.json(data);
  } catch (e) {
    console.error('[CRM DASHBOARD]', e.message);
    return res.status(500).json({ error: e.message });
  }
}

export async function getSegment(req, res) {
  try {
    const { segment } = req.params;
    const data = await crmService.getSegment(segment);
    return res.json(data);
  } catch (e) {
    console.error('[CRM GET SEGMENT]', e.message);
    return res.status(500).json({ error: e.message });
  }
}
