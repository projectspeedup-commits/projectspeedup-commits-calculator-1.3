const fs = require('fs');

let content = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const activeDashboardCode = `                {supplySection !== "free-stock" && supplySection !== "calc" && (() => {
                  const isSupplyView = supplySection === "calc-supply" || supplySection === "supply-plans";
                  const activeDashboardTotals = {
                    allocated: isSupplyView ? supplyCalculationData.totals.allocated : stockTotals.allocated,
                    shortage: isSupplyView ? supplyCalculationData.totals.deficit : stockTotals.shortage,
                    remaining: isSupplyView ? supplyCalculationData.totals.remaining : stockTotals.remaining,
                    techWaste2: isSupplyView ? supplyCalculationData.totals.techWaste2 : stockTotals.techWaste2,
                    usefulRem2: isSupplyView ? supplyCalculationData.totals.usefulRem2 : stockTotals.usefulRem2,
                    averageKim: isSupplyView ? supplyCalculationData.totals.averageKim : stockTotals.averageKim
                  };
                  return (
                  <div className="flex-none min-w-0 xl:max-w-2xl w-full md:w-auto relative overflow-hidden">`;

content = content.replace(
  /\{\s*supplySection !== "free-stock" && supplySection !== "calc" && \(\n\s*<div className="flex-none min-w-0 xl:max-w-2xl w-full md:w-auto relative overflow-hidden">/,
  activeDashboardCode
);

const summaryBlockStartIndex = content.indexOf('return (\n                  <div className="flex-none min-w-0 xl:max-w-2xl w-full md:w-auto relative overflow-hidden">');

if (summaryBlockStartIndex !== -1) {
  // we successfully injected the new logic
  // now replace stockTotals inside this block
  let blockEndIndex = content.indexOf('                  </div>\n                )}\n', summaryBlockStartIndex);
  if (blockEndIndex !== -1) {
    let block = content.substring(summaryBlockStartIndex, blockEndIndex);
    
    block = block.replace(/\{stockTotals\.allocated\.toFixed\(3\)\}/g, '{activeDashboardTotals.allocated.toFixed(3)}');
    block = block.replace(/\{stockTotals\.shortage\.toFixed\(3\)\}/g, '{activeDashboardTotals.shortage.toFixed(3)}');
    block = block.replace(/\{stockTotals\.remaining\.toFixed\(3\)\}/g, '{activeDashboardTotals.remaining.toFixed(3)}');
    block = block.replace(/\{stockTotals\.techWaste2\.toFixed\(3\)\}/g, '{activeDashboardTotals.techWaste2.toFixed(3)}');
    block = block.replace(/\{stockTotals\.usefulRem2\.toFixed\(3\)\}/g, '{activeDashboardTotals.usefulRem2.toFixed(3)}');
    block = block.replace(/\{Math\.max\(0,\s*stockTotals\.averageKim\)\.toFixed\(3\)\}/g, '{Math.max(0, activeDashboardTotals.averageKim).toFixed(3)}');

    content = content.substring(0, summaryBlockStartIndex) + block + content.substring(blockEndIndex);
  } else {
    console.log("Could not find block end.");
  }

  // Close the IIFE at the end of the block
  const endBlockStr = `                      
                    </div>
                  </div>
                )}`;
  const newEndBlockStr = `                      
                    </div>
                  </div>
                )})()}`;

  content = content.replace(endBlockStr, newEndBlockStr);

} else {
  console.log("Could not find injection point.");
}

fs.writeFileSync('src/components/AdminPanel.tsx', content);
