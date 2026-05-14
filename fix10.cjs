const fs = require('fs');
let c = fs.readFileSync('src/components/production/CalcSupplySection.tsx', 'utf-8');

c = c.replace(/res\.combinedTechWaste2 > 0\s*\?\s*String\(\s*\(\s*res\.weightTons\s*\|\|\s*res\.totalWeight\s*\|\|\s*0\s*\)\.toFixed\(3\),\s*\)\.replace\("\.", ","\)\s*:\s*"0"/g,
    'res.combinedTechWaste2 > 0\n                                        ? String(\n                                            res.combinedTechWaste2.toFixed(3),\n                                          ).replace(".", ",")\n                                        : "0"'
);

c = c.replace(/res\.combinedUsefulRem2 > 0\s*\?\s*String\(\s*\(\s*res\.weightTons\s*\|\|\s*res\.totalWeight\s*\|\|\s*0\s*\)\.toFixed\(3\),\s*\)\.replace\("\.", ","\)\s*:\s*"0"/g,
    'res.combinedUsefulRem2 > 0\n                                        ? String(\n                                            res.combinedUsefulRem2.toFixed(3),\n                                          ).replace(".", ",")\n                                        : "0"'
);

c = c.replace(/res\.combinedKim2 > 0\s*\?\s*String\(\s*\(\s*res\.weightTons\s*\|\|\s*res\.totalWeight\s*\|\|\s*0\s*\)\.toFixed\(3\),\s*\)\.replace\("\.", ","\)\s*:\s*"0"/g,
    'res.combinedKim2 > 0\n                                        ? String(\n                                            res.combinedKim2.toFixed(3),\n                                          ).replace(".", ",")\n                                        : "0"'
);

c = c.replace(/res\.combinedTechWaste3 > 0\s*\?\s*String\(\s*\(\s*res\.weightTons\s*\|\|\s*res\.totalWeight\s*\|\|\s*0\s*\)\.toFixed\(3\),\s*\)\.replace\("\.", ","\)\s*:\s*"0"/g,
    'res.combinedTechWaste3 > 0\n                                        ? String(\n                                            res.combinedTechWaste3.toFixed(3),\n                                          ).replace(".", ",")\n                                        : "0"'
);

c = c.replace(/res\.combinedUsefulRem3 > 0\s*\?\s*String\(\s*\(\s*res\.weightTons\s*\|\|\s*res\.totalWeight\s*\|\|\s*0\s*\)\.toFixed\(3\),\s*\)\.replace\("\.", ","\)\s*:\s*"0"/g,
    'res.combinedUsefulRem3 > 0\n                                        ? String(\n                                            res.combinedUsefulRem3.toFixed(3),\n                                          ).replace(".", ",")\n                                        : "0"'
);

c = c.replace(/res\.combinedKim3 > 0\s*\?\s*String\(\s*\(\s*res\.weightTons\s*\|\|\s*res\.totalWeight\s*\|\|\s*0\s*\)\.toFixed\(3\),\s*\)\.replace\("\.", ","\)\s*:\s*"0"/g,
    'res.combinedKim3 > 0\n                                        ? String(\n                                            res.combinedKim3.toFixed(3),\n                                          ).replace(".", ",")\n                                        : "0"'
);


// Numeric ones
c = c.replace(/res\.combinedTechWaste2 > 0\s*\?\s*Number\(\s*\(\s*res\.weightTons\s*\|\|\s*res\.totalWeight\s*\|\|\s*0\s*\)\.toFixed\(3\),\s*\)\s*:\s*0/g,
    'res.combinedTechWaste2 > 0\n                                        ? Number(\n                                            res.combinedTechWaste2.toFixed(3),\n                                          )\n                                        : 0'
);
c = c.replace(/res\.combinedUsefulRem2 > 0\s*\?\s*Number\(\s*\(\s*res\.weightTons\s*\|\|\s*res\.totalWeight\s*\|\|\s*0\s*\)\.toFixed\(3\),\s*\)\s*:\s*0/g,
    'res.combinedUsefulRem2 > 0\n                                        ? Number(\n                                            res.combinedUsefulRem2.toFixed(3),\n                                          )\n                                        : 0'
);
c = c.replace(/res\.combinedTechWaste3 > 0\s*\?\s*Number\(\s*\(\s*res\.weightTons\s*\|\|\s*res\.totalWeight\s*\|\|\s*0\s*\)\.toFixed\(3\),\s*\)\s*:\s*0/g,
    'res.combinedTechWaste3 > 0\n                                        ? Number(\n                                            res.combinedTechWaste3.toFixed(3),\n                                          )\n                                        : 0'
);
c = c.replace(/res\.combinedUsefulRem3 > 0\s*\?\s*Number\(\s*\(\s*res\.weightTons\s*\|\|\s*res\.totalWeight\s*\|\|\s*0\s*\)\.toFixed\(3\),\s*\)\s*:\s*0/g,
    'res.combinedUsefulRem3 > 0\n                                        ? Number(\n                                            res.combinedUsefulRem3.toFixed(3),\n                                          )\n                                        : 0'
);

c = c.replace(/res\.weightTons/g, '(res.weight || res.totalWeight)');

fs.writeFileSync('src/components/production/CalcSupplySection.tsx', c);
