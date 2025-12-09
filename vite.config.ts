import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  return {
    server: {
      port: 3000,
      host: "0.0.0.0",
      proxy: {
        "/.netlify/functions": {
          target: "http://localhost:8888",
          changeOrigin: true,
          secure: false,
        },
      },
      hmr: {
        overlay: false,
      },
    },
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon-32x32.png", "robots.txt"],
        manifest: {
          name: "Dude - AI Creative Studio",
          short_name: "Dude Studio",
          description: "AI Creative Studio & Image Generator",
          theme_color: "#ffffff",
          icons: [
            {
              src: "pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
          screenshots: [
            {
              src: "/screenshots/home-desktop.png",
              sizes: "1280x720",
              type: "image/png",
              form_factor: "wide",
            },
            {
              src: "/screenshots/home-mobile.png",
              sizes: "375x812",
              type: "image/png",
            },
          ],
        },
      }),
    ],
    // Do not inline secret environment variables into the client bundle.
    // Secrets should be provided at runtime from server-side environment (Netlify env vars)
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
