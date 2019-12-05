import { Context, Program, Color, VertexBuffer, IndexBuffer } from '../../';
import { vs, fs } from "./shaders";

// https://www.tutorialspoint.com/webgl/webgl_modes_of_drawing


var vertices = [
    -0.7,-0.1,0,
    -0.3,0.6,0,
    -0.3,-0.3,0,
    0.2,0.6,0,
    0.3,-0.3,0,
    0.7,0.6,0 
 ]

//--------------------------

let canvas: HTMLCanvasElement = document.getElementById('c') as HTMLCanvasElement;
let gl = canvas.getContext('webgl');


let ctx: Context;
let shader: Program;
let vb: VertexBuffer;
// let ib: IndexBuffer;

if (gl) {

    ctx = new Context(gl);
    ctx.clearColor = Color.WHITE;
    shader = new Program(ctx, vs, fs).bind();

    vb = new VertexBuffer(ctx)
    vb.setData(new Float32Array(vertices), false)
    vb.addAttribute(shader.getAttributeLocation('aVertexPosition'), 3);

    // ib = new IndexBuffer(ctx);
    // ib.setData(new Uint16Array(indices));

    render()

} else {
    console.log('no webgl support');
}

function render() {
    requestAnimationFrame(render)
    ctx.clear();
    ctx.adjustSize();
    vb.bindAttributes();

    // 如果需要indexbuffer则
    // ib.bind();
    // ctx.drawElementsTriangle(ib.length, 0)
    // ctx.drawElements(ctx.LINES,ib.length,0)


    // 各种render模式
    // ctx.drawArrays(ctx.LINES,6);
    // ctx.drawArrays(ctx.LINE_STRIP,6);
    // ctx.drawArrays(ctx.LINE_LOOP,6);
    // ctx.drawArrays(ctx.TRIANGLES,6)
    // ctx.drawArrays(ctx.TRIANGLE_FAN,6);
    ctx.drawArrays(ctx.TRIANGLE_STRIP,6);



}





