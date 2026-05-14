const fs = require('fs');
const path = require('path');

const dirs = ['src/components/production', 'src/components/supply', 'src/components'];

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Remove double classNames: take the second one
    content = content.replace(/className="([^"]*)"\s+className="([^"]*)"/g, 'className="$2"');
    
    // The user wants the header row to be fixed. So anywhere there is a <thead className="...">
    // Let's ensure it has "sticky top-0 z-20 shadow-sm shadow-slate-200 dark:shadow-slate-800"
    content = content.replace(/<thead className="([^"]*)"/g, (match, p1) => {
       if (!p1.includes('sticky')) {
           return `<thead className="${p1} sticky top-0 z-20 shadow-sm shadow-slate-200 dark:shadow-slate-800"`;
       }
       return match;
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
            // ...
        } else if (fullPath.endsWith('.tsx')) {
            processFile(fullPath);
        }
    }
}

dirs.forEach(processDir);
