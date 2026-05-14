const fs = require('fs');
let c = fs.readFileSync('src/components/supply/SupplyCalcSupplySection.tsx', 'utf-8');

c = c.replace(/res\.weightTons \? Number\(\s*res\.weightTons,\s*\)\.toFixed\(3\)/g, '(res.weight || res.totalWeight || 0).toFixed(3)');
c = c.replace(/res\.weightTons/g, '(res.weight || res.totalWeight)');

fs.writeFileSync('src/components/supply/SupplyCalcSupplySection.tsx', c);
