import express from 'express';
import { dbFetch, dbInsert, dbUpdate, dbDelete, dbFetchOne, supabase, supabaseAdmin } from '../lib/supabase.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();
router.use(verifyToken);

// Middleware to check if user can edit
async function requireManualEditor(req, res, next) {
  if (req.user.role === 'boss' || req.user.role === 'admin') return next();
  
  try {
    const perm = await dbFetchOne('hrm_manual_permissions', '*', { employee_id: req.user.employee_id });
    if (perm && perm.can_edit) {
      req.manualPerms = perm;
      return next();
    }
    return res.status(403).json({ error: 'Requires manual editor permission' });
  } catch (e) {
    return res.status(403).json({ error: 'Permission denied' });
  }
}

// Middleware to check if user can publish
async function requireManualPublisher(req, res, next) {
  if (req.user.role === 'boss' || req.user.role === 'admin') return next();
  
  try {
    const perm = await dbFetchOne('hrm_manual_permissions', '*', { employee_id: req.user.employee_id });
    if (perm && (perm.can_publish || perm.can_edit)) { // Allowing edit to publish for now if can_publish isn't strictly enforced separately
      if (perm.can_publish) {
        return next();
      }
    }
    return res.status(403).json({ error: 'Requires manual publisher permission' });
  } catch (e) {
    return res.status(403).json({ error: 'Permission denied' });
  }
}

// GET /api/manual/public - Get categories and published articles
router.get('/public', async (req, res) => {
  try {
    const { data: categories } = await supabase.from('hrm_manual_categories').select('*').order('order_index');
    const { data: articles } = await supabase.from('hrm_manual_articles')
      .select('id, category_id, title, published_content, version, order_index, updated_at')
      .eq('status', 'published')
      .order('order_index');
      
    res.json({ categories: categories || [], articles: articles || [] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/manual/admin - Get all for editors
router.get('/admin', requireManualEditor, async (req, res) => {
  try {
    const { data: categories } = await supabase.from('hrm_manual_categories').select('*').order('order_index');
    const { data: articles } = await supabase.from('hrm_manual_articles')
      .select('*')
      .neq('status', 'deleted')
      .order('order_index');
    res.json({ categories: categories || [], articles: articles || [] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/manual/categories
router.post('/categories', requireManualEditor, async (req, res) => {
  try {
    const { name, order_index } = req.body;
    const cat = await dbInsert('hrm_manual_categories', { name, order_index: order_index || 0 });
    res.json({ success: true, category: cat });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /api/manual/categories/:id
router.put('/categories/:id', requireManualEditor, async (req, res) => {
  try {
    const { name, order_index } = req.body;
    const cat = await dbUpdate('hrm_manual_categories', req.params.id, { name, order_index });
    res.json({ success: true, category: cat });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/manual/articles
router.post('/articles', requireManualEditor, async (req, res) => {
  try {
    const { category_id, title, draft_content, order_index } = req.body;
    const art = await dbInsert('hrm_manual_articles', { 
      category_id, 
      title, 
      draft_content, 
      order_index: order_index || 0,
      status: 'draft',
      created_by: req.user.id,
      updated_by: req.user.id
    });
    res.json({ success: true, article: art });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /api/manual/articles/:id
router.put('/articles/:id', requireManualEditor, async (req, res) => {
  try {
    const { title, draft_content, order_index, category_id } = req.body;
    const updatePayload = { 
      updated_at: new Date().toISOString(),
      updated_by: req.user.id
    };
    if (title !== undefined) updatePayload.title = title;
    if (draft_content !== undefined) updatePayload.draft_content = draft_content;
    if (order_index !== undefined) updatePayload.order_index = order_index;
    if (category_id !== undefined) updatePayload.category_id = category_id;
    
    // Changing draft implies it's no longer matching published exactly if it was published
    updatePayload.status = 'draft';

    const art = await dbUpdate('hrm_manual_articles', req.params.id, updatePayload);
    res.json({ success: true, article: art });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/manual/articles/:id/publish
router.post('/articles/:id/publish', requireManualPublisher, async (req, res) => {
  try {
    const articleId = req.params.id;
    const art = await dbFetchOne('hrm_manual_articles', '*', { id: articleId });
    if (!art || art.status === 'deleted') return res.status(404).json({ error: 'Article not found' });

    // Save current published to history if it exists
    if (art.published_content) {
      await dbInsert('hrm_manual_versions', {
        article_id: articleId,
        content: art.published_content,
        version: art.version,
        created_by: req.user.id
      });
    }

    // Publish new
    const updated = await dbUpdate('hrm_manual_articles', articleId, {
      published_content: art.draft_content,
      status: 'published',
      version: art.version + 1,
      updated_at: new Date().toISOString(),
      published_by: req.user.id,
      published_at: new Date().toISOString()
    });

    res.json({ success: true, article: updated });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/manual/articles/:id/versions
router.get('/articles/:id/versions', requireManualEditor, async (req, res) => {
  try {
    const { data: versions } = await supabase.from('hrm_manual_versions')
      .select('*, sys_users(full_name, username)')
      .eq('article_id', req.params.id)
      .order('version', { ascending: false });
    res.json({ versions: versions || [] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/manual/articles/:id/restore/:version
router.post('/articles/:id/restore/:version', requireManualEditor, async (req, res) => {
  try {
    const v = await dbFetchOne('hrm_manual_versions', '*', { article_id: req.params.id, version: req.params.version });
    if (!v) return res.status(404).json({ error: 'Version not found' });
    
    const updated = await dbUpdate('hrm_manual_articles', req.params.id, {
      draft_content: v.content,
      status: 'draft',
      updated_at: new Date().toISOString()
    });
    res.json({ success: true, article: updated });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/manual/permissions
router.get('/permissions', async (req, res) => {
  try {
    if (req.user.role !== 'boss' && req.user.role !== 'admin') {
      const perm = await dbFetchOne('hrm_manual_permissions', '*', { employee_id: req.user.employee_id });
      if (!perm?.can_manage_editors) return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const { data: perms } = await supabase.from('hrm_manual_permissions')
      .select('*, Employees(Full_name, employee_id)');
    res.json({ permissions: perms || [] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/manual/articles/:id/soft-delete
router.post('/articles/:id/soft-delete', requireManualEditor, async (req, res) => {
  try {
    const art = await dbFetchOne('hrm_manual_articles', '*', { id: req.params.id });
    if (!art) return res.status(404).json({ error: 'Article not found' });
    
    // Store original status in a custom field or simply assume it goes back to draft upon restore?
    // The requirement says: ACTIVE -> SOFT DELETE. We will just set status to 'deleted'.
    const updated = await dbUpdate('hrm_manual_articles', req.params.id, {
      status: 'deleted',
      updated_at: new Date().toISOString(),
      updated_by: req.user.id
    });
    res.json({ success: true, article: updated });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/manual/recycle-bin
router.get('/recycle-bin', requireManualEditor, async (req, res) => {
  try {
    const { data: articles } = await supabase.from('hrm_manual_articles')
      .select('*, sys_users!updated_by(full_name, username)')
      .eq('status', 'deleted')
      .order('updated_at', { ascending: false });
    res.json({ articles: articles || [] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/manual/articles/:id/restore-deleted
router.post('/articles/:id/restore-deleted', requireManualEditor, async (req, res) => {
  try {
    const art = await dbFetchOne('hrm_manual_articles', '*', { id: req.params.id });
    if (!art || art.status !== 'deleted') return res.status(404).json({ error: 'Deleted article not found' });
    
    // Restore to draft
    const updated = await dbUpdate('hrm_manual_articles', req.params.id, {
      status: 'draft',
      updated_at: new Date().toISOString(),
      updated_by: req.user.id
    });
    res.json({ success: true, article: updated });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/manual/articles/:id - Hard Delete
router.delete('/articles/:id', async (req, res) => {
  try {
    // Only Boss can hard delete (or an explicit Admin)
    if (req.user.role !== 'boss' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only Boss/Admin can hard delete articles' });
    }
    
    const art = await dbFetchOne('hrm_manual_articles', '*', { id: req.params.id });
    if (!art) return res.status(404).json({ error: 'Article not found' });
    if (art.status !== 'deleted') return res.status(400).json({ error: 'Article must be in Recycle Bin to be hard deleted' });

    // Ensure we delete versions first to maintain integrity
    await supabase.from('hrm_manual_versions').delete().eq('article_id', req.params.id);
    
    // Now hard delete the article
    await dbDelete('hrm_manual_articles', req.params.id);
    
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
