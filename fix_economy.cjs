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

const files = walk('src/components/economy');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // table
  content = content.replace(/<table className=\"w-full text-left border-collapse\">/g, 
             '<table className=\"w-full text-left border-collapse text-xs whitespace-nowrap text-slate-800 dark:text-slate-200\">');
  
  // th
  content = content.replace(/<th className=\"px-6 py-4 text-\[10px\] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400\"/g, 
             '<th className=\"font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-left text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle\"');

  content = content.replace(/<th className=\"px-6 py-4 text-\[10px\] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 text-center\"/g, 
             '<th className=\"font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-center text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle\"');

  content = content.replace(/<th className=\"px-6 py-4 text-\[10px\] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right\"/g, 
             '<th className=\"font-bold text-slate-700 dark:text-slate-300 px-4 py-3 text-right text-[11px] uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 align-middle\"');
             
  // td
  content = content.replace(/<td className=\"px-6 py-4\">/g, 
             '<td className=\"px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-left\">');

  content = content.replace(/<td className=\"px-6 py-4 text-center\">/g, 
             '<td className=\"px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-center\">');

  content = content.replace(/<td className=\"px-6 py-4 text-right\">/g, 
             '<td className=\"px-4 py-3 text-sm border-b border-slate-100 dark:border-slate-800/50 align-middle text-right\">');
             
  // tr
  content = content.replace(/<tr className=\"hover:bg-slate-50 dark:hover:bg-slate-800\/50 transition-colors group\">/g, 
             '<tr className=\"border-b border-slate-100 dark:border-slate-800/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors group\">');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Updated: ' + file);
  }
});
