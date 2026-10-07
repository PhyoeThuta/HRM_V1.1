const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'hrm-client', 'src');

const replacements = [
    { from: /\[#1e2235\]/gi, to: 'surface-800' },
    { from: /\[#161929\]/gi, to: 'surface-850' },
    { from: /\[#0f1120\]/gi, to: 'surface-900' },
    { from: /\[#080b14\]/gi, to: 'surface-950' },
    { from: /\[#11131f\]/gi, to: 'surface-900' } // mapping this slightly off-black to 900
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
console.log('Done replacing Tailwind arbitrary hex colors with surface classes!');
