


<p align="center"><img width="404" src="logo.png" alt="mini-shed 小游戏，小框架"></a></p>
<h3 align="center">一个开放，模块化，数据驱动，前端友好的小游戏框架（实验中）</h3> 

---
 
<!-- # mini-shed -->



<!-- 迷你屋是一个开放，高效的小游戏框架 -->

<!-- ## Table of Contents

- [koa-jwt](#koa-jwt)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Install](#install)
  - [Usage](#usage)
    - [Retrieving the token](#retrieving-the-token)
    - [Passing the secret](#passing-the-secret)
    - [Checking if the token is revoked](#checking-if-the-token-is-revoked)
  - [Example](#example)
  - [Token Verification Exceptions](#token-verification-exceptions)
  - [Related Modules](#related-modules)
  - [Tests](#tests)
  - [Author](#author)
  - [Credits](#credits)
  - [Contributors](#contributors)
  - [License](#license) -->

<!-- ## 简介

`mini-shed` 是一枚高效，开放，易扩展的微信小游戏框架。 -->

> mini-shed 正在独立开发中，有建议，想帮忙，想聊天的，都欢迎来骚扰我。[[联系方式]](https://nshen.net/about)

## 特性

- 基于前端流行技术 `TypeScript` 编写，`babel` + `rollup` 构建，用组合 `npm` 包的方式开发小游戏。
- 在 `VSCode` 中开发，`Chrome`浏览器中实时刷新调试，秒编译到各个小游戏平台。
- 可发布 Web版`H5小游戏`，`微信/QQ小游戏`， `头条/抖音小游戏`，`OPPO/VIVO小游戏` 等快游戏平台。
- 迷你的`Entity-Component-System` 架构，数据驱动，简单高效，独立`System`自由组合，易于扩展。
- 没用`Adapter库`，原生`WebGL`高速渲染，跨小游戏平台统一API，专注于`小且快`。

# 快速开始

## 获取最新脚手架

```
git clone https://github.com/nshen/shed.git myGame

```

## 然后进入目录

```
cd myGame
```

## 安装 npm 依赖

```
npm install
```

## 简单一条命令即可编译出小游戏

```
npm run build
```

## 打开微信小游戏开发工具，导入游戏，选择 `dist` 子目录即可

![create mini game](./create_minigame.png)

# 迷你ECS架构

Entity Component System 是一个经典架构，`Shed.js` 根据JS语言特性实现了这个迷你版本

## Component

`Component` **只有数据，没有方法。**  例如一个 `transform` 组件只是一个含 `type` 属性的 `Object` 。

```typescript
  { type: 'transform', x: 0, y: 0, rotation: 180 }
```

## Entity


`Entity` 仅是一个有唯一 `id` 的**容器**，并且保存了一个 `Components` 表。

例如一个添加了 `transform 组件` 与 `render 组件` 的 `Entity` **可以想象成** ：

```typescript
let entity = {
    id: 'Entity121',
    components: {
        'transform': { type: 'transform', x: 0, y: 0, rotation: 180 },
        'render': { image:'sprite.png' }
    }
}
```

## System

System **只有方法，不存数据。** 以下是一个自定义 `System` 的写法

```typescript

import { System } from "@shed/ecs";

export class EmptySystem extends System {

    update() {

        // write you code here
    }
}

```

一个 `System` 通常关注和操作一组指定类型的 `Entities`

例如一个 `RenderSystem` 就应该只关注同时含有 `render` 与 `transform` 组件的 `Entities`。

确实 [@shed/render-system](https://github.com/nshen/shed-render-system) 就是这么做的。

这里可以看到，一个 `System` 可以发布成一个独立的 `npm包`。开发游戏时可以像拼插乐高一样按需安装系统。

`npm install shed-xxx-system`

这就是这个系统容易扩展的地方，更多信息请查看 [@shed/ecs](https://github.com/nshen/shed-ecs) 主页




# 生态系统

## 每个游戏都需要的核心库

| Project | Status | Description |
|---------|--------|-------------|
| [@shed/ecs]      | [![shed-ecs-status]][@shed/ecs-package]   | 迷你 `Entity-Component-System` 系统 |
| [@shed/math]     | [![shed-math-status]][@shed/math-package] | Matrix，Vector 等数学支持库 |
| [@shed/gl]       | [![shed-gl-status]][@shed/gl-package]     | 让 `Webgl API` 更简洁的帮助库 |



[@shed/ecs]: https://github.com/nshen/shed-ecs
[@shed/math]: https://github.com/nshen/shed-math
[@shed/gl]:  https://github.com/nshen/shed-gl

[shed-ecs-status]: https://img.shields.io/npm/v/@shed/ecs.svg
[shed-math-status]: https://img.shields.io/npm/v/@shed/math.svg
[shed-gl-status]: https://img.shields.io/npm/v/@shed/gl.svg

[@shed/ecs-package]: https://www.npmjs.com/package/@shed/ecs
[@shed/math-package]: https://www.npmjs.com/package/@shed/math
[@shed/gl-package]: https://www.npmjs.com/package/@shed/gl

## Systems

| Project | Status | Description |
|---------|--------|-------------|
| [@shed/render-system]      | [![@shed/render-system-status]][@shed/render-system-package]   | 高效的 2D Batching 渲染系统 |

[@shed/render-system]: https://github.com/nshen/shed-render-system
[@shed/render-system-status]: https://img.shields.io/npm/v/@shed/render-system.svg
[@shed/render-system-package]: https://www.npmjs.com/package/@shed/render-system

目前 `System` 生态比较贫乏，期待你的加入。