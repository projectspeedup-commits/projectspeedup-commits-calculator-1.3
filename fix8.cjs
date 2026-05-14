const fs = require('fs');
let c = fs.readFileSync('src/components/supply/SupplyCalcStockSection.tsx', 'utf-8');

let idx2 = 0;
c = c.replace(/\{\s*\(\s*res\.weightTons\s*\|\|\s*res\.totalWeight\s*\|\|\s*0\s*\)\s*\.\s*toFixed\(\s*3\s*,?\s*\)\s*\}/g, (match) => {
    idx2++;
    if (idx2 === 1) return '{ Number(stockItem.allocatedAmount || 0).toFixed(3) }';
    if (idx2 === 2) return '{ Number(stockItem.stockAfterTaking || 0).toFixed(3) }';
    return match;
});

fs.writeFileSync('src/components/supply/SupplyCalcStockSection.tsx', c);
