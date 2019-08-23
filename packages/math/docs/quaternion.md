# Quaternion

任意一个角位移都有两个四元数的表示法，即 q 和 -q。

w 的绝对值越接近 1 表示没有旋转

## constructor

```
public x: number = 0, 
public y: number = 0, 
public z: number = 0, 
public w: number = 1
```

## identity


## lengthSquared

应该永远返回1，因为我们使用单位四元数

## length

应该永远返回1，因为我们使用单位四元数

## dot

点乘与Vector类似，结果是一个标量，单位四元数点乘的结果范围为 −1 ≤ a · b ≤ 1

the quaternion dot product gives the cosine of half of the
angle needed to rotate one quaternion into the other

If q1 • q2 is close to 1 (assuming that they're normalized), then they apply very similar rotations. Also, since we know that the negation of a quaternion performs the same rotation as the original, if the dot product is close to −1, the two still apply very similar rotations.

## conjugate() / invert()

conjugate() 为反转向量部分

`q∗ = [w v]* = [w −v]`

由于是单位四元数 invert() 与 conjugate() 返回值相同



```
/**
 * rotation quaternions are all unit quaternions
 * so the conjugate and inverse are equivalent
 */
```

## rotateX / rotateY / rotateZ

## append / prepend / multiply

四元数乘法又叫 `Hamilton product` , 与矩阵乘法类似，乘法顺序不可交换， 单位四元数与单位四元数相乘后结果仍然是单位四元数。

## rotateVector

p′ = qpq^−1

## 转换

fromAxisAngle / toAxisAngle

//-----------------

cos(θ/2) sin(θ/2)nˆ,

// <https://www.3dgep.com/understanding-quaternions/>

# Slerp

<http://allenchou.net/2018/05/game-math-deriving-the-slerp-formula/>

https://github.com/mrdoob/three.js/blob/dev/src/math/Quaternion.js
