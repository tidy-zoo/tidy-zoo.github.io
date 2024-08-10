/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_COUNTING_DOWN: number;
  readonly VITE_APP_MATCH_RESULT_TIMEOUT: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
