import { defineConfig } from "@kubb/core";
import { definePlugin as createSwagger } from "@kubb/swagger";
import { definePlugin as createSwaggerTS } from "@kubb/swagger-ts";
import { definePlugin as createSwaggerTanstackQuery } from "@kubb/swagger-tanstack-query";

export default defineConfig({
  root: ".",
  input: {
    path: "./openapi.json",
  },
  output: {
    path: "./dist/kubb",
    clean: true,
  },
  hooks: {
    done: ['echo "📦 kubb generation done"'],
  },
  plugins: [
    createSwagger({}),
    createSwaggerTS({ output: { path: "models" }, enumType: "enum" }),
    createSwaggerTanstackQuery({
      output: { path: "./hooks" },
      mutate: {
        variablesType: "mutate",
        methods: ["post", "put", "patch", "delete"],
      },
      client: {
        importPath: "@/client",
      },
    }),
  ],
});
