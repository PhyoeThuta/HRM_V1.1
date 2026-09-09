import fs from 'fs';
import path from 'path';

const data = JSON.parse(fs.readFileSync('silent_failures.json', 'utf8'));

// Group by file
const grouped = {};
for (const item of data) {
  if (!grouped[item.file]) {
    grouped[item.file] = [];
  }
  grouped[item.file].push(item);
}

let md = `# Comprehensive Silent Failures Scan Report (QA / Senior Engineer Audit)\n\n`;
md += `> [!WARNING]\n> This is an exhaustive list of every \`try...catch\` block or error handling section in the entire project that swallows errors without properly notifying the client or throwing. These represent technical debt and potential logic bugs.\n\n`;

for (const file of Object.keys(grouped).sort()) {
  md += `## 📄 ${file.replace(/\\\\/g, '/')}\n\n`;
  for (const item of grouped[file]) {
    md += `- **Line ${item.line}**:\n`;
    md += `  \`\`\`javascript\n  ${item.code.replace(/\\n/g, '\\n  ')}\n  \`\`\`\n`;
  }
  md += `\n`;
}

fs.writeFileSync('C:\\\\Users\\\\Phyoe\\\\.gemini\\\\antigravity-ide\\\\brain\\\\031cdd41-970b-4cc3-89d4-7ea867b8bb5b\\\\exhaustive_silent_failures_report.md', md);
console.log('Report generated.');
