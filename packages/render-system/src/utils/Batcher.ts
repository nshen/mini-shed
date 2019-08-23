import { VertexBuffer, IndexBuffer, Context, Program, Texture, Color } from "@shed/gl";
import { Matrix2D, Vector2D } from "@shed/math";
declare var __DEBUG__: boolean;
const A_POS: string = "aPos";
const U_MVP_MATRIX: string = "uMVP";

const A_UV: string = "aUV"
const V_UV: string = "vUV"
const U_SAMPLER: string = "uSampler";

const A_COLOR: string = "aColor"
const V_COLOR: string = "vColor"

enum DRAW_TYPE {
    TEXTURE,
    COLOR,
    WIREFRAME,
    NONE
}

export class Batcher {

    protected _ctx: Context;
    protected _vertexBuffer: VertexBuffer;
    protected _indexBuffer: IndexBuffer;
    protected _maxVertices: number = 0;
    protected _vertexArray: Float32Array;
    protected _indexArray: Uint16Array;
    protected _numberVertices: number = 0;
    protected _vIdx: number = 0;
    protected _iIdx: number = 0;
    protected _vp: Float32Array | undefined;
    protected _tempV1: Vector2D = new Vector2D();
    protected _tempV2: Vector2D = new Vector2D();


    protected _drawingType: DRAW_TYPE = DRAW_TYPE.NONE;
    protected _lastFlushType: DRAW_TYPE = DRAW_TYPE.NONE;

    // texture batcher
    protected _textureShader: Program;
    protected _texture: Texture | undefined;

    // color batcher
    protected _colorShader: Program;

    // wireframe batcher
    protected _wireframeShader: Program;
    protected _penColor: Color = Color.LIGHT_GRAY.clone();
    set penColor(c: Color) {
        this._penColor = c;
    }

    // TODO: test maxVertices
    constructor(ctx: Context, maxVertices: number = 100000) {
        this._ctx = ctx;
        this._maxVertices = maxVertices;
        this._textureShader = this._createTextureShader();
        this._colorShader = this._createColorShader();
        this._wireframeShader = this._createWireframeShader();

        // xyrgba = 6  &&  xyuv = 4  so we use 12 length
        this._vertexArray = new Float32Array(maxVertices * 12);
        this._indexArray = new Uint16Array(maxVertices * 6)
        this._vertexBuffer = new VertexBuffer(ctx);
        this._indexBuffer = new IndexBuffer(ctx);

    }

    protected _createWireframeShader(): Program {

        let vs = `
				attribute vec2 ${A_POS};
				attribute vec4 ${A_COLOR};
				uniform mat3 ${U_MVP_MATRIX};
				varying vec4 ${V_COLOR};

				void main () {
                    vec3 coords = ${U_MVP_MATRIX} * vec3(${A_POS}, 1.0);
                    gl_Position = vec4(coords.xy, 0.0, 1.0);
					${V_COLOR} = ${A_COLOR};
				}
			`;

        let fs = `
                precision mediump float;
                varying vec4 ${V_COLOR};
				void main () {
                    gl_FragColor = ${V_COLOR};
				}
            `;

        return new Program(this._ctx, vs, fs);
    }

    protected _createTextureShader(): Program {
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


    protected _createColorShader(): Program {
        let vs = `
				attribute vec2 ${A_POS};
				attribute vec4 ${A_COLOR};
                uniform mat3 ${U_MVP_MATRIX};
				varying vec4 ${V_COLOR};

				void main () {
                    vec3 coords = ${U_MVP_MATRIX} * vec3(${A_POS}, 1.0);
                    gl_Position = vec4(coords.xy, 0.0, 1.0);
                    ${V_COLOR} = ${A_COLOR};
				}
			`;

        let fs = `
                precision mediump float;
                varying vec4 ${V_COLOR};

				void main () {
                    gl_FragColor = ${V_COLOR};
				}
            `;
        return new Program(this._ctx, vs, fs);
    }

    protected _checkVertices(numVertices: number) {
        if ((numVertices + this._numberVertices) > this._maxVertices)
            this.flush();
    }

    set vpMatrix(m: Matrix2D) {
        this._vp = m.float32Array;
    }

    protected _vertexColor(x: number, y: number, color: Color) {
        let vertices = this._vertexArray;

        vertices[this._vIdx++] = x;
        vertices[this._vIdx++] = y;

        vertices[this._vIdx++] = color.r;
        vertices[this._vIdx++] = color.g;
        vertices[this._vIdx++] = color.b;
        vertices[this._vIdx++] = color.a;
        // u v

        this._numberVertices++;
    }


    drawLine(m: Matrix2D, x1: number, y1: number, x2: number, y2: number, color: Color = this._penColor) {
        if (this._drawingType !== DRAW_TYPE.WIREFRAME) {
            this.flush();
            this._drawingType = DRAW_TYPE.WIREFRAME;
        }
        this._checkVertices(2);

        let p = this._tempV2;

        p.reset(x1, y1);

        m.transformPoint(p)
        this._vertexColor(p.x, p.y, color);

        p.reset(x2, y2);
        m.transformPoint(p);
        this._vertexColor(p.x, p.y, color);
    };

    drawTexture(m: Matrix2D, t: Texture, region: { l: number, r: number, t: number, b: number }) {
        if (this._drawingType !== DRAW_TYPE.TEXTURE) {
            this.flush();
            this._drawingType = DRAW_TYPE.TEXTURE;
        }
        if (this._texture && this._texture !== t)
            this.flush();
        this._checkVertices(4);

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
        // let out = this._tempV1;

        let p = this._tempV2;
        p.reset(-0.5, 0.5);
        m.transformPoint(p);
        vertices[this._vIdx++] = p.x;
        vertices[this._vIdx++] = p.y;
        vertices[this._vIdx++] = region.l;
        vertices[this._vIdx++] = region.b;
        this._numberVertices++;

        p.reset(-0.5, -0.5);
        m.transformPoint(p);
        vertices[this._vIdx++] = p.x;
        vertices[this._vIdx++] = p.y;
        vertices[this._vIdx++] = region.l;
        vertices[this._vIdx++] = region.t;
        this._numberVertices++;

        p.reset(0.5, -0.5);
        m.transformPoint(p);
        vertices[this._vIdx++] = p.x;
        vertices[this._vIdx++] = p.y;
        vertices[this._vIdx++] = region.r;
        vertices[this._vIdx++] = region.t;
        this._numberVertices++;

        p.reset(0.5, 0.5);
        m.transformPoint(p);
        vertices[this._vIdx++] = p.x;
        vertices[this._vIdx++] = p.y;
        vertices[this._vIdx++] = region.r;
        vertices[this._vIdx++] = region.b;
        this._numberVertices++;
    }


    // color 0~1
    drawQuad(m: Matrix2D, color: { r: number, g: number, b: number, a: number }) {

        if (this._drawingType !== DRAW_TYPE.COLOR) {
            this.flush();
            this._drawingType = DRAW_TYPE.COLOR;
        }

        this._checkVertices(4)

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
        // let out = this._tempV1;

        let p = this._tempV2;
        p.reset(-0.5, 0.5);
        m.transformPoint(p);
        vertices[this._vIdx++] = p.x;
        vertices[this._vIdx++] = p.y;
        vertices[this._vIdx++] = color.r;
        vertices[this._vIdx++] = color.g;
        vertices[this._vIdx++] = color.b;
        vertices[this._vIdx++] = color.a;
        this._numberVertices++;

        p.reset(-0.5, -0.5);
        m.transformPoint(p);
        vertices[this._vIdx++] = p.x;
        vertices[this._vIdx++] = p.y;
        vertices[this._vIdx++] = color.r;
        vertices[this._vIdx++] = color.g;
        vertices[this._vIdx++] = color.b;
        vertices[this._vIdx++] = color.a;
        this._numberVertices++;

        p.reset(0.5, -0.5);
        m.transformPoint(p);
        vertices[this._vIdx++] = p.x;
        vertices[this._vIdx++] = p.y;
        vertices[this._vIdx++] = color.r;
        vertices[this._vIdx++] = color.g;
        vertices[this._vIdx++] = color.b;
        vertices[this._vIdx++] = color.a;
        this._numberVertices++;

        p.reset(0.5, 0.5);
        m.transformPoint(p);
        vertices[this._vIdx++] = p.x;
        vertices[this._vIdx++] = p.y;
        vertices[this._vIdx++] = color.r;
        vertices[this._vIdx++] = color.g;
        vertices[this._vIdx++] = color.b;
        vertices[this._vIdx++] = color.a;
        this._numberVertices++;

    }


    flush() {
        let vIdx = this._vIdx;
        if (vIdx === 0)
            return;

        if (!this._vp) {
            if (__DEBUG__) {
                console.error('no ViewProject matrix');
            }
            return;
        }



        switch (this._drawingType) {
            case DRAW_TYPE.TEXTURE:
                if (this._lastFlushType !== DRAW_TYPE.TEXTURE) {
                    this._vertexBuffer.clearAttributes();
                    this._vertexBuffer.addAttribute(this._textureShader.getAttributeLocation(A_POS), 2);
                    this._vertexBuffer.addAttribute(this._textureShader.getAttributeLocation(A_UV), 2);
                    this._lastFlushType = DRAW_TYPE.TEXTURE;
                }
                this._textureShader.bind();
                this._textureShader.uMat3(U_MVP_MATRIX, this._vp);
                (this._texture as Texture).bind();
                break;
            case DRAW_TYPE.COLOR:
                if (this._lastFlushType !== DRAW_TYPE.COLOR) {
                    this._vertexBuffer.clearAttributes();
                    this._vertexBuffer.addAttribute(this._colorShader.getAttributeLocation(A_POS), 2);
                    this._vertexBuffer.addAttribute(this._colorShader.getAttributeLocation(A_COLOR), 4);
                    this._lastFlushType = DRAW_TYPE.COLOR;
                }
                this._colorShader.bind();
                this._colorShader.uMat3(U_MVP_MATRIX, this._vp);
                break;

            case DRAW_TYPE.WIREFRAME:
                if (this._lastFlushType !== DRAW_TYPE.WIREFRAME) {
                    this._vertexBuffer.clearAttributes();
                    this._vertexBuffer.addAttribute(this._wireframeShader.getAttributeLocation(A_POS), 2);
                    this._vertexBuffer.addAttribute(this._wireframeShader.getAttributeLocation(A_COLOR), 4);
                    this._lastFlushType = DRAW_TYPE.WIREFRAME;
                }
                this._wireframeShader.bind();
                this._wireframeShader.uMat3(U_MVP_MATRIX, this._vp);
                break;
            case DRAW_TYPE.NONE:
                console.error('what??')
                return
                break;
        }


        let arr = this._vertexArray.subarray(0, vIdx);
        this._vertexBuffer.setData(arr, true);
        this._vertexBuffer.bindAttributes();

        if (this._drawingType === DRAW_TYPE.WIREFRAME) {
            // this._ctx.drawArraysLines(0, vIdx / 6);
            this._ctx.drawArrays(this._ctx.LINES, vIdx / 6);
        } else {
            let iarr = this._indexArray.subarray(0, this._iIdx);
            this._indexBuffer.setData(iarr);
            this._indexBuffer.bind()
            this._ctx.drawElementsTriangle(this._iIdx, 0);
        }
        this._vIdx = this._iIdx = this._numberVertices = 0;
    };
}