import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

const extensions = [
    '.ts'
];
export default {
    input: './src/index.ts',
    // external: ['@shed/utils'],
    plugins: [
        resolve({ extensions }),
        commonjs(),
        json(),
        babel({ extensions, include: ['src/**/*'] }),
    ],

    output: [
        {
            file: pkg.module, // same as jsnext:main 
            format: 'esm',
            sourcemap: false
        }
    ],
};