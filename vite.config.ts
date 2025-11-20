import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    server: {
      port: 3000,
      host: "0.0.0.0",
    },
    plugins: [react()],
    // Do not inline secret environment variables into the client bundle.
    // Secrets should be provided at runtime from server-side environment (Netlify env vars)
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
