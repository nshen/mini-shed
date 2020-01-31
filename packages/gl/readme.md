# @shed/gl

:hammer: WebGL 的包装与抽象，用以简化 `WebGL API` 使用

## 安装

```bash
npm install @shed/gl
```
或使用 `yarn`

```bash
yarn add @shed/gl
```

## 用法

```typescript
import { Context, Color } from '@shed/gl';

let canvas = document.getElementById('myCanvas');
let gl = canvas.getContext('webgl');
if (gl) {
    // 用 Context 包装原始的 WebGLRenderingContext 对象后
    // 就可以调用Context上的方法了
    let ctx = new Context(gl);
    // 随机背景色
    ctx.clearColor = Color.random();
    ctx.clear();
} else {
    console.log('no webgl support');
}
```

## API


- [Context](#context)
- [Attributes and Uniforms](#attributes-and-uniforms)
- [Program](#program)
- [VertexBuffer](#vertexbuffer)
- [IndexBuffer](#indexbuffer)
- [Texture](#texture)
- [Color](#color)


### Context

>有待完善

### Attributes and Uniforms 

`Uniforms` 和 `Attributes` 都是输入到 `Shader` 中的数据。

- Uniforms 在所有顶点中都相同
- Attributes 通常在每个顶点中都不同

由于 Uniforms 在所有顶点上都相同，所以应该直接设置在Program上

```
program.uXXX(...)
```

Attributes 则应该设置在 `VertexBuffer` 上，让其每个顶点都不同

### Program

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

>有待完善

### VertexBuffer

向显存中上传 `Buffer` 是非常慢的，所以最好是一次上传一个大的`buffer`，而不应该上传很多小 `buffer`。

多个buffer

```
buffer1 -> | x , y |

buffer2 -> | size |

buffer3 -> | r , g , b|
```

不如一次上传

```
| x , y , size , r , g , b |
```

这种叫做 `Interleaved Buffer`, 在 `VertexBuffer` 类中很容易实现上述优化

>有待完善

### IndexBuffer

>有待完善

### Texture

>有待完善

### Color

>有待完善

## Contributors

* [nshen](https://github.com/nshen)

## License

[The MIT License](http://opensource.org/licenses/MIT)





