/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_MODE: string;
    readonly VITE_API_BASE: string;
    readonly VITE_BASE_URL: string;
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
