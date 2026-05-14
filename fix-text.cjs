const fs = require('fs');
const path = require('path');

const dirs = ['src/components/production', 'src/components/supply'];

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // replace "Размер мм." -> "Размер"
    content = content.replace(/Размер мм\./g, 'Размер');
    content = content.replace(/Длина мм\./g, 'Длина');
    
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
