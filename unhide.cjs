const fs = require('fs');

let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

// Unhide th and td that have `hidden px-5 ...`
content = content.replace(/<th className="hidden px-5/g, '<th className="px-5');
content = content.replace(/<td className="hidden px-5/g, '<td className="px-5');

fs.writeFileSync('src/components/AdminPanel.tsx', content);
