import js from "@eslint/js";
import tseslint from "typescript-eslint";
import playwright from "eslint-plugin-playwright";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ...playwright.configs['flat/recommended'],
    files: ['tests/**'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      // Assertions for some specs live inside page-object helper methods
      // (e.g. CorporateBranding.verifyDefaultColors), not the test body.
      'playwright/expect-expect': ['warn', { assertFunctionPatterns: ['^verify', '^assert'] }],
    },
  },
  {
    ignores: ["node_modules/", "test-results/", "playwright-report/"],
  }
);