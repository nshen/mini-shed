import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

const extensions = [
    '.ts'
];

const name = '@shed/ecs';

export default {
    input: './src/index.ts',

    // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
    // https://rollupjs.org/guide/en#external-e-external
    external: ['@shed/utils'],

    plugins: [
        // Allows node_modules resolution
        resolve({ extensions }),
        commonjs(),

        // Compile TypeScript/JavaScript files
        babel({ extensions, include: ['src/**/*'], runtimeHelpers: true }),
    ],

    output: [
        {
            file: pkg.main,
            format: 'cjs',
            sourcemap: true
        }
        ,
        {
            file: pkg.module, // same as jsnext:main 
            format: 'esm',
            sourcemap: true
        }
    ],
};