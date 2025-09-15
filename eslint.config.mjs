import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // Disable unused variables and imports warnings
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
      
      // If you have eslint-plugin-unused-imports installed
      "unused-imports/no-unused-imports": "off",
      "unused-imports/no-unused-vars": "off",
      
      // Alternative: Set to warning instead of completely off
      // "@typescript-eslint/no-unused-vars": "warn",
      // "no-unused-vars": "warn",
      
      // Alternative: Allow unused vars that start with underscore
      // "@typescript-eslint/no-unused-vars": [
      //   "warn",
      //   {
      //     "argsIgnorePattern": "^_",
      //     "varsIgnorePattern": "^_",
      //     "caughtErrorsIgnorePattern": "^_"
      //   }
      // ]
    },
  },
];

export default eslintConfig;