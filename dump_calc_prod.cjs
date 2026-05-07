const fs = require("fs");
fs.writeFileSync(
  "temp_calc_prod.txt",
  fs
    .readFileSync("src/components/AdminPanel.tsx", "utf8")
    .split("\n")
    .slice(5950, 6100)
    .join("\n"),
);
