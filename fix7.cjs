const fs = require('fs');
let c = fs.readFileSync('src/components/supply/SupplyCalcStockSection.tsx', 'utf-8');

c = c.replace('<span>\n{ (res.weightTons || res.totalWeight || 0).toFixed(3) }{""}\nтн\n</span>\n</div>\n</div>\n</th>\n<th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >\n<div className="flex flex-col items-center justify-center gap-1">\n<span>Дел. Остатки склад г/к</span>\n<div className="inline-flex items-center gap-1 border border-slate-200 dark:border-slate-800  px-1.5 py-0.5 rounded text-[9px] font-black tracking-normal">\n<span className="text-slate-800 dark:text-slate-200/70">\nΣ\n</span>\n<span>\n{ (res.weightTons || res.totalWeight || 0).toFixed(3) }', 
'<span>\n{ (stockTotals?.techWaste2 || 0).toFixed(3) }{""}\nтн\n</span>\n</div>\n</div>\n</th>\n<th className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle sticky top-0 z-10" >\n<div className="flex flex-col items-center justify-center gap-1">\n<span>Дел. Остатки склад г/к</span>\n<div className="inline-flex items-center gap-1 border border-slate-200 dark:border-slate-800  px-1.5 py-0.5 rounded text-[9px] font-black tracking-normal">\n<span className="text-slate-800 dark:text-slate-200/70">\nΣ\n</span>\n<span>\n{ (stockTotals?.usefulRem2 || 0).toFixed(3) }');

let idx = 0;
c = c.replace(/\{\s*\(\s*res\.weightTons\s*\|\|\s*res\.totalWeight\s*\|\|\s*0\s*\)\s*\.\s*toFixed\(\s*3\s*\)\s*\}/g, (match) => {
    idx++;
    if (idx === 1) return '{ (res.weight || res.totalWeight || 0).toFixed(3) }'; // row 805
    if (idx === 2) return '{ (res.remainingToProcess || 0).toFixed(3) }'; // row 811
    if (idx === 3) return '{ (res.weight || res.totalWeight || 0).toFixed(3) }'; // row 846
    if (idx === 4) return '{ Number(stockItem.stockBeforeTaking || 0).toFixed(3) }';
    if (idx === 5) return '{ Number(stockItem.allocatedAmount || 0).toFixed(3) }';
    if (idx === 6) return '{ Number(stockItem.stockAfterTaking || 0).toFixed(3) }';
    return match;
});

fs.writeFileSync('src/components/supply/SupplyCalcStockSection.tsx', c);
