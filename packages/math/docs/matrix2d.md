# Matrix2D

Matrix2D 可以看作是一个 3 * 3 矩阵，只是在内部省略了最后一行，使之运算更加高效。

```
|  a   c   tx |
|  b   d   ty |
|  0   0   1  |  <-- 省略
```

矩阵变换使用矩阵后乘列向量的方式执行变换，与 glsl 里顺序一致。

```
|  a   c   tx |      x
|  b   d   ty |  *   y
|  0   0   1  |      1
```

所以经过该矩阵变换后的新坐标为

```
x' = ax + cy + tx
y' = bx + dy + ty
```

## 创建

```
let m = new Matrix2D();
```

构造函数为

- constructor(a: number = 1, b: number = 0, c: number = 0, d: number = 1, tx: number = 0, ty: number = 0)

## 属性


### determinant

返回 2x2 矩阵行列式 `ad - bc`

```
let a = new Matrix2D( 1, 2, 3, 4, 5, 6)

console.log(a.determinant) // -2
```

## 方法

### identity(): this

归一化

```
1  0  0
0  1  0
0  0  1
```

### scale(sx: number , sy: number = sx): this

添加一个缩放

```
        sx  0   0     
this =  0   sy  0  *  this
        0   0   1
```

### rotate(angle: number): this

添加一个旋转

```
         cos -sin  0
this  =  sin  cos  0  *  this 
          0    0   1
```

旋转30度

```
let a = new Matrix2D().rotate(30);
```

### translate(x: number, y: number): this

添加一个移动

```
        1 0 tx
this =  0 1 ty  *  this 
        0 0 1
```

### fromSRT(scaleX: number = 1, scaleY: number = 1, angle: number = 0, tx: number = 0, ty: number = 0): this

高效的创建一个SRT矩阵，顺序执行 `scale` -> `rotate` -> `translate`

相当于下边代码，但速度快很多

```
let m: Matrix2D = new Matrix2D(); m.scale(scaleX, scaleY); m.rotate(angle); m.translate(tx, ty); return m;
```

### fromScale

创建一个缩放矩阵

```
let scale = new Matrix2D().fromScale(2, 3);
```

### fromRotation

创建一个旋转矩阵

```
let rotate = new Matrix2D().fromRotation(128);
```

### fromTranslation

创建一个移动矩阵

```
let translate = new Matrix2D().fromTranslation(7, 8);
```

### prepend(m: Matrix2D): this
### multiply(m: Matrix2D): this

`prepend` 与 `multiply` 是同一个方法。

乘以一个矩阵，相当于在此变换矩阵之前增加一个变换

```
this = this * m
```

因为变换的顺序是从右到左的，所以如果你需要在此变换之后添加一个变换，应该用下边的 append 方法

append 与 prepend 只是结合矩阵的顺序不同

```
let a = new Matrix2D().fromSRT(2, 3, 4, 5, 6); 
let b = new Matrix2D().fromSRT(9, 8, 7, 6, 5);

// 以下两个矩阵是相同的 
a.clone().append(b) 
b.clone().prepend(a);
```

### append(m: Matrix2D): this

前乘一个矩阵，相当于在此变换矩阵之后增加一个变换

```
this = m * this
```

### invert(): this

转换为取逆矩阵。

矩阵乘以其逆矩阵等于 identity矩阵

```
 let a = new Matrix2D().rotate(113).translate(3, 5).scale(7, 8);
 let inverseA = a.clone().invert();

 expect(a.multiply(inverseA).equal(new Matrix2D())).toBeTruthy();

```

### transformPoint(p: Vector2D): this

用此矩阵转换一个Vector2D表示的点，参数点`p`会被修改

```

    |  a   c   tx |     x
p = |  b   d   ty |  *  y
    |  0   0   1  |     1

```

### transformVector(v: Vector2D): this

用此矩阵转换一个向量(仅方向，不包含平移)，参数 `v` 会被修改

```
     |  a   c   tx |     x
v =  |  b   d   ty |  *  y
     |  0   0   1  |     0
```
### toFloat32Array(out: Float32Array | Array<number>): Float32Array | Array<number>

填充 `out` 数组并返回，数组应为长度 `9` 的 `Float32Array` 或 `Array<number>`

```
    let temp = new Float32Array(9);
    a.toArray(temp);
    expect(temp).toEqual(new Float32Array([1, 2, 0, 3, 4, 0, 5, 6, 1]));
```

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
