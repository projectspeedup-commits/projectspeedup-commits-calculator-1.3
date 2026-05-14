const fs = require('fs');
const path = require('path');

const dirs = ['src/components/production', 'src/components/supply'];

function cleanClasses(content) {
    let original = content;
    
    // Normalize <table className="..."> to a standard one
    content = content.replace(/<table\s+className=["'][^"']*["']/g, '<table className="w-full text-left border-collapse text-xs table-fixed text-slate-800 dark:text-slate-200"');
    
    // Normalize <thead className="...">
    content = content.replace(/<thead\s+className=["'][^"']*["']/g, '<thead className="bg-slate-100 dark:bg-slate-800/50 sticky top-0 z-20 shadow-sm border-b border-slate-200 dark:border-slate-800"');
    
    // Normalize <tr className="..."> in thead
    content = content.replace(/<tr\s+className=["']border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50\/50 dark:hover:bg-slate-800\/50 transition-colors["']/g, '<tr className="border-b border-slate-200 dark:border-slate-800 transition-colors">');
    
    // Process th tags sequentially
    // we want all th to have neutral class
    content = content.replace(/<th([^>]*)>/g, (match, inner) => {
        if(inner.includes('style=')) return match; // skip manual styled
        let cleanInner = inner.replace(/className=(["'][^"']*["']|\{[^}]*\})/g, '');
        return `<th className="font-semibold text-slate-600 dark:text-slate-300 px-3 py-2 text-center text-xs align-middle border border-slate-200 dark:border-slate-800" ${cleanInner.trim()}>`;
    });

    // Process td tags
    content = content.replace(/<td([^>]*)>/g, (match, inner) => {
        if(inner.includes('style=')) return match;
        let cleanInner = inner.replace(/className=(["'][^"']*["']|\{\s*[`'][^`']*[`']\s*\})/g, '');
        
        let align = 'text-center';
        if (cleanInner.includes('Номенклатура') || inner.includes('nom') || inner.includes('text-left') || inner.includes('truncate')) {
            align = 'text-left';
        }
        
        return `<td className="${align} px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 align-middle" ${cleanInner.trim()}>`;
    });
    
    // Clean up highlighted backgrounds inside td
    content = content.replace(/bg-(sky|emerald|rose|indigo|amber|blue)-[0-9\/]+/g, '');
    content = content.replace(/text-(sky|emerald|rose|indigo|amber|blue)-[0-9]+/g, 'text-slate-800 dark:text-slate-200');
    content = content.replace(/border-(sky|emerald|rose|indigo|amber|blue)-[0-9\/]+/g, 'border-slate-200 dark:border-slate-800');
    
    return content;
}

dirs.forEach(dir => {
    fs.readdirSync(dir).forEach(file => {
        if (file.endsWith('.tsx')) {
            const p = path.join(dir, file);
            const content = fs.readFileSync(p, 'utf8');
            const newContent = cleanClasses(content);
            if (content !== newContent) {
                fs.writeFileSync(p, newContent, 'utf8');
                console.log('Fixed', p);
            }
        }
    })
});
