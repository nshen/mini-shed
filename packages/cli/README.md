## install

`npm i -g @shed/cli`


Commands:

```bash
  create|c [options] <name>  创建一个新的小游戏
  spritesheet|s <folder>     创建一个Spritesheet ( 需要安装ImageMagick 6.X )
  fnt <file>                 将fnt格式，转换成 shed.js 支持的json格式
```

Examples:

```bash
  $ shed create newGame          # 在当前目录下创建一个新的小游戏 newGame
  $ shed spritesheet ./images    # 将./images目录下所有图片打包成一个 spritesheet
  $ shed fnt ./myfont.fnt        # 将./myfont.fnt 转换成 ./myfont.json
```

### ImageMagic 6.x 下载

https://legacy.imagemagick.org/


## Build


快应用
https://doc.quickapp.cn/framework/manifest.html

OPPO

https://open.oppomobile.com/wiki/doc#id=10516