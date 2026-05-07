const fs = require("fs");

const content = fs.readFileSync("src/components/AdminPanel.tsx", "utf-8");

// Find start and end of supply block
const supplyStartIdx = content.indexOf('{activeTab === "supply" && (');
if (supplyStartIdx === -1) throw new Error("Could not find supply block");
let openCount = 0;
let supplyEndIdx = -1;
let started = false;

// We need to parse until we find the matching `)}`
for (let i = supplyStartIdx; i < content.length; i++) {
  if (content.substr(i, 2) === "&&") started = true;
  if (content[i] === "(" && started) openCount++;
  if (content[i] === ")" && started) {
    openCount--;
    if (openCount === 0) {
      if (content.substr(i + 1, 1) === "}") {
        supplyEndIdx = i + 2;
        break;
      }
    }
  }
}

if (supplyEndIdx === -1) throw new Error("Could not find end of supply block");

// Now extract the supply block
let supplyBlock = content.substring(supplyStartIdx, supplyEndIdx);

// Now find the production block
const prodStartIdx = content.indexOf('{activeTab === "production" && (');
if (prodStartIdx === -1) throw new Error("Could not find prod start");
openCount = 0;
started = false;
let prodEndIdx = -1;

for (let i = prodStartIdx; i < content.length; i++) {
  if (content.substr(i, 2) === "&&") started = true;
  if (content[i] === "(" && started) openCount++;
  if (content[i] === ")" && started) {
    openCount--;
    if (openCount === 0) {
      if (content.substr(i + 1, 1) === "}") {
        prodEndIdx = i + 2;
        break;
      }
    }
  }
}

if (prodEndIdx === -1) throw new Error("Could not find end of prod block");

let prodBlock = supplyBlock
  .replace(/activeTab === "supply"/g, 'activeTab === "production"')
  .replace(/key="supply"/g, 'key="production"')
  .replace(/Снабжение и закупки/g, "Производство")
  .replace(
    /Управление реестром поставок, складскими остатками и расчет потребности в сырье\./g,
    "Управление заказами на производство, план-графиками и расчет потребности.",
  )
  .replace(/supplySection/g, "productionSection")
  .replace(/setSupplySection/g, "setProductionSection")
  .replace(/isSupplyView/g, "isProdSupplyView");

const newContent =
  content.substring(0, prodStartIdx) +
  prodBlock +
  content.substring(prodEndIdx);

fs.writeFileSync("src/components/AdminPanel.tsx", newContent);
console.log("Replaced production block");
