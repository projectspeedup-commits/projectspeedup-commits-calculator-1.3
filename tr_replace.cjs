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

  content = content.replace(/className=\"border-b border-slate-200 dark:border-slate-800 transition-colors\"/g, 
             'className=\"border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 group\"');

  content = content.replace(/className=\{\`border-b border-slate-200 dark:border-slate-800 transition-colors\`\}/g, 
             'className={`border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 group`}');

  content = content.replace(/className=\"hover:bg-slate-50\/50 dark:hover:bg-slate-800\/20 transition-colors group\"/g, 
             'className=\"border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group\"');

  content = content.replace(/className=\{\`hover:bg-slate-50 dark:hover:bg-slate-800\/50 transition-colors\`\}/g, 
             'className={`border-b border-slate-100 dark:border-slate-800/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors group`}');

  content = content.replace(/className=\"hover:bg-slate-50 dark:hover:bg-slate-800\/50 transition-colors\"/g, 
             'className=\"border-b border-slate-100 dark:border-slate-800/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors group\"');

  content = content.replace(/<tr className=\"border-b border-slate-200 dark:border-slate-800\">/g, 
             '<tr className=\"border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group\">');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Updated: ' + file);
  }
});
