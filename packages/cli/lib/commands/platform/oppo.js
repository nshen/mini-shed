"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FileHelper_1 = require("../../FileHelper");
const rollup_1 = require("rollup");
const rollup_plugin_terser_1 = require("rollup-plugin-terser");
const replace = require("rollup-plugin-replace");
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const copy = require('rollup-plugin-copy-glob');
const sourcemaps = require('rollup-plugin-sourcemaps');
const extensions = ['.js', '.ts',];
async function build_oppo(environment) {
    // environment.exclude = null; // 所有 @shed 项目都要替换，最重要的是 @shed/platform 确保无用代码被删除
    let bundle = await rollup_1.rollup({
        input: FileHelper_1.FileHelper.PROJECT_ENTRY,
        external: [],
        plugins: [
            environment.__DEBUG__ && sourcemaps(),
            replace(environment),
            resolve({ extensions }),
            commonjs(),
            babel({
                cwd: FileHelper_1.FileHelper.CLI_ROOT,
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
                { files: `${FileHelper_1.FileHelper.CLI_PLATFORMS}/oppo/**`, dest: `${FileHelper_1.FileHelper.PROJECT_DIST_OPPO}/` },
                { files: `${FileHelper_1.FileHelper.PROJECT_ROOT}/src/assets/**`, dest: `${FileHelper_1.FileHelper.PROJECT_DIST_OPPO}` },
            ], { verbose: true }),
            !environment.__DEBUG__ && rollup_plugin_terser_1.terser(),
        ]
    });
    console.log(bundle);
    await bundle.write({
        name: 'shedgame',
        file: `${FileHelper_1.FileHelper.PROJECT_DIST_OPPO}/main.js`,
        format: 'cjs',
        sourcemap: environment.__DEBUG__,
        esModule: false
    });
}
exports.build_oppo = build_oppo;
