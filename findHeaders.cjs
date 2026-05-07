const fs = require('fs');
const contents = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');
const lines = contents.split('\n');
let count = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('th className="px-5') || lines[i].includes('<th ') || lines[i].includes('<th className="px-5')) {
    if (lines[i].includes('th')) { // loose check
        count++;
        if (count === 29) {
           console.log("FOUND 29 at line: " + (i + 1) + " -> " + lines[i].trim());
        }
        if (count >= 24 && count <= 35) {
           console.log("th index " + count + ": line " + (i + 1) + " -> " + lines[i].trim());
        }
    }
  }
}
