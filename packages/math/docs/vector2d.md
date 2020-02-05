# Vector2D

## static 属性

只读属性，分别返回 X 轴， Y 轴
- X_AXIS
- Y_AXIS

## static 方法

### `Lerp(v1: Vector2D, v2: Vector2D, t: number = 0, out?: Vector2D): Vector2D`

两点间线性插值 t 为 0 ~ 1 之间的小数，为 0 则结果等于 v1，为 1 则结果等于 v2

out 省略则返回一个新创建的 Vector2D

### Random(scale: number = 1, out?: Vector2D): Vector2D

返回一个指定长度的随机方向向量

* @param scale 向量长度，默认为1
* @param out 省略则返回一个新创建的 Vector2D 否则复制到 out 向量

### AngleBetween(v1: Vector2D, v2: Vector2D): number

取得两向量之间夹角的弧度值，逆时针为正

### fromPolar(len: number, radians: number, out?: Vector2D): Vector2D

极坐标转换为笛卡尔坐标 

* @param {number} len 半径长度
* @param {number} radians 弧度值

## Getter / Setter 属性

### get length(): number
### set length(value: number)

向量长度

### get lengthSquared(): number

向量长度的平方

## 方法

### isZero(): boolean

是否为0向量

### add(v: Vector2D): this

向量相加

this = this + v

### sub(v: Vector2D): this
### minus(v: Vector2D): this

向量相减

this = this - v

### multiply(v: Vector2D): this

向量相乘

this = this x v 

### divide(v: Vector2D): this 

向量相除

this  = this / v

### closeTo(v: Vector2D, tolerance: number = 0.0001): boolean

是否接近向量v

### scale(s: number): this 

向量缩放

### scaleAbout(point: Vector2D, sx: number, sy: number): this 

基于某个点缩放

### scaleAndAdd(v: Vector2D, scale: number): this

与缩放过的v相加

this = v * v.scale();

### distanceTo(p2: Vector2D): number

返回从此点到p2点之间的距离

### squaredDistanceTo(p2: Vector2D): number 

 此点到p2距离的平方

### negate(): this

取负

### normalize(): this 

转为单位向量,数学上经常在向量上加个小帽子^表示

### dot(v: Vector2D): number

点乘 结果等于 |a||b|cos夹角

点乘的性质:

- a点乘b == 0 ，两向量垂直
- a点乘b > 0 ，同向（夹角小于90度）
- a点乘b < 0 ,反向（夹角大于90度）
- a点乘b ==  length(a) * length(b)，共线且同向 (如果a与b都为单位向量则等于 +1)
- a点乘b == -length(a) * length(b) ,共线且逆向（如果a与b都为单位向量则等于 -1）
- a点乘a == a长度的平

### cross(v: Vector2D): number

2d叉乘并不常见，与3d不同，结果是一个数值，相当于3d叉乘的z轴

```
// --------------------2d cross--------------------------//

// http://allenchou.net/2013/07/cross-product-of-2d-vectors/

// the sign of the cross product of 2D vectors tells you whether the second vector is on the left or right side of the first vector .

float cross(const Vec2 &a, const Vec2 &b)
{
    Vec3 v1(a.x, a.y, 0.0f);
    Vec3 v2(b.x, b.y, 0.0f);

    return cross(v1, v2).z;
}
```

### leftHandNormal(): this 

返回左垂直向量 , 注意返回的并不是单位向量

### rightHandNormal(): this

返回右垂直向量 , 注意返回的并不是单位向量

### fromPolar(r: number, radians: number): this

将极坐标转为笛卡尔坐标

@param r 半径长度
@param radians 弧度值 ,逆时针正角度

### toPolar(): { r: number; radians: number }

将此向量转为极坐标输出

### clampMax(max: number): this

按最大长度夹断 

### rotate(radians: number): this

@param {number} radians 弧度值

绕原点旋转一个角度 ，逆时针为正

```
// （矩阵乘法） 

|cos  -sin  0|      x
|sin   cos  0|  *   y
| 0     0   1|      1
```

### rotateAbout(radians: number, point: Vector2D): this

@param {number} radians 弧度值表示的角度

绕某个点旋转

### rotateByVector(v: Vector2D): this

旋转一个向量表示的角度，与rotate方法类似，但节省了计算sin/cos所以效率更高要注意如果v非单位向量则旋转后向量长度会改变

### projectOntoV(v: Vector2D): this

取得此向量在v向量上投影后的向量

```
      /|
this / | 
    /  |
  |----|----  v
   ProjV
```
算法：

```
    |a||b|cos
   ----------- b
      |b|^2
```

### projectOntoPerpV(v: Vector2D): this

取得此向量在v法线上投影后的向量

```
      /|
this / | PerpV
    /  |
   --------
       v
```

算法啊类似：

``` typescript
var v:Vector2D = this.getProjV(v);
return this.subtract(v,result)
```

### reflect(n: Vector2D): this

根据入射角 = 反射角理论，计算此向量经过法向量n反射后的向量

```
  tail\  |  / head
       \ |n/
   head \|/ tail
    ------------
```

`v = u - 2(u.n)n`


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
