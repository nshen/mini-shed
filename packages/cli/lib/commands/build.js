"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const rm = require('rimraf');
const path = require('path');
const FileHelper_1 = require("../FileHelper");
const platform_1 = require("./platform");
async function build(platform, debug = false) {
    FileHelper_1.FileHelper.init();
    let pkg = await FileHelper_1.FileHelper.json(FileHelper_1.FileHelper.PROJECT_PKG);
    if (!pkg) {
        console.error('没有发现 package.json 请进入工程目录内调用 build 命令');
        return;
    }
    if (!await FileHelper_1.FileHelper.exist(FileHelper_1.FileHelper.PROJECT_ENTRY)) {
        console.error(`没有发现代码入口 ${FileHelper_1.FileHelper.PROJECT_ENTRY} 文件`);
        return;
    }
    // 代码中变量替换
    let environment = {
        '__DEBUG__': debug,
        '__PLATFORM_H5__': false,
        '__PLATFORM_WX__': false,
        '__PLATFORM_QQ__': false,
        '__PLATFORM_TT__': false,
        '__PLATFORM_OPPO__': false
    };
    console.log(platform);
    switch (platform) {
        case 'h5':
            environment.__PLATFORM_H5__ = true;
            rm(FileHelper_1.FileHelper.PROJECT_DIST_H5, fs, () => {
                platform_1.build_h5(environment);
            });
            break;
        case 'wx':
            environment.__PLATFORM_WX__ = true;
            rm(FileHelper_1.FileHelper.PROJECT_DIST_WX, fs, () => {
                platform_1.build_wx(environment);
            });
            break;
        case 'qq':
            environment.__PLATFORM_QQ__ = true;
            rm(FileHelper_1.FileHelper.PROJECT_DIST_QQ, fs, () => {
                platform_1.build_qq(environment);
            });
            break;
        case 'tt':
            environment.__PLATFORM_TT__ = true;
            rm(FileHelper_1.FileHelper.PROJECT_DIST_TT, fs, () => {
                platform_1.build_tt(environment);
            });
            break;
        case 'oppo':
            environment.__PLATFORM_OPPO__ = true;
            rm(FileHelper_1.FileHelper.PROJECT_DIST_OPPO, fs, () => {
                platform_1.build_oppo(environment);
            });
            break;
        default:
            console.error(`不支持 ${platform} 请检查输入`);
            return;
    }
    // if (dist !== '') console.log(dist);
}
exports.build = build;
