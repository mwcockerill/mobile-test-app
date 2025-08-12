module.exports = {
  root: true,
  extends: ["@react-native"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  ignorePatterns: [
    "e2e/**/*",
    "test/integration/**/*",
    "test/unit/Section.test.tsx",
    "android/**/*",
    "ios/**/*",
    "node_modules/**/*",
  ],
  rules: {
    "prettier/prettier": "off",
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "@typescript-eslint/no-shadow": ["error"],
        "no-shadow": "off",
        "no-undef": "off",
      },
    },
  ],
};
