import nextPlugin from 'eslint-config-next';

const config = [
  ...nextPlugin,
  {
    ignores: ['.next/', 'node_modules/', 'public/'],
  },
];

export default config;