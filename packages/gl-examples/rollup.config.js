import babel from 'rollup-plugin-babel';
import template from 'rollup-plugin-generate-html-template';
import copy from 'rollup-plugin-copy-glob';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';

const extensions = [
    '.ts'
];

export default [
    // buildExample('loaders'),
    buildExample('depthstencils'),
    buildExample('light'),
    buildExample('blend-map'),
    buildExample('render-models'),
    buildExample('phong'),
    buildExample('test')
]


function buildExample(name, htmlTemplate = 'src/template.html') {
    return {
        input: `./src/${name}/index.ts`,
        output: {
            file: `./dist/${name}/${name}.js`,
            format: 'iife',
            // sourcemap: true
            name: 'window', extend: true, globals: {}
        },
        watch: {
            chokidar: {
                usePolling: true
            }
        },
        plugins: [
            replace({
                // include: 'src/**',
                __DEBUG__: process.env.DEBUG === 'true'
            }),
            template({
                template: htmlTemplate,
                target: `index.html`
            }),
            copy([
                { files: `src/${name}/assets/*`, dest: `./dist/${name}/assets/` },
            ], { verbose: true }),
            resolve({ extensions }),
            babel({ extensions, include: ['./src/**/*'] }),
        ]
    }
}