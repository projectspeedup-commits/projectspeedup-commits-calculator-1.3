const fs = require('fs');
const path = require('path');

const dirs = ['src/components/production', 'src/components/supply'];

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Remove strong highlights
    content = content.replace(/<span\s+className=(["`][^"`]*?(?:text-emerald-|text-rose-|text-sky-|text-indigo-|text-amber-|bg-sky-|bg-emerald-|bg-rose-|bg-indigo-|bg-amber-)[^"`]*["`])\s*>/g, () => {
        return '<span className="font-medium text-slate-800 dark:text-slate-200 text-xs">';
    });
    
    content = content.replace(/<div\s+className=(["`][^"`]*?(?:text-emerald-|text-rose-|text-sky-|text-indigo-|text-amber-|bg-sky-|bg-emerald-|bg-rose-|bg-indigo-|bg-amber-)[^"`]*["`])([^>]*)>/g, (match, p1, p2) => {
        return `<div className="font-medium text-slate-800 dark:text-slate-200 text-xs"${p2}>`;
    });

    content = content.replace(/<td\b([^>]*)>/g, (match, inner) => {
        // preserve standard style
        if (inner.includes('style=')) return match;
        
        let cleanInner = inner.replace(/className=(["'][^"']*["']|\{[^}]*\})/g, '');
        let align = 'text-center';
        if (inner.includes('text-left') || inner.includes('truncate') || inner.includes('nom')) {
            align = 'text-left';
        }
        return `<td className="${align} px-3 py-2 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 align-middle text-xs" ${cleanInner.trim()}>`;
    });

    content = content.replace(/<th\b([^>]*)>/g, (match, inner) => {
        if (inner.includes('style=')) return match;
        
        let cleanInner = inner.replace(/className=(["'][^"']*["']|\{[^}]*\})/g, '');
        return `<th className="text-center px-3 py-2 font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 align-middle text-xs bg-slate-100 dark:bg-slate-800/50 whitespace-nowrap" ${cleanInner.trim()}>`;
    });

    content = content.replace(/<table\s+className=(["'][^"']*["'])/g, '<table className="w-full text-left border-collapse text-xs table-fixed"');

    // Remove text highlight on 'font-bold text-emerald-400' and so on
    content = content.replace(/font-bold text-emerald-400/g, 'font-medium text-slate-800 dark:text-slate-200');
    content = content.replace(/font-bold text-rose-400/g, 'font-medium text-slate-800 dark:text-slate-200');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    } else {
        console.log(`Unchanged ${filePath}`);
    }
}

function processDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.tsx')) {
            processFile(fullPath);
        }
    }
}

dirs.forEach(processDir);
