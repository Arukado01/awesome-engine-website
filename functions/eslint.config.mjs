import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['lib/**', 'node_modules/**'] },
  ...tseslint.configs.recommended,
  { files: ['src/**/*.ts', 'test/**/*.ts'] },
);
