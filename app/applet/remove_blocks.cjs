const fs = require("fs");
let code = fs.readFileSync("src/components/AdminPanel.tsx", "utf8");

// The export buttons block
const buttonsStart = code.indexOf(
  '{productionSection === "calc" && calculationResults.length > 0 && (\n                  <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-1.5 sm:gap-2 w-full xl:w-auto mt-2 xl:mt-0 shrink-0 mb-2 xl:mb-0">\n                    <button',
);
if (buttonsStart === -1) {
  console.error("Buttons start not found!");
} else {
  // find the end of the condition block  )}
  let buttonsEnd = code.indexOf(
    "                  </div>\n                )}\n              </div>",
    buttonsStart,
  );
  if (buttonsEnd !== -1) {
    buttonsEnd += "                  </div>\n                )}\n".length; // keep `              </div>` for the container closing
    code = code.substring(0, buttonsStart) + code.substring(buttonsEnd);
    console.log("Removed buttons block.");
  } else {
    console.error("Buttons end not found.");
  }
}

// The cards grid block
const gridStart = code.indexOf(
  "<div className={`grid grid-cols-1 ${!isPurchasingMode ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-6`}>",
  buttonsStart !== -1 ? buttonsStart : 0,
);
if (gridStart === -1) {
  console.error("Grid start not found!");
} else {
  const gridEndStr =
    '<div className="bg-white dark:bg-[#1A1C19] rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">';
  let gridEnd = code.indexOf(gridEndStr, gridStart);
  if (gridEnd !== -1) {
    code = code.substring(0, gridStart) + code.substring(gridEnd);
    console.log("Removed grid cards block.");
  } else {
    console.error("Grid end not found.");
  }
}

fs.writeFileSync("src/components/AdminPanel.tsx", code);
console.log("Done.");
