import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { ProvedorEstados } from "./context/index.jsx";
import NavBar from "./components/NavBar.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ProvedorEstados>
      <NavBar />
      <App />
    </ProvedorEstados>
  </StrictMode>
);
