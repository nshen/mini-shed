// shebang line
const chalk = require('chalk');
const figlet = require('figlet');
const program = require('commander');

import { create, createSpritesheet, fnt, build, BuildPlatformType } from './commands';

program
    .command('create <name>')
    .alias('c')
    .description('创建一个新的小游戏') // command description
    .option('-r, --remote [value]', '指定从coding下载还是从github下载，默认为coding', "coding") // args.sugar = value, optional, default is 'Low'
    .action(function (name: any, options: any) {
        // console.log(options.remote)
        create(name, options.remote);
    });

program
    .command('build <platform>')
    .alias('b')
    .description('编译到小游戏平台')
    .option('-d, --debug', '输出额外的debug信息')
    .option('-w, --watch', '')
    .action(function (platform: BuildPlatformType, options: any) {

        build(platform, options.debug);

    });

program
    .command('spritesheet <folder>')
    .alias('s')
    .description('创建一个Spritesheet ( 需要安装ImageMagick 6.X )')
    .action(function (folder: any, options: any) {
        createSpritesheet(folder);
    });

program
    .command('fnt <file>')
    .description('将fnt格式，转换成 shed.js 支持的json格式')
    .action(function (file: any) {
        fnt(file);
    });

// 自定义帮助
program.on('--help', function () {
    console.log('');
    console.log('Examples:');

    console.log('  $ shed create newGame          在当前目录下创建一个新的小游戏 newGame');
    console.log('  $ shed spritesheet ./images    将./images目录下所有图片打包成一个 spritesheet');
    console.log('  $ shed fnt ./myfont.fnt    将./myfont.fnt 转换成 ./myfont.json');
});

// allow commander to parse `process.argv`
program.parse(process.argv);

if (process.argv.length <= 2) {

    console.log(chalk.red(figlet.textSync('mini-shed', { horizontalLayout: 'full' })));
    console.log('感谢尝试 mini-shed 小游戏框架 < https://github.com/nshen/mini-shed >');
    // console.log('https://github.com/nshen/mini-shed/issues');
    console.log('有任何问题请入QQ群：431085380');
    console.log('shed -h 可显示更多帮助信息');
    console.log('--------------------------\n');

    // program.help();
} else {
    // clear();
    // console.log(process.argv);
}
