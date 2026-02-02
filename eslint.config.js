const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "prettier",
    "plugin:@typescript-eslint/recommended"
  ),
  {
    ignores: [".next/**", "node_modules/**", "out/**", "build/**", "dist/**"],
  },
  {
    files: ["*.config.js", "*.config.ts", "next-env.d.ts"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/triple-slash-reference": "off",
    },
  },
  {
    rules: {
      // Забороняє явне використання 'any'
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
];

module.exports = eslintConfig;
