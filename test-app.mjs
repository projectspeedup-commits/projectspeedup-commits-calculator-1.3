import { renderToString } from 'react-dom/server';
import React from 'react';
import App from './src/App.tsx';

try {
  console.log("Rendering App...");
  const element = React.createElement(App);
  const html = renderToString(element);
  console.log("Render successful! Length:", html.length);
} catch (e) {
  console.error("RENDER ERROR:", e);
}
