import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default defineConfig([
  globalIgnores(["**/*.config.*", "**/*.test.*"]),
  {
    extends: compat.extends(
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended"
    ),

    plugins: {
      "@typescript-eslint": typescriptEslint,
      "@stylistic": stylistic
    },

    languageOptions: {
      globals: {
        ...globals.browser
      },

      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",

      parserOptions: {
        project: ["./tsconfig.json"]
      }
    },

    rules: {
      indent: ["error", 2],
      "no-console": "error",
      "no-dupe-args": "error",
      "no-duplicate-case": "error",
      "no-dupe-keys": "error",
      "no-empty-pattern": "error",
      "no-unreachable": "error",

      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          ignoreRestSiblings: true,
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ],

      camelcase: [
        "error",
        {
          properties: "never",
          ignoreDestructuring: true
        }
      ],

      eqeqeq: "error",
      "no-empty": "error",
      "no-empty-function": "error",
      "no-extra-semi": "error",
      "no-var": "error",
      "prefer-const": "error",
      "no-duplicate-imports": "error",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "linebreak-style": "off",
      quotes: ["error", "double"],
      "@stylistic/semi": ["error", "always"],
      "default-case": "error",
      "use-isnan": "error",
      "no-else-return": "error",
      //   "@typescript-eslint/semi": ["error", "always"],
      "@typescript-eslint/no-non-null-assertion": "off",

      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "default",
          format: ["camelCase", "PascalCase", "snake_case", "UPPER_CASE"],
          leadingUnderscore: "allow",
          trailingUnderscore: "forbid"
        },
        {
          selector: "typeLike",
          format: ["UPPER_CASE", "PascalCase"]
        },
        {
          selector: "variable",
          types: ["boolean"],
          format: ["PascalCase"],
          prefix: ["is", "should", "has", "can", "did", "will", "does"]
        },
        {
          selector: "variable",
          modifiers: ["destructured"],
          format: null
        },
        {
          selector: "property",
          format: ["PascalCase"],

          filter: {
            regex: "[-]",
            match: true
          }
        },
        {
          selector: "function",
          format: ["camelCase", "PascalCase"]
        }
      ],

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          ignoreRestSiblings: true,
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ],

      "@typescript-eslint/no-empty-interface": "error",
      "@typescript-eslint/no-unnecessary-condition": "error",
      "@typescript-eslint/prefer-includes": "error"
    }
  }
]);
