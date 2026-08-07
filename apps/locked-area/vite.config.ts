/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Public-site runs on 5173; locked-area uses 5174 so both apps can run
    // simultaneously during development.
    port: 5174,
  },
  build: {
    // No source maps in the deployed bundle.
    //
    // "hidden" emits .map files without a sourceMappingURL comment, which is
    // the right setting when the maps are uploaded to an error tracker and
    // kept off the web server. There is no error tracker here and CI deploys
    // the whole dist/ folder, so the maps shipped anyway: 3.6 MB across 25
    // files, publicly fetchable (GET /assets/index-*.js.map returned 200 with
    // the full original source). That was the worst of both - source readable
    // by anyone, and still no working maps, because nothing linked them.
    //
    // If error tracking is added later, build with sourcemap: "hidden" in CI,
    // upload the maps to the tracker, and delete them before deploying.
    sourcemap: false,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    css: true,
    // setup.ts mocks @/lib/supabase for every test, so these are never used to
    // reach a real project. They exist so that a file importing the real module
    // (an un-mocked integration test, say) fails on its assertions rather than
    // on the env-var guard at module load.
    env: {
      VITE_SUPABASE_URL: "http://localhost:54321",
      VITE_SUPABASE_ANON_KEY: "test-anon-key",
    },
  },
});
