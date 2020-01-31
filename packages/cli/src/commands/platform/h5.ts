import { BuildEnvironment } from '../build';
import { FileHelper } from '../../helpers/FileHelper';
import { getIPAddress } from '../../helpers/getIPAddress';

import { rollup, watch, OutputOptions } from "rollup";

// rollup plugins
import { terser } from "rollup-plugin-terser";
const replace = require("rollup-plugin-replace");
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const copy = require('rollup-plugin-copy-glob');
const sourcemaps = require('rollup-plugin-sourcemaps');

const chalk = require('chalk');
const ora = require('ora');
const QRCode = require('qrcode');
const liveServer = require("live-server");

const extensions = ['.js', '.ts',];

let spinner;

export async function build_h5(environment: BuildEnvironment, watchMode: boolean) {

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
                    ["@babel/proposal-class-properties", { "loose": true }],
                    "@babel/proposal-object-rest-spread",
                    ["babel-plugin-transform-async-to-promises", { "inlineHelpers": true }]
                ]
            }),
            copy([
                { files: `${FileHelper.CLI_PLATFORMS}/h5/*`, dest: `${FileHelper.PROJECT_DIST_H5}` }, // copy files in platform folder to dist
                { files: `${FileHelper.PROJECT_ROOT}/src/assets/**`, dest: `${FileHelper.PROJECT_DIST_H5}` },
            ], { verbose: false }),
            !environment.__DEBUG__ && terser(),
            environment.__DEBUG__ && sourcemaps(),
        ]
    };

    const outputOptions: OutputOptions = {
        name: 'shedgame',
        // name: 'window', extend: true, globals: {},
        file: `${FileHelper.PROJECT_DIST_H5}/game.js`,
        format: 'iife',
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
        spinner = ora(`正在编译 ${chalk.cyan('H5')} 版本`).start();
        let firstEnd = true; //第一次编译成功应显示二维码并弹开浏览器
        let watcher = watch([watchOptions]);
        watcher.on('event', e => {
            switch (e.code) {
                case "START":
                    break;
                case "END":
                    spinner.succeed('编译成功 O(∩_∩)O');
                    console.timeEnd('用时');
                    if (firstEnd) {
                        firstEnd = false;
                        let myIP = getIPAddress();
                        QRCode.toString(`http://${myIP}:8182`, { type: 'terminal' }, function (err, url) {
                            console.log(url);
                            if (!err)
                                spinner.succeed('生成二维码成功');
                        });
                        spinner.succeed(`正在打开浏览器：http://${myIP}:8182`, FileHelper.PROJECT_DIST_H5);
                        spinner.succeed('WEB目录：' + FileHelper.PROJECT_DIST_H5);
                        let liveServerParams = {
                            port: 8182, // Set the server port. Defaults to 8080.
                            host: myIP, //"0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
                            root: FileHelper.PROJECT_DIST_H5, // Set root directory that's being served. Defaults to cwd.
                            open: true, // When false, it won't load your browser by default.
                            // ignore: 'scss,my/templates', // comma-separated string for paths to ignore
                            file: "index.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
                            wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
                            // mount: [['/components', './node_modules']], // Mount a directory to a route.
                            logLevel: 0, // 0 = errors only, 1 = some, 2 = lots
                            // middleware: [function(req, res, next) { next(); }] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
                        };
                        liveServer.start(liveServerParams);
                    }
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
        spinner = ora(`正在编译 ${chalk.cyan('H5')} 版本`).start();
        let bundle = await rollup(inputOptions);
        console.log();
        bundle.watchFiles.forEach(e => {
            console.log(`  ${chalk.cyan('->')} ` + e.toString().trim());
        });
        await bundle.write(outputOptions);
        spinner.succeed('编译成功 O(∩_∩)O');
        spinner.succeed('WEB目录：' + FileHelper.PROJECT_DIST_H5);
    }
}
