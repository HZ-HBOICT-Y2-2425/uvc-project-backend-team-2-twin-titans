import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Specificeer de bestanden die linten
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  
  // Definieer de globale variabelen voor de browseromgeving
  { languageOptions: { globals: globals.browser } },

  // Voeg de aanbevolen configuraties toe voor JavaScript en React
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,

  // Gebruik 'ignores' om de gegenereerde Svelte-bestanden uit te sluiten
  {
    ignores: [
      ".svelte-kit/*",
      "node_modules/*"
    ]
  },

  // Voeg extra regels toe om specifieke lintingproblemen uit te schakelen
  {
    rules: {
      "no-unused-vars": "off", // Schakel 'no-unused-vars' uit
      "no-self-assign": "off", // Schakel 'no-self-assign' uit
      "no-empty": "off", // Schakel 'no-empty' uit
      "no-useless-escape": "off", // Schakel 'no-useless-escape' uit
      "@typescript-eslint/require-await": "off", // Schakel '@typescript-eslint/require-await' uit
      "no-constant-condition": "off", // Schakel 'no-constant-condition' uit voor de gegenereerde code
      "no-control-regex": "off" // Schakel 'no-control-regex' uit
    }
  }
];
