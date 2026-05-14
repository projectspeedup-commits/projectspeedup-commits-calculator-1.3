const fs = require('fs');
let c = fs.readFileSync('src/components/supply/SupplyCalcStockSection.tsx', 'utf-8');

c = c.replace(/\{\(res\.weightTons\|\|res\.totalWeight\|\|0\)\.toFixed\(\s*3\s*,\s*\)\}/g, '(stockTotals?.techWaste2 || 0).toFixed(3)');

// Actually let's just write a custom script using string ranges.
let c1 = c.split('{(res.weightTons||res.totalWeight||0).toFixed(');
// ...
