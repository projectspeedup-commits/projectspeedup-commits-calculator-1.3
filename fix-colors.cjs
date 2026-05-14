const fs = require('fs');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
    }
  });
  return results;
}

const files = walk('./src/components');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Add dark:bg-slate-900 if bg-white is present and missing dark:bg
  content = content.replace(/className={?("[^"]*bg-white[^"]*")|('[^']*bg-white[^']*')|(`[^`]*bg-white[^`]*`)}?/g, (match) => {
    if (!match.includes('dark:bg-') && !match.includes('dark:bg-transparent')) {
        return match.replace('bg-white', 'bg-white dark:bg-slate-900');
    }
    return match;
  });

  if (content !== fs.readFileSync(file, 'utf8')) {
      fs.writeFileSync(file, content);
      changed = true;
      console.log('Fixed bg-white in', file);
  }
  
  content = fs.readFileSync(file, 'utf8');
  // Add dark:text-white if text-slate-900 or text-slate-800 is present and missing dark:text
  content = content.replace(/className={?("[^"]*text-slate-[89]00[^"]*")|('[^']*text-slate-[89]00[^']*')|(`[^`]*text-slate-[89]00[^`]*`)}?/g, (match) => {
    if (!match.includes('dark:text-')) {
        return match.replace(/text-slate-[89]00/, '$& dark:text-white');
    }
    return match;
  });

  if (content !== fs.readFileSync(file, 'utf8')) {
      fs.writeFileSync(file, content);
      console.log('Fixed text-slate in', file);
  }
});
