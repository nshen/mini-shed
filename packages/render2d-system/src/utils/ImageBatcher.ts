import { VertexBuffer, IndexBuffer, Context, Program, Texture } from "@shed/gl";
import { Matrix2D, Vector2D } from "@shed/math";
import { Batcher } from "./Batcher";

const A_POS: string = "aPos";
const A_UV: string = "aUV"
const V_UV: string = "vUV"
const U_MVP_MATRIX: string = "uMVP";
const U_SAMPLER: string = "uSampler";

export class ImageBatcher {

    protected _ctx: Context;
    protected _vertexBuffer: VertexBuffer;
    protected _indexBuffer: IndexBuffer;
    protected _shader: Program;
    protected _texture: Texture | undefined;

    protected _maxVertices: number = 0;
    protected _vertexArray: Float32Array;
    protected _indexArray: Uint16Array;
    protected _numberVertices: number = 0;
    protected _vIdx: number = 0;
    protected _iIdx: number = 0;
    protected _vp: Float32Array | undefined;

    protected _tempV1: Vector2D = new Vector2D();
    protected _tempV2: Vector2D = new Vector2D();

    constructor(ctx: Context, maxVertices: number = 10000) {
        this._ctx = ctx;
        this._maxVertices = maxVertices;
        this._shader = this._createProgram();
        this._vertexBuffer = new VertexBuffer(ctx);
        this._vertexBuffer.addAttribute(this._shader.getAttributeLocation(A_POS), 2);
        this._vertexBuffer.addAttribute(this._shader.getAttributeLocation(A_UV), 2);
        this._indexBuffer = new IndexBuffer(ctx, true);
        this._vertexArray = new Float32Array(maxVertices * 4);
        this._indexArray = new Uint16Array(maxVertices * 6)
    }

    protected _createProgram(): Program {
        let vs = `
				attribute vec2 ${A_POS};
				attribute vec2 ${A_UV};
                uniform mat3 ${U_MVP_MATRIX};
				varying vec2 ${V_UV};

				void main () {
                    vec3 coords = ${U_MVP_MATRIX} * vec3(${A_POS}, 1.0);
                    gl_Position = vec4(coords.xy, 0.0, 1.0);
                    ${V_UV} = ${A_UV};
				}
			`;

        let fs = `
                precision mediump float;
                uniform sampler2D ${U_SAMPLER};
                varying vec2 ${V_UV};

				void main () {
                    gl_FragColor = texture2D(${U_SAMPLER},${V_UV});
				}
            `;
        return new Program(this._ctx, vs, fs);
    }

    draw(m: Matrix2D, t: Texture, region: { l: number, r: number, t: number, b: number }) {

        if (this._texture && this._texture !== t)
            this.flush();
        if ((this._numberVertices + 4) > this._maxVertices)
            this.flush();

        // console.log(this._numberVertices);
        this._texture = t;

        /*
            1 2
            0 3
        */

        let indexArray = this._indexArray;
        let n = this._numberVertices;
        indexArray[this._iIdx++] = 0 + n;
        indexArray[this._iIdx++] = 2 + n;
        indexArray[this._iIdx++] = 1 + n;
        indexArray[this._iIdx++] = 0 + n;
        indexArray[this._iIdx++] = 3 + n;
        indexArray[this._iIdx++] = 2 + n;


        let vertices = this._vertexArray;
        let out = this._tempV1;

        let p = this._tempV2;
        p.reset(-0.5, 0.5);
        m.transformPoint(p, out);
        vertices[this._vIdx++] = out.x;
        vertices[this._vIdx++] = out.y;
        vertices[this._vIdx++] = region.l;
        vertices[this._vIdx++] = region.b;
        this._numberVertices++;

        p.reset(-0.5, -0.5);
        m.transformPoint(p, out);
        vertices[this._vIdx++] = out.x;
        vertices[this._vIdx++] = out.y;
        vertices[this._vIdx++] = region.l;
        vertices[this._vIdx++] = region.t;
        this._numberVertices++;

        p.reset(0.5, -0.5);
        m.transformPoint(p, out);
        vertices[this._vIdx++] = out.x;
        vertices[this._vIdx++] = out.y;
        vertices[this._vIdx++] = region.r;
        vertices[this._vIdx++] = region.t;
        this._numberVertices++;

        p.reset(0.5, 0.5);
        m.transformPoint(p, out);
        vertices[this._vIdx++] = out.x;
        vertices[this._vIdx++] = out.y;
        vertices[this._vIdx++] = region.r;
        vertices[this._vIdx++] = region.b;
        this._numberVertices++;

    }

    set vpMatrix(m: Matrix2D) {
        this._vp = m.float32Array;
    }

    public flush() {
        let vIdx = this._vIdx;
        if (vIdx === 0)
            return;

        if (!this._vp) {
            if (__DEBUG__) {
                console.error('no ViewProject matrix');
            }
            return;
        }

        let arr = this._vertexArray.subarray(0, vIdx);
        this._vertexBuffer.setData(arr, true);
        this._vertexBuffer.bindAttributes();

        let iarr = this._indexArray.subarray(0, this._iIdx);
        this._indexBuffer.setData(iarr);
        this._indexBuffer.bind()

        this._shader.uMat3(U_MVP_MATRIX, this._vp);
        this._shader.bind();
        (this._texture as Texture).bind();
        this._ctx.drawElementsTriangle(this._iIdx, 0);

        this._vIdx = this._iIdx = this._numberVertices = 0;

    }
}
