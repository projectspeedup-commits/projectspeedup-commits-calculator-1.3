const fs = require('fs');
const path = require('path');

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

  // Replace p-12 with p-6 md:p-12
  if (content.includes('p-12')) {
    content = content.replace(/\bp-12\b/g, 'p-6 md:p-12');
    changed = true;
  }
  
  // Replace overflow-x-auto without w-full to have w-full to prevent breaking
  if (content.includes('overflow-x-auto') && !content.includes('overflow-x-auto w-full') && !content.includes('w-full overflow-x-auto')) {
     content = content.replace(/\boverflow-x-auto\b/g, 'overflow-x-auto w-full');
     changed = true;
  }

  // Adjust table text to be smaller on mobile
  if (content.match(/<table /)) {
      content = content.replace(/<table className="([^"]*)"/g, (match, classes) => {
          if (!classes.includes('text-xs')) {
             return `<table className="${classes} text-[10px] md:text-xs"`;
          }
          return match;
      });
      changed = true;
  }

  // Make h-9 buttons h-10 md:h-9 for touch targets, but actually h-10 is standard tailwind.
  if (content.match(/h-9/)) {
      content = content.replace(/\bh-9\b/g, 'min-h-[44px] md:min-h-0 md:h-9');
      changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
