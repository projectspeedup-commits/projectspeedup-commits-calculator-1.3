const fs = require('fs');
let c = fs.readFileSync('src/components/supply/SupplyCalcSupplySection.tsx', 'utf-8');

c = c.replace(/res\.combinedTechWaste2 > 0\s*\?\s*String\(\s*res\.combinedTechWaste\.toFixed\(3\),\s*\)\.replace\("\.", ","\)\s*:\s*"0"/g, 
'res.combinedTechWaste2 > 0 ? String(res.combinedTechWaste2.toFixed(3)).replace(".", ",") : "0"');
c = c.replace(/res\.combinedUsefulRem2 > 0\s*\?\s*String\(\s*res\.combinedUsefulRem\.toFixed\(3\),\s*\)\.replace\("\.", ","\)\s*:\s*"0"/g, 
'res.combinedUsefulRem2 > 0 ? String(res.combinedUsefulRem2.toFixed(3)).replace(".", ",") : "0"');
c = c.replace(/res\.combinedKim2 > 0\s*\?\s*String\(\s*res\.combinedKim\.toFixed\(3\),\s*\)\.replace\("\.", ","\)\s*:\s*"0"/g, 
'res.combinedKim2 > 0 ? String(res.combinedKim2.toFixed(3)).replace(".", ",") : "0"');

c = c.replace(/res\.combinedTechWaste3 > 0\s*\?\s*String\(\s*res\.combinedTechWaste\.toFixed\(3\),\s*\)\.replace\("\.", ","\)\s*:\s*"0"/g, 
'res.combinedTechWaste3 > 0 ? String(res.combinedTechWaste3.toFixed(3)).replace(".", ",") : "0"');
c = c.replace(/res\.combinedUsefulRem3 > 0\s*\?\s*String\(\s*res\.combinedUsefulRem\.toFixed\(3\),\s*\)\.replace\("\.", ","\)\s*:\s*"0"/g, 
'res.combinedUsefulRem3 > 0 ? String(res.combinedUsefulRem3.toFixed(3)).replace(".", ",") : "0"');
c = c.replace(/res\.combinedKim3 > 0\s*\?\s*String\(\s*res\.combinedKim\.toFixed\(3\),\s*\)\.replace\("\.", ","\)\s*:\s*"0"/g, 
'res.combinedKim3 > 0 ? String(res.combinedKim3.toFixed(3)).replace(".", ",") : "0"');

// Numbers
c = c.replace(/res\.combinedTechWaste2 > 0\s*\?\s*Number\(\s*res\.combinedTechWaste\.toFixed\(3\),\s*\)\s*:\s*0/g, 
'res.combinedTechWaste2 > 0 ? Number(res.combinedTechWaste2.toFixed(3)) : 0');
c = c.replace(/res\.combinedUsefulRem2 > 0\s*\?\s*Number\(\s*res\.combinedUsefulRem\.toFixed\(3\),\s*\)\s*:\s*0/g, 
'res.combinedUsefulRem2 > 0 ? Number(res.combinedUsefulRem2.toFixed(3)) : 0');
c = c.replace(/res\.combinedKim2 > 0\s*\n\s*\?\s*Number\(\s*res\.combinedKim\.toFixed\(3\)\)/g, 
'res.combinedKim2 > 0 ? Number(res.combinedKim2.toFixed(3))');

c = c.replace(/res\.combinedTechWaste3 > 0\s*\?\s*Number\(\s*res\.combinedTechWaste\.toFixed\(3\),\s*\)\s*:\s*0/g, 
'res.combinedTechWaste3 > 0 ? Number(res.combinedTechWaste3.toFixed(3)) : 0');
c = c.replace(/res\.combinedUsefulRem3 > 0\s*\?\s*Number\(\s*res\.combinedUsefulRem\.toFixed\(3\),\s*\)\s*:\s*0/g, 
'res.combinedUsefulRem3 > 0 ? Number(res.combinedUsefulRem3.toFixed(3)) : 0');
c = c.replace(/res\.combinedKim3 > 0\s*\n\s*\?\s*Number\(\s*res\.combinedKim\.toFixed\(3\)\)/g, 
'res.combinedKim3 > 0 ? Number(res.combinedKim3.toFixed(3))');

// The JSX expressions
c = c.replace(/res\.combinedTechWaste2 > 0\s*\n\s*\?\s*res\.combinedTechWaste\.toFixed\(\s*3,\s*\)/g, 
'res.combinedTechWaste2 > 0 ? res.combinedTechWaste2.toFixed(3)');
c = c.replace(/res\.combinedUsefulRem2 > 0\s*\n\s*\?\s*res\.combinedUsefulRem\.toFixed\(\s*3,\s*\)/g, 
'res.combinedUsefulRem2 > 0 ? res.combinedUsefulRem2.toFixed(3)');
c = c.replace(/res\.combinedKim2 > 0\s*\n\s*\?\s*res\.combinedKim\.toFixed\(3\)/g, 
'res.combinedKim2 > 0 ? res.combinedKim2.toFixed(3)');

c = c.replace(/res\.combinedTechWaste3 > 0\s*\n\s*\?\s*res\.combinedTechWaste\.toFixed\(\s*3,\s*\)/g, 
'res.combinedTechWaste3 > 0 ? res.combinedTechWaste3.toFixed(3)');
c = c.replace(/res\.combinedUsefulRem3 > 0\s*\n\s*\?\s*res\.combinedUsefulRem\.toFixed\(\s*3,\s*\)/g, 
'res.combinedUsefulRem3 > 0 ? res.combinedUsefulRem3.toFixed(3)');
c = c.replace(/res\.combinedKim3 > 0\s*\n\s*\?\s*res\.combinedKim\.toFixed\(3\)/g, 
'res.combinedKim3 > 0 ? res.combinedKim3.toFixed(3)');

// Final shortage
c = c.replace(/res\.finalShortage > 0\s*\n\s*\?\s*\(\(res\.weight \|\| res\.totalWeight\)\|\|res\.totalWeight\|\|0\)\.toFixed\(3\)/g, 
'res.finalShortage > 0 ? res.finalShortage.toFixed(3)');

fs.writeFileSync('src/components/supply/SupplyCalcSupplySection.tsx', c);
