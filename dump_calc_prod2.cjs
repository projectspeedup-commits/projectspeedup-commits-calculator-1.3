const fs = require("fs");
fs.writeFileSync(
  "temp_calc_prod.txt",
  fs
    .readFileSync("src/components/AdminPanel.tsx", "utf8")
    .split("\n")
    .slice(5900, 5970)
    .join("\n"),
);
