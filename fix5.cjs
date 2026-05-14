const fs = require('fs');
let c = fs.readFileSync('src/components/supply/SupplyCalcStockSection.tsx', 'utf-8');

c = c.replace(/\{\s*\(\s*res\.weightTons\s*\|\|\s*res\.totalWeight\s*\|\|\s*0\s*\)\s*\.\s*toFixed\(\s*3\s*,?\s*\)\s*\}/g, (match, offset) => {
    let p = c.substring(Math.max(0, offset - 150), offset);
    if (p.includes("Тех. отходы склад г/к")) return "{ (stockTotals?.techWaste2 || 0).toFixed(3) }";
    if (p.includes("Дел. Остатки склад г/к")) return "{ (stockTotals?.usefulRem2 || 0).toFixed(3) }";
    
    let snippet2 = c.substring(0, offset);
    let trContext = snippet2.substring(snippet2.lastIndexOf('<tr'));
    let tdCount2 = (trContext.match(/<td/g) || []).length;

    // Down in stockItem maps, the header is:
    // Исх. Остаток (тн)
    // Взято (тн)
    // Остаток на складе (тн)
    if (p.includes('{"Длина"}') || p.includes('stockItem["Длина"]') || p.includes('stockItem.stockBeforeTaking') || tdCount2 > 6) {
        if (tdCount2 === 7) return '{ Number(stockItem.stockBeforeTaking || 0).toFixed(3) }';
        if (tdCount2 === 8) return '{ Number(stockItem.allocatedAmount || 0).toFixed(3) }';
        if (tdCount2 === 9) return '{ Number(stockItem.stockAfterTaking || 0).toFixed(3) }';
    }
    
    return '{ (res.weightTons || res.totalWeight || 0).toFixed(3) }';
});

fs.writeFileSync('src/components/supply/SupplyCalcStockSection.tsx', c);
