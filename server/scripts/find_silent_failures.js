import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  for (let file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        walkDir(fullPath, callback);
      }
    } else {
      if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
        callback(fullPath);
      }
    }
  }
}

const rootDir = path.resolve('c:/Users/Phyoe/Desktop/hrm_react');
let findings = [];

walkDir(rootDir, (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  // A crude state machine to find catch blocks
  let inCatch = false;
  let catchLine = 0;
  let catchContent = '';
  let braceCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (!inCatch) {
      const catchMatch = line.match(/catch\s*\(([^)]+)\)\s*\{/);
      if (catchMatch) {
        inCatch = true;
        catchLine = i + 1;
        catchContent = line.substring(line.indexOf('{') + 1) + '\n';
        braceCount = 1;
        // Count braces in the rest of the line
        const rest = line.substring(line.indexOf('{') + 1);
        for (let char of rest) {
          if (char === '{') braceCount++;
          if (char === '}') braceCount--;
        }
        if (braceCount === 0) {
           processCatch(filePath, catchLine, catchContent);
           inCatch = false;
        }
      }
    } else {
      catchContent += line + '\n';
      for (let char of line) {
        if (char === '{') braceCount++;
        if (char === '}') braceCount--;
      }
      if (braceCount === 0) {
        processCatch(filePath, catchLine, catchContent);
        inCatch = false;
      }
    }
  }
});

function processCatch(file, lineNo, content) {
  const relPath = path.relative(rootDir, file);
  
  // If it throws an error or sends a 5xx response or toasts an error, it's NOT a silent failure.
  if (content.includes('throw ') || 
      content.includes('res.status(5') || 
      content.includes('toast.error') || 
      content.includes('next(e') ||
      content.includes('Promise.reject') ||
      content.includes('process.exit')) {
    return;
  }
  
  // Filter out some expected silent catches
  if (content.includes('/* ignore */') || content.includes('// ignore')) return;

  findings.push({ file: relPath, line: lineNo, code: content.trim() });
}

console.log(JSON.stringify(findings, null, 2));
