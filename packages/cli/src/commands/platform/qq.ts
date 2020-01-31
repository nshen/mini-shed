import { BuildEnvironment } from '../build';
import { FileHelper } from '../../helpers/FileHelper';
import { rollup, watch, OutputOptions } from "rollup";

import { terser } from "rollup-plugin-terser";
const replace = require("rollup-plugin-replace");
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const copy = require('rollup-plugin-copy-glob');
const sourcemaps = require('rollup-plugin-sourcemaps');

const chalk = require('chalk');
const ora = require('ora');

const extensions = ['.js', '.ts',];

let spinner;

export async function build_qq(environment: BuildEnvironment, watchMode: boolean) {

    const inputOptions = {
        input: FileHelper.PROJECT_ENTRY,
        external: [],
        plugins: [
            replace(environment),
            resolve({ extensions }),
            commonjs(),
            babel({
                cwd: FileHelper.CLI_ROOT,
                extensions,
                // exclude: null,
                include: ['src/**/*'],
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
                { files: `${FileHelper.CLI_PLATFORMS}/qq/*`, dest: `${FileHelper.PROJECT_DIST_QQ}/` }, // copy files in platform folder to dist
                { files: `${FileHelper.PROJECT_ROOT}/src/assets/**`, dest: `${FileHelper.PROJECT_DIST_QQ}` },
            ], { verbose: false }),
            // environment.__DEBUG__ && sourcemaps(),
            !environment.__DEBUG__ && terser(),
        ]
    };

    const outputOptions: OutputOptions = {
        name: 'shedgame',
        file: `${FileHelper.PROJECT_DIST_QQ}/game.js`,
        format: 'cjs',
        sourcemap: environment.__DEBUG__,
        esModule: false
    };

    const watchOptions = {
        ...inputOptions,
        output: outputOptions,
        watch: {
            clearScreen: true,
            include: [`${FileHelper.PROJECT_ROOT}/src/**/*`],
            chokidar: {
                usePolling: true
            }
        }
    };

    if (watchMode) {
        console.log();
        console.log(chalk.bold('------------------------------------------------'));
        console.log(chalk.bold('|       watch 模式开启，监视文件修改中         |'));
        console.log(chalk.bold('------------------------------------------------'));
        console.log();
        spinner = ora(`正在编译 ${chalk.cyan('QQ')} 版本`).start();
        let watcher = watch([watchOptions]);
        watcher.on('event', e => {
            switch (e.code) {
                case "START":
                    break;
                case "END":
                    spinner.succeed('编译成功 O(∩_∩)O');
                    console.timeEnd('用时');
                    break;
                case "BUNDLE_START":
                    spinner.start('正在重新编译... ԅ(¯﹃¯ԅ) ');
                    console.time('用时');
                    break;
                case "ERROR":
                    console.timeEnd('用时');
                    console.log('------------------------------------------------');
                    console.log(JSON.stringify(e.error, null, 4));
                    console.log('------------------------------------------------');
                    spinner.fail(chalk.red('编译错误') + ' 发现错误如上，请在尝试' + chalk.bold('修复') + '后' + chalk.bold('保存') + '文件，我仍会' + chalk.bold('自动编译') + ' (～o￣3￣)～');
                    break;
                case "FATAL":
                    console.timeEnd('用时');
                    spinner.fail('编译失败' + e.error.toString());
                    break;
                default:
                    break;
            }
        });

    } else {
        spinner = ora(`正在编译 ${chalk.cyan('QQ')} 版本`).start();
        let bundle = await rollup(inputOptions);
        console.log();
        bundle.watchFiles.forEach(e => {
            console.log(`  ${chalk.cyan('->')} ` + e.toString().trim());
        });
        await bundle.write(outputOptions);
        spinner.succeed('编译成功 O(∩_∩)O');
        spinner.succeed('请打开QQ开发者工具导入目录：' + FileHelper.PROJECT_DIST_QQ);
    }
};