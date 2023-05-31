import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel/serverless";

import compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [tailwind({
    config: {
      applyBaseStyles: false
    }
  }), react(), compress()],
  adapter: vercel()
});