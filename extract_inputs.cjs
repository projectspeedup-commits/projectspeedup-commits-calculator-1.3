const fs = require('fs');

const path = 'src/components/CalculatorApp.tsx';
const text = fs.readFileSync(path, 'utf8');
const lines = text.split('\n');

const startIndex = 1384; 
const endIndex = 1587; 

const extracted = lines.slice(startIndex, endIndex).join('\n');

const componentStr = `import { AlertCircle, Circle, Hexagon } from "lucide-react";
import { formatInputValue, handleNumericInput } from "../../lib/constants";

export function CalculatorInputs({
  profileType,
  setProfileType,
  setFrontCoef,
  steelGrades,
  steelGrade,
  setSteelGrade,
  validationErrors,
  dimensions,
  setDimensions,
  orderWeight,
  setOrderWeight,
  rawPrice,
  setRawPrice,
  manualRawPrice,
  setManualRawPrice,
  currentAdminRawPrice
}: any) {
  return (
    <>
${extracted}
    </>
  );
}
`;

fs.writeFileSync('src/components/calculator/CalculatorInputs.tsx', componentStr);

const newLines = [
  ...lines.slice(0, startIndex),
  `                <CalculatorInputs
                  profileType={profileType}
                  setProfileType={setProfileType}
                  setFrontCoef={setFrontCoef}
                  steelGrades={steelGrades}
                  steelGrade={steelGrade}
                  setSteelGrade={setSteelGrade}
                  validationErrors={validationErrors}
                  dimensions={dimensions}
                  setDimensions={setDimensions}
                  orderWeight={orderWeight}
                  setOrderWeight={setOrderWeight}
                  rawPrice={rawPrice}
                  setRawPrice={setRawPrice}
                  manualRawPrice={manualRawPrice}
                  setManualRawPrice={setManualRawPrice}
                  currentAdminRawPrice={currentAdminRawPrice}
                />`,
  ...lines.slice(endIndex)
];

const modifiedText = newLines.join('\n');
const insertIndex = modifiedText.indexOf('import { HistoryPanel }');
const finalStr = modifiedText.slice(0, insertIndex) + 'import { CalculatorInputs } from "./calculator/CalculatorInputs";\n' + modifiedText.slice(insertIndex);

fs.writeFileSync(path, finalStr);

console.log("Done extracting Inputs section");
