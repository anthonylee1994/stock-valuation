import {App} from "@/app.tsx";
import "@/index.css";
import {createRoot} from "react-dom/client";
import {ErrorBoundary} from "react-error-boundary";
import {ErrorDisplay} from "./components/ErrorDisplay";

createRoot(document.getElementById("root")!).render(
    <ErrorBoundary FallbackComponent={ErrorDisplay}>
        <App />
    </ErrorBoundary>
);
