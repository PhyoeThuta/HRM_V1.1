const fs = require('fs');
const content = fs.readFileSync('C:/Users/Phyoe/.gemini/antigravity-ide/brain/ffcfcad8-cfa0-4880-964a-d5d2544e0c18/.system_generated/logs/transcript.jsonl', 'utf8');
const lines = content.trim().split('\n');
let capturing = false;
for (let i = 0; i < lines.length; i++) {
  try {
    const step = JSON.parse(lines[i]);
    if (step.source === 'MODEL' && step.content && step.content.includes('# Tasks for Customer Onboarding Workflow')) {
      console.log('--- MSG ---');
      console.log(step.content);
    }
    if (step.source === 'MODEL' && step.content && step.content.includes('ArtifactType\":\"task\"')) {
      console.log('--- FOUND TASK.MD CREATION ---');
      console.log(step.content);
    }
  } catch(e) {}
}
