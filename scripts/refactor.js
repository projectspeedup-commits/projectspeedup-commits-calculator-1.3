import fs from 'fs';

let content = fs.readFileSync('src/components/AdminPanelProductionTab.tsx', 'utf-8');

const marker1 = '                ) : productionSection === "calc-stock" ? (';
const marker2 = '                ) : productionSection === "free-stock" ? (';

const idx1 = content.indexOf(marker1);
const idx2 = content.indexOf(marker2, idx1 + 1);

if (idx1 !== -1 && idx2 !== -1) {
  const nextLine = '\\n                  <CalcStockSection {...props} />\\n';
  const newContent = content.substring(0, idx1 + marker1.length) + nextLine + content.substring(idx2);
  fs.writeFileSync('src/components/AdminPanelProductionTab.tsx', newContent);
  console.log('replaced calc-stock');
} else {
  console.log('not found');
}
