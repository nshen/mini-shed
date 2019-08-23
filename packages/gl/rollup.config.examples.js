import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from "rollup-plugin-replace";
import pkg from './package.json';

// import commonjs from 'rollup-plugin-commonjs';
import shader from 'rollup-plugin-shader';
import htmlTemplate from 'rollup-plugin-generate-html-template';
import copy from 'rollup-plugin-copy-glob';
// import serve from 'rollup-plugin-serve';
// import livereload from 'rollup-plugin-livereload'

const extensions = [
    '.ts', '.js'
];

// console.log('running in debug mode:', process.env.DEBUG);

export default[

    buildExample('light')
    // buildExample('blend-map')
    // buildExample('render-models'),
    // buildExample('phong'),
]

function buildExample(name = 'index') {
    return {
        input: `./src/examples/${name}/index.ts`,
        output: {
            file: `./examples/${name}/${name}.js`,
            format: 'cjs',
            sourcemap: true
        },
        plugins: [
            replace({
                include: 'src/**',
                __DEBUG__: process.env.DEBUG === 'true'
            }),
            htmlTemplate({
                template: 'src/examples/template.html',
                target: 'index.html'
            }),
            copy([
                { files: `src/examples/${name}/assets/*`, dest: `./examples/${name}/assets/` }, 
            ], { verbose: true }),
            // Allows node_modules resolution
            resolve({ extensions }),
            // Allow bundling cjs modules. Rollup doesn't understand cjs

            // commonjs(
            //     {
            //         namedExports: {
            //             // left-hand side can be an absolute path, a path
            //             // relative to the current directory, or the name
            //             // of a module in node_modules
            //             'node_modules/matter-js/build/matter.js': ['Engine','Bodies','Render','World']
            //         }
            //     }

            // ),
            // Compile TypeScript/JavaScript files
            babel({ extensions, include: ['src/**/*'] }),
            shader({
                // All match files will be parsed by default,
                // but you can also specifically include/exclude files
                include: ['**/*.glsl', '**/*.vs', '**/*.fs', '**/*.frag', '**/*.vert'],
                // exclude: ['node_modules/foo/**', 'node_modules/bar/**'],

                // specify whether to remove comments
                removeComments: true,   // default: true
            })
        ]
    }
}