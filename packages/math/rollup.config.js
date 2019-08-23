import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

const extensions = [
    '.ts', '.js'
];

export default {
    input: './src/index.ts',
    external: [],

    plugins: [
        resolve({ extensions }),
        babel({ extensions, include: ['src/**/*']}),
    ],

    output: [
        {
            file: pkg.main,
            format: 'cjs',
            sourcemap: true
        },
        {
            file: pkg.module, // same as jsnext:main 
            format: 'esm',
            sourcemap: true
        }],
};