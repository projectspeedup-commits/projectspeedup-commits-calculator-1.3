import fs from "fs";
const lines = fs.readFileSync("data.csv", "utf8").split("\\n");
for (let i = 1; i < lines.length; i++) {
  const cols = lines[i].split(",");
  if (
    cols.length >= 30 &&
    cols[29] &&
    cols[29].trim().length > 0 &&
    cols[29].trim() !== '""'
  ) {
    console.log(lines[i]);
    break;
  }
}
