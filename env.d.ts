/// <reference types="vite/client" />
interface ImportMetaEnv extends Readonly<Record<string, string>> {
    readonly VITE_BASE_WEB: string
    readonly VITE_BASE_WS: string
}
interface ImportMeta {
    readonly env: ImportMetaEnv
}