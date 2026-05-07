const fs = require("fs");
let content = fs.readFileSync("src/components/AdminPanel.tsx", "utf8");

// Wrap the else branch of matchedDemand ternary in a Fragment
content = content.replace(
  /\) : \(\s*<div className={`bg-white dark:bg-\[#1A1C19\] border border-slate-200/,
  ") : (\n                      <>\n                        <div className={`bg-white dark:bg-[#1A1C19] border border-slate-200",
);

// Close that fragment before the end of the motion.div
// We need to find the specific )} before </motion.div> for calc-stock
content = content.replace(
  /\)}[\s\n]*<\/motion\.div>[\s\n]*\) : supplySection === "free-stock"/,
  '</>)}\n                  </motion.div>\n                ) : supplySection === "free-stock"',
);

// Also let's double check if we have any other duplicate closers
// In our previous edit we might have introduced subtle issues.

fs.writeFileSync("src/components/AdminPanel.tsx", content);
