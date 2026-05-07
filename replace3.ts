import * as fs from "fs";

const file = "src/components/AdminPanel.tsx";
const lines = fs.readFileSync(file, "utf8").split("\n");

// Replace line 8643 (0-indexed, so line 8644)
console.log(lines[8643]);
lines[8643] = lines[8643].replace("Заявка на обеспечение", "Портфель заказов");

fs.writeFileSync(file, lines.join("\n"));
console.log("Replaced successfully!");
