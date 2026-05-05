const fs = require('fs');
const lines = fs.readFileSync('/app/applet/data.csv', 'utf8').split('\\n');
for (let i = 1; i < lines.length; i++) {
  const cols = lines[i].split(',');
  if (cols.length >= 30 && cols[29] && cols[29].trim().length > 0) {
    console.log(lines[i]);
    break;
  }
}
