const fs = require('fs');

const path = 'src/components/CalculatorApp.tsx';
const text = fs.readFileSync(path, 'utf8');
const lines = text.split('\n');

const startIndex = 2085; // /* COMMERCIAL COMMERCE SECTION */
const endIndex = 2697; // </section>

const extracted = lines.slice(startIndex, endIndex).join('\n');

const componentStr = `import { AlertCircle, Briefcase, Calculator, Circle, HelpCircle, Minus, PieChart, Plus, TrendingUp } from "lucide-react";
import { formatCurrency, formatInputValue, handleNumericInput } from "../../lib/constants";

export function CalculatorEconomy({
  sellPrice,
  setSellPrice,
  orderWeight,
  validationErrors,
  commercialStats,
  currentAdminRawPrice,
  advancedRemnantStats,
  isEconomyExpanded,
  setIsEconomyExpanded,
  totalPiecesInOrder
}: any) {
  return (
    <>
${extracted}
    </>
  );
}
`;

fs.writeFileSync('src/components/calculator/CalculatorEconomy.tsx', componentStr);

const newLines = [
  ...lines.slice(0, startIndex),
  `                <CalculatorEconomy
                  sellPrice={sellPrice}
                  setSellPrice={setSellPrice}
                  orderWeight={orderWeight}
                  validationErrors={validationErrors}
                  commercialStats={commercialStats}
                  currentAdminRawPrice={currentAdminRawPrice}
                  advancedRemnantStats={advancedRemnantStats}
                  isEconomyExpanded={isEconomyExpanded}
                  setIsEconomyExpanded={setIsEconomyExpanded}
                  totalPiecesInOrder={totalPiecesInOrder}
                />`,
  ...lines.slice(endIndex)
];

const modifiedText = newLines.join('\n');
const insertIndex = modifiedText.indexOf('import { HistoryPanel }');
const finalStr = modifiedText.slice(0, insertIndex) + 'import { CalculatorEconomy } from "./calculator/CalculatorEconomy";\n' + modifiedText.slice(insertIndex);

fs.writeFileSync(path, finalStr);

console.log("Done extracting Economy section");
