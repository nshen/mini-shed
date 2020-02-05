# @shed/render2d-system

:hammer: `@shed/ecs` 的一个 `2d渲染` 系统，它会尽量把所有 Entity 打包在一起一次渲染，使其效率最高。

## 安装

```bash
npm install @shed/render2d-system
```
或使用 `yarn`

```bash
yarn add @shed/render2d-system
```

## 用法

同其他 `System` 一样, 首先要加入到 `ecs` 中

```typescript
import { Render2DSystem, Render2DComponent } from "@shed/render2d-system";

this._ecs.addSystem(new Render2DSystem(this._ecs, this._ctx))
```

默认情况下，`Render2DSystem` 会遍历渲染所有包含 `transform` 和 `render2d` 组件的 `Entity`。

例如下边代码会渲染出一个红色方块：

```typescript
// 创建并添加一个新的 Entity
this._ecs.addNewEntity('redQuad',
    { type: 'render2d', visible: true, color: { r: 1, g: 0, b: 0, a: 1 },
    { type: 'transform', x: 0, y: 0, width: 100, height: 100, rotation: 0 },
);
```

## Component 部分

`System` 运行时会查找包含对应 `Components` 的 `Entity`，并执行相关逻辑。`Entity Component System` 的概念请参考 [@shed/ecs](../ecs/) 中相关说明。

在 `@shed/ecs` 中 `component` 只是纯粹的数据，所以是 `pure object`，类似 `{ type : 'mycomponent' }` 就可以表示为一个组件

`Render2DSystem` 只会与以下两个组件打交道

- `transform` component
- `render2d` component


### transform component

`transform` 组件用来表示物体的 位置，大小与旋转角度。

创建一个 `transform component` 只需

```javascript
let comp = { type: 'transform', x: 0, y: 0, width: 100, height: 100, rotation: 0 }
```
使用 `TypeScript` 的好处就是可以导入类型信息，如果手误打错，编辑器会提醒你

```typescript
import { TransformComponent } from "@shed/render2d-system";

let comp: TransformComponent = ...;
```

还提供了更简便方式创建一个 `TransformComponent`

```typescript
import { createTransformComponent } from "@shed/render2d-system";

let comp = createTransformComponent(0,0,1,1,0); // x = 0, y = 0, width = 1, height = 1, rotation = 0
```
不管用什么方法创建，总而言之类型是这样的

```typescript
type TransformComponent = {
    type: 'transform',
    x: number, y: number,
    width: number, height: number,
    rotation: number; // 角度值
};
```

### render2d component

`render2d component` 通常表示一个图片，或一个色块，他们的类型如下

```typescript
type Quad2D = {
    type: "render2d";
    visible: boolean;
    color: {
        r: number;
        g: number;
        b: number;
        a: number;
    };
}
```

```typescript
type Image2D = {
    type: "render2d";
    visible: boolean;
    image: {
        src: string;
        region: {
            l: number;
            r: number;
            t: number;
            b: number;
        };
        repeat: boolean;
        linear: boolean;
    };
}
```

可以直接使用，也可以泛型版本

```typescript
let img: Render2DComponent<Image2D> = ...;
```

## 分层渲染

`WebGL` 中有一个 `DrawCall` 的概念，他是影响性能的最重要的指标，`@render2d-system` 默认会尽量把所有精灵在一个 `DrawCall` 中渲染出来使其效率最高，这也是小游戏最理想的渲染方式。

但大多数时候需要将不同的物件，分层级渲染出来，例如背景图在最底层，然后敌人，然后子弹，最后放主角

```typescript
const renderSystem = new Render2DSystem(this._ecs, this._ctx, this._ecs.state.assets, true);
renderSystem.addLayer(this._ecs.getGroup('bg', 'render2d', 'transform'));
renderSystem.addLayer(this._ecs.getGroup('enemy', 'render2d', 'transform'));
renderSystem.addLayer(this._ecs.getGroup('bullet', 'render2d', 'transform'));
renderSystem.addLayer(this._ecs.getGroup('player', 'render2d', 'transform'));
```

这样分了4层，画4次，也才只有4个 `DrawCall`，效率还是非常高的。 这也就是说我们可以根据需要，尽量减少层数来优化效率。

## Contributors

* [nshen](https://github.com/nshen)

## License

[The MIT License](http://opensource.org/licenses/MIT)