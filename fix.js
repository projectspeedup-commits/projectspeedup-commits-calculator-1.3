const fs = require('fs');

let content = fs.readFileSync('src/components/supply/SupplyCalcSection.tsx', 'utf-8');
const lines = content.split('\n');

lines[238] = lines[238].replace("data.weight", "(totalWeight||0)");

lines[581] = lines[581].replace("data.weight", "(res.weightTons||res.totalWeight||0)");
lines[586] = lines[586].replace("data.weight", "(res.weightTons||res.totalWeight||0)");

lines[622] = lines[622].replace("data.weight", "(totalWeightSh||0)");
lines[625] = lines[625].replace("data.weight", "(totalZagSh||0)");
lines[628] = lines[628].replace("data.weight", "(totalTechSh||0)");
lines[631] = lines[631].replace("data.weight", "(totalDelovSh||0)");

lines[721] = lines[721].replace("data.weight", "(res.weightTons||res.totalWeight||0)");
lines[726] = lines[726].replace("data.weight", "(res.weightTons||res.totalWeight||0)");

lines[762] = lines[762].replace("data.weight", "(totalInOrderEX||0)");
lines[765] = lines[765].replace("data.weight", "(totalRemainingEX||0)");
lines[767] = lines[767].replace("data.weight", "(totalZagEX||0)");
lines[768] = lines[768].replace("data.weight", "(totalTechEX||0)");
lines[769] = lines[769].replace("data.weight", "(totalDelovEX||0)");

lines[1063] = lines[1063].replace("data.weight", "(res.weightTons||res.totalWeight||0)");
lines[1068] = lines[1068].replace("data.weight", "(res.weightTons||res.totalWeight||0)");
lines[1092] = lines[1092].replace("data.weight", "(res.weightTons||res.totalWeight||0)");
lines[1300] = lines[1300].replace("data.weight", "(res.weightTons||res.totalWeight||0)");

fs.writeFileSync('src/components/supply/SupplyCalcSection.tsx', lines.join('\n'));
