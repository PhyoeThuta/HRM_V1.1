const fs = require('fs');
const content = fs.readFileSync('C:/Users/Phyoe/.gemini/antigravity-ide/brain/ffcfcad8-cfa0-4880-964a-d5d2544e0c18/.system_generated/logs/transcript.jsonl', 'utf8');
const lines = content.trim().split('\n');
lines.forEach(line => {
  if (line.includes('upgrade') && line.includes('5')) {
    console.log(line.substring(0, 500));
  }
  if (line.includes('form link') && line.includes('id')) {
    console.log(line.substring(0, 500));
  }
});
