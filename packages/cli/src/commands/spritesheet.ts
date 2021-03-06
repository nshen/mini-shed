const spritesheet = require('spritesheet-js');
const path = require('path')
import * as fs from "fs-extra";
import {Logger} from "../helpers/log";

export async function createSpritesheet(folder: string) {
    let folderPath = path.join(process.cwd(), folder)
    console.log(folderPath)
    if (!await fs.pathExists(folderPath)) {
        Logger.error(`目录 ${folderPath} 不存在`);
        return;
    }
    let images = await fs.readdir(folderPath)
    if (images.length <= 1) {
        Logger.error('目录中应多于1张图片');
        return;
    }

    images = images.map(f => path.join(folderPath, f));
    spritesheet(images,
        {
            name:folder
            // algorithm: 'binpacking',
            // width: 256,
            // height: 240,
        }, function (err: Error) {
            if (err) {
                Logger.error('spritesheet-js:' + err.message);
                Logger.error('此命令需要正确安装 ImageMagick 6.X，如有问题请到主页寻求帮助');
                return;
            };
            // 修改成 mini-shed 需要的版本
            let str = fs.readFileSync(`${folder}.json`, 'utf8');
            let json = JSON.parse(str);
            let w = json.meta.size.w;
            let h = json.meta.size.h;
            let shedSpritesheet: {
                type: 'spritesheet',
                width: number,
                height: number,
                region: { [key: string]: { l: number, r: number, t: number, b: number } }
            } = {
                type: 'spritesheet',
                width: w,
                height: h,
                region: {}
            };
            for (let i in json.frames) {
                shedSpritesheet.region[i] = {
                    l: json.frames[i].frame.x / w,
                    r: (json.frames[i].frame.x + json.frames[i].frame.w) / w,
                    t: json.frames[i].frame.y / h,
                    b: (json.frames[i].frame.y + json.frames[i].frame.h) / h,
                }
            }
            fs.writeFileSync(`${folder}.json`, JSON.stringify(shedSpritesheet));
            console.log('spritesheet successfully generated');
        });
}

