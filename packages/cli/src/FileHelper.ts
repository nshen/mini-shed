import * as fs from "fs-extra";
const path = require('path');

export class FileHelper {

    static PROJECT_ROOT: string;
    static PROJECT_ENTRY: string;
    static PROJECT_PKG: string;
    static PROJECT_DIST: string;

    // 目标目录
    static PROJECT_DIST_H5: string;
    static PROJECT_DIST_WX: string;
    static PROJECT_DIST_QQ: string;
    static PROJECT_DIST_TT: string;
    static PROJECT_DIST_OPPO: string;

    static CLI_ROOT: string;
    static CLI_PLATFORMS: string;


    // console.log(__dirname);
    // console.log(__filename);
    // console.log(process.cwd());
    // console.log(path.resolve('./'));
    // console.log(cacheFolder)
    static init() {

        // project目录
        FileHelper.PROJECT_ROOT = path.resolve('./');
        FileHelper.PROJECT_ENTRY = path.resolve('./src/main.ts');
        FileHelper.PROJECT_PKG = path.resolve('./package.json');

        FileHelper.PROJECT_DIST_H5 = path.resolve('./dist/h5');
        FileHelper.PROJECT_DIST_WX = path.resolve('./dist/wx');
        FileHelper.PROJECT_DIST_QQ = path.resolve('./dist/qq');
        FileHelper.PROJECT_DIST_TT = path.resolve('./dist/tt');
        FileHelper.PROJECT_DIST_OPPO = path.resolve('./dist/oppo');


        // 命令所在目录
        FileHelper.CLI_ROOT = path.join(__dirname, '../');
        FileHelper.CLI_PLATFORMS = path.join(__dirname, '../platforms');

        // export const cacheFolder = path.join(__dirname, '../../cache');
        // export const platformFolder = path.join(__dirname, '../../platforms');
        // export const rootFolder = path.join(__dirname, '../../');
    }

    static async json(path: string) {

        try {

            let pkg = await fs.readFile(path)
            return JSON.parse(pkg.toString());

        } catch (error) {

            return null;
        }
    }

    static async exist(path: string) {
        return await fs.pathExists(path);
    }

}