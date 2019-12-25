import { Vector2D } from './Vector2D';
import { floatEqual, Deg2Rad } from '../src/MathUtils';
import { ICommonMethod } from "./ICommonMethod";

export class Matrix2D implements ICommonMethod<Matrix2D>{

    public a: number;
    public b: number;
    public c: number;
    public d: number;

    public tx: number;
    public ty: number;

    public constructor(a: number = 1, b: number = 0, c: number = 0, d: number = 1, tx: number = 0, ty: number = 0) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
    }

    public get determinant(): number {
        return this.a * this.d - this.c * this.b;
    }

    public identity(): this {
        let t = this;
        t.a = 1;
        t.b = 0;
        t.c = 0;
        t.d = 1;
        t.tx = 0;
        t.ty = 0;
        return this;
    }

    public scale(sx: number, sy: number = sx): this {
        let t = this;
        t.a *= sx;
        t.c *= sx;
        t.tx *= sx;
        t.b *= sy;
        t.d *= sy;
        t.ty *= sy;
        return this;
    }

    public rotate(angle: number): this {
        let t = this;
        let rad = angle * Deg2Rad;
        let cos: number = Math.cos(rad);
        let sin: number = Math.sin(rad);
        let _a: number = t.a;
        let _c: number = t.c;
        let _tx: number = t.tx;
        let _b: number = t.b;
        let _d: number = t.d;
        let _ty: number = t.ty;

        t.a = _a * cos - _b * sin;
        t.c = _c * cos - _d * sin;
        t.tx = _tx * cos - _ty * sin;
        t.b = _a * sin + _b * cos;
        t.d = _c * sin + _d * cos;
        t.ty = _tx * sin + _ty * cos;
        return this;
    }

    public translate(tx: number, ty: number): this {
        this.tx += tx;
        this.ty += ty;
        return this;
    }

    public fromSRT(scaleX: number = 1, scaleY: number = 1, angle: number = 0, tx: number = 0, ty: number = 0): this {
        let t = this;
        t.tx = tx;
        t.ty = ty;
        if (angle % 360 === 0) {
            t.a = scaleX;
            t.b = 0;
            t.c = 0;
            t.d = scaleY;
        } else {
            let rad = angle * Deg2Rad;
            let cos: number = Math.cos(rad);
            let sin: number = Math.sin(rad);
            t.a = cos * scaleX;
            t.b = sin * scaleX;
            t.c = -sin * scaleY;
            t.d = cos * scaleY;
        }
        return this;
    }

    public fromScale(scaleX: number, scaleY: number): this {
        return this.reset(scaleX, 0, 0, scaleY, 0, 0);
    }

    public fromRotation(angle: number): this {
        let rad = angle * Deg2Rad;
        let s: number = Math.sin(rad);
        let c: number = Math.cos(rad);
        return this.reset(c, s, -s, c, 0, 0);
    };

    public fromTranslation(posX: number, posY: number): this {
        return this.reset(1, 0, 0, 1, posX, posY);
    };


    public prepend(m: Matrix2D): this {
        let _a: number = this.a;
        let _b: number = this.b;
        let _c: number = this.c;
        let _d: number = this.d;

        this.a = _a * m.a + _c * m.b;
        this.c = _a * m.c + _c * m.d;
        this.b = _b * m.a + _d * m.b;
        this.d = _b * m.c + _d * m.d;
        this.tx += _a * m.tx + _c * m.ty;
        this.ty += _b * m.tx + _d * m.ty;
        return this;
    }

    public multiply = this.prepend;

    public append(m: Matrix2D): this {
        let _a: number = this.a;
        let _b: number = this.b;
        let _c: number = this.c;
        let _d: number = this.d;
        let _tx: number = this.tx;
        let _ty: number = this.ty;

        this.a = m.a * _a + m.c * _b;
        this.b = m.b * _a + m.d * _b;
        this.c = m.a * _c + m.c * _d;
        this.d = m.b * _c + m.d * _d;
        this.tx = m.a * _tx + m.c * _ty + m.tx;
        this.ty = m.b * _tx + m.d * _ty + m.ty;

        return this;
    }

    public invert(): this {
        let det: number = this.a * this.d - this.c * this.b;
        if (det === 0)
            det = 0.00001;

        det = 1 / det;
        let _a: number = this.a;
        let _b: number = this.b;
        let _c: number = this.c;
        let _d: number = this.d;
        let _tx: number = this.tx;
        let _ty: number = this.ty;

        this.a = _d * det;
        this.b = -_b * det;
        this.c = -_c * det;
        this.d = _a * det;
        this.tx = (_c * _ty - _d * _tx) * det;
        this.ty = (_b * _tx - _a * _ty) * det;

        return this;
    }

    public transformPoint(p: Vector2D): this {

        let nx: number = this.a * p.x + this.c * p.y + this.tx;
        p.y = this.b * p.x + this.d * p.y + this.ty;
        p.x = nx;
        return this;
    }

    public transformVector(v: Vector2D): this {

        let nx: number = this.a * v.x + this.c * v.y;
        v.y = this.b * v.x + this.d * v.y;
        v.x = nx;
        return this;
    }

    public toArray(out: Float32Array | Array<number>): Float32Array | Array<number> {
        out[0] = this.a;
        out[1] = this.b;
        out[2] = 0;
        out[3] = this.c;
        out[4] = this.d;
        out[5] = 0;
        out[6] = this.tx;
        out[7] = this.ty;
        out[8] = 1;
        return out;
    }

    // common methods

    public reset(a: number, b: number, c: number, d: number, tx: number, ty: number): this {
        let t = this;
        t.a = a;
        t.b = b;
        t.c = c;
        t.d = d;
        t.tx = tx;
        t.ty = ty;
        return this;
    }

    public equal(m: Matrix2D): boolean {
        let t = this;
        return floatEqual(t.a, m.a) &&
            floatEqual(t.b, m.b) &&
            floatEqual(t.c, m.c) &&
            floatEqual(t.d, m.d) &&
            floatEqual(t.tx, m.tx) &&
            floatEqual(t.ty, m.ty);
    }

    public copyFrom(m: Matrix2D): this {
        let t = this;
        t.a = m.a;
        t.b = m.b;
        t.c = m.c;
        t.d = m.d;
        t.tx = m.tx;
        t.ty = m.ty;
        return this;
    }

    public clone(): Matrix2D {
        let t = this;
        return new Matrix2D(t.a, t.b, t.c, t.d, t.tx, t.ty);
    }

    public toString(): string {
        return '[Matrix2D](' + this.a + ',' + this.b + ',0,' + this.c + ',' + this.d + ',0,' + this.tx + ',' + this.ty + ',1)';
    }
}

