import { renderToString } from "react-dom/server";
import React from "react";
import { CalculatorApp } from "./src/components/CalculatorApp.tsx";
import {
  DEFAULT_RAW_PRICES,
  DEFAULT_ECONOMY_ITEMS,
} from "./src/lib/constants.ts";

try {
  console.log("Rendering CalculatorApp...");
  const element = React.createElement(CalculatorApp, {
    globalRawPrices: DEFAULT_RAW_PRICES,
    globalScrapPrice: "20000",
    globalRemnantPrice: "30000",
    remnantPricing: {},
    economyItems: DEFAULT_ECONOMY_ITEMS,
    onAdminClick: () => {},
    isCloudActive: false,
    uid: "test",
    isDarkMode: false,
    toggleTheme: () => {},
  });
  const html = renderToString(element);
  console.log("Render successful! Length:", html.length);
} catch (e) {
  console.error("RENDER ERROR:", e);
}
