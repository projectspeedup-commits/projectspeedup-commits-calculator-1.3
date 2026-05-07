const fs = require("fs");
let code = fs.readFileSync("src/components/AdminPanel.tsx", "utf8");

const mobileSupplyRegex =
  /(<button\s+onClick=\{\(\) => setActiveTab\("supply"\)\}[\s\S]*?<span className="text-\[10px\] font-bold tracking-tight">Снабжение<\/span>\s*<\/button>)/m;
const mobileProdRegex =
  /(<button\s+onClick=\{\(\) => setActiveTab\("production"\)\}[\s\S]*?<span className="text-\[10px\] font-bold tracking-tight">Пр-во<\/span>\s*<\/button>)/m;

const mobileSupply = code.match(mobileSupplyRegex)?.[1];
const mobileProd = code.match(mobileProdRegex)?.[1];

console.log("Mobile supply len:", mobileSupply?.length);
console.log("Mobile prod len:", mobileProd?.length);

const desktopSupplyRegex =
  /(<button\s+onClick=\{\(\) => setActiveTab\("supply"\)\}[\s\S]*?<span className="text-\[11px\] font-medium tracking-wide">Снабжение<\/span>\s*<\/button>)/m;
const desktopProdRegex =
  /(<button\s+onClick=\{\(\) => setActiveTab\("production"\)\}[\s\S]*?<span className="text-\[11px\] font-medium tracking-wide">Пр-во<\/span>\s*<\/button>)/m;

const desktopSupply = code.match(desktopSupplyRegex)?.[1];
const desktopProd = code.match(desktopProdRegex)?.[1];

console.log("Desktop supply len:", desktopSupply?.length);
console.log("Desktop prod len:", desktopProd?.length);
