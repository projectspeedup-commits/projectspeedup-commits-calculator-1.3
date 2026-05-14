const fs = require('fs');

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Replace in headers/totals at component level
    content = content.replace(/{(res\.weightTons\|\|res\.totalWeight\|\|0)\.toFixed\(3\)}/g, (match, p1, offset, string) => {
        // Look at context
        let prevText = string.substring(Math.max(0, offset - 150), offset);
        if (prevText.includes("взято со склада") || prevText.includes("Взято со склада")) return "{stockTotals.allocated.toFixed(3)}";
        if (prevText.includes("дефицит") || prevText.includes("Дефицит")) return "{stockTotals.deficit.toFixed(3)}";
        if (prevText.includes("Обеспечено")) return "{res.allocatedStock.toFixed(3)}";
        if (prevText.includes("Дефицит:")) return "{res.shortageStock.toFixed(3)}";
        
        if (prevText.includes("Итого взято со склада")) return "{stockTotals.allocated.toFixed(3)}";
        if (prevText.includes("Итого дефицит")) return "{stockTotals.deficit.toFixed(3)}";
        if (prevText.includes("Итого тех. отходов")) return "{stockTotals.techWaste2.toFixed(3)}";
        if (prevText.includes("Итого делов. остатка")) return "{stockTotals.usefulRem2.toFixed(3)}";
        
        return match;
    });

    content = content.replace(/\(res\.weightTons\|\|res\.totalWeight\|\|0\)/g, (match, offset, string) => {
        let prevText = string.substring(Math.max(0, offset - 80), offset);
        if (prevText.includes("combinedTechWaste")) return "res.combinedTechWaste";
        if (prevText.includes("combinedUsefulRem")) return "res.combinedUsefulRem";
        if (prevText.includes("combinedKim")) return "res.combinedKim";
        if (prevText.includes("allocatedStock > 0")) return "res.allocatedStock";
        if (prevText.includes("shortageStock >")) return "res.shortageStock";
        
        // Let's fallback
        return match;
    });

    fs.writeFileSync(filePath, content);
}

fixFile('src/components/supply/SupplyCalcStockSection.tsx');
fixFile('src/components/supply/SupplyCalcSupplySection.tsx');
fixFile('src/components/production/CalcStockSection.tsx');
fixFile('src/components/production/CalcSupplySection.tsx');
console.log("Fixed!");
