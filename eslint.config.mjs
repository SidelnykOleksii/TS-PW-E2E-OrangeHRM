import js from "@eslint/js";
import tseslint from "typescript-eslint";
import playwright from "eslint-plugin-playwright";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // ...playwright.configs['flat/recommended'],
    files: ['tests/**'], 
  },
  {
    ignores: ["node_modules/", "test-results/", "playwright-report/"],
  }
);