import { defineConfig, transformWithEsbuild } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    {
      name: "treat-js-files-as-jsx",
      enforce: "pre",
      async transform(code, id) {
        if (!/src[\/\\].*\.[jt]sx?$/.test(id)) {
          return null;
        }

        return transformWithEsbuild(code, id, {
          loader: "jsx",
          jsx: "automatic"
        });
      }
    },
    react({
      include: /\.(js|jsx|ts|tsx)$/
    })
  ],
  esbuild: {
    loader: "jsx",
    include: /src[\/\\].*\.[jt]sx?$/
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx"
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:8090",
      "/upload": "http://localhost:8090",
      "/uploads": "http://localhost:8090",
      "/health": "http://localhost:8090"
    }
  }
});
