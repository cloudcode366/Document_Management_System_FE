import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { copy } from "vite-plugin-copy";

export default defineConfig({
  plugins: [
    react(),
    copy({
      targets: [
        { src: "Scripts/*", dest: "dist/Scripts" }, // Sao chép thư mục Scripts
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve("src"), // Alias cho thư mục gốc "src/"
      assets: path.resolve("src/assets"),
      components: path.resolve("src/components"),
      pages: path.resolve("src/pages"),
      styles: path.resolve("src/styles"),
      services: path.resolve("src/services"),
      Scripts: path.resolve("src/Scripts"),
    },
  },
  server: {
    port: 3000,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler", // or "modern"
      },
    },
  },
  optimizeDeps: {
    include: ["react-pdf", "pdfjs-dist", "jquery", "signalr"],
  },
  assetsInclude: ["**/*.pdf"],
});
