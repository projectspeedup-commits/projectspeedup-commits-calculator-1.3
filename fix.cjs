const fs = require('fs');

function fix(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/<table className="w-full text-left border-collapse text-sm" border="1"><thead className="bg-slate-50 dark:bg-slate-800\/50"><tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50\/50 dark:hover:bg-slate-800\/50 transition-colors">/g, '<table border="1"><thead><tr>');
    content = content.replace(/<th className="text-left px-4 py-3 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap" style="text-align:center;font-weight:bold;">/g, '<th style="text-align:center;font-weight:bold;">');
    
    // Some lines build up row HTML like '<tr>'. Let's restore them if they got replaced.
    // They look like rowsHtml += "<tr>"; but we changed them to rowsHtml += '<tr className="...">';
    content = content.replace(/rowsHtml\s*\+=\s*"?<tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50\/50 dark:hover:bg-slate-800\/50 transition-colors">"?/g, 'rowsHtml += "<tr>"');
    
    // the row arrays
    content = content.replace(/rowsHtml\s*\+=\s*"?<tr>"?/g, 'rowsHtml += "<tr>"'); // just to be safe

    fs.writeFileSync(filePath, content, 'utf8');
}

fix('src/components/production/CalcStockSection.tsx');
fix('src/components/supply/SupplyCalcStockSection.tsx');
