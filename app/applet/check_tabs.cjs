const fs = require('fs');
const content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const supplyStart = content.indexOf('{activeTab === "supply" && (');
const supplyEndPosFunc = () => {
    let brackets = 0;
    for(let i = supplyStart + '{activeTab === "supply" && ('.length; i < content.length; i++) {
        if (content[i] === '{') brackets++;
        if (content[i] === '}') {
            if (brackets === 0) return i;
            brackets--;
        }
    }
    return -1;
};
// since it's {activeTab === ... && ( <motion.div> ... </motion.div> )}
// The closing would be )} or something. Let's just find the string.
const lines = content.split('\n');

let supplyLines = [];
let inSupply = false;

let prodLines = [];
let inProd = false;

for (let i = 0; i < lines.length; i++) {
   const line = lines[i];
   if (line.includes('{activeTab === "supply" && (')) inSupply = true;
   else if (line.includes('{activeTab === "economy" && (')) inSupply = false;
   
   if (line.includes('{activeTab === "production" && (')) inProd = true;
   else if (line.includes('{activeTab === "logistics" && (')) inProd = false;

   if (inSupply) supplyLines.push(line);
   if (inProd) prodLines.push(line);
}

console.log(`Supply lines: ${supplyLines.length}`);
console.log(`Production lines: ${prodLines.length}`);
