const chalk = require('chalk');
const pkg = require('../../package.json');
const checkForUpdate = require('update-check');
import { shouldUseYarn } from "./should-use-yarn";

export async function updateCheck() {
    let update = null;
    try {
        update = await checkForUpdate(pkg);
    } catch (err) {
        // console.error(`Failed to check for updates: ${err}`);
    }
    if (update) {

        console.log();
        console.log(chalk.yellow.bold(`mini-shed 的最新版本为 ${update.latest}。`));
        console.log(
            '您可调用此命令更新: ' +
            chalk.cyan(
                shouldUseYarn()
                    ? 'yarn global add @shed/cli'
                    : 'npm i -g @shed/cli'
            )
        );
        console.log();
    }
}