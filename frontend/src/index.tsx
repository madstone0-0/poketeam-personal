import "./wdyr";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Main from "./components/Main";

const container = document.getElementById("root")!;
createRoot(container).render(
    <StrictMode>
        <Main />
    </StrictMode>,
);
