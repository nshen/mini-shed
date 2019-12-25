import { Context, Color, Program, VertexBuffer, IndexBuffer } from "../..";
import * as dat from 'dat.gui'
import { perspectiveFieldOfViewRH, Matrix3D, Rad2Deg, Deg2Rad } from '@shed/math'
import { vs, fs, phongVS, phongFS } from "./shaders";
import { vertices, indices, normals } from './geometry'
import * as Names from '../common/names';

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

let light = {
    diffuse: [255, 255, 255, 255],
    ambient: [0.03 * 255, 0.03 * 255, 0.03 * 255, 255],
    specular: [1 * 255, 255, 255, 255],

    direction: [-0.25, -0.25, -0.25],
    needsUpdate: true
}

let material = {
    diffuse: [46, 99, 191, 255],
    ambient: [1 * 255, 255, 255, 255],
    specular: [1 * 255, 255, 255, 255],
    shininess: 10,
    needsUpdate: true
}

let shaders = {
    current: 'phong',
    needsUpdate: true
}


let tmpColor = new Color();
let tmpArray = new Float32Array(4);
function normalizeColorArray(arr: number[]): Float32Array {
    tmpColor.reset255(arr[0], arr[1], arr[2], arr[3]);
    tmpColor.toFloat32Array(tmpArray)
    return tmpArray;
}

let shaderLib = {}

if (gl) {

    ctx = new Context(gl);
    ctx.enableDepthTest();
    ctx.clearColor = Color.LIGHT_GRAY;

    shaderLib['goraud'] = new Program(ctx, vs, fs);
    shaderLib['phong'] = new Program(ctx, phongVS, phongFS);

    shader = shaderLib[shaders['current']];
    shader.bind();
    vertexBuffer = new VertexBuffer(ctx);
    vertexBuffer.setData(new Float32Array(vertices), false);
    vertexBuffer.addAttribute(shader.getAttributeLocation(Names.aVertexPosition), 3);

    normalBuffer = new VertexBuffer(ctx);
    normalBuffer.setData(new Float32Array(normals), false);
    normalBuffer.addAttribute(shader.getAttributeLocation(Names.aVertexNormal), 3);

    indexBuffer = new IndexBuffer(ctx);
    indexBuffer.setData(new Uint16Array(indices));

    addUI();

    loop()


} else {
    console.log('no webgl support');
}

function loop() {
    requestAnimationFrame(loop);
    animate();
    render();
}


function render() {

    angle ++;
    ctx.adjustSize();
    ctx.clear(true);
    pMatrix = perspectiveFieldOfViewRH(45, ctx.width / ctx.height, 0.1, 10000);

    mvMatrix.identity();
    mvMatrix.rotateY(angle * Deg2Rad);
    mvMatrix.translate(0, 0, -1.5);


    if (shaders.needsUpdate) {
        shader = shaderLib[shaders['current']];
        shader.bind();
        vertexBuffer.clearAttributes();
        vertexBuffer.addAttribute(shader.getAttributeLocation(Names.aVertexPosition), 3);

        normalBuffer.clearAttributes();
        normalBuffer.addAttribute(shader.getAttributeLocation(Names.aVertexNormal), 3);

        shader.uMat4(Names.uMVMatrix, mvMatrix.toArray())
        shader.uMat4(Names.uPMatrix, pMatrix.toArray())
        shader.uMat4(Names.uNMatrix, mvMatrix.clone().invert().transpose().toArray());

        shaders.needsUpdate = false;
    }

    if (light.needsUpdate) {

        shader.uVec3v(Names.uLightDirection, light.direction);
        shader.uVec4v(Names.uLightAmbient, normalizeColorArray(light.ambient));
        shader.uVec4v(Names.uLightDiffuse, normalizeColorArray(light.diffuse));
        shader.uVec4v(Names.uLightSpecular, normalizeColorArray(light.specular));
        light.needsUpdate = false;
    }

    if (material.needsUpdate) {
        shader.uVec4v(Names.uMaterialDiffuse, normalizeColorArray(material.diffuse));
        shader.uVec4v(Names.uMaterialAmbient, normalizeColorArray(material.ambient));
        shader.uVec4v(Names.uMaterialSpecular, normalizeColorArray(material.specular));
        shader.uniform1f(Names.uShininess, material.shininess);
        material.needsUpdate = false;
    }


    vertexBuffer.bindAttributes();
    normalBuffer.bindAttributes();
    indexBuffer.bind();

    // ctx.drawElements(gl.LINES,indexBuffer.length);
    ctx.drawElementsTriangle(indexBuffer.length);

}

function animate() {
    let timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;
        angle += (90 * elapsed) / 10000.0;
    }
    lastTime = timeNow;
}


function addUI() {


    let updateLight = () => {
        light.needsUpdate = true
    }
    let updateMaterial = () => {
        material.needsUpdate = true
    }

    let gui = new dat.GUI();
    gui.add(shaders, 'current', ['phong', 'goraud']).onChange(v => {
        light.needsUpdate = material.needsUpdate = shaders.needsUpdate = true;
    });


    let mUI = gui.addFolder('light');
    
    mUI.addColor(light, 'diffuse').onChange(updateLight);
    mUI.addColor(light, 'ambient').onChange(updateLight);
    mUI.addColor(light, 'specular').onChange(updateLight)

    mUI.add(light.direction, '0', -10, 10, 0.1).onChange(updateLight)
    mUI.add(light.direction, '1', -10, 10, 0.1).onChange(updateLight)
    mUI.add(light.direction, '2', -10, 10, 0.1).onChange(updateLight)
    mUI.open();



    mUI = gui.addFolder('material');
    mUI.addColor(material, 'diffuse').onChange(updateMaterial);
    mUI.addColor(material, 'ambient').onChange(updateMaterial);
    mUI.addColor(material, 'specular').onChange(updateMaterial);
    mUI.add(material, 'shininess', 0, 100, 5).onChange(updateMaterial);

    mUI.open();
    // let lUI = gui.addFolder('light')



}


// http://workshop.chromeexperiments.com/examples/gui