import { VertexBuffer, Color, Context, Program } from "@shed/gl";
import { Matrix2D, Vector2D } from "@shed/math";
import { Batcher } from "./Batcher";

const A_POS: string = "aPos";
const A_COLOR: string = "aColor"
const U_MVP_MATRIX: string = "uMVP";
const V_COLOR: string = "vColor"

export default class WireframeBatcher {

    protected _bigBuffer: VertexBuffer;
    protected _ctx: Context;
    protected _shader: Program;

    protected _maxVertices: number = 0;
    protected _numberVertices: number = 0;
    protected _vertices: Float32Array;
    protected _vIdx: number = 0;
    protected _color: Color;
    protected _mvp: Float32Array | undefined;

    constructor(ctx: Context, maxVertices: number = 10000) {
        this._ctx = ctx;
        this._maxVertices = maxVertices;
        this._shader = this._createTextureShader();
        this._bigBuffer = new VertexBuffer(ctx);
        this._bigBuffer.addAttribute(this._shader.getAttributeLocation(A_POS), 2);
        this._bigBuffer.addAttribute(this._shader.getAttributeLocation(A_COLOR), 4);
        this._vertices = new Float32Array(maxVertices * 6);// big array
        this._color = Color.GRAY.clone();
    }

    set penColor(c: Color) {
        this._color = c;
    }

    set backgroundColor(c: Color) {
        this._ctx.clearColor = c;
    }

    set mvpMatrix(m: Matrix2D) {
        this._mvp = m.float32Array;
    }

    drawLine(x: number, y: number, x2: number, y2: number, color: Color = this._color) {
        this._check(2);
        this._vertex(x, y, color);
        this._vertex(x2, y2, color);
    };

    drawArrow(x: number, y: number, x2: number, y2: number, color: Color = this._color) {
        this._check(6);
        this._vertex(x, y, color);
        this._vertex(x2, y2, color);

        let angle = 30 * Math.PI / 180;
        let v = new Vector2D(x - x2, y - y2)
        v.length = 10;
        let left = v.clone().rotate(angle);
        v.rotate(-angle);
        this._vertex(x2, y2, color);
        this._vertex(x2 + left.x, y2 + left.y, color);
        this._vertex(x2, y2, color);
        this._vertex(x2 + v.x, y2 + v.y, color);
    }

    drawRectline(x: number, y: number, x2: number, y2: number, width: number, color: Color = this._color) {
        this._check(8);
        let v = new Vector2D(x2 - x, y2 - y);
        v.leftHandNormal().normalize().scale(width * 0.5);

        let p1 = new Vector2D(x, y).add(v);
        let p2 = new Vector2D(x, y).sub(v);
        let p3 = new Vector2D(x2, y2).sub(v);
        let p4 = new Vector2D(x2, y2).add(v);

        this._vertex(p1.x, p1.y, color);
        this._vertex(p2.x, p2.y, color);

        this._vertex(p2.x, p2.y, color);
        this._vertex(p3.x, p3.y, color);

        this._vertex(p3.x, p3.y, color);
        this._vertex(p4.x, p4.y, color);

        this._vertex(p4.x, p4.y, color);
        this._vertex(p1.x, p1.y, color);
    }

    drawTriangle(x: number, y: number, x2: number, y2: number, x3: number, y3: number,
        color: Color = this._color,
        color2: Color = this._color,
        color3: Color = this._color) {
        this._check(6);

        this._vertex(x, y, color);
        this._vertex(x2, y2, color2);

        this._vertex(x2, y2, color2);
        this._vertex(x3, y3, color3);

        this._vertex(x3, y3, color3);
        this._vertex(x, y, color);

    }

    drawQuad(x: number, y: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number,
        color: Color = this._color,
        color2: Color = this._color,
        color3: Color = this._color,
        color4: Color = this._color) {
        this._check(8);
        this._vertex(x, y, color); this._vertex(x2, y2, color2);
        this._vertex(x2, y2, color2); this._vertex(x3, y3, color3);
        this._vertex(x3, y3, color3); this._vertex(x4, y4, color4);
        this._vertex(x4, y4, color4); this._vertex(x, y, color);
    }

    drawRect(x: number, y: number, width: number, height: number, color: Color = this._color) {
        // Matrix2D.SRT()
        let r = x + width;
        let d = y + height;
        this.drawQuad(x, y, r, y, r, d, x, d, color, color, color, color);
    }

    drawX(x: number, y: number, size: number, color: Color = this._color) {
        let l = x - size, r = x + size, t = y - size, b = y + size;
        this._check(4)
        this._vertex(l, t, color);
        this._vertex(r, b, color);
        this._vertex(r, t, color);
        this._vertex(l, b, color);

    }

    drawCircle(x: number, y: number, radius: number, segments: number = 0, color: Color = this._color) {
        this.drawEllipse(x, y, radius, radius, segments, color);

        // if (segments === 0)
        //     segments = Math.max(1, (6 * Math.cbrt(radius)) | 0);

        // if (__DEBUG__) {
        //     if (segments < 3)
        //         console.error('segments of drawCircle() must more than 2');
        // }

        // let angle = 2 * Math.PI / segments;
        // let v = new Vector2D(x, y - radius)
        // this._check(segments * 2 + 2);
        // for (let i = 0; i < segments; i++) {
        //     this._vertex(v.x, v.y, color);
        //     v.rotate(angle);
        //     this._vertex(v.x, v.y, color);
        // }
    }
    drawEllipse(x: number, y: number, width: number, height: number, segments: number = 10, color: Color = this._color) {
        this._check(segments * 2);
        if (__DEBUG__) {
            if (segments < 3)
                console.error('segments of drawCircle() drawEllipse must more than 2 segments');
        }
        let twopi = 2 * Math.PI;
        let angle = twopi / segments;
        let a = 0, xx = x + width, yy = y;
        while (a < twopi) {
            this._vertex(xx, yy, color);
            a += angle;
            xx = x + width * (Math.cos(a));
            yy = y + height * (Math.sin(a));
            this._vertex(xx, yy, color);
        }
    }
    drawRoundedRect(x: number, y: number, width: number, height: number, radius: number) { }

    drawPolygon(path: number[]) { }
    drawStar(x: number, y: number) { }

    drawCurve(x1: number, y1: number, cx1: number, cy1: number, cx2: number, cy2: number, x2: number, y2: number, segments: number, color: Color = this._color) {
        this._check(segments * 2 + 2);

        // Algorithm from: http://www.antigrain.com/research/bezier_interpolation/index.html#PAGE_BEZIER_INTERPOLATION
        let subdiv_step = 1 / segments;
        let subdiv_step2 = subdiv_step * subdiv_step;
        let subdiv_step3 = subdiv_step * subdiv_step * subdiv_step;

        let pre1 = 3 * subdiv_step;
        let pre2 = 3 * subdiv_step2;
        let pre4 = 6 * subdiv_step2;
        let pre5 = 6 * subdiv_step3;

        let tmp1x = x1 - cx1 * 2 + cx2;
        let tmp1y = y1 - cy1 * 2 + cy2;

        let tmp2x = (cx1 - cx2) * 3 - x1 + x2;
        let tmp2y = (cy1 - cy2) * 3 - y1 + y2;

        let fx = x1;
        let fy = y1;

        let dfx = (cx1 - x1) * pre1 + tmp1x * pre2 + tmp2x * subdiv_step3;
        let dfy = (cy1 - y1) * pre1 + tmp1y * pre2 + tmp2y * subdiv_step3;

        let ddfx = tmp1x * pre4 + tmp2x * pre5;
        let ddfy = tmp1y * pre4 + tmp2y * pre5;

        let dddfx = tmp2x * pre5;
        let dddfy = tmp2y * pre5;

        while (segments-- > 0) {
            this._vertex(fx, fy, color);
            fx += dfx;
            fy += dfy;
            dfx += ddfx;
            dfy += ddfy;
            ddfx += dddfx;
            ddfy += dddfy;
            this._vertex(fx, fy, color);
        }
        this._vertex(fx, fy, color);
        this._vertex(x2, y2, color);
    }

    public clear() {
        this._vIdx = this._numberVertices = 0;
        this._ctx.clear();
    }

    public flush() {
        let vIdx = this._vIdx;
        if (vIdx === 0)
            return;

        if (!this._mvp) {
            if (__DEBUG__) {
                console.log('no MVP matrix');
            }
            return;
        }

        let arr = this._vertices.subarray(0, vIdx);
        this._bigBuffer.setData(arr, false);
        this._bigBuffer.bindAttributes();

        this._shader.uMat3(U_MVP_MATRIX, this._mvp);
        this._shader.bind();
        this._ctx.drawArraysLines(0, vIdx / 6);

        this._vIdx = this._numberVertices = 0;

    }

    protected _createTextureShader(): Program {

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

    protected _check(numVertices: number) {
        if ((numVertices + this._numberVertices) > this._maxVertices)
            this.flush();
    }

    protected _vertex(x: number, y: number, color: Color) {
        let vertices = this._vertices;

        vertices[this._vIdx++] = x;
        vertices[this._vIdx++] = y;

        vertices[this._vIdx++] = color.r;
        vertices[this._vIdx++] = color.g;
        vertices[this._vIdx++] = color.b;
        vertices[this._vIdx++] = color.a;
        // u v

        this._numberVertices++;
    }
}