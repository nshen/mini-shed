import { Context, Color, Program, VertexBuffer, IndexBuffer } from "../../";
import * as dat from 'dat.gui'
import { perspectiveFieldOfViewRH, Matrix3D, Rad2Deg, Deg2Rad } from '@shed/math'
import { vs, fs } from "./shaders";
import { vertices, indices, normals } from './geometry'

let lastTime: number = 0;
let angle: number = 0;

let ctx: Context;
let shader: Program;
let vertexBuffer: VertexBuffer;
let normalBuffer: VertexBuffer;
let indexBuffer: IndexBuffer;
let pMatrix: Matrix3D;
let mvMatrix = new Matrix3D();

let canvas: HTMLCanvasElement = document.getElementById('c') as HTMLCanvasElement;
let gl = canvas.getContext('webgl');



if (gl) {

    ctx = new Context(gl);
    ctx.enableDepthTest();
    ctx.clearColor = Color.LIGHT_GRAY;

    shader = new Program(ctx, vs, fs);

    // lights uniforms
    shader.uVec3('uLightDirection', 0.0, -1.0, -1.0);
    shader.uVec4('uLightAmbient', 0.2, 0.2, 0.2, 1.0);
    shader.uVec4('uLightDiffuse', 0.5, 0.5, 0.5, 1.0);
    // object material for light
    shader.uVec4('uMaterialDiffuse', 0.5, 0.8, 0.1, 1.0);


    shader.bind();

    vertexBuffer = new VertexBuffer(ctx);
    vertexBuffer.setData(new Float32Array(vertices), false);
    vertexBuffer.addAttribute(shader.getAttributeLocation('aVertexPosition'), 3);

    normalBuffer = new VertexBuffer(ctx);
    normalBuffer.setData(new Float32Array(normals), false);
    normalBuffer.addAttribute(shader.getAttributeLocation('aVertexNormal'), 3);

    indexBuffer = new IndexBuffer(ctx);
    indexBuffer.setData(new Uint16Array(indices));


    loop()


} else {
    console.log('no webgl support');
}

function loop() {
    requestAnimationFrame(loop);
    pMatrix = perspectiveFieldOfViewRH(45, ctx.width / ctx.height, 0.1, 10000);
    ctx.adjustSize();
    render();
    animate();
}


function render() {
    // ctx.clearColor = new Color(0.3, 0.3, 0.3, 1.0);
    // ctx._gl.clearDepth(1) //?

    // ctx._gl.depthFunc(ctx._gl.LEQUAL);

    ctx.clear(true);

    mvMatrix.identity();
    mvMatrix.rotateY(angle * Deg2Rad);
    mvMatrix.translate(0, 0, -2.5);

    shader.uMat4('uMVMatrix', mvMatrix.toArray())
    shader.uMat4('uPMatrix', pMatrix.toArray())
    shader.uMat4('uNMatrix', mvMatrix.clone().invert().transpose().toArray());

    vertexBuffer.bindAttributes();
    normalBuffer.bindAttributes();
    indexBuffer.bind();

    ctx.drawElementsTriangle(indexBuffer.length);
}

function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;
        angle += (90 * elapsed) / 1000.0;
    }
    lastTime = timeNow;
}

// var text = {
//     message: 'dat.gui',
//     speed: 0.8,
//     displayOutline: false,
//     explode: () => {
//         console.log('hahah')
//     }

// }
// var gui = new dat.GUI();
// gui.add(text, 'message');
// gui.add(text, 'speed', -5, 5);
// gui.add(text, 'displayOutline');
// gui.add(text, 'explode');
// // Choose from accepted values
// gui.add(text, 'message', ['pizza', 'chrome', 'hooray']);

// // Choose from named values
// gui.add(text, 'speed', { Stopped: 0, Slow: 0.1, Fast: 5 })

// var f1 = gui.addFolder('Flow Field');
// f1.add(text, 'speed');
// // f1.add(text, 'noiseStrength');

// var f2 = gui.addFolder('Letters');
// f2.add(text, 'growthSpeed');
// f2.add(text, 'maxSize');
// f2.add(text, 'message');

// f2.open();
// http://workshop.chromeexperiments.com/examples/gui