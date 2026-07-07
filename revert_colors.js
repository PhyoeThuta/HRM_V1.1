const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'hrm-client', 'src');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Revert rgb(var()) back to original hex codes
    content = content.replace(/rgb\(var\(--color-surface-800\)\)/g, '#1e2235');
    content = content.replace(/rgb\(var\(--color-surface-850\)\)/g, '#161929');
    content = content.replace(/rgb\(var\(--color-surface-900\)\)/g, '#0f1120');
    content = content.replace(/rgb\(var\(--color-surface-950\)\)/g, '#080b14');
    content = content.replace(/var\(--color-surface-800\)/g, '#1e2235');
    content = content.replace(/var\(--color-surface-850\)/g, '#161929');
    content = content.replace(/var\(--color-surface-900\)/g, '#0f1120');
    content = content.replace(/var\(--color-surface-950\)/g, '#080b14');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Reverted:', filePath);
    }
}

function walkDir(dir) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        if (fs.statSync(dirPath).isDirectory()) {
            walkDir(dirPath);
        } else if (dirPath.endsWith('.jsx')) {
            processFile(dirPath);
        }
    });
}

walkDir(srcDir);
console.log('Done!');
