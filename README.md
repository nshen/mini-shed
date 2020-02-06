


<p align="center"><img width="404" src="logo.png" alt="mini-shed 小游戏，小框架"></a></p>
<h3 align="center">一个开放，模块化，数据驱动，前端友好的小游戏框架（实验中）</h3> 

---
 

> mini-shed 目前版本 v0.2，龟速独立开发中，有建议，想参与，想聊天的欢迎来[骚扰](https://nshen.net/about)。

## 特性

- 基于前端流行技术 `TypeScript` 编写，`babel` + `rollup` 构建，用组合 `npm` 包的方式开发小游戏。
- 在 `VSCode` 中开发，`Chrome`浏览器中实时刷新调试，秒编译到各个小游戏平台。
- 可发布 Web版`H5小游戏`，`微信/QQ小游戏`， `头条/抖音小游戏`，`OPPO/VIVO小游戏` 等快游戏平台。
- `Entity-Component-System` 架构，数据驱动，简单高效，独立`System`自由组合，易于扩展。
- 专注于小且快，没用`Adapter库`，原生`WebGL`渲染，跨小游戏平台统一API。

## 快速开始

### 安装 `@shed/cli` 命令行工具

迷你屋使用 `@shed/cli` 来创建，编译小游戏。

- 用 npm 安装

```bash
npm install -g @shed/cli

# 网络环境不好可安装淘宝镜像 cnpm，之后所有 npm 命令都用 cnpm 代替
npm install -g cnpm --registry=https://registry.npm.taobao.org
cnpm install -g @shed/cli
```

- 或用 yarn 安装

```bash
yarn global add @shed/cli
```

打开命令行输入 `shed` 回车，如果安装成功会有提示信息。

### 创建一个新的小游戏

```bash
> shed create myGame  # 在当前目录下创建一个新游戏叫做 `myGame`
```
进入 `myGame` 目录，安装依赖

```bash
> cd myGame
> npm install # 或者 yarn install 
```

### 实时编译Web预览

在 `myGame` 目录中运行

```bash
> shed build h5 --watch
```

其他命令见 [@shed/cli](./packages/cli) 文档页

## 项目结构

整个项目是在 [Lerna](https://lerna.js.org/) 管理下的 monorepo。

mini-shed 中的包是标准的 npm 包，可按需组合，并不局限在下边的包，可自行扩展。

#### 常用包

| Package | Status | Description |
|---------|--------|-------------|
| [@shed/cli]      | [![shed-cli-status]][@shed/cli-package]   | 命令行工具，主要用来创建，编译小游戏，还提供一些辅助功能 |
| [@shed/ecs]      | [![shed-ecs-status]][@shed/ecs-package]   | 开放的 `Entity-Component-System` 系统实现 |
| [@shed/math]     | [![shed-math-status]][@shed/math-package] | 数学支持库 Matrix，Vector 等|
| [@shed/gl]       | [![shed-gl-status]][@shed/gl-package]     | 使`WebGL API` 简化的面向对象包装 |
| [@shed/platform] | [![shed-platform-status]][@shed/platform-package] | 以微信小游戏为基准，统一各小游戏平台提供的`API`，并 `Promise` 化 |
| [@shed/utils]    | [![shed-utils-status]][@shed/utils-package] |  一些实用类或函数 |

#### 新包模板

创建一个新包可以基于此修改

| Package | Status | Description |
|---------|--------|-------------|
| [@shed/new-package]  | [![shed-new-package-status]][@shed/new-package-package] | 一个配置好`typescript`, `babel`, `rollup` 的模板包 |

#### Systems

`Entity Component System` 中的 `System` 可以独立成一个 `npm` 包存在，使得非常容易扩展。

| Project | Status | Description |
|---------|--------|-------------|
| [@shed/render2d-system]      | [![@shed/render2d-system-status]][@shed/render2d-system-package]   | 2d渲染系统，它会尽量把所有 Entity 打包在一起一次渲染 |


[@shed/render2d-system]: ./packages/render2d-system
[@shed/render2d-system-status]: https://img.shields.io/npm/v/@shed/render2d-system.svg
[@shed/render2d-system-package]: https://www.npmjs.com/package/@shed/render2d-system

#### 默认demo包

| Package | Description |
|---------| ------------|
| [@shed/starter] | 使用`shed create` 命令创建的默认demo |

[@shed/cli]: ./packages/cli
[@shed/ecs]: ./packages/ecs
[@shed/math]: ./packages/math
[@shed/gl]: ./packages/gl
[@shed/platform]: ./packages/platform
[@shed/utils]: ./packages/utils
[@shed/starter]: ./packages/starter
[@shed/new-package]: ./packages/new-package

[shed-cli-status]: https://img.shields.io/npm/v/@shed/cli.svg
[shed-ecs-status]: https://img.shields.io/npm/v/@shed/ecs.svg
[shed-math-status]: https://img.shields.io/npm/v/@shed/math.svg
[shed-gl-status]: https://img.shields.io/npm/v/@shed/gl.svg
[shed-platform-status]: https://img.shields.io/npm/v/@shed/platform.svg
[shed-utils-status]: https://img.shields.io/npm/v/@shed/utils.svg
[shed-starter-status]: https://img.shields.io/npm/v/@shed/starter.svg
[shed-new-package-status]: https://img.shields.io/npm/v/@shed/new-package.svg

[@shed/cli-package]: https://www.npmjs.com/package/@shed/cli
[@shed/ecs-package]: https://www.npmjs.com/package/@shed/ecs
[@shed/math-package]: https://www.npmjs.com/package/@shed/math
[@shed/gl-package]: https://www.npmjs.com/package/@shed/gl
[@shed/platform-package]: https://www.npmjs.com/package/@shed/platform
[@shed/utils-package]: https://www.npmjs.com/package/@shed/utils
[@shed/starter-package]: https://www.npmjs.com/package/@shed/starter
[@shed/new-package-package]: https://www.npmjs.com/package/@shed/new-package



## `.github` 文件夹

.github 文件夹内是 github actions ，用于发布`@shed/starter` 到国内镜像

### 触发

每次`push`源代码到 `github` 时，会触发此流程

### 发布 starter 

`github actions`会自动把 `/packages/starter` 目录 ，强推到 `coding.net` 和 `gitee.com` 以下项目地址

- https://shed.coding.net/p/mini-shed-starter
- https://gitee.com/nshen/mini-shed-starter

使用`@shed/cli`命令行创建游戏时，实际上是从上边的地址clone下来的

```bash
shed create myGame 
# 实际相当于 
# git clone https://e.coding.net/shed/mini-shed-starter.git myGame
```

## Contributors

* [nshen](https://github.com/nshen)

## License

[The MIT License](http://opensource.org/licenses/MIT)
