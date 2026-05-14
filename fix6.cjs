const fs = require('fs');
let c = fs.readFileSync('src/components/supply/SupplyCalcStockSection.tsx', 'utf-8');

c = c.replace(/\{\s*\(\s*res\.weightTons\s*\|\|\s*res\.totalWeight\s*\|\|\s*0\s*\)\s*\.\s*toFixed\(\s*3\s*,?\s*\)\s*\}/g, '{ (res.weightTons || res.totalWeight || 0).toFixed(3) }');
fs.writeFileSync('src/components/supply/SupplyCalcStockSection.tsx', c);
