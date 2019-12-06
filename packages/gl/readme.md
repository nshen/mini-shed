# @shed/gl

`@shed/gl` 是 WebGL 的包装与抽象，用以简化 `WebGL API` 使用

## Context

取得一个WebGL上下文：

```typescript
let canvas = document.getElementById('Canvas'); 
let gl = canvas.getContext('webgl');
if(!gl){
    console.log('你的浏览器不支持WebGL');
}
let ctx = new Context(gl);
```
之后就可以调用`Context`的方法了

```typescript
let ctx = new Context(gl);
// 用随机背景色清空画布
ctx.clearColor = Color.random();
ctx.clear();

```

## Program

Vertex Shader

```glsl
let vs = `
attribute vec3 aVertexPosition;
void main(void) {
    gl_Position = vec4(aVertexPosition, 1.0); 
    gl_PointSize = 4.0;
}`;
```

Fragment Shader

```glsl
let fs = `
precision highp float;
void main(void) {
    gl_FragColor = vec4(0.2,0.5,0.5, 1.0);
}`;
```

创建一个 `Program` 并绑定到当前上下文

```typescript
program = new Program(ctx, vs, fs).bind();
```

## Attributes and Uniforms 

`Uniforms` 和 `Attributes` 都是输入到 `Shader` 中的数据。

- Uniforms 在所有顶点中都相同
- Attributes 通常在每个顶点中都不同

由于 Uniforms 在所有顶点上都相同，所以应该直接设置在Program上

```
program.uXXX(...)
```

Attributes 则应该设置在 `VertexBuffer` 上，让其每个顶点都不同




## VertexBuffer

向显存中上传Buffer是非常慢的，所以最好是一次上传一个大的buffer，而不应该上传很多buffer。

多个buffer

| x ,y |
|size|
| r , g , b|

不如上传

| x,y,size,r,g,b |

这种叫做 Interleaved Buffer

## IndexBuffer



## Texture


## DrawCall

Draw calls can be the most expensive call.