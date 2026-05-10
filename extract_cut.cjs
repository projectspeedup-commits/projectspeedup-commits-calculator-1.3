const fs = require('fs');

const path = 'src/components/CalculatorApp.tsx';
const text = fs.readFileSync(path, 'utf8');
const lines = text.split('\n');

const startIndex = 1404; // The line before <section className="bg-white dark:bg-[#1A1C19] rounded-2xl ...
const endIndex = 1860; // The line with </section> for cut and remnants

const extracted = lines.slice(startIndex, endIndex).join('\n');

const componentStr = `import { Ruler, Sparkles, Wand2 } from "lucide-react";
import { formatInputValue, handleNumericInput } from "../../lib/constants";

export function CalculatorCutAndRemnants({
  optimalBilletLengths,
  orderedLength,
  setLengthInput,
  lengthInput,
  validationErrors,
  suggestedValues,
  cutLength,
  setCutLength,
  handleCutLengthChange,
  cutThickness,
  setCutThickness,
  handleCutThicknessChange,
  remnantLength,
  setRemnantLength,
  remnantType,
  setRemnantType,
  isRemnantModeAuto,
  setIsRemnantModeAuto,
  handleBilletLengthInput
}: any) {
  return (
    <>
${extracted}
    </>
  );
}
`;

fs.writeFileSync('src/components/calculator/CalculatorCutAndRemnants.tsx', componentStr);

const newLines = [
  ...lines.slice(0, startIndex),
  `                <CalculatorCutAndRemnants
                  optimalBilletLengths={optimalBilletLengths}
                  orderedLength={orderedLength}
                  setLengthInput={setLengthInput}
                  lengthInput={lengthInput}
                  validationErrors={validationErrors}
                  suggestedValues={suggestedValues}
                  cutLength={cutLength}
                  setCutLength={setCutLength}
                  handleCutLengthChange={handleCutLengthChange}
                  cutThickness={cutThickness}
                  setCutThickness={setCutThickness}
                  handleCutThicknessChange={handleCutThicknessChange}
                  remnantLength={remnantLength}
                  setRemnantLength={setRemnantLength}
                  remnantType={remnantType}
                  setRemnantType={setRemnantType}
                  isRemnantModeAuto={isRemnantModeAuto}
                  setIsRemnantModeAuto={setIsRemnantModeAuto}
                  handleBilletLengthInput={handleBilletLengthInput}
                />`,
  ...lines.slice(endIndex)
];

const modifiedText = newLines.join('\n');
const insertIndex = modifiedText.indexOf('import { CalculatorInputs }');
const finalStr = modifiedText.slice(0, insertIndex) + 'import { CalculatorCutAndRemnants } from "./calculator/CalculatorCutAndRemnants";\n' + modifiedText.slice(insertIndex);

fs.writeFileSync(path, finalStr);

console.log("Done extracting Cut and Remnants section");
