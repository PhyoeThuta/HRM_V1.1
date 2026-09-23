const fs = require('fs');
let content = fs.readFileSync('routes/enroll.js', 'utf8');

// Replace CRM import if not present
if (!content.includes('import { crmModule } from \'../modules/crm/index.js\';')) {
  content = content.replace(
    'import express from \'express\';',
    'import express from \'express\';\nimport { crmModule } from \'../modules/crm/index.js\';'
  );
}

const postRegex = /\/\/ POST \/api\/enroll\/\:token - Submit form data[\s\S]*?router\.post\('\/\:token', async \(req, res\) => \{[\s\S]*?\n\}\);\n/m;
const newPost = `// POST /api/enroll/:token - Submit form data
router.post('/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const formData = req.body;

    const newCustomer = await crmModule.completeOnboarding(token, formData);

    return res.status(201).json({ 
      success: true, 
      message: 'Onboarding completed successfully',
      customer_id: newCustomer.id 
    });
  } catch (error) {
    console.error('[ENROLL POST ERROR]', error);
    if (error.message === 'Invalid or expired token.') {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Failed to process enrollment' });
  }
});
`;

content = content.replace(postRegex, newPost);
fs.writeFileSync('routes/enroll.js', content);
