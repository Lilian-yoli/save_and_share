import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/scss/index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";

const theme = {
  system: "#3cae9f",
  subSystem: "#285E4D",
  contrast: "#6218fa",
  white: "snow",
  black: "#333",
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // comment out the strict mode, or the tappay form would rerender.
  // <React.StrictMode>
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </BrowserRouter>
  // </React.StrictMode>
);

reportWebVitals();
