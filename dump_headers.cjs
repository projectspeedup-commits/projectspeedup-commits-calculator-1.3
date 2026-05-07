const fs = require("fs");
fs.writeFileSync(
  "temp_calc_headers.txt",
  fs
    .readFileSync("src/components/AdminPanel.tsx", "utf8")
    .split("\n")
    .slice(5800, 5900)
    .join("\n"),
);
