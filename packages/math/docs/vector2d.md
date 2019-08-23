# Vector2D

## static 属性

- X_AXIS
- Y_AXIS

## static 方法

 `Lerp(v1: Vector2D, v2: Vector2D, t: number = 0, out?: Vector2D): Vector2D`

两点间线性插值 t 为 0 ~ 1 之间的小数，为 0 则结果等于 v1，为 1 则结果等于 v2

out 省略则返回一个新创建的 Vector2D


## 其他通用方法

- `reset()`

  重新赋值

- `equal()`

  判断是否相等

- `copyFrom()`

  从目标复制

- `clone()`

  克隆一个新对象

- `toString()`

  返回字符串表示
