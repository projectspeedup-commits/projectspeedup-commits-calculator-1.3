const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx')) {
         results.push(file);
      }
    }
  });
  return results;
}

const files = walk('src/components');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  content = content.replace(/<td className=\"text-left px-3 py-2 text-xs border border-slate-200 dark:border-slate-800 align-middle\"/g, 
             '<td className=\"px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left\"');

  content = content.replace(/<td className=\"text-center px-4 py-3 text-\[13px\] border-b border-slate-100 dark:border-slate-800\/50 align-middle\"/g, 
             '<td className=\"px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center\"');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Updated: ' + file);
  }
});
