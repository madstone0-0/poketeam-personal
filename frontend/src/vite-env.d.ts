/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_MODE: string;
    readonly VITE_API_BASE: string;
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
