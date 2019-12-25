import chalk from "chalk";

export function error(str: string) {
    console.error(chalk.bold.red('Error: ' + str));
}

export function command(str: string) {
    console.log(chalk.blue.bold(str));
}