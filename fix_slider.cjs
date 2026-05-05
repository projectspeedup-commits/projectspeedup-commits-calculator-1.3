const fs = require('fs');

let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

content = content.replace(/xl:shrink/g, 'xl:shrink-0');
content = content.replace(/xl:min-w-0/g, 'xl:min-w-max');
content = content.replace(/xl:flex-1/g, 'xl:flex-none');

fs.writeFileSync('src/components/AdminPanel.tsx', content);
