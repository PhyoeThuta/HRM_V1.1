const fs = require('fs');
let c = fs.readFileSync('server/routes/misc.js', 'utf8');
const target = `// POST /api/documents
router.post('/documents', requireAdmin, async (req, res) => {
  try {
    const { title, category, file_url, description, employee_id } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const doc = await dbInsert('employee_documents', {
      title,
      category: category || 'General',
      file_url: file_url || '/sample_promotion_letter.pdf',
      description: description || '',
      employee_id: (employee_id && employee_id !== 'GENERAL') ? employee_id : null,
      uploaded_by_user_id: req.user.id,
      created_at: new Date().toISOString(),
    });

    return res.json({ success: true, document: doc });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});`.replace(/\r\n/g, '\n');

c = c.replace(/\r\n/g, '\n');

const replacement = `// GET /api/documents/download/:id
router.get('/documents/download/:id', async (req, res) => {
  try {
    const doc = await dbFetchOne('employee_documents', '*', { id: req.params.id });
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    
    if (doc.file_url && doc.file_url.startsWith('company_documents/')) {
      const path = doc.file_url.replace('company_documents/', '');
      const { data, error } = await supabaseAdmin.storage
        .from('company_documents')
        .createSignedUrl(path, 60);
      if (error) throw error;
      return res.redirect(data.signedUrl);
    } else {
      return res.redirect(doc.file_url);
    }
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// POST /api/documents
router.post('/documents', requireAdmin, upload.single('document_file'), async (req, res) => {
  try {
    const { title, category, description, employee_id } = req.body;
    let file_url = req.body.file_url;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    if (req.file) {
      if (req.file.mimetype !== 'application/pdf') {
        return res.status(400).json({ error: 'Only PDF files are allowed' });
      }
      if (req.file.size > 10 * 1024 * 1024) {
        return res.status(400).json({ error: 'File size must be under 10MB' });
      }
      const safeName = req.file.originalname.replace(/[^a-zA-Z0-9.\\-_]/g, '_');
      const filename = \`\${Date.now()}_\${Math.random().toString(36).substring(7)}_\${safeName}\`;
      const { error } = await supabaseAdmin.storage
        .from('company_documents')
        .upload(filename, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false
        });
      if (error) throw new Error('Failed to upload secure document: ' + error.message);
      file_url = \`company_documents/\${filename}\`;
    }

    const doc = await dbInsert('employee_documents', {
      title,
      category: category || 'General',
      file_url: file_url || '/sample_promotion_letter.pdf',
      description: description || '',
      employee_id: (employee_id && employee_id !== 'GENERAL') ? employee_id : null,
      uploaded_by_user_id: req.user.id,
      created_at: new Date().toISOString(),
    });

    return res.json({ success: true, document: doc });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});`;

if (c.includes(target)) {
  fs.writeFileSync('server/routes/misc.js', c.replace(target, replacement));
  console.log('Replaced successfully!');
} else {
  console.log('Target not found! Check logic.');
}
