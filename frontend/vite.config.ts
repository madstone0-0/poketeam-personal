import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { viteStaticCopy } from "vite-plugin-static-copy";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
    root: "src",
    build: {
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, "./src/index.html"),
                e200: path.resolve(__dirname, "./src/200.html"),
            },
        },
        outDir: "../dist",
        emptyOutDir: true,
    },
    base: "",
    plugins: [
        react(),
        viteStaticCopy({
            targets: [
                { src: path.resolve(__dirname, "./CNAME"), dest: path.resolve(__dirname, "./dist") },
                { src: path.resolve(__dirname, "./src/favicon.ico"), dest: path.resolve(__dirname, "./dist") },
            ],
        }),
    ],
});
