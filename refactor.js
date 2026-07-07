const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'hrm-client', 'src');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace style={{ background: '#XXXXXX' }} with className="bg-surface-XXX"
    // This is tricky because it might be mixed with other styles.
    // Let's just do a naive regex replace first.
    
    // Replace standalone hex colors in style objects
    content = content.replace(/#1e2235/g, 'var(--color-surface-800)');
    content = content.replace(/#0f1120/g, 'var(--color-surface-900)');
    content = content.replace(/#080b14/g, 'var(--color-surface-950)');
    content = content.replace(/#161929/g, 'var(--color-surface-850)');

    // Since they were in style={{ background: '#1e2235' }}, they will become style={{ background: 'var(--color-surface-800)' }}
    // Wait! CSS variables defined as '30 34 53' (RGB tuple) cannot be used directly in background!
    // background: 'var(--color-surface-800)' will output background: 30 34 53; which is INVALID CSS!
    
    // So we MUST replace the entire style object with Tailwind classes!
    
    // Actually, since I mapped them to Tailwind config `bg-surface-800`, I can just change the class!
    // But how to parse inline styles?
    // Let's change the CSS variables in index.css BACK to standard hex/rgba for standard variables, and ONLY use RGB tuples for brand colors?
    // Or we can just use `rgb(var(--color-surface-800))` in the inline styles!
    
    content = content.replace(/var\(--color-surface-800\)/g, 'rgb(var(--color-surface-800))');
    content = content.replace(/var\(--color-surface-900\)/g, 'rgb(var(--color-surface-900))');
    content = content.replace(/var\(--color-surface-950\)/g, 'rgb(var(--color-surface-950))');
    content = content.replace(/var\(--color-surface-850\)/g, 'rgb(var(--color-surface-850))');

    // Remove text-white if we want it to adapt? 
    // No, we redefined white in Tailwind config to adapt to black!

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated', filePath);
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
console.log('Done refactoring!');
