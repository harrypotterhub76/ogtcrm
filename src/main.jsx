import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/primereact.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

import App from "./App.jsx";
const value = {
  ripple: true,
  unstyled: false,
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <PrimeReactProvider value={value}>
      <App />
    </PrimeReactProvider>
  </BrowserRouter>
);
