import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";
// eslint-disable-next-line import/no-unresolved
import { defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    envPrefix: env.ENV_PREFIX ?? "FRONT_",
    build: {
      assetsInlineLimit: 0,
    },
    resolve: {
      tsconfigPaths: true,
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "vitest.setup.ts",
      clearMocks: true,
      css: {
        modules: {
          classNameStrategy: "non-scoped",
        },
      },
      reporters: ["default", "junit", "vitest-sonar-reporter"],
      outputFile: {
        "vitest-sonar-reporter": "test-reports/unit/sonar-report.xml",
        junit: "test-reports/unit/junit-report.xml",
      },
      include: ["tests/unit/**/*.test.[jt]s?(x)"],
      maxWorkers: env.CI ? 2 : undefined,
      server: {
        deps: {
          inline: ["@pplancq/shelter-ui-react"],
        },
      },
      coverage: {
        enabled: env.CI === "true",
        reporter: ["lcovonly", "html", "text", "text-summary"],
        reportsDirectory: "test-reports/unit/coverage",
        provider: "v8",
        lines: 80,
        functions: 75,
        branches: 80,
        statements: 80,
        include: ["src/**/*.[jt]s?(x)"],
        exclude: ["src/**/*.d.[jt]s?(x)", "src/**/*.types.[jt]s?(x)", "src/**/index.[jt]s?(x)"],
      },
    },
  };
});
