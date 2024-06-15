import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    lib: {
      entry: "src/extension.ts",
      name: "ai-powered-snippetss",
      fileName: (format) => `extension.js`,
    },
    rollupOptions: {
      external: ["vscode", "openai", "path", "fs", "axios", "yaml"],
      output: {
        globals: {
          vscode: "vscode",
          openai: "openai",
          path: "path",
          fs: "fs",
          axios: "axios",
          yaml: "yaml",
        },
      },
    },
  },
});
