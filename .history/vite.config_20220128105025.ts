import { defineConfig } from "vite";
import path from "path";
console.log(123);

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [],
});
