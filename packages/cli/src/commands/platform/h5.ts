import { FileHelper } from '../../FileHelper';
import { rollup, watch, OutputOptions } from "rollup";
import { terser } from "rollup-plugin-terser";
const chalk = require('chalk');

var liveServer = require("live-server");
var QRCode = require('qrcode');


const replace = require("rollup-plugin-replace");
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const copy = require('rollup-plugin-copy-glob');
const sourcemaps = require('rollup-plugin-sourcemaps');
const extensions = ['.js', '.ts',];

export async function build_h5(environment) {

    // fs.ensureDirSync(FileHelper.PROJECT_DIST_H5);

    console.log('开始编译 h5 版本');
    console.log('debug: ', environment.__DEBUG__);

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
                { files: `${FileHelper.CLI_PLATFORMS}/h5/*`, dest: `${FileHelper.PROJECT_DIST_H5}/` }, // copy files in platform folder to dist
                { files: `${FileHelper.PROJECT_ROOT}/src/assets/**`, dest: `${FileHelper.PROJECT_DIST_H5}` },
            ], { verbose: false }),

            environment.__DEBUG__ && sourcemaps(),
            !environment.__DEBUG__ && terser(),
        ]

    };

    const outputOptions: OutputOptions = {
        name: 'shedgame',
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



    if (environment.__DEBUG__) {
        console.log('------------------------------------------------');
        console.log(chalk.bold("|       watch 模式开启，监视文件修改中"));

        let firstEnd = true;
        let watcher = watch([watchOptions]);
        watcher.on('event', e => {
            // console.log(e.code);
            switch (e.code) {
                case "START":
                    break;
                case "END":
                    console.log(chalk.green('编译成功 O(∩_∩)O'));
                    console.timeEnd('用时');
                    if (firstEnd) {
                        QRCode.toString(`http://${getIPAddress()}:8182`, { type: 'terminal' }, function (err, url) {
                            console.log(url);
                        });
                        console.log(`正在打开浏览器：http://${getIPAddress()}:8182`);
                        firstEnd = false;
                        var params = {
                            port: 8182, // Set the server port. Defaults to 8080.
                            host: getIPAddress(), //"0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
                            root: FileHelper.PROJECT_DIST_H5, // Set root directory that's being served. Defaults to cwd.
                            open: true, // When false, it won't load your browser by default.
                            // ignore: 'scss,my/templates', // comma-separated string for paths to ignore
                            file: "index.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
                            wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
                            // mount: [['/components', './node_modules']], // Mount a directory to a route.
                            logLevel: 0, // 0 = errors only, 1 = some, 2 = lots
                            // middleware: [function(req, res, next) { next(); }] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
                        };
                        liveServer.start(params);
                    }
                    break;
                case "BUNDLE_START":
                    // console.clear();
                    console.log('------------------------------------------------');
                    console.log('正在重新编译... ԅ(¯﹃¯ԅ) ');
                    console.time('用时');
                    break;
                case "ERROR":
                    console.timeEnd('用时');
                    console.log('------------------------------------------------');
                    console.log(JSON.stringify(e.error, null, 4));
                    console.log('------------------------------------------------');
                    console.log(chalk.red('编译错误') + ' 发现错误如上，请在尝试' + chalk.bold('修复') + '后' + chalk.bold('保存') + '文件，我仍会' + chalk.bold('自动编译') + ' (～o￣3￣)～');
                    break;
                case "FATAL":
                    console.log('------------------------------------------------');
                    console.timeEnd('用时');
                    console.error('编译失败', e.error);
                    break;
                default:
                    break;
            }
        });







    } else {
        let bundle = await rollup(inputOptions);
        console.log('文件列表:\r\n', bundle.watchFiles.join('\r\n'));
        await bundle.write(outputOptions);
    }


    // console.log(bundle);
}

function getIPAddress() {
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}
console.log(getIPAddress()); // 本地ip