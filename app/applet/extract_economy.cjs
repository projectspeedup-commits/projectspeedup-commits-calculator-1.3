const fs = require('fs');
const content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const startStr = '{activeTab === "economy" && (';
const endStr = '          {activeTab === "production" && (';

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

const economyBlock = content.slice(startIndex, endIndex);

fs.writeFileSync('economy_block_raw.txt', economyBlock);
console.log('done', startIndex, endIndex);
