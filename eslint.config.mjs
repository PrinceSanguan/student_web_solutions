import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      /**
       * Capstone thumbnails are arbitrary URLs typed by the admin, so
       * `next/image` remotePatterns cannot cover them. Plain <img> is the
       * correct tool here, not a lint violation.
       */
      "@next/next/no-img-element": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "data/**",
  ]),
]);

export default eslintConfig;
