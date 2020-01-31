# @shed/gl-examples

用来测试 `@shed/gl` 的包

## 最简单的代码

```typescript
import { Context, Color } from '@shed/gl';

let canvas: HTMLCanvasElement = document.getElementById('c') as HTMLCanvasElement;
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

## 例子 

目前可运行的例子有

- depthstencils
- light
- blend-map
- render-models
- phong
- test