import pkg from './package.json';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from '@rollup/plugin-replace';
// import { terser } from 'rollup-plugin-terser';
import commonjs from 'rollup-plugin-commonjs';
// import shader from 'rollup-plugin-shader';
import htmlTemplate from 'rollup-plugin-generate-html-template';
import copy from 'rollup-plugin-copy-glob';
// import serve from 'rollup-plugin-serve';
// import livereload from 'rollup-plugin-livereload'



const extensions = [
    '.ts', '.js'
];

console.log('running in debug mode:', process.env.DEBUG);

export default [

    // buildExample('loaders'),
    // buildExample('depthstencils'),
    // buildExample('light'),
    // buildExample('blend-map'),
    // buildExample('render-models'),
    buildExample('phong'),
    buildExample('test'),
]

function buildExample(name = 'index') {
    return {
        input: `./src/${name}/index.ts`,
        // external: [
        //     ...Object.keys(pkg.dependencies || {}),
        //     ...Object.keys(pkg.peerDependencies || {})
        // ],
        output: {
            file: `./dist/${name}/${name}.js`,
            format: 'iife',
            name: 'window', extend: true, globals: {},
            sourcemap: true
        },
        watch: {
            chokidar: {
                usePolling: true
            }
        },
        plugins: [
            resolve({
                // mainFields: ['browser'],
                browser: true,
                preferBuiltins: false
            }),
            commonjs(),

            replace({
                include: 'src/**',
                __DEBUG__: process.env.DEBUG === 'true'
            }),
            htmlTemplate({
                template: 'src/template.html',
                target: 'index.html'
            }),
            copy([
                { files: `src/${name}/assets/*`, dest: `./dist/${name}/assets/` },
            ], { verbose: true }),
            // Allows node_modules resolution
            // resolve({
            //     mainFields: ['module'],
            //     // extensions,
            //     // preferBuiltins: false,
            //     browser: true,
            //     preferBuiltins: false
            // }),
            // commonjs(),
            // Allow bundling cjs modules. Rollup doesn't understand cjs
            // commonjs({
            //     include: 'node_modules/**'
            // }),

            // babel(),
            babel({ extensions, include: ['src/**/*'] }),
            // shader({
            //     // All match files will be parsed by default,
            //     // but you can also specifically include/exclude files
            //     include: ['**/*.glsl', '**/*.vs', '**/*.fs', '**/*.frag', '**/*.vert'],
            //     // exclude: ['node_modules/foo/**', 'node_modules/bar/**'],

            //     // specify whether to remove comments
            //     removeComments: true,   // default: true
            // })
        ]
    }
}