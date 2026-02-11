module.exports = {
  root: true,
  extends: ["universe/native", "universe/shared/typescript-analysis"],
  plugins: ["react-native"],
  rules: {
    // Guardrail: forbid raw color literals in styles/components (tokens only)
    "react-native/no-color-literals": "error",
  },
  ignorePatterns: ["node_modules/", "dist/", "build/"],
};
