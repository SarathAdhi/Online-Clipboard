import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel/serverless";
import compress from "astro-compress";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel(),
  site: "https://www.0cb.tech",
  prefetch: true,
  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    react(),
    sitemap({
      changefreq: "weekly",
      priority: 0.8,
      lastmod: new Date(),
    }),
    compress(),
  ],
});
