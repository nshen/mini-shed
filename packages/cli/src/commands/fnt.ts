import * as fs from "fs-extra";
import { Logger } from "../helpers/log";
const util = require('util');
const path = require('path');
const stat = util.promisify(fs.stat);


let _charMap: { [key: string]: any; } = {};

export async function fnt(filename: string) {


    let file = path.join(process.cwd(), filename);
    if (!fs.existsSync(file)) {
        Logger.error(`${file} 不存在`);
        return;
    }
    let s = await stat(file);
    if (!s.isFile()) {
        Logger.error(`${file} 不是文件`);
        return;
    }

    let fnt = await fs.readFile(file, 'utf8');

    let fntLines = fnt.split('\n');
    let fntLineArray;
    for (let i = 0; i < fntLines.length; i++) {
        fntLineArray = fntLines[i].split(' ');
        switch (fntLineArray[0]) {
            case 'info':
                continue;
            case 'common':
                continue;
            case 'page':
                continue;
            case 'chars':
                continue;
            case 'char':
                _parseChar(fntLineArray);
                continue;
            case 'kernings':
                continue;
            case 'kerning':
                continue;
            default:
                break;
        }
    }
    // console.log(_charMap);

    fs.writeFileSync(`${path.basename(filename, '.fnt')}.json`, JSON.stringify(_charMap));
    // // let font = parse(fnt);
    // // console.log(font);
    // let img = wx.createImage() as any as HTMLImageElement;
    // img.onload = () => {
    //     this._ecs.state.assets['test.png'] = img;
    //     let curX = 0;
    //     let str = 'nshen.net我是陈新1234567890abcdefghijklmnopq';
    //     let item;
    //     for (let i = 0; i < str.length; i++) {
    //         item = this._charMap[str[i]];
    //         this._ecs.addNewEntity('font',
    //             {
    //                 type: 'transform',
    //                 x: curX + item.width / 2 + item.xoffset,
    //                 y: 100 + item.yoffset / 2,
    //                 width: item.width,
    //                 height: item.height
    //             },
    //             { type: 'render', image: 'test.png', region: { l: item.x / img.width, r: (item.x + item.width) / img.width, t: item.y / img.height, b: (item.y + item.height) / img.height } });
    //         curX += item.xadvance;
    //     }
    // };
    // img.src = 'test.png';
};

function _parseChar(lineArray: String[]) {

    let str;
    let char: {
        id?: number;
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        xoffset?: number;
        yoffset?: number;
        xadvance?: number;
        page?: number;
    } = {};

    for (let i = 1; i < lineArray.length; i++) {
        str = lineArray[i];
        if (str.length === 0)
            continue;
        let key_value = str.split('=');
        // console.log(key_value[0], '===', key_value[1])
        switch (key_value[0]) {

            case 'id':
                char.id = Number(key_value[1]);
                continue;
            case 'x':
                char.x = Number(key_value[1]);
                continue;
            case 'y':
                char.y = Number(key_value[1]);
                continue;
            case 'width':
                char.width = Number(key_value[1]);
                continue;
            case 'height':
                char.height = Number(key_value[1]);
                continue;
            case 'xoffset':
                char.xoffset = Number(key_value[1]);
                continue;
            case 'yoffset':
                char.yoffset = Number(key_value[1]);
                continue;
            case 'xadvance':
                char.xadvance = Number(key_value[1]);
                continue;
            case 'page':
                char.page = Number(key_value[1]);
                continue;
        }
        if (char.id)
            _charMap[String.fromCharCode(char.id)] = char;
    }
}