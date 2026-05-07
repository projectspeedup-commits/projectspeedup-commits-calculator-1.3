const fs = require("fs");
let content = fs.readFileSync("src/components/AdminPanel.tsx", "utf8");

// Also fix row width issue: "Номенклатура заг.", "Марка заг.", "Размер заг.", "Кол-во тн заг.", "Длина мм.", "Тех. Отходы", "Делов. Остаток", "КИМ / Совет"
// Change them to have line breaks if feasible.
content = content.replace(/>Номенклатура заг\.</g, ">Номенклатура<br/>заг.<");
content = content.replace(/>Марка заг\.</g, ">Марка<br/>заг.<");
content = content.replace(/>Размер заг\.</g, ">Размер<br/>заг.<");
content = content.replace(/>Кол-во тн заг\.</g, ">Кол-во тн<br/>заг.<");
content = content.replace(/>Тех\. Отходы</g, ">Тех.<br/>Отходы<");
content = content.replace(/>Делов\. Остаток</g, ">Делов.<br/>Остаток<");
content = content.replace(/>КИМ \/ Совет</g, ">КИМ /<br/>Совет<");

fs.writeFileSync("src/components/AdminPanel.tsx", content);
