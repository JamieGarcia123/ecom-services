import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  base: process.env.NODE_ENV === 'production' ? '/ecom-services/' : '/', // only use base path in production
  build: {
    outDir: 'build/client',
    emptyOutDir: true,
  },
});


