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
    // Suppress the warning about 500kb chunks since you have a large bundle
    chunkSizeWarningLimit: 6000, 
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        // ERROR FIX: Increased from 4MB to 6MB to handle your 4.61MB bundle
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
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
        icons: [
          {
            src: "career48.png",
            sizes: "48x48",
            type: "image/png",
          },
          {
            src: "career128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "career192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "career512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
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