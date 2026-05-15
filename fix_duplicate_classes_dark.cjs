const fs = require('fs');
function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const p = dir + '/' + file;
    if (fs.statSync(p).isDirectory()) {
      processDir(p);
    } else if (p.endsWith('.tsx') || p.endsWith('.ts')) {
      let content = fs.readFileSync(p, 'utf8');
      
      const before = content;
      content = content.replace(/dark:text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200/g, 'dark:text-slate-200');
      content = content.replace(/text-slate-800 dark:text-slate-200 dark:text-slate-800 dark:text-slate-200/g, 'text-slate-800 dark:text-slate-200');
      content = content.replace(/text-slate-800 dark:text-slate-200 dark:text-slate-200/g, 'text-slate-800 dark:text-slate-200');
      
      if (before !== content) {
        fs.writeFileSync(p, content);
        console.log('Fixed', p);
      }
    }
  }
}
processDir('src/components');
