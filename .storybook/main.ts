import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', 'storybook-addon-remix-react-router'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  staticDirs: ['../public'],
  stories: ['../app/**/*.stories.?(c|m)@(j|t)s?(x)'],
};

export default config;
