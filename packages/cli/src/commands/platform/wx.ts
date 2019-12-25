import { FileHelper } from '../../FileHelper';
import { rollup } from "rollup";
import { terser } from "rollup-plugin-terser";
const replace = require("rollup-plugin-replace")
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const copy = require('rollup-plugin-copy-glob');
const sourcemaps = require('rollup-plugin-sourcemaps');
const extensions = ['.js', '.ts',];

export async function build_wx(environment) {

    // environment.exclude = null; // 所有 @shed 项目都要替换，最重要的是 @shed/platform 确保无用代码被删除
    let bundle = await rollup({
        input: FileHelper.PROJECT_ENTRY,
        external: [],
        plugins: [
            environment.__DEBUG__ && sourcemaps(),
            replace(environment),
            resolve({ extensions }),
            commonjs(),
            babel({
                cwd: FileHelper.CLI_ROOT,
                extensions, include: ['src/**/*'],
                presets: ["@babel/preset-typescript"],
                plugins: [
                    [
                        "@babel/proposal-class-properties",
                        {
                            "loose": true
                        }
                    ],
                    "@babel/proposal-object-rest-spread",
                    ["babel-plugin-transform-async-to-promises", { "inlineHelpers": true }]
                ]
            }),
            copy([
                { files: `${FileHelper.CLI_PLATFORMS}/wx/*`, dest: `${FileHelper.PROJECT_DIST_WX}/` }, // copy files in platform folder to dist
                { files: `${FileHelper.PROJECT_ROOT}/src/assets/**`, dest: `${FileHelper.PROJECT_DIST_WX}` },
            ], { verbose: true }),

            !environment.__DEBUG__ && terser(),
        ]

    })
    
    console.log(bundle);

    await bundle.write({
        name: 'shedgame',
        file: `${FileHelper.PROJECT_DIST_WX}/game.js`,
        format: 'cjs',
        sourcemap: environment.__DEBUG__,
        esModule: false
    })
}
