const fs = require('fs');
function fix(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/<td className="text-left px-4 py-3 text-slate-800 dark:text-slate-200 align-middle">/g, '<td>');
    fs.writeFileSync(filePath, content, 'utf8');
}
fix('src/components/production/CalcStockSection.tsx');
fix('src/components/supply/SupplyCalcStockSection.tsx');
