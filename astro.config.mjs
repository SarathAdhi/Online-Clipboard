import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel/serverless";
import compress from "astro-compress";
import prefetch from "@astrojs/prefetch";

export default defineConfig({
  output: "server",
  adapter: vercel(),
  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    react(),
    prefetch(),
    compress(),
  ],
});
