const fs = require('fs');
const content = fs.readFileSync('routes/employees.js', 'utf8');
const lines = content.split('\n');

let putResJsonIndex = -1;
for (let i = 200; i < 250; i++) {
  if (lines[i].includes('return res.json({ success: true });')) {
    putResJsonIndex = i;
    break;
  }
}

let deleteRouteIndex = -1;
for (let i = 400; i < lines.length; i++) {
  if (lines[i].includes('// DELETE /api/employees/:id')) {
    deleteRouteIndex = i;
    break;
  }
}

if (putResJsonIndex !== -1 && deleteRouteIndex !== -1) {
  const newLines = [
    ...lines.slice(0, putResJsonIndex + 1),
    '  } catch (e) {',
    '    return res.status(500).json({ error: e.message });',
    '  }',
    '});',
    '',
    ...lines.slice(deleteRouteIndex)
  ];
  fs.writeFileSync('routes/employees.js', newLines.join('\n'));
  console.log('Fixed employees.js');
} else {
  console.log('Could not find indices', putResJsonIndex, deleteRouteIndex);
}
