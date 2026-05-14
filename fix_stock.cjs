const fs = require('fs');

function fixStockSection() {
    let content = fs.readFileSync('src/components/supply/SupplyCalcStockSection.tsx', 'utf-8');
    
    // Totals
    content = content.replace(
        /взято со склада[\s\S]*?\{\(res\.weightTons\|\|res\.totalWeight\|\|0\)\.toFixed\(3\)\}/m,
        match => match.replace("(res.weightTons||res.totalWeight||0)", "allocatedStock")
    );
    content = content.replace(
        /дефицит[\s\S]*?\{\(res\.weightTons\|\|res\.totalWeight\|\|0\)\.toFixed\(3\)\}/m,
        match => match.replace("(res.weightTons||res.totalWeight||0)", "shortageStock")
    );
    
    // In map loop 1 (tsv rows)
    content = content.replace(/res\.combinedTechWaste > 0\s*\?\s*String\(\s*\(\w+\.\w+\|\|\w+\.\w+\|\|0\)\.toFixed\(3\)/g, 
                              "res.combinedTechWaste > 0\n ? String(\n res.combinedTechWaste.toFixed(3)");
    content = content.replace(/res\.combinedUsefulRem > 0\s*\?\s*String\(\s*\(\w+\.\w+\|\|\w+\.\w+\|\|0\)\.toFixed\(3\)/g, 
                              "res.combinedUsefulRem > 0\n ? String(\n res.combinedUsefulRem.toFixed(3)");
    content = content.replace(/res\.combinedKim > 0\s*\?\s*String\(\s*\(\w+\.\w+\|\|\w+\.\w+\|\|0\)\.toFixed\(3\)/g, 
                              "res.combinedKim > 0\n ? String(\n res.combinedKim.toFixed(3)");

    // In map loop 2
    content = content.replace(/res\.combinedTechWaste > 0\s*\?\s*\(\w+\.\w+\|\|\w+\.\w+\|\|0\)\.toFixed\(3\)/g, 
                              "res.combinedTechWaste > 0\n ? res.combinedTechWaste.toFixed(3)");
    content = content.replace(/res\.combinedUsefulRem > 0\s*\?\s*\(\w+\.\w+\|\|\w+\.\w+\|\|0\)\.toFixed\(3\)/g, 
                              "res.combinedUsefulRem > 0\n ? res.combinedUsefulRem.toFixed(3)");
    content = content.replace(/res\.combinedKim > 0\s*\?\s*\(\w+\.\w+\|\|\w+\.\w+\|\|0\)\.toFixed\(3\)/g, 
                              "res.combinedKim > 0\n ? res.combinedKim.toFixed(3)");                              
                              
    // In map loop 3
    content = content.replace(/res\.combinedTechWaste > 0\s*\?\s*Number\(\s*\(\w+\.\w+\|\|\w+\.\w+\|\|0\)\.toFixed\(3\)/g, 
                              "res.combinedTechWaste > 0\n ? Number(\n res.combinedTechWaste.toFixed(3)");
    content = content.replace(/res\.combinedUsefulRem > 0\s*\?\s*Number\(\s*\(\w+\.\w+\|\|\w+\.\w+\|\|0\)\.toFixed\(3\)/g, 
                              "res.combinedUsefulRem > 0\n ? Number(\n res.combinedUsefulRem.toFixed(3)");
    content = content.replace(/res\.combinedKim > 0\s*\?\s*Number\(\(\w+\.\w+\|\|\w+\.\w+\|\|0\)\.toFixed\(3\)\)/g, 
                              "res.combinedKim > 0\n ? Number(res.combinedKim.toFixed(3))");

    // Totals inside HTML
    content = content.replace(
        /Итого взято со склада[\s\S]*?\{\(res\.weightTons\|\|res\.totalWeight\|\|0\)\.toFixed\(\s*3\s*,\s*\)\}/m,
        match => match.replace("(res.weightTons||res.totalWeight||0)", "allocatedStock")
    );
    content = content.replace(
        /Итого дефицит[\s\S]*?\{\(res\.weightTons\|\|res\.totalWeight\|\|0\)\.toFixed\(\s*3\s*,\s*\)\}/m,
        match => match.replace("(res.weightTons||res.totalWeight||0)", "shortageStock")
    );
    content = content.replace(
        /Итого взято со склада[\s\S]*?\{\(res\.weightTons\|\|res\.totalWeight\|\|0\)\.toFixed\(\s*3\s*,\s*\)\}/m,
        match => match.replace("(res.weightTons||res.totalWeight||0)", "allocatedStock")
    );
    content = content.replace(
        /Итого дефицит[\s\S]*?\{\(res\.weightTons\|\|res\.totalWeight\|\|0\)\.toFixed\(\s*3\s*,\s*\)\}/m,
        match => match.replace("(res.weightTons||res.totalWeight||0)", "shortageStock")
    );
    content = content.replace(
        /Итого тех\. отходов.*?\{\(\w+\.\w+\|\|\w+\.\w+\|\|0\)\.toFixed\(\s*3\s*,\s*\)\}/s,
        match => match.replace("(res.weightTons||res.totalWeight||0)", "combinedTechWaste")
    );
    content = content.replace(
        /Итого делов\. остатка.*?\{\(\w+\.\w+\|\|\w+\.\w+\|\|0\)\.toFixed\(\s*3\s*,\s*\)\}/s,
        match => match.replace("(res.weightTons||res.totalWeight||0)", "combinedUsefulRem")
    );

    // td for allocatedStock
    content = content.replace(/res\.allocatedStock > 0\s*\?\s*\(\w+\.\w+\|\|\w+\.\w+\|\|0\)\.toFixed\(\s*3\s*,\s*\)/g, 
        "res.allocatedStock > 0\n ? res.allocatedStock.toFixed(\n 3,\n )");
    content = content.replace(/res\.shortageStock > 0\.0005\s*\?\s*\(\w+\.\w+\|\|\w+\.\w+\|\|0\)\.toFixed\(3\)/g, 
        "res.shortageStock > 0.0005\n ? res.shortageStock.toFixed(3)");
        
    fs.writeFileSync('src/components/supply/SupplyCalcStockSection.tsx', content);
}

fixStockSection();
