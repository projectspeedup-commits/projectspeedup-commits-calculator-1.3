const fs = require('fs');

let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const summaryBlockStartIndex = content.indexOf('return (\n                  <div className="flex-none min-w-0 xl:max-w-2xl w-full md:w-auto relative overflow-hidden">');

if (summaryBlockStartIndex !== -1) {
  let blockEndIndex = content.indexOf('                  </div>\n                )})()}', summaryBlockStartIndex);
  if (blockEndIndex !== -1) {
    let block = content.substring(summaryBlockStartIndex, blockEndIndex);
    
    block = block.replace(/\{\(\(stockTotals as any\)\.techWaste2 \|\| 0\)\.toFixed\(3\)\}/g, '{activeDashboardTotals.techWaste2.toFixed(3)}');
    block = block.replace(/\{\(\(stockTotals as any\)\.usefulRem2 \|\| 0\)\.toFixed\(3\)\}/g, '{activeDashboardTotals.usefulRem2.toFixed(3)}');

    content = content.substring(0, summaryBlockStartIndex) + block + content.substring(blockEndIndex);
    fs.writeFileSync('src/components/AdminPanel.tsx', content);
    console.log("Replaced correctly.");
  } else {
    console.log("Not found 2");
  }
} else {
  console.log("Not found 1");
}
