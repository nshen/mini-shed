# @shed/cli

:hammer: `mini-shed` 主要的命令行工具，用来创建，编译小游戏，还提供一些辅助功能。

## 安装

由于是命令行工具，需要全局安装

```bash
npm install -g @shed/cli
```
或使用 `yarn`

```bash
yarn global add @shed/cli
```

安装完成后，在命令行中调用 `shed` 命令，如果有提示则表示安装成功。

```bash
shed -h  # -h显示所有命令的 help 信息
```

## 用法

通常为 `shed` + `命令` + `--参数` 的方式使用命令行

### 创建一个新游戏

```bash
> shed create myGame  # 在当前目录下创建一个新游戏叫做 `myGame`
```
进入 `myGame` 目录，安装依赖

```bash
> cd myGame
> npm install # 或者 yarn install
```

进入开发模式，实时编译，web预览

```bash
> shed build h5 --watch
```

`--watch` 参数可以实时监视代码修改，实时编译。

还可以加 `--debug` 参数，会生成 `sourcemap` ，并且不会压缩代码， 方便调试。

### 编译到小游戏平台

```bash
> shed build wx   # 微信小游戏
> shed build qq   # 手Q小游戏
> shed build tt   # 头条小游戏
> shed build oppo # oppo小游戏
> shed build h5   # web网页版本
```

通常调用后会发布到一个独立**文件夹**下，打开对应的**开发者工具**导入该**文件夹**，根据需要修改对应平台的参数。

### 创建一个 `spritesheet`

此命令需要提前安装 `ImageMagick 6.X`

命令为 `shed + spritesheet + 文件夹`

```bash
> shed spritesheet ./images   #将./images目录下所有图片打包成一个 spritesheet
```

### fnt 格式转 json

命令 `shed + fnt + 文件名`  可将fnt格式转换成 `mini-shed` 支持的 `json` 格式

```bash
shed fnt ./myfont.fnt  # 将./myfont.fnt 转换成 ./myfont.json
```
### 显示帮助信息

```bash
shed -h
```

## 小游戏平台文档

OPPO https://open.oppomobile.com/wiki/doc#id=10516


## Contributors

* [nshen](https://github.com/nshen)

## License

[The MIT License](http://opensource.org/licenses/MIT)


Build
快应用 https://doc.quickapp.cn/framework/manifest.html

