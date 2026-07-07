const colorConvert = require('color-convert');

function applyFilter(hex) {
    // 1. Convert hex to RGB
    let [r, g, b] = colorConvert.hex.rgb(hex);
    
    // 2. invert(1)
    r = 255 - r;
    g = 255 - g;
    b = 255 - b;
    
    // 3. hue-rotate(180deg)
    let [h, s, l] = colorConvert.rgb.hsl(r, g, b);
    h = (h + 180) % 360;
    
    // Back to hex
    return colorConvert.hsl.hex(h, s, l);
}

// We want the final color to be #A3B81F (Lime Green)
// So we need to reverse the process. 
// Reverse hue-rotate(180deg) is hue-rotate(180deg)
// Reverse invert(1) is invert(1)

function reverseFilter(hex) {
    let [h, s, l] = colorConvert.hex.hsl(hex);
    h = (h - 180 + 360) % 360;
    let [r, g, b] = colorConvert.hsl.rgb(h, s, l);
    
    r = 255 - r;
    g = 255 - g;
    b = 255 - b;
    
    return '#' + colorConvert.rgb.hex(r, g, b);
}

const targetGreen = '#A3B81F';
const targetOrange = '#FF7700';

const sourceGreen = reverseFilter(targetGreen);
const sourceOrange = reverseFilter(targetOrange);

console.log('To get Green', targetGreen, 'we need to provide:', sourceGreen);
console.log('To get Orange', targetOrange, 'we need to provide:', sourceOrange);

// Let's verify
console.log('Verification Green:', '#' + applyFilter(sourceGreen));
console.log('Verification Orange:', '#' + applyFilter(sourceOrange));
