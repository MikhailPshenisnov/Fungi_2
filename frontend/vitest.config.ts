import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

const storybookProjectArg = process.argv.find((arg) => arg.startsWith('storybook:'));
const storybookConfigDir = process.env.STORYBOOK_CONFIG_DIR
  ? path.resolve(process.env.STORYBOOK_CONFIG_DIR)
  : storybookProjectArg
    ? path.resolve(storybookProjectArg.slice('storybook:'.length))
    : path.join(dirname, '.storybook');
const isStorybookRun = Boolean(process.env.STORYBOOK_CONFIG_DIR || process.env.VITEST_STORYBOOK || storybookProjectArg);
const storybookProjectName = `storybook:${path.normalize(storybookConfigDir)}`;
const baseSetupFiles = ['./src/shared/testing/setup.ts'];
const storybookSetupFile = path.join(storybookConfigDir, 'vitest.setup.js');
const aliases = {
  '@app': path.resolve(dirname, 'src/app'),
  '@processes': path.resolve(dirname, 'src/processes'),
  '@pages': path.resolve(dirname, 'src/pages'),
  '@widgets': path.resolve(dirname, 'src/widgets'),
  '@features': path.resolve(dirname, 'src/features'),
  '@entities': path.resolve(dirname, 'src/entities'),
  '@shared': path.resolve(dirname, 'src/shared')
};

export default defineConfig({
  plugins: isStorybookRun ? [storybookTest({ configDir: storybookConfigDir })] : [],
  resolve: {
    alias: aliases
  },
  test: {
    environment: 'jsdom',
    setupFiles: isStorybookRun ? [storybookSetupFile] : baseSetupFiles,
    ...(isStorybookRun
      ? {
          name: storybookProjectName,
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }]
          }
        }
      : {})
  }
});
