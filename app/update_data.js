const fs = require('fs');

let dataStr = fs.readFileSync('src/data.ts', 'utf8');

// We will do a regex replace to add description: `...` to each product object
let newData = dataStr.replace(/(id:\s*'([rs]\d+)',\s*name:\s*'([^']+)',\s*category:\s*'([^']+)',\s*variants:\s*\[[^\n]+\]\s*,\s*images:\s*\[[^\]]+\])(\s*)/g, (match, p1, id, name, category, p2) => {
    const desc = `Experience the next level of innovation with the ${name}. Designed specifically for the ${category} industry, this product combines cutting-edge engineering with user-friendly operation.\n\nBacked by WingsTech's comprehensive R&D and support, you can rely on this robust solution to meet your most demanding requirements. Whether you're upgrading your current systems or exploring new possibilities, this product offers unparalleled value and performance.`;
    return `${p1},\n    description: \`${desc}\`\n  `;
});

fs.writeFileSync('src/data.ts', newData);
console.log('Update Complete');
