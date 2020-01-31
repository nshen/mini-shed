import { FileHelper } from '../helpers/FileHelper';
import { build_h5, build_wx, build_qq, build_tt, build_oppo } from "./platform";
import { Logger } from "../helpers/log";
import chalk from "chalk";
import * as fs from "fs-extra";
const rm = require('rimraf');

export type BuildEnvironment = {
    __DEBUG__: boolean,
    __PLATFORM_H5__: boolean,
    __PLATFORM_WX__: boolean,
    __PLATFORM_QQ__: boolean,
    __PLATFORM_TT__: boolean,
    __PLATFORM_OPPO__: boolean;
};

export type PlatformType = 'h5' | 'wx' | 'qq' | 'tt' | 'oppo';

export async function build(platform: PlatformType, debug: boolean = false, watch: boolean = false) {

    FileHelper.init();

    let pkg = await FileHelper.json(FileHelper.PROJECT_PKG);
    if (!pkg) {
        Logger.error(`没有发现 ${chalk.cyan('package.json')} 请进入工程目录内调用 ${chalk.cyan('build')} 命令`);
        return;
    }

    if (! await FileHelper.exist(FileHelper.PROJECT_ENTRY)) {
        Logger.error(`没有发现代码入口 ${chalk.cyan(FileHelper.PROJECT_ENTRY)} 文件`);
        return;
    }

    // 代码中变量替换
    let environment: BuildEnvironment = {
        '__DEBUG__': debug,
        '__PLATFORM_H5__': false,
        '__PLATFORM_WX__': false,
        '__PLATFORM_QQ__': false,
        '__PLATFORM_TT__': false,
        '__PLATFORM_OPPO__': false
    };

    switch (platform) {
        case 'h5':
            environment.__PLATFORM_H5__ = true;
            rm(FileHelper.PROJECT_DIST_H5, fs, () => {
                build_h5(environment, watch);
            });
            break;
        case 'wx':
            environment.__PLATFORM_WX__ = true;
            rm(FileHelper.PROJECT_DIST_WX, fs, () => {
                build_wx(environment, watch);
            });
            break;
        case 'qq':
            environment.__PLATFORM_QQ__ = true;
            rm(FileHelper.PROJECT_DIST_QQ, fs, () => {
                build_qq(environment, watch);
            });
            break;
        case 'tt':
            environment.__PLATFORM_TT__ = true;
            rm(FileHelper.PROJECT_DIST_TT, fs, () => {
                build_tt(environment, watch);
            });
            break;
        case 'oppo':
            environment.__PLATFORM_OPPO__ = true;
            rm(FileHelper.PROJECT_DIST_OPPO, fs, () => {
                build_oppo(environment, watch);
            });
            break;

        default:
            Logger.error(`不支持 ${chalk.red(platform)} 请检查输入`);
            return;
    }

    // if (dist !== '') console.log(dist);

}