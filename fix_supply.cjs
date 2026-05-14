const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/components/supply/SupplyCalcSection.tsx',
  'src/components/supply/SupplyCalcStockSection.tsx',
  'src/components/supply/SupplyCalcSupplySection.tsx'
];

filesToFix.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  content = content.replace(/max-h-\[60vh\]/g, 'max-h-[calc(100vh-350px)]');
  content = content.replace(/max-h-\[600px\]/g, 'max-h-[calc(100vh-350px)]');
  content = content.replace(/overflow-x-auto overflow-y-auto/g, 'overflow-auto');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Updated: ' + file);
  }
});
