import camelCase from 'lodash.camelcase';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';

const pkg = require('./package.json');

const libraryName = 'web-crypto-tools';

const distFile = 'dist/';

const config = (tsconfigOverride = null) => ({
  input: `src/${libraryName}.ts`,
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [],
  watch: {
    include: 'src/**',
  },
  plugins: [
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript({ useTsconfigDeclarationDir: true, tsconfigOverride }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),

    // Resolve source maps to the original source
    sourceMaps(),
  ],
});

export default [
  {
    ...config({ compilerOptions: { target: 'es5' } }),
    output: [
      { file: distFile + pkg.main, format: 'cjs', sourcemap: true },
      { file: distFile + pkg.module, format: 'es', sourcemap: true },
      {
        file: distFile + pkg.browser,
        name: camelCase(libraryName),
        format: 'umd',
        sourcemap: true,
      },
    ],
  },
  {
    ...config(),
    output: [{ file: distFile + pkg.es2015, format: 'es', sourcemap: true }],
  },
];
