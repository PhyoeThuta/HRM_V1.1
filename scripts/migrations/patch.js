const fs = require('fs');
const lines = fs.readFileSync('server/routes/employees.js', 'utf8').split('\n');

const importStr = "import { hrmModule } from '../modules/hrm/index.js';";
lines.splice(7, 0, importStr);

const postStart = lines.findIndex(l => l.startsWith('// POST /api/employees'));
const postEnd = lines.findIndex(l => l.startsWith('// POST /api/employees/bulk-import'));

const newRoutes = `// POST /api/employees
router.post('/', requireAdmin, validate(createEmployeeSchema), async (req, res) => {
  try {
    const { result, credentials } = await hrmModule.createEmployee(req.body, req.user);
    return res.json({ success: true, employee: result, message: \`Employee added! Login: \${credentials.username} / \${credentials.defaultPassword}\` });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// PUT /api/employees/:id
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    await hrmModule.updateEmployee(req.params.id, req.body, req.user);
    return res.json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

`;

lines.splice(postStart, postEnd - postStart, newRoutes.trim());

fs.writeFileSync('server/routes/employees.js', lines.join('\n'));
console.log('Patched employees.js');
