# ProjectMatrix 

提供各种形式的投影矩阵

## 2D投影矩阵

2D投影矩阵都忽略了`Z`轴，只确保 `X` , `Y` 坐标正确，通常用于投影到 `Canvas` 的宽高

### center2D(width: number, height: number, flipY: boolean = true): Matrix2D

中心为原点的投影矩阵，如果 `flipY` 为 `false` 则 `y轴` 向上为正，并且 rotation 逆时针为正。

### topleft2D(width: number, height: number, flipY: boolean = true): Matrix2D

左上角为原点的投影矩阵，如果 `flipY` 为 `false` 则 `y轴` 向上为正，并且 rotation 逆时针为正。

## 3D 投影矩阵

常见3D形式投影矩阵，分为透视( perspectiveXXX )与正交( orthoXXX )

>参考推导: 
>http://www.songho.ca/opengl/gl_projectionmatrix.html

### perspectiveOffCenterRH(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number): Matrix3D 

### perspectiveRH(width: number, height: number, zNear: number, zFar: number): Matrix3D 

### perspectiveFieldOfViewRH(fieldOfViewY: number, aspectRatio: number, zNear: number, zFar: number): Matrix3D 

### orthoOffCenterRH(left: number, right: number, bottom: number, top: number, zNear: number, zFar: number): Matrix3D 

### orthoRH(width: number, height: number, zNear: number, zFar: number): Matrix3D