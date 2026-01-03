import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/",
  server: {
    host: "::",
    port: 3000,
  },
  build: {
    chunkSizeWarningLimit: 6000, 
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
      },
      manifest: {
        name: "CareerHub - Modern Recruitment Platform",
        short_name: "CareerHub",
        description:
          "Career Hub is a modern recruitment platform connecting top candidates with leading employers. Find your dream job or hire the best talent with AI-powered matching.",
        theme_color: "#0077F0",
        background_color: "#F8F9FB",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/career48.png",
            sizes: "48x48",
            type: "image/png",
          },
          {
            src: "/career128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "/career192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/career512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));