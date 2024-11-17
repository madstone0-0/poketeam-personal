import react from "eslint-plugin-react";
import { fixupPluginRules } from "@eslint/compat";
import globals from "globals";
import babelParser from "babel-eslint";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ["**/dist", "**/node_modules"],
  },
  ...compat.extends("eslint:recommended"),
  {
    plugins: {
      react: fixupPluginRules(react),
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      parser: babelParser,
      ecmaVersion: 2018,
      sourceType: "module",

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    rules: {
      indent: ["warn", 4],
      "linebreak-style": ["warn", "windows"],
      quotes: ["error", "double"],
      semi: ["error", "always"],
      "no-unused-vars": 0,
    },
  },
];

