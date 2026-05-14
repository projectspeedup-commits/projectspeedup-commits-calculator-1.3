const fs = require('fs');
let c = fs.readFileSync('src/components/supply/SupplyCalcStockSection.tsx', 'utf-8');

c = c.replace(/\{\(res\.weightTons\|\|res\.totalWeight\|\|0\)\.toFixed\(\s*3\s*,?\s*\)\}/g, (match, offset, str) => {
    let p = str.substring(Math.max(0, offset - 150), offset);
    if (p.includes("взято со склада")) return "{ (stockTotals?.allocated || 0).toFixed(3) }";
    if (p.includes("дефицит")) return "{ (stockTotals?.deficit || 0).toFixed(3) }";
    if (p.includes("Обеспечено:")) return "{ (res.allocatedStock || 0).toFixed(3) }";
    if (p.includes("Дефицит:")) return "{ (res.shortageStock || 0).toFixed(3) }";
    if (p.includes("Тех. отходы склад г/к")) return "{ (stockTotals?.techWaste2 || 0).toFixed(3) }";
    if (p.includes("Дел. Остатки склад г/к")) return "{ (stockTotals?.usefulRem2 || 0).toFixed(3) }";
    
    // For the remaining items in rows (columns 9, 10, 14, 22, 23, 24)
    // We can infer by checking the next text or surrounding text
    // Just find the index and guess, or do string replacements contextually
    return match;
});

// For td columns 9, 10, 14 (totalWeight in order, remainingToProcess?, techEnds...)
// Oh wait, `res2.weightTons || res2.totalWeight` is the 10th column = res.weightTons, which should be res.totalWeight!
// 10: "Кол-во тн в зак." => res.weight ?? or res.totalWeight
// 11: "ИТОГО ост. к выполнению" => res.remainingToProcess ??
// Wait, I will just print the context of all remaining matches.
fs.writeFileSync('src/components/supply/SupplyCalcStockSection.tsx', c);
