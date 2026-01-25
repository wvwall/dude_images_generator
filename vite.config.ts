import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { readFileSync } from "fs";

const packageJson = JSON.parse(readFileSync("./package.json", "utf8"));

export default defineConfig(({ mode }) => {
  return {
    define: {
      "process.env.VITE_APP_VERSION": JSON.stringify(packageJson.version),
    },
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
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
          clientsClaim: true,
          skipWaiting: true,
        },
        includeAssets: ["favicon-32x32.png", "robots.txt"],
        manifest: {
          name: "Dude - AI Creative Studio",
          short_name: "Dude Studio",
          description: "AI Creative Studio & Image Generator",
          // Default theme color (dynamically updated via meta tag in ThemeContext)
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
              sizes: "2832x1386",
              type: "image/png",
              form_factor: "wide",
            },
            {
              src: "/screenshots/home-mobile.png",
              sizes: "648x1198",
              type: "image/png",
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
