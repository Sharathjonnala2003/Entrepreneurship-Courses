import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dns from "dns";

// This ensures localhost resolves correctly
dns.setDefaultResultOrder("verbatim");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
    port: 5173,
    host: true,
  },
});
