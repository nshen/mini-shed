import * as fs from "fs-extra";
import { Logger } from "../helpers/log";
import path from 'path';
import chalk from "chalk";

const clone = require('git-clone');
const ora = require('ora');


let repositories: { [key: string]: string; } = {
    'coding': 'https://e.coding.net/shed/mini-shed-starter.git',
    'gitee': 'https://gitee.com/nshen/mini-shed-starter.git',
};

let spinner: any;

export async function create(name: string, r: string = 'coding') {

    r = r.toLowerCase();
    let repo = repositories[r];
    if (!repo) {
        Logger.error(r + `不存在，请尝试指定 ${chalk.cyan('gitee')} 或 ${chalk.cyan('coding')}`);
        return;
    }

    let exists = await fs.pathExists(`./${name}`);
    if (exists) {
        Logger.error(`"${name}" 已经存在，请使用不存在的目录名`);
        return;
    }

    spinner = ora(`正在从 ${chalk.cyan(r)} 下载最新脚手架，请${randomThing()}稍等一下`).start();

    clone(repo, name, async (err: any) => {
        if (err) {
            spinner.fail(`下载失败，请检查网络并重试。`);
            spinner.fail(`从 ${chalk.cyan(r)} 下载失败，请检查网络，或尝试 shed create ${name} ${r === 'github' ? 'coding' : 'github'}`);
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
        spinner.succeed(`成功在 ${path.join(process.cwd(), name)} 中创建了 ${chalk.cyan(name)} 项目！`);
        console.log('在这个目录中，你可以调用以下命令：');
        console.log();
        console.log(chalk.cyan('  shed '));
        console.log();
        console.log(`建议你现在输入：`);
        console.log(chalk.cyan(`  cd ${name}`));
        console.log(chalk.cyan(`  npm install`));
        console.log();
        console.log('发布小游戏请使用');
        Logger.command('npm run build');
    });

}

let thingsYouCanDo: string[] = ['喝杯水', '冲杯茶', '冲杯咖啡', '吃块糖', '直直腰', '起立走走', '眺望远方', '闭目养神', '到处逛逛'];
function randomThing(): string {
    return thingsYouCanDo[Math.floor(Math.random() * thingsYouCanDo.length)];
}