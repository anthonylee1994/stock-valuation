import path from "node:path";
import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {"@": path.resolve(__dirname, "src")},
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (!id.includes("node_modules")) return;

                    if (id.includes("@heroui")) return "vendor-heroui";
                    if (id.includes("react-icons")) return "vendor-icons";
                    if (id.includes("zustand")) return "vendor-zustand";
                    if (id.includes("axios")) return "vendor-axios";
                    if (id.includes("moment")) return "vendor-moment";
                    if (id.includes("@toon-format")) return "vendor-toon";
                    if (id.includes("react") || id.includes("scheduler")) return "vendor-react";
                },
            },
        },
    },
});
