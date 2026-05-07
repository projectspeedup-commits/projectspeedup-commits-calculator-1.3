const fs = require("fs");
fs.writeFileSync(
  "dump2.txt",
  fs
    .readFileSync("src/components/AdminPanel.tsx", "utf8")
    .split("\n")
    .slice(1730, 2030)
    .join("\n"),
);
