/// <reference types="vitest/config" />
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    browser: {
      provider: playwright(),
      enabled: true,
      instances: [{ browser: "chromium" }],
    },
  },
});
