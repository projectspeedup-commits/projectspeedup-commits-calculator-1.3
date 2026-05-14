const fs = require('fs');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) results = results.concat(walk(file));
    else if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
  });
  return results;
}
const files = walk('./src/components/');
let count = 0;
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  if (c.includes('  hover: text-white')) {
    c = c.replace(/className="(.*?)  hover: text-white(.*?)"/g, 'className=\"$1 bg-indigo-600 hover:bg-indigo-700 text-white$2\"');
    fs.writeFileSync(f, c, 'utf8');
    console.log('Fixed', f);
    count++;
  }
});
console.log('Fixed ' + count + ' files');
