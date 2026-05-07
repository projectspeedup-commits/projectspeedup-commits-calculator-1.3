const fs = require("fs");
let code = fs.readFileSync("src/components/AdminPanel.tsx", "utf8");

const mobileSupplyRegex =
  /(<button\s+onClick=\{\(\) => setActiveTab\("supply"\)\}[\s\S]*?<span className="text-\[10px\] font-bold tracking-tight">Снабжение<\/span>\s*<\/button>)/m;
const mobileProdRegex =
  /(<button\s+onClick=\{\(\) => setActiveTab\("production"\)\}[\s\S]*?<span className="text-\[10px\] font-bold tracking-tight">Пр-во<\/span>\s*<\/button>)/m;

const mobileSupply = code.match(mobileSupplyRegex)?.[1];
const mobileProd = code.match(mobileProdRegex)?.[1];

if (mobileSupply && mobileProd) {
  const combined = code.substring(
    code.indexOf(mobileSupply),
    code.indexOf(mobileProd) + mobileProd.length,
  );
  code = code.replace(combined, mobileProd + "\n\n" + mobileSupply);
  console.log("Swapped mobile");
}

const desktopSupplyRegex =
  /(<button\s+onClick=\{\(\) => setActiveTab\("supply"\)\}[\s\S]*?<span className="text-\[11px\] font-medium tracking-wide">Снабжение<\/span>\s*<\/button>)/m;
const desktopProdRegex =
  /(<button\s+onClick=\{\(\) => setActiveTab\("production"\)\}[\s\S]*?<span className="text-\[11px\] font-medium tracking-wide">Пр-во<\/span>\s*<\/button>)/m;

const desktopSupply = code.match(desktopSupplyRegex)?.[1];
const desktopProd = code.match(desktopProdRegex)?.[1];

if (desktopSupply && desktopProd) {
  const combined = code.substring(
    code.indexOf(desktopSupply),
    code.indexOf(desktopProd) + desktopProd.length,
  );
  code = code.replace(
    combined,
    desktopProd + "\n\n           " + desktopSupply,
  );
  console.log("Swapped desktop");
}

fs.writeFileSync("src/components/AdminPanel.tsx", code);
