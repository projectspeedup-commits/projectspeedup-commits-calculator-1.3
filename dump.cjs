const fs = require("fs");
fs.writeFileSync(
  "dump.txt",
  fs
    .readFileSync("src/components/AdminPanel.tsx", "utf8")
    .split("\n")
    .slice(1750, 1960)
    .join("\n"),
);
