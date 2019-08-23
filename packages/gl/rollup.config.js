import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from "rollup-plugin-replace";
import pkg from './package.json';

const extensions = [
    '.ts', '.js'
];

// console.log('running in debug mode:', process.env.DEBUG);

export default {
    input: './src/index.ts',

    // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
    // https://rollupjs.org/guide/en#external-e-external
    external: [],

    plugins: [
        replace({
            include: 'src/**',
            __DEBUG__: process.env.DEBUG === 'true'
        }),
        // Allows node_modules resolution
        resolve({ extensions }),

        // Compile TypeScript/JavaScript files
        babel({ extensions, include: ['src/**/*'], runtimeHelpers: true }),
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