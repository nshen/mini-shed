import { Context, Color } from '@shed/gl';

let canvas: HTMLCanvasElement = document.getElementById('c') as HTMLCanvasElement;
let gl = canvas.getContext('webgl');
if (gl) {
    let ctx = new Context(gl);
    // 随机背景色
    ctx.clearColor = Color.random();
    ctx.clear();

} else {
    console.log('no webgl support');
}
