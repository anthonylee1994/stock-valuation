import {createRoot} from "react-dom/client";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {ErrorBoundary} from "@/components/ErrorBoundary.tsx";
import {App} from "@/app.tsx";
import "@/index.css";

createRoot(document.getElementById("root")!).render(
    <ErrorBoundary>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    </ErrorBoundary>
);
