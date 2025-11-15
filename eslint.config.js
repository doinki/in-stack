// @ts-check

import { join } from 'node:path';

import { defineConfig, includeIgnoreFile } from 'eslint-config-mado';
import * as importConfig from 'eslint-config-mado/import';
import * as jsConfig from 'eslint-config-mado/javascript';
import * as prettierConfig from 'eslint-config-mado/prettier';
import * as reactConfig from 'eslint-config-mado/react';
import * as sortConfig from 'eslint-config-mado/sort';
import * as tsConfig from 'eslint-config-mado/typescript';
import * as unicornConfig from 'eslint-config-mado/unicorn';
import storybook from 'eslint-plugin-storybook';
import globals from 'globals';

const gitignorePath = join(import.meta.dirname, '.gitignore');

export default defineConfig(
  includeIgnoreFile(gitignorePath),
  { languageOptions: { globals: { ...globals.node, ...globals.browser } } },
  jsConfig.defineConfig(),
  tsConfig.defineConfig({ tsconfigRootDir: import.meta.dirname }),
  importConfig.defineConfig(),
  reactConfig.defineConfig(),
  unicornConfig.defineConfig(),
  sortConfig.defineConfig(),
  prettierConfig.defineConfig(),
  // @ts-expect-error
  storybook.configs['flat/recommended'],
);
