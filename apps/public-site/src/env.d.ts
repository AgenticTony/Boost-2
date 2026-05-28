/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_HYGRAPH: string;
  readonly VITE_HYGRAPH_ENDPOINT: string;
  readonly VITE_HYGRAPH_TOKEN: string;
  readonly VITE_CONTACT_WORKER_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
