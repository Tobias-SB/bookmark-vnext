module.exports = {
  root: true,
  // ✅ Non-type-aware preset: avoids parserOptions.project requirement
  extends: ["universe/native", "universe/shared/typescript"],
  plugins: ["react-native"],
  rules: {
    // Guardrail 1: no raw literal colors anywhere.
    "react-native/no-color-literals": "error",

    // Guardrail 3: feature modules must be accessed via their "door" only.
    // ✅ Allowed:   import { ReadableListScreen } from '@/features/readables'
    // ❌ Forbidden: import { ReadableListScreen } from '@/features/readables/ui/screens/ReadableListScreen'
    "no-restricted-syntax": [
      "error",
      {
        selector:
          "ImportDeclaration[source.value=/^@\\/features\\/[^/]+\\/.+/]",
        message:
          "Do not deep import from features. Import from the feature door: @/features/<feature> (or use relative imports within the feature).",
      },
    ],
  },

  overrides: [
    {
      // Guardrail 2: outside theme module, nobody touches base theme colors.
      files: ["src/**/*.{ts,tsx}"],
      excludedFiles: ["src/app/theme/**"],
      rules: {
        // Prevent bypassing tokens via react-native-paper's theme hook / MD3 base themes.
        "no-restricted-imports": [
          "error",
          {
            paths: [
              {
                name: "react-native-paper",
                importNames: ["useTheme", "MD3LightTheme", "MD3DarkTheme"],
                message:
                  "Base theme access is restricted. Use tokens from useAppTheme().tokens (or shared primitives).",
              },
            ],
          },
        ],

        // Keep the deep feature-import guardrail active in this override too (overrides replace rule arrays).
        "no-restricted-syntax": [
          "error",
          {
            selector:
              "ImportDeclaration[source.value=/^@\\/features\\/[^/]+\\/.+/]",
            message:
              "Do not deep import from features. Import from the feature door: @/features/<feature> (or use relative imports within the feature).",
          },

          // Prevent using theme.colors.* directly (common drift vector).
          {
            selector:
              "MemberExpression[object.name='theme'][property.name='colors']",
            message:
              "Do not access theme.colors outside src/app/theme/**. Use tokens from useAppTheme().tokens.",
          },
          {
            selector:
              "MemberExpression[property.name='colors'][object.type='MemberExpression'][object.property.name='theme']",
            message:
              "Do not access *.theme.colors outside src/app/theme/**. Use tokens from useAppTheme().tokens.",
          },
        ],
      },
    },
  ],

  ignorePatterns: ["node_modules/", "dist/", "build/"],
};
