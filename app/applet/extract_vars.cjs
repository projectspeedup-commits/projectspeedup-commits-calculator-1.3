const fs = require('fs');
const content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const returnIdx = content.indexOf('\n  return (');
const beforeReturn = content.slice(0, returnIdx);

// Extract all top-level variables in the component
let vars = new Set();
const regex = /^\s*(const|let)\s+([a-zA-Z0-9_]+)\s*=/gm;
let match;
while ((match = regex.exec(beforeReturn)) !== null) {
  vars.add(match[2]);
}

const destructRegex = /^\s*(const|let)\s+\[([^\]]+)\]\s*=/gm;
while ((match = destructRegex.exec(beforeReturn)) !== null) {
  const parts = match[2].split(',').map(s => s.trim());
  for (let p of parts) {
      if (p) vars.add(p.split('=')[0].trim());
  }
}

console.log(Array.from(vars).join(', '));
fs.writeFileSync('vars.txt', Array.from(vars).join(', '));
