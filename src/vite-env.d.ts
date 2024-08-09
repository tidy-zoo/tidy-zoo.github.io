/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_COUNTING_DOWN: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
