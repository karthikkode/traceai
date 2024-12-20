import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 4173, // Use the PORT environment variable or fallback to 4173
    host: true, // Expose the server to external access
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
