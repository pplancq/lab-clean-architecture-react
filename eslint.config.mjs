import { defineConfig } from '@pplancq/eslint-config';

export default defineConfig({
  enableReact: true,
  enablePrettier: 'on',
  enableVitest: true,
  unitTestFiles: ['tests/unit/**/*.{test,spec,steps}.{js,jsx,ts,tsx}'],
  enablePlaywright: true,
  unitE2eFiles: ['tests/e2e/**/*.{test,spec}.{js,jsx,ts,tsx}'],
  extendConfig: [
    {
      files: ['mocks/**/*'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
    {
      files: ['**/*.config.{js,cjs,mjs,ts,cts,mts}'],
      rules: {
        'import/no-default-export': 'off',
        'import/no-extraneous-dependencies': 'off',
      },
    },
    {
      files: ['**/src/**/*.d.ts'],
      rules: {
        '@typescript-eslint/no-empty-object-type': 'off',
      },
    },
    {
      files: ['**/src/**/*.ts'],
      rules: {
        'class-methods-use-this': 'off',
      },
    },
  ],
});
