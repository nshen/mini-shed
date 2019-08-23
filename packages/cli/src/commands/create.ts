import * as fs from "fs-extra";
import * as log from "../log";

const clone = require('git-clone');
const ora = require('ora');


let repositories: { [key: string]: string } = {
    'github': 'https://git.dev.tencent.com/nshen/coding-blog.git',
    'coding': 'https://github.com/nshen/shed-gl.git'
}

let spinner: any

export async function create(name: string, r: string = 'github') {

    let repo = repositories[r.toLowerCase()];
    if (!repo) {
        log.error(r + '不存在，请尝试指定 github 或 coding');
        return;
    }

    let exists = await fs.pathExists(`./${name}`);
    if (exists) {
        log.error(`"${name}" 已经存在，请使用不存在的目录名`);
        return;
    }

    spinner = ora(`正在从 ${r} 下载最新脚手架，请${randomThing()}稍等一下`)
    spinner.start();

    clone(repo, name, async (err: any) => {
        if (err) {
            spinner.fail('下载失败，请检查网络并重试。')
            return;
        }
        try {
            if (await fs.pathExists(`./${name}/.git`)) {
                await fs.remove(`./${name}/.git`);
            }
        } catch (error) {
            console.error(error);
        }
        // TODO: copy to __dirname?
        spinner.succeed(`${name} 创建成功！`);

        console.log(`请调用以下命令进入目录并安装依赖`);
        log.command(`cd ${name}`);
        log.command(`npm install`);
        console.log('发布小游戏请使用');
        log.command('npm run build');
    })

}

let thingsYouCanDo: string[] = ['喝杯水', '冲杯茶', '冲杯咖啡', '吃块糖', '直直腰', '起立走走', '眺望远方', '闭目养神', '上个洗手间'];
function randomThing(): string {
    return thingsYouCanDo[Math.floor(Math.random() * thingsYouCanDo.length)];
}