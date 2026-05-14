const fs = require('fs');
const path = require('path');

const dirs = ['src/components/production', 'src/components/supply'];

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // unify table
    content = content.replace(/<table\s+className="[^"]*"/g, '<table className="w-full text-left border-collapse text-sm"');
    content = content.replace(/<table(\s|>)(?!.*className)/g, '<table className="w-full text-left border-collapse text-sm"$1');

    // unify thead
    content = content.replace(/<thead\s+className="[^"]*"/g, '<thead className="bg-slate-50 dark:bg-slate-800/50"');
    content = content.replace(/<thead(\s|>)/g, (match, p1) => {
        if (match.includes('className')) return match;
        return `<thead className="bg-slate-50 dark:bg-slate-800/50"${p1}`;
    });

    // unify tr
    content = content.replace(/<tr\s+className="[^"]*"/g, '<tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"');
    content = content.replace(/<tr(\s|>)/g, (match, p1) => {
        if (match.includes('className')) return match;
        return `<tr className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"${p1}`;
    });

    // unify th
    content = content.replace(/<th\s+className="([^"]*)"/g, (match, p1) => {
        let align = '';
        if (p1.includes('text-center')) align = 'text-center ';
        else if (p1.includes('text-right')) align = 'text-right ';
        else align = 'text-left ';
        return `<th className="${align}px-4 py-3 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap"`;
    });
    // add to th without class
    content = content.replace(/<th(\s|>)/g, (match, p1) => {
        if (match.includes('className')) return match;
        return `<th className="text-left px-4 py-3 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap"${p1}`;
    });

    // unify td
    content = content.replace(/<td\s+className="([^"]*)"/g, (match, p1) => {
        let align = '';
        if (p1.includes('text-center')) align = 'text-center ';
        else if (p1.includes('text-right')) align = 'text-right ';
        else align = 'text-left ';
        return `<td className="${align}px-4 py-3 text-slate-800 dark:text-slate-200 align-middle"`;
    });
    // add to td without class
    content = content.replace(/<td(\s|>)/g, (match, p1) => {
        if (match.includes('className')) return match;
        return `<td className="text-left px-4 py-3 text-slate-800 dark:text-slate-200 align-middle"${p1}`;
    });

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
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
