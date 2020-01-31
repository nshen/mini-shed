# @shed/ecs

:hammer: 精简高效的 [Entity-Component-System](https://en.wikipedia.org/wiki/Entity–component–syste) 实现，为小游戏设计。

## 安装

```bash
npm install @shed/ecs
```
或使用 `yarn`

```bash
yarn add @shed/ecs
```

## 用法

`ECS` 类是整个系统核心，添加删除 `Entity`，添加`System`，取得过滤 `Entity`的 `Group` 等方法都在这里。

### ECS

创建 `ECS`

```typescript
import { ECS } from "@shed/ecs";

this._ecs = new ECS();
```

ECS 3个字母分别代表

- Entity
- Component
- System

### Entity

创建 Entity使用 

```typescript
let e: Entity = ecs.newEntity();
```

添加进系统 

```typescript
ecs.addEntity(e);
``` 

或使用 `ecs.addNewEntity()`方法 一步达成

Entity 包含一系列的 Components

### Component

Component **只包含数据， 没有方法**，因此非常简单，它只是包含 `type` 属性的普通 `JS Object`。

例如 transform 组件：

``` typescript
{ type: 'transform', x: 0, y: 0, width: 80, height: 80, rotation: 0 }
```

因此创建一个 Entity 并且添加3个 Components 只需

```typescript
this._ecs.addNewEntity('redQuad',
    { type: 'myQuad' },
    { type: 'render2d', visible: true, color: { r: 1, g: 0, b: 0, a: 1 },
    { type: 'transform', x: 0, y: 0, width: 100, height: 100, rotation: 0 },
);
```

### System

通常一个 System 就是继承 `System`，并实现 `init()` ，`update()` 等方法的类。


```typescript
import { System } from "@shed/ecs";

export class MySystem extends System {

    init() {

    }

    update() {

    }
}
```

当`ecs.update()`时，会依照 `system` 的添加顺序调用 `update()`方法。

### Group

Group是高效的关键，通常不必在 `System` 里遍历 `ECS`系统中所有的 `Entity`，只需要创建需要关注Group, 然后遍历该组即可。

```typescript

export class RenderSystem extends System {

    protected _group:Group;

    constructor(ecs: ECS) {
        super(ecs);
        this._group = ecs.getGroup('render', 'transform'); 
        // _group 中所有 Entity 都含有 render 与 transform 组件
    }

}
```

ECS 内部会使`Group` 内成员实时更新，保持最新。


```typescript

// 关注同时包含type为 enemy，render，transform 3个 Component 的所有 Entity
this._enemies = ecs.getGroup('enemy', 'render', 'transform');

```

保持最新也就是说，如果组内某个Entity删除了一个component, 他将不再属于这个组。

或者某个Entity直接被ECS删除掉，他同时也会从这个组中被删掉。

并且创建过的组会被ECS内部缓存，多次取也不会造成效率问题。