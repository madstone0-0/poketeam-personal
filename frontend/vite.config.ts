import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
    root: "src",
    build: {
        outDir: "../dist",
        emptyOutDir: true,
    },
    base: "",
    plugins: [
        react(),
        viteStaticCopy({
            targets: [
                { src: path.resolve(__dirname, "./.htaccess"), dest: path.resolve(__dirname, "./dist") },
                { src: path.resolve(__dirname, "./src/favicon.ico"), dest: path.resolve(__dirname, "./dist") },
            ],
        }),
    ],
});
