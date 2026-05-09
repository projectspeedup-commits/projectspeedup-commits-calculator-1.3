export const getCrossSectionArea = (profileType: "round" | "hex", size_mm: number): number => {
  if (profileType === "round") {
    return Math.PI * Math.pow(size_mm / 2, 2);
  } else {
    // Hex area: 3 * sqrt(3) / 2 * a^2. But size_mm is usually the inscribed circle diameter (d).
    // So area = 2 * Math.sqrt(3) * Math.pow(size_mm / 2, 2)
    return 2 * Math.sqrt(3) * Math.pow(size_mm / 2, 2);
  }
};

export const calculateBarWeightKg = (profileType: "round" | "hex", size_mm: number, length_mm: number): number => {
  const area = getCrossSectionArea(profileType, size_mm);
  // Density of steel = 0.00000785 kg/mm^3
  return area * length_mm * 0.00000785;
};

export const calculateRequiredWeightTons = (
  orderWeightTons: number,
  piecesPerBar: number,
  orderedLengthMm: number,
  displayedTargetLengthMm: number
) => {
  if (!displayedTargetLengthMm || piecesPerBar === 0) return null;
  const usefulLength = orderedLengthMm * piecesPerBar;
  const kim = usefulLength / displayedTargetLengthMm;
  return orderWeightTons / (kim > 0 ? kim : 1);
};

export const calculateOptimalBilletLengths = (
  orderedLengthMm: number,
  currentDrawCoef: number,
  totalTechCoef: number,
  isND: boolean
) => {
  const draw = currentDrawCoef;
  const tech = totalTechCoef;
  const options = [];

  const maxBillet = Math.floor(8400 / draw);
  const maxAllowedBillet = Math.min(6000, maxBillet);

  if (isND) {
    for (let b = 4000; b <= maxAllowedBillet; b += 100) {
      const estUseful = (b * draw) / tech;
      let bestScrapForB = 999999;
      let bestN = 0;
      for (let i = 1; i <= 20; i++) {
        const optLen = Math.floor(estUseful / i) - 5;
        if (optLen >= 3000 && optLen <= 6000) {
          const scrap = estUseful - i * optLen;
          if (scrap < bestScrapForB && scrap >= 0) {
            bestScrapForB = scrap;
            bestN = i;
          }
        }
      }
      options.push({ billetLength: b, n: bestN, actualUseful: estUseful, scrap: bestScrapForB });
    }
  } else {
    for (let n = 1; n <= 60; n++) {
      const idealBillet = (n * orderedLengthMm * tech) / draw;
      const roundedBillet = Math.ceil(idealBillet / 100) * 100;
      if (roundedBillet >= 4000 && roundedBillet <= maxAllowedBillet) {
        const estUseful = (roundedBillet * draw) / tech;
        const scrap = estUseful - n * orderedLengthMm;
        if (scrap >= 0 && scrap < 1000) {
          options.push({ billetLength: roundedBillet, n, actualUseful: estUseful, scrap });
        }
      }
    }
  }

  const uniqueOptions = Array.from(
    new Map(options.map((item) => [item.billetLength, item])).values(),
  );

  return uniqueOptions.sort((a, b) => a.scrap - b.scrap).slice(0, 3);
};
