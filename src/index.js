import React from "react";
import ReactDOM from "react-dom/client";
import { SnackbarProvider } from "notistack";
import reportWebVitals from "./reportWebVitals";
import { Slide } from "@mui/material";

import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SnackbarProvider
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      TransitionComponent={Slide}
      preventDuplicate
      dense
    >
      <App />
    </SnackbarProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
