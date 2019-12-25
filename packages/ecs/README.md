# @shed/ecs

精简高效的 Entity-Component-System 实现，为小游戏设计。

## 安装

`npm install @shed/ecs`

## ECS

`this._ecs = new ECS();`

整个系统核心，添加删除Entity，添加System，取得过滤Entity的Group等方法都在这里。

## Entity

创建 Entity使用 `ecs.createEntity()`，添加进系统 `ecs.addEntity()` 

或一步达成 `ecs.addNewEntity()`

Entity 包含一系列的 Component

## Component

Component 只包含数据，没有方法，因此非常简单，它只是包含`type`属性的普通`JS Object`。

例如 transform 组件：

``` typescript
{ type: 'transform', x: 0, y: 0, width: 80, height: 80 }
```

因此创建一个 Entity 并且添加3个 Component 只需

```typescript
  this._player = this._ecs.createAndAddEntity('player',
    { type: 'render', image: 'images/player.png'},
    { type: 'transform', x: 0, y: 0, width: 80, height: 80 },
    { type: 'player' }
  )
```

## System

通常一个System就是继承 `System` 类，并实现`update()`方法，当`ecs.update()`时，会依照system的添加顺序调用`update()`方法。

```typescript

export class RenderSystem extends System {

     constructor(ecs: ECS) {
        super(ecs);
     }

     update(){

     }
}
```

## Group

Group是高效的关键，不必在System里遍历所有的Entity，只需要创建需要关注Group,
然后遍历该组即可。

```typescript

export class RenderSystem extends System {

    protected _group:Group;

    constructor(ecs: ECS) {
        super(ecs);
        this._group = ecs.getGroup('render', 'transform'); 
    }

}
```

组内成员会实时更新，保持最新。


```typescript

// 关注同时包含type为 enemy，render，transform 3个Component的所有Entity
this._enemies = ecs.getGroup('enemy', 'render', 'transform');

```

保持最新也就是说，如果组内某个Entity删除了一个component, 他将不再属于这个组。

或者某个Entity直接被ECS删除掉，他同时也会从这个组中被删掉。

并且创建过的组会被ECS内部缓存，多次取也不会造成效率问题，