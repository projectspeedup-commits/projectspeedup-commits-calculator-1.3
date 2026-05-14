const fs = require('fs');
const path = require('path');

const dirs = ['src/components/production', 'src/components/supply'];

dirs.forEach(dir => {
    fs.readdirSync(dir).forEach(file => {
        if (file.endsWith('.tsx')) {
            const p = path.join(dir, file);
            let content = fs.readFileSync(p, 'utf8');
            let original = content;

            // Make nomenclature narrower
            content = content.replace(/<div\s+className="max-w-\[200px\]([^"]*)"(.*?)>/g, '<div className="max-w-[12rem]$1"$2>');
            content = content.replace(/className="truncate text-slate-800/g, 'className="max-w-[12rem] truncate text-slate-800');
            // If class name is exactly truncate
            content = content.replace(/className="max-w-\[200px\]([^"]*)"/g, 'className="max-w-[12rem]$1"');
            
            // Set th Номенклатура
            content = content.replace(/<th([^>]*)>Номенклатура<\/th>/g, (match, p1) => {
                if (p1.includes('style=')) return `<th${p1.replace(/style=\{[^}]*\}/, "style={{ width: '12rem', maxWidth: '12rem', minWidth: '12rem' }}")}>Номенклатура</th>`;
                return `<th${p1} style={{ width: '12rem', maxWidth: '12rem', minWidth: '12rem' }}>Номенклатура</th>`;
            });

            // Set th Внутр. №
             content = content.replace(/<th([^>]*)>Внутр\. №<\/th>/g, '<th$1 style={{ width: "8rem" }}>Внутр. №</th>');
             content = content.replace(/<th([^>]*)>Внутренний №[^<]*<\/th>/g, '<th$1 style={{ width: "8rem" }}>Внутренний №</th>');

            if (content !== original) {
                fs.writeFileSync(p, content, 'utf8');
                console.log('Narrowed nom in', p);
            }
        }
    })
});
