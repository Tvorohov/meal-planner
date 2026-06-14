import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Project is served from https://<user>.github.io/meal-planner/ on GitHub
// Pages, so production assets need that base path. Dev stays at root.
export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/meal-planner/" : "/",
  plugins: [react()],
}));
