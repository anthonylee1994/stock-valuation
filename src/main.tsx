import {App} from "@/app.tsx";
import "@/index.css";
import {createRoot} from "react-dom/client";
import {ErrorBoundary} from "react-error-boundary";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {ErrorDisplay} from "./components/ErrorDisplay";

createRoot(document.getElementById("root")!).render(
    <ErrorBoundary FallbackComponent={ErrorDisplay}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    </ErrorBoundary>
);
