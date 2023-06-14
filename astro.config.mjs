import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel/serverless";
import compress from "astro-compress";
import prefetch from "@astrojs/prefetch";
import sitemap from "@astrojs/sitemap";
import tsConfig from "./tsconfig.json";
import path, { resolve } from "path";

const alias = tsConfig.compilerOptions.paths;
const dirname = resolve();

const resolvedAliases = Object.fromEntries(
  Object.entries(alias).map(([key, value]) => [
    key.replaceAll("/*", ""),
    resolve(dirname, "src/" + value[0].replaceAll("/*", "")),
  ])
);

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel(),
  site: "https://www.0cb.tech",
  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    react(),
    prefetch(),
    sitemap({
      changefreq: "weekly",
      priority: 0.8,
      lastmod: new Date(),
    }),
    compress(),
  ],
  vite: {
    build: {
      rollupOptions: {
        external: [
          "react", // ignore react stuff
          "react-dom",
        ],
      },
    },
    resolve: {
      alias: {
        ...resolvedAliases,
        "./runtimeConfig": "./runtimeConfig.browser",
        "jss-plugin-{}": "jss-plugin-global",
      },
    },
  },
});
