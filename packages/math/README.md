# @shed/math

`@shed/math`  尝试兼顾效率与 API 易用性数学库


## 文档

- 2D相关

    - [Vector2D](./docs/vector2d.md)
    - [Matrix2D](./docs/matrix2d.md)

- 3D相关

    - [Vector3D]   施工中
    - [Matrix3D]   施工中
    - [Quaternion] 施工中

- 其他
 
    - [ProjectMatirx](./docs/projectMatrix.md)
    - [MathUtils](./docs/mathUtils.md)

- 通用方法

    以上类通过实现 `ICommonMethod<T>` 接口，都实现了以下通用方法。

    - `reset()`    重新赋值
    - `equal()`    判断是否相等
    - `copyFrom()` 从目标复制
    - `clone()`    克隆一个新对象
    - `toString()` 返回字符串表示