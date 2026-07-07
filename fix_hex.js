const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'hrm-client', 'src');

const replacements = [
    { from: /'#1e2235'/g, to: "'var(--bg-800, #1e2235)'" },
    { from: /'#161929'/g, to: "'var(--bg-850, #161929)'" },
    { from: /'#0f1120'/g, to: "'var(--bg-900, #0f1120)'" },
    { from: /'#080b14'/g, to: "'var(--bg-950, #080b14)'" },
];

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    replacements.forEach(r => {
        content = content.replace(r.from, r.to);
    });

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated:', filePath);
    }
}

function walkDir(dir) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        if (fs.statSync(dirPath).isDirectory()) {
            walkDir(dirPath);
        } else if (dirPath.endsWith('.jsx') || dirPath.endsWith('.js')) {
            processFile(dirPath);
        }
    });
}

walkDir(srcDir);
console.log('Done replacing hardcoded hex with CSS variables!');
