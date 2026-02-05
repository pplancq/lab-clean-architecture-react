import { defineConfig, type EnvironmentConfig, loadEnv } from '@rsbuild/core';
import { pluginEslint } from '@rsbuild/plugin-eslint';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';
import { pluginStylelint } from 'rsbuild-plugin-stylelint';
import packageJson from './package.json';

const resolveModule = (module: string) => {
  try {
    require.resolve(module);
    return true;
  } catch {
    return false;
  }
};

const { publicVars } = loadEnv({ prefixes: [process.env.ENV_PREFIX ?? 'FRONT_'] });

const publicUrl = process.env.PUBLIC_URL ?? (packageJson as { homepage?: string }).homepage ?? '/';
const publicPath = new URL(publicUrl.endsWith('/') ? publicUrl : `${publicUrl}/`, 'http://localhost').pathname;
const disableSourceMap = (process.env.DISABLE_SOURCE_MAP ?? 'false') === 'true' ? false : 'source-map';
const enablePwa = (process.env.FRONT_PWA_ENABLED ?? 'false') === 'true';

export default defineConfig(({ env }) => {
  const isProduction = env === 'production';

  const web: EnvironmentConfig = {
    plugins: [pluginReact(), pluginSass()],
    source: {
      entry: {
        index: 'src/main.ts',
      },
      define: publicVars,
    },
    output: {
      assetPrefix: publicPath,
      sourceMap: {
        js: isProduction ? disableSourceMap : 'cheap-module-source-map',
        css: (process.env.DISABLE_SOURCE_MAP ?? 'false') !== 'true',
      },
      distPath: {
        root: 'build',
      },
      copy: [
        {
          from: 'public',
          to: '.',
        },
      ],
      manifest: {
        generate({ manifestData }) {
          return {
            name: 'Game Collection Manager',
            short_name: 'Game Manager',
            description: 'Manage your video game collection, wishlist, and console maintenance',
            start_url: '/',
            display: 'standalone',
            theme_color: '#1E3A8A',
            background_color: '#FFFFFF',
            orientation: 'any',
            icons: [
              {
                src: '/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
              },
              {
                src: '/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
              },
            ],
            ...manifestData,
          };
        },
      },
    },
    html: {
      template: './index.html',
    },
  };
  const serviceWorker: EnvironmentConfig = {
    dev: {
      client: {
        overlay: false,
      },
    },
    source: {
      entry: {
        [process.env.FRONT_SERVICE_WORKER_FILE_NAME ?? 'serviceWorker']: {
          import: 'src/serviceWorker.ts',
          html: false,
        },
      },
      define: publicVars,
    },
    performance: {
      chunkSplit: {
        strategy: 'all-in-one',
      },
    },
    output: {
      filename: {
        js: '[name].js',
      },
      distPath: {
        root: 'build',
        js: '.',
      },
      sourceMap: {
        js: isProduction ? disableSourceMap : 'cheap-module-source-map',
      },
    },
  };

  const environments: Record<string, EnvironmentConfig> = {
    web,
  };

  if (enablePwa) {
    environments.serviceWorker = serviceWorker;
  }

  return {
    plugins: [
      !isProduction &&
        pluginEslint({
          enable: (process.env.DISABLE_ESLINT_PLUGIN ?? 'false') === 'false' && resolveModule('eslint'),
          eslintPluginOptions: {
            configType: 'flat',
          },
        }),
      !isProduction &&
        pluginStylelint({
          enable: (process.env.DISABLE_STYLELINT_PLUGIN ?? 'false') === 'false' && resolveModule('stylelint'),
        }),
    ].filter(Boolean),
    server: {
      port: Number.parseInt(process.env.PORT ?? '3000', 10),
      open: (process.env.BROWSER ?? 'false') === 'true',
    },
    environments,
  };
});
