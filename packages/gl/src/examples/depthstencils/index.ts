import { Context, Color, Program, VertexBuffer, IndexBuffer, Texture } from "../../";
import { perspectiveFieldOfViewRH, Matrix3D, Rad2Deg, Deg2Rad } from '@shed/math'
import * as dat from 'dat.gui'
// import { vs, fs } from "./shaders";
import { ImageLoader } from "./ImageLoader";
// import { vertices, indices, normals } from './geometry'

// https://open.gl/depthstencils
// let lastTime: number = 0;
// let angle: number = 0;

let ctx: Context;
let shader: Program;
let buffer: VertexBuffer;

// let normalBuffer: VertexBuffer;
// let indexBuffer: IndexBuffer;
// let pMatrix: Matrix3D;
// let mvMatrix = new Matrix3D();
let loader = new ImageLoader();

let canvas: HTMLCanvasElement = document.getElementById('c') as HTMLCanvasElement;
let gl = canvas.getContext('webgl', { stencil: true });


let mMatrix = new Matrix3D();
init();



function initContext() {
    ctx = new Context(gl);
    ctx.enableDepthTest();
    ctx.clearColor = Color.LIGHT_GRAY;
    ctx.adjustSize();
}

function initShader() {

    let vs = `
    attribute vec3 aVertexPosition;
    attribute vec3 aVertexColor;
    attribute vec2 aVertexUV;
    
    uniform mat4 uModel; 
    uniform mat4 uView;
    uniform mat4 uProj;
     
    varying vec3 vColor;
    varying vec2 vTexcoord;
     
    void main(void) {
        vColor = aVertexColor;
        vTexcoord = aVertexUV;
        
        gl_Position = uProj * uView * uModel * vec4(aVertexPosition,1.0);
    }
    `;


    let fs = `
    precision mediump float;
    uniform sampler2D cat;
    uniform sampler2D dog;
    varying vec3 vColor;
    varying vec2 vTexcoord;

    void main(void)  {
        vec4 color0 = texture2D( cat,vTexcoord);
        vec4 color1 = texture2D( dog,vTexcoord);
        gl_FragColor = vec4(vColor, 1.0) * mix(texture2D(cat, vTexcoord), texture2D(dog, vTexcoord), 0.5);
        
    }`;

    shader = new Program(ctx, vs, fs).bind();
}

function initBuffer() {

    let vertices: number[] = [
        -0.5, -0.5, -0.5, 1.0, 1.0, 1.0, 0.0, 0.0,
        0.5, -0.5, -0.5, 1.0, 1.0, 1.0, 1.0, 0.0,
        0.5, 0.5, -0.5, 1.0, 1.0, 1.0, 1.0, 1.0,
        0.5, 0.5, -0.5, 1.0, 1.0, 1.0, 1.0, 1.0,
        -0.5, 0.5, -0.5, 1.0, 1.0, 1.0, 0.0, 1.0,
        -0.5, -0.5, -0.5, 1.0, 1.0, 1.0, 0.0, 0.0,

        -0.5, -0.5, 0.5, 1.0, 1.0, 1.0, 0.0, 0.0,
        0.5, -0.5, 0.5, 1.0, 1.0, 1.0, 1.0, 0.0,
        0.5, 0.5, 0.5, 1.0, 1.0, 1.0, 1.0, 1.0,
        0.5, 0.5, 0.5, 1.0, 1.0, 1.0, 1.0, 1.0,
        -0.5, 0.5, 0.5, 1.0, 1.0, 1.0, 0.0, 1.0,
        -0.5, -0.5, 0.5, 1.0, 1.0, 1.0, 0.0, 0.0,

        -0.5, 0.5, 0.5, 1.0, 1.0, 1.0, 1.0, 0.0,
        -0.5, 0.5, -0.5, 1.0, 1.0, 1.0, 1.0, 1.0,
        -0.5, -0.5, -0.5, 1.0, 1.0, 1.0, 0.0, 1.0,
        -0.5, -0.5, -0.5, 1.0, 1.0, 1.0, 0.0, 1.0,
        -0.5, -0.5, 0.5, 1.0, 1.0, 1.0, 0.0, 0.0,
        -0.5, 0.5, 0.5, 1.0, 1.0, 1.0, 1.0, 0.0,

        0.5, 0.5, 0.5, 1.0, 1.0, 1.0, 1.0, 0.0,
        0.5, 0.5, -0.5, 1.0, 1.0, 1.0, 1.0, 1.0,
        0.5, -0.5, -0.5, 1.0, 1.0, 1.0, 0.0, 1.0,
        0.5, -0.5, -0.5, 1.0, 1.0, 1.0, 0.0, 1.0,
        0.5, -0.5, 0.5, 1.0, 1.0, 1.0, 0.0, 0.0,
        0.5, 0.5, 0.5, 1.0, 1.0, 1.0, 1.0, 0.0,

        -0.5, -0.5, -0.5, 1.0, 1.0, 1.0, 0.0, 1.0,
        0.5, -0.5, -0.5, 1.0, 1.0, 1.0, 1.0, 1.0,
        0.5, -0.5, 0.5, 1.0, 1.0, 1.0, 1.0, 0.0,
        0.5, -0.5, 0.5, 1.0, 1.0, 1.0, 1.0, 0.0,
        -0.5, -0.5, 0.5, 1.0, 1.0, 1.0, 0.0, 0.0,
        -0.5, -0.5, -0.5, 1.0, 1.0, 1.0, 0.0, 1.0,

        -0.5, 0.5, -0.5, 1.0, 1.0, 1.0, 0.0, 1.0,
        0.5, 0.5, -0.5, 1.0, 1.0, 1.0, 1.0, 1.0,
        0.5, 0.5, 0.5, 1.0, 1.0, 1.0, 1.0, 0.0,
        0.5, 0.5, 0.5, 1.0, 1.0, 1.0, 1.0, 0.0,
        -0.5, 0.5, 0.5, 1.0, 1.0, 1.0, 0.0, 0.0,
        -0.5, 0.5, -0.5, 1.0, 1.0, 1.0, 0.0, 1.0,


        -1.0, -0.5, -1.0, 0.0, 0.0, 0.0, 0.0, 0.0,
        1.0, -0.5, -1.0, 0.0, 0.0, 0.0, 1.0, 0.0,
        1.0, -0.5, 1.0, 0.0, 0.0, 0.0, 1.0, 1.0,
        1.0, -0.5, 1.0, 0.0, 0.0, 0.0, 1.0, 1.0,
        -1.0, -0.5, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0,
        -1.0, -0.5, -1.0, 0.0, 0.0, 0.0, 0.0, 0.0
    ];

    buffer = new VertexBuffer(ctx);
    buffer.setData(new Float32Array(vertices));
    buffer.addAttribute(shader.getAttributeLocation("aVertexPosition"), 3);
    buffer.addAttribute(shader.getAttributeLocation("aVertexColor"), 3)
    buffer.addAttribute(shader.getAttributeLocation("aVertexUV"), 2);
    buffer.bindAttributes();


}

async function init() {

    let img1 = await loader.load('./assets/cat.png');
    let img2 = await loader.load('./assets/dog.png');

    initContext();
    ctx.clear();
    initShader();
    initBuffer();

    let texture1 = new Texture(ctx, img1);
    let texture2 = new Texture(ctx, img2);

    shader.uSampler2D("cat", texture1.bind(0));
    shader.uSampler2D("dog", texture2.bind(1));

    // mMatrix.rotateY(50);
    // mMatrix.translate(0,1,0);

    shader.uMat4('uModel', mMatrix.float32Array);
    shader.uMat4('uView', new Matrix3D().fromLookAt(2.5, 1.5, 2.5, 0, 0, 0, 0, 1, 0).invert().float32Array);
    // shader.uMat4('uMV', mvMatrix.float32Array)
    shader.uMat4('uProj', perspectiveFieldOfViewRH(45, ctx.width / ctx.height, 0.1, 10).float32Array);
    // shader.uMat4('uProj', perspectiveFieldOfViewRH(45, ctx.width / ctx.height, 0.1, 10).float32Array);
    ctx.enableDepthTest();



    loop();
}

function loop() {
    // requestAnimationFrame(loop);

    if (config.depthTest) {
        // ctx.enableDepthTest();
    } else {
        // ctx.disableDepthTest();
    }
    ctx.adjustSize();
    render();
}

function render() {
    let gl = ctx._gl;


    ctx.clear();
    // gl.clearColor(1.0, 1.0, 1.0, 1.0);
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // // Draw cube
    shader.uMat4('uModel', mMatrix.rotateY(-1).float32Array)
    ctx.drawArraysTriangles(36);

    // // 地板作为模板



    ctx.enableStencilTest()
    gl.stencilFunc(gl.ALWAYS, 1, 0xff); // Set any stencil to 1
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
    gl.stencilMask(0xff); // Write to stencil buffer
    gl.depthMask(false); // Don't write to depth buffer
    gl.clear(gl.STENCIL_BUFFER_BIT); // Clear stencil buffer (0 by default)
    ctx.drawArraysTriangles(6, 36);  // Draw floor

    // // 画反射方块

    gl.stencilFunc(gl.EQUAL, 1, 0xff); // Pass test if stencil value is 1
    gl.stencilMask(0x00); // Don't write anything to stencil buffer
    gl.depthMask(true); // // Write to depth buffer
    // //
    mMatrix.scale(1, -1, 1).translate(0, -1, 0)
    shader.uMat4('uModel', mMatrix.float32Array)
    ctx.drawArraysTriangles(36);
    ctx.disableStencilTest();


}

let config = {
    depthTest: true
};

function addUI() {



    let gui = new dat.GUI();
    gui.add(config, 'depthTest')

    gui.open();



}

addUI();
