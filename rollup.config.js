import json from '@rollup/plugin-json';
import {terser} from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss'
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  output: {
    file: './dist/index.min.js',
    format: 'iife',
    plugins: [ terser() ]
  },
  plugins: [ json(), typescript(), postcss() ]
};