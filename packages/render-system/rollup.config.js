import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from "rollup-plugin-replace";
import pkg from './package.json';

const extensions = [
    '.ts', '.js'
];

export default {
    input: './src/index.ts',

    // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
    // https://rollupjs.org/guide/en#external-e-external
    external: ['@shed/gl', '@shed/ecs', '@shed/math'],

    plugins: [
        replace({
            include: 'src/**',
            __DEBUG__: process.env.DEBUG === 'true'
        }),
        // Allows node_modules resolution
        resolve({ extensions }),

        // Compile TypeScript/JavaScript files
        babel({ extensions }),
    ],
    // https://github.com/rollup/rollup-plugin-babel/issues/300
    // The external function receives every id which rollup tries to load, 
    // if it returns true then rollup will leave the import in place (it wont bundle it), 
    // if it returns false though then it will bundle it (default behaviour).
    // external(id) {
    //     console.log(id)
    //     return /@babel\/runtime/.test(id);
    // },
    output: [
        {
            file: pkg.module, // same as jsnext:main 
            format: 'esm',
            sourcemap: true
        }],
};