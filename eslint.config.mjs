import { defineConfig } from "@pplancq/eslint-config";

export default defineConfig({
  rulesNaming: "modern",
  enableReact: true,
  enablePrettier: "disableStyleOnly",
  enableVitest: true,
  unitTestFiles: ["tests/unit/**/*.{test,spec,steps}.{js,jsx,ts,tsx}"],
  enablePlaywright: true,
  unitE2eFiles: ["tests/e2e/**/*.{test,spec}.{js,jsx,ts,tsx}"],
  extendConfig: [
    {
      ignores: ["build", "test-reports"],
    },
    {
      files: ["mocks/**/*"],
      rules: {
        "import-x/no-extraneous-dependencies": "off",
      },
    },
    {
      files: ["**/*.config.{js,cjs,mjs,ts,cts,mts}"],
      rules: {
        "import-x/no-default-export": "off",
        "import-x/no-extraneous-dependencies": "off",
      },
    },
  ],
});
