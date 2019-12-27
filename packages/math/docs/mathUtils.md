# MathUtils 

提供数学常用函数，与常量。

## 常数

### Deg2Rad

乘以 `Deg2Rad(degrees to radians)` 将角度转为弧度

### Rad2Deg

乘以 `Rad2Deg(radians to degrees)` 将弧度转为角度

### Epsilon

最小值 `Epsilon: number = 1.0e-7;`

## 实用函数

### floatEqual(float1: number, float2: number, diff: number = 5.0e-7): boolean

返回两个浮点数是否相等

### clamp(value: number, min: number, max: number): number 

确保 `value` 不小于 `min` 并且不大于 `max`

### angleNormalize(angle:number):number

将角度转为 `[0,360)` 表示，例如 `normalizeAngle(-365)` 等于 `355`。

### mod(x: number, m: number) 

### approach(goal:number, current:number , dt:number)

平滑移动函数 [Math for Game Developers - Smooth Move(ment) (Linear Interpolation)](https://www.youtube.com/watch?v=qJq7I2DLGzI&list=PLW3Zl3wyJwWOpdhYedlD-yCB7WQoHf-My&index=12) 
