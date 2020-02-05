import chalk from "chalk";

export class Logger {

    
    static error(str: string) {
        console.error(chalk.bold.red('[Error]: ') + str);
    }

    static command(str: string) {
        // console.log(chalk.blue.bold(str));
        console.log(chalk.cyan(str)) 
    }
}