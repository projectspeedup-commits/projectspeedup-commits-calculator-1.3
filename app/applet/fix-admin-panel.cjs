const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/AdminPanelEconomyTab.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add import
if (!content.includes('OverheadCostsTable')) {
  // Replace the import block
  content = content.replace(
    "import { DirectCostsTable } from './economy/DirectCostsTable';",
    "import { DirectCostsTable } from './economy/DirectCostsTable';\nimport { OverheadCostsTable } from './economy/OverheadCostsTable';"
  );
}

// Add overheadItems
if (!content.includes('const overheadItems = ')) {
  content = content.replace(
    'const directItems = store.economyItems.filter((i: any) => i.category === "direct");',
    'const directItems = store.economyItems.filter((i: any) => i.category === "direct");\n  const overheadItems = store.economyItems.filter((i: any) => i.category === "overhead");'
  );
}

// Add to UI
if (!content.includes('<OverheadCostsTable')) {
  content = content.replace(
    '<DirectCostsTable directItems={directItems} handleEconomyChange={store.updateEconomyItem} />',
    '<DirectCostsTable directItems={directItems} handleEconomyChange={store.updateEconomyItem} />\n            <OverheadCostsTable overheadItems={overheadItems} handleEconomyChange={store.updateEconomyItem} />'
  );
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed AdminPanelEconomyTab.tsx');
