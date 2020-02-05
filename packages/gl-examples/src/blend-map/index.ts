import { VertexBuffer, Color, Context, Program, Texture } from "@shed/gl";
import { Matrix2D, center2D } from "@shed/math";

const A_POS: string = "aPos";
const A_UV: string = "aUV";
const U_MVP_MATRIX: string = "uMVP";
const U_SAPMLER: string = "uSampler";
const U_SAPMLER1: string = "uSampler1";
const V_UV: string = "vUV";

const VS = `
precision mediump float;
attribute vec2 ${A_POS};
attribute vec2 ${A_UV};
uniform mat3 ${U_MVP_MATRIX};
varying vec2 ${V_UV};
void main(void){
    vec3 coords = ${U_MVP_MATRIX} * vec3(${A_POS}, 1.0);
    gl_Position = vec4(coords.xy, 0.0, 1.0);
    ${V_UV} = ${A_UV}.xy;
}`;

const FS = `
precision mediump float;
uniform sampler2D ${U_SAPMLER};
uniform sampler2D ${U_SAPMLER1};
varying vec2 ${V_UV};
void main(void) {
    vec4 color0 = texture2D(${U_SAPMLER},${V_UV});
    vec4 color1 = texture2D(${U_SAPMLER1},${V_UV});
    gl_FragColor = color1 * color0;
}`;

let imgLoaded = 0;
let img = new Image();
img.src = './assets/grassy.png';
img.onload = () => {
    if (++imgLoaded === 2)
        render();
};

let img1 = new Image();
img1.src = './assets/mud.png';
img1.onload = () => {
    if (++imgLoaded === 2)
        render();
};


// blendMap
// https://www.youtube.com/playlist?list=PLRIWtICgwaX0u7Rf9zkZhLoLuZVfUksDP
function render() {

    let canvas: HTMLCanvasElement = document.getElementById('c') as HTMLCanvasElement;
    let gl = canvas.getContext('webgl');
    if (gl) {
        let ctx = new Context(gl);
        ctx.adjustSize();
        ctx.clearColor = Color.GRAY;

        let shader = new Program(ctx, VS, FS);
        // let m = Matrix2D.SRT(1, 1, 30*Math.PI/180, 479, -469);
        let m = new Matrix2D().fromSRT(1, 1, 0, 0, 0);

        // let proj = topleft2D(gl.drawingBufferWidth, gl.drawingBufferHeight);
        let proj = center2D(gl.drawingBufferWidth, gl.drawingBufferHeight);
        // console.log('proj',proj.transformVector(new Vector2D(479, 469)));
        m.append(proj);

        let arr = new Float32Array(9);
        m.toArray(arr);

        shader.uMat3(U_MVP_MATRIX, arr);


        let posBuffer = new VertexBuffer(ctx);
        setRectangle(posBuffer, 0, 0, img.width, img.height);
        // setRectangle(posBuffer, 0, 0, 958, 938);
        posBuffer.addAttribute(shader.getAttributeLocation(A_POS), 2);
        posBuffer.addAttribute(shader.getAttributeLocation(A_UV), 2);
        posBuffer.bindAttributes();

        let texture = new Texture(ctx, img);
        let texture1 = new Texture(ctx, img1);

        shader.uSampler2D(U_SAPMLER, texture.bind(0));
        shader.uSampler2D(U_SAPMLER1, texture1.bind(1));

        ctx.adjustSize();
        ctx.clear();

        shader.bind();
        posBuffer.bindAttributes();
        // texCoordBuffer.bindAttributes();

        ctx.drawArrays(gl.TRIANGLES, 6);
    } else {
        console.log('no webgl support');
    }
}

function setRectangle(buffer: VertexBuffer, x: number, y: number, width: number, height: number) {
    var x1 = x - width / 2;
    var x2 = x + width / 2;
    var y1 = y - height / 2;
    var y2 = y + height / 2;
    buffer.setData(new Float32Array([
        x1, y1, 0.0, 0.0,
        x2, y1, 1.0, 0.0,
        x1, y2, 0.0, 1.0,
        x1, y2, 0.0, 1.0,
        x2, y1, 1.0, 0.0,
        x2, y2, 1.0, 1.0
    ]), false);
    console.log(x2, y2);
}
