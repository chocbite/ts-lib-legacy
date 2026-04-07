import { defineConfig } from "tsdown";

export default defineConfig({
  banner: { js: "import './index.css';" },
  sourcemap: "inline",
});
