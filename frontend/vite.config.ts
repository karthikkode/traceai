import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080, // Default port for Render
    host: "0.0.0.0", // Allow access from all network interfaces
  },
  preview: {
    port: 8080, // For production preview
    host: "0.0.0.0",
  },
});