import { Vector3D } from "./Vector3D";
import { Quaternion } from "./Quaternion";
import { floatEqual, Deg2Rad } from "./MathUtils";
import { Euler } from "./Euler";

/*
      x   y   z   t
   -------------------
   | n11 n12 n13 n14 |
   | n21 n22 n23 n24 |
   | n31 n32 n33 n34 |
   | n41 n42 n43 n44 |

    // orthogonal matrix is simply one whose inverse is equal to its transpose.
    // An orthogonal matrix M can only have a determinant of 1 or −1. If det 1 M = ,
    // the matrix M represents a pure rotation. If det 1 M = − , then the matrix M represents a rotation followed by a reflection.
*/
export class Matrix3D {

    public n11: number = 1;
    public n12: number = 0;
    public n13: number = 0;
    public n14: number = 0; // tx

    public n21: number = 0;
    public n22: number = 1;
    public n23: number = 0;
    public n24: number = 0; // ty

    public n31: number = 0;
    public n32: number = 0;
    public n33: number = 1;
    public n34: number = 0; // tz

    public n41: number = 0;
    public n42: number = 0;
    public n43: number = 0;
    public n44: number = 1;

    protected _temp: Float32Array = new Float32Array(16);

    constructor(
        p11: number = 1, p12: number = 0, p13: number = 0, p14: number = 0,
        p21: number = 0, p22: number = 1, p23: number = 0, p24: number = 0,
        p31: number = 0, p32: number = 0, p33: number = 1, p34: number = 0,
        p41: number = 0, p42: number = 0, p43: number = 0, p44: number = 1) {
        this.n11 = p11; this.n12 = p12; this.n13 = p13; this.n14 = p14;
        this.n21 = p21; this.n22 = p22; this.n23 = p23; this.n24 = p24;
        this.n31 = p31; this.n32 = p32; this.n33 = p33; this.n34 = p34;
        this.n41 = p41; this.n42 = p42; this.n43 = p43; this.n44 = p44;
    }

    get determinant(): number {

        //http://www.euclideanspace.com/maths/algebra/matrix/functions/determinant/fourD/index.htm

        let m00 = this.n11, m01 = this.n12, m02 = this.n13, m03 = this.n14,
            m10 = this.n21, m11 = this.n22, m12 = this.n23, m13 = this.n24,
            m20 = this.n31, m21 = this.n32, m22 = this.n33, m23 = this.n34,
            m30 = this.n41, m31 = this.n42, m32 = this.n43, m33 = this.n44

        return (m03 * m12 * m21 * m30 - m02 * m13 * m21 * m30 - m03 * m11 * m22 * m30 + m01 * m13 * m22 * m30 +
            m02 * m11 * m23 * m30 - m01 * m12 * m23 * m30 - m03 * m12 * m20 * m31 + m02 * m13 * m20 * m31 +
            m03 * m10 * m22 * m31 - m00 * m13 * m22 * m31 - m02 * m10 * m23 * m31 + m00 * m12 * m23 * m31 +
            m03 * m11 * m20 * m32 - m01 * m13 * m20 * m32 - m03 * m10 * m21 * m32 + m00 * m13 * m21 * m32 +
            m01 * m10 * m23 * m32 - m00 * m11 * m23 * m32 - m02 * m11 * m20 * m33 + m01 * m12 * m20 * m33 +
            m02 * m10 * m21 * m33 - m00 * m12 * m21 * m33 - m01 * m10 * m22 * m33 + m00 * m11 * m22 * m33);

    }

    reset(
        p11: number = 1, p12: number = 0, p13: number = 0, p14: number = 0,
        p21: number = 0, p22: number = 1, p23: number = 0, p24: number = 0,
        p31: number = 0, p32: number = 0, p33: number = 1, p34: number = 0,
        p41: number = 0, p42: number = 0, p43: number = 0, p44: number = 1) {

        let t = this;
        t.n11 = p11; t.n12 = p12; t.n13 = p13; t.n14 = p14;
        t.n21 = p21; t.n22 = p22; t.n23 = p23; t.n24 = p24;
        t.n31 = p31; t.n32 = p32; t.n33 = p33; t.n34 = p34;
        t.n41 = p41; t.n42 = p42; t.n43 = p43; t.n44 = p44;
        return t;
    }

    fromBasis(right: Vector3D, up: Vector3D, forward: Vector3D): this {
        return this.reset(
            right.x, up.x, forward.x, 0,
            right.y, up.y, forward.y, 0,
            right.z, up.z, forward.z, 0,
            0, 0, 0, 1
        )
    }

    fromTranslation(x: number, y: number, z: number): this {
        return this.reset(
            1, 0, 0, x,
            0, 1, 0, y,
            0, 0, 1, z,
            0, 0, 0, 1
        )
    }

    fromRotationX(angle: number): this {
        angle *= Deg2Rad;
        let c = Math.cos(angle);
        let s = Math.sin(angle);

        return this.reset(
            1, 0, 0, 0,
            0, c, - s, 0,
            0, s, c, 0,
            0, 0, 0, 1
        );
    }

    fromRotationY(angle: number): this {
        angle *= Deg2Rad;
        let c = Math.cos(angle);
        let s = Math.sin(angle);

        return this.reset(
            c, 0, s, 0,
            0, 1, 0, 0,
            - s, 0, c, 0,
            0, 0, 0, 1
        );
    }

    fromRotationZ(angle: number): this {
        angle *= Deg2Rad;
        let c = Math.cos(angle);
        let s = Math.sin(angle);

        return this.reset(
            c, - s, 0, 0,
            s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
    }

    fromScale(x: number, y: number, z: number): this {
        return this.reset(
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1
        )
    }

    fromShear(x: number, y: number, z: number): this {

        return this.reset(
            1, y, z, 0,
            x, 1, z, 0,
            x, y, 1, 0,
            0, 0, 0, 1
        )
    }

    /**
     * 相当于.rotateY(head).rotateX(pitch).rotateZ(roll);
     */
    fromEuler(e: Euler): this {
        // Realtime rendering 4th p72

        let r = e.roll * Deg2Rad, h = e.head * Deg2Rad, p = e.pitch * Deg2Rad;
        let cos = Math.cos, sin = Math.sin;
        let sinr = sin(r), cosr = cos(r), sinp = sin(p), cosp = cos(p), sinh = sin(h), cosh = cos(h);
        return this.reset(
            cosr * cosh - sinr * sinp * sinh, -sinr * cosp, cosr * sinh + sinr * sinp * cosh, 0,
            sinr * cosh + cosr * sinp * sinh, cosr * cosp, sinr * sinh - cosr * sinp * cosh, 0,
            -cosp * sinh, sinp, cosp * cosh, 0,
            0, 0, 0, 1
        )
    }

    fromQuaternion(q: Quaternion): this {

        let x = q.x, y = q.y, z = q.z, w = q.w;
        let x2 = x + x;
        let y2 = y + y;
        let z2 = z + z;

        let xx = x * x2;
        let xy = x * y2;
        let xz = x * z2;
        let yy = y * y2;
        let yz = y * z2;
        let zz = z * z2;
        let wx = w * x2;
        let wy = w * y2;
        let wz = w * z2;

        this.n11 = 1 - yy - zz;
        this.n21 = xy + wz;
        this.n31 = xz - wy;
        this.n41 = 0;

        this.n12 = xy - wz;
        this.n22 = 1 - (xx + zz);
        this.n32 = yz + wx;
        this.n42 = 0;

        this.n13 = xz + wy;
        this.n23 = yz - wx;
        this.n33 = 1 - xx - yy;
        this.n43 = 0;

        this.n14 = 0;
        this.n24 = 0;
        this.n34 = 0;
        this.n44 = 1;

        return this;

    }

    /**
     * Rotation Translation
     * @param r 
     * @param t 
     */
    fromRT(r: Quaternion, t: Vector3D): this {

        let x = r.x, y = r.y, z = r.z, w = r.w;
        let x2 = x + x;
        let y2 = y + y;
        let z2 = z + z;

        let xx = x * x2;
        let xy = x * y2;
        let xz = x * z2;
        let yy = y * y2;
        let yz = y * z2;
        let zz = z * z2;
        let wx = w * x2;
        let wy = w * y2;
        let wz = w * z2;

        this.n11 = 1 - yy - zz;
        this.n21 = xy + wz;
        this.n31 = xz - wy;
        this.n41 = 0;

        this.n12 = xy - wz;
        this.n22 = 1 - (xx + zz);
        this.n32 = yz + wx;
        this.n42 = 0;

        this.n13 = xz + wy;
        this.n23 = yz - wx;
        this.n33 = 1 - xx - yy;
        this.n43 = 0;

        this.n14 = t.x;
        this.n24 = t.y;
        this.n34 = t.z;
        this.n44 = 1;

        return this;
    }

    fromSRT(s: Vector3D, r: Quaternion, t: Vector3D): this {

        let x = r.x, y = r.y, z = r.z, w = r.w;
        let x2 = x + x;
        let y2 = y + y;
        let z2 = z + z;

        let xx = x * x2;
        let xy = x * y2;
        let xz = x * z2;
        let yy = y * y2;
        let yz = y * z2;
        let zz = z * z2;
        let wx = w * x2;
        let wy = w * y2;
        let wz = w * z2;

        let sx = s.x;
        let sy = s.y;
        let sz = s.z;

        this.n11 = (1 - yy - zz) * sx;
        this.n21 = (xy + wz) * sx;
        this.n31 = (xz - wy) * sx;
        this.n41 = 0;

        this.n12 = (xy - wz) * sy;
        this.n22 = (1 - (xx + zz)) * sy;
        this.n32 = (yz + wx) * sy;
        this.n42 = 0;

        this.n13 = (xz + wy) * sz;
        this.n23 = (yz - wx) * sz;
        this.n33 = (1 - xx - yy) * sz;
        this.n43 = 0;

        this.n14 = t.x;
        this.n24 = t.y;
        this.n34 = t.z;
        this.n44 = 1;

        return this;

    }

    fromLookAt(eyeX: number, eyeY: number, eyeZ: number,
        targetX: number, targetY: number, targetZ: number,
        upX: number, upY: number, upZ: number): this {


        let fx, fy, fz, rlf, rx, ry, rz, rls, ux, uy, uz;

        // foward vector
        fx = eyeX - targetX;
        fy = eyeY - targetY;
        fz = eyeZ - targetZ;

        // Normalize foward.
        rlf = 1 / Math.sqrt(fx * fx + fy * fy + fz * fz);
        fx *= rlf;
        fy *= rlf;
        fz *= rlf;

        // Calculate cross product of f and up.
        rx = fy * upZ - fz * upY;
        ry = fz * upX - fx * upZ;
        rz = fx * upY - fy * upX;

        // Normalize right vector.
        rls = 1 / Math.sqrt(rx * rx + ry * ry + rz * rz);
        rx *= rls;
        ry *= rls;
        rz *= rls;

        // Calculate cross product of r and f.
        ux = ry * fz - rz * fy;
        uy = rz * fx - rx * fz;
        uz = rx * fy - ry * fx;

        let t = this;
        // Set to this.
        t.n11 = rx; t.n12 = ux; t.n13 = fx; t.n14 = eyeX;
        t.n21 = ry; t.n22 = uy; t.n23 = fy; t.n24 = eyeY;
        t.n31 = rz; t.n32 = uz; t.n33 = fz; t.n34 = eyeZ;
        t.n41 = 0; t.n42 = 0; t.n43 = 0; t.n44 = 1;

        return t;

    }

    identity(): this {
        return this.reset(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        )
    }

    isRigidTransform(): boolean {
        return this.determinant === 1;
    }

    /**
     * singular 矩阵不可逆
     */
    isSingular(): boolean {
        return this.determinant === 0;
    }

    transpose(): this {

        let tmp, t = this;
        tmp = t.n12; t.n12 = t.n21; t.n21 = tmp;
        tmp = t.n13; t.n13 = t.n31; t.n31 = tmp;
        tmp = t.n14; t.n14 = t.n41; t.n41 = tmp;
        tmp = t.n23; t.n23 = t.n32; t.n32 = tmp;
        tmp = t.n24; t.n24 = t.n42; t.n42 = tmp;
        tmp = t.n34; t.n34 = t.n43; t.n43 = tmp;
        return this;

    }


    /**
     *  非常耗时，如果可以的话速度优化
     *  to invert a pure rotation then we just take the transpose of the 3x3 part of the matrix.
     *  to invert a pure translation the we just negate the translation
     */
    invert(): this | null {

        // http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
        // https://github.com/toji/gl-matrix/blob/master/src/mat4.js

        let a00 = this.n11, a01 = this.n21, a02 = this.n31, a03 = this.n41;
        let a10 = this.n12, a11 = this.n22, a12 = this.n32, a13 = this.n42;
        let a20 = this.n13, a21 = this.n23, a22 = this.n33, a23 = this.n43;
        let a30 = this.n14, a31 = this.n24, a32 = this.n34, a33 = this.n44;

        let b00 = a00 * a11 - a01 * a10;
        let b01 = a00 * a12 - a02 * a10;
        let b02 = a00 * a13 - a03 * a10;
        let b03 = a01 * a12 - a02 * a11;
        let b04 = a01 * a13 - a03 * a11;
        let b05 = a02 * a13 - a03 * a12;
        let b06 = a20 * a31 - a21 * a30;
        let b07 = a20 * a32 - a22 * a30;
        let b08 = a20 * a33 - a23 * a30;
        let b09 = a21 * a32 - a22 * a31;
        let b10 = a21 * a33 - a23 * a31;
        let b11 = a22 * a33 - a23 * a32;

        // Calculate the determinant
        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (!det) {
            return null;
        }
        det = 1.0 / det;

        this.n11 = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        this.n21 = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        this.n31 = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        this.n41 = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        this.n12 = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        this.n22 = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        this.n32 = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        this.n42 = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        this.n13 = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        this.n23 = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        this.n33 = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        this.n43 = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        this.n14 = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        this.n24 = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        this.n34 = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        this.n44 = (a20 * b03 - a21 * b01 + a22 * b00) * det;
        return this;
    }

    equal(m: Matrix3D): boolean {
        let t = this;
        return floatEqual(t.n11, m.n11) &&
            floatEqual(t.n12, m.n12) &&
            floatEqual(t.n13, m.n13) &&
            floatEqual(t.n14, m.n14) &&
            floatEqual(t.n21, m.n21) &&
            floatEqual(t.n22, m.n22) &&
            floatEqual(t.n23, m.n23) &&
            floatEqual(t.n24, m.n24) &&
            floatEqual(t.n31, m.n31) &&
            floatEqual(t.n32, m.n32) &&
            floatEqual(t.n33, m.n33) &&
            floatEqual(t.n34, m.n34) &&
            floatEqual(t.n41, m.n41) &&
            floatEqual(t.n42, m.n42) &&
            floatEqual(t.n43, m.n43) &&
            floatEqual(t.n44, m.n44);
    }


    /**
     *  this =  m * this 
     * @param m 
     */
    append(m: Matrix3D): this {

        let t11 = this.n11, t12 = this.n12, t13 = this.n13, t14 = this.n14;
        let t21 = this.n21, t22 = this.n22, t23 = this.n23, t24 = this.n24;
        let t31 = this.n31, t32 = this.n32, t33 = this.n33, t34 = this.n34;
        let t41 = this.n41, t42 = this.n42, t43 = this.n43, t44 = this.n44;

        this.n11 = m.n11 * t11 + m.n12 * t21 + m.n13 * t31 + m.n14 * t41;
        this.n12 = m.n11 * t12 + m.n12 * t22 + m.n13 * t32 + m.n14 * t42;
        this.n13 = m.n11 * t13 + m.n12 * t23 + m.n13 * t33 + m.n14 * t43;
        this.n14 = m.n11 * t14 + m.n12 * t24 + m.n13 * t34 + m.n14 * t44;

        this.n21 = m.n21 * t11 + m.n22 * t21 + m.n23 * t31 + m.n24 * t41;
        this.n22 = m.n21 * t12 + m.n22 * t22 + m.n23 * t32 + m.n24 * t42;
        this.n23 = m.n21 * t13 + m.n22 * t23 + m.n23 * t33 + m.n24 * t43;
        this.n24 = m.n21 * t14 + m.n22 * t24 + m.n23 * t34 + m.n24 * t44;

        this.n31 = m.n31 * t11 + m.n32 * t21 + m.n33 * t31 + m.n34 * t41;
        this.n32 = m.n31 * t12 + m.n32 * t22 + m.n33 * t32 + m.n34 * t42;
        this.n33 = m.n31 * t13 + m.n32 * t23 + m.n33 * t33 + m.n34 * t43;
        this.n34 = m.n31 * t14 + m.n32 * t24 + m.n33 * t34 + m.n34 * t44;

        this.n41 = m.n41 * t11 + m.n42 * t21 + m.n43 * t31 + m.n44 * t41;
        this.n42 = m.n41 * t12 + m.n42 * t22 + m.n43 * t32 + m.n44 * t42;
        this.n43 = m.n41 * t13 + m.n42 * t23 + m.n43 * t33 + m.n44 * t43;
        this.n44 = m.n41 * t14 + m.n42 * t24 + m.n43 * t34 + m.n44 * t44;

        return this;

    }

    /**
     * this = this * m
     * @param m 
     */
    prepend(m: Matrix3D): this {

        let t11 = this.n11, t12 = this.n12, t13 = this.n13, t14 = this.n14;
        let t21 = this.n21, t22 = this.n22, t23 = this.n23, t24 = this.n24;
        let t31 = this.n31, t32 = this.n32, t33 = this.n33, t34 = this.n34;
        let t41 = this.n41, t42 = this.n42, t43 = this.n43, t44 = this.n44;

        this.n11 = t11 * m.n11 + t12 * m.n21 + t13 * m.n31 + t14 * m.n41;
        this.n12 = t11 * m.n12 + t12 * m.n22 + t13 * m.n32 + t14 * m.n42;
        this.n13 = t11 * m.n13 + t12 * m.n23 + t13 * m.n33 + t14 * m.n43;
        this.n14 = t11 * m.n14 + t12 * m.n24 + t13 * m.n34 + t14 * m.n44;

        this.n21 = t21 * m.n11 + t22 * m.n21 + t23 * m.n31 + t24 * m.n41;
        this.n22 = t21 * m.n12 + t22 * m.n22 + t23 * m.n32 + t24 * m.n42;
        this.n23 = t21 * m.n13 + t22 * m.n23 + t23 * m.n33 + t24 * m.n43;
        this.n24 = t21 * m.n14 + t22 * m.n24 + t23 * m.n34 + t24 * m.n44;

        this.n31 = t31 * m.n11 + t32 * m.n21 + t33 * m.n31 + t34 * m.n41;
        this.n32 = t31 * m.n12 + t32 * m.n22 + t33 * m.n32 + t34 * m.n42;
        this.n33 = t31 * m.n13 + t32 * m.n23 + t33 * m.n33 + t34 * m.n43;
        this.n34 = t31 * m.n14 + t32 * m.n24 + t33 * m.n34 + t34 * m.n44;

        this.n41 = t41 * m.n11 + t42 * m.n21 + t43 * m.n31 + t44 * m.n41;
        this.n42 = t41 * m.n12 + t42 * m.n22 + t43 * m.n32 + t44 * m.n42;
        this.n43 = t41 * m.n13 + t42 * m.n23 + t43 * m.n33 + t44 * m.n43;
        this.n44 = t41 * m.n14 + t42 * m.n24 + t43 * m.n34 + t44 * m.n44;
        return this;
    }

    multiply = this.prepend;

    translate(x: number, y: number, z: number): this {

        /*
        *   1 0 0 x
        *   0 1 0 y   *  this
        *   0 0 1 z
        *   0 0 0 1
        */
        this.n11 += this.n41 * x, this.n12 += this.n42 * x, this.n13 += this.n43 * x, this.n14 += this.n44 * x;
        this.n21 += this.n41 * y, this.n22 += this.n42 * y, this.n23 += this.n43 * y, this.n24 += this.n44 * y;
        this.n31 += this.n41 * z, this.n32 += this.n42 * z, this.n33 += this.n43 * z, this.n34 += this.n44 * z;

        return this;
    }

    scale(x: number, y: number = x, z: number = x): this {

        /*
        *   x 0 0 0
        *   0 y 0 0    *  this
        *   0 0 z 0
        *   0 0 0 1
        */

        let t = this;
        t.n11 *= x, t.n12 *= x, t.n13 *= x, t.n14 *= x;
        t.n21 *= y, t.n22 *= y, t.n23 *= y, t.n24 *= y;
        t.n31 *= z, t.n32 *= z, t.n33 *= z, t.n34 *= z;

        return this;
    }

    rotateX(angle: number): this {

        // 1, 0,  0, 0,
        // 0, c, -s, 0,  *  this
        // 0, s,  c, 0,
        // 0, 0,  0, 1

        angle *= Deg2Rad;

        let c: number = Math.cos(angle);
        let s: number = Math.sin(angle);

        let t = this;
        let m21 = t.n21, m22 = t.n22, m23 = t.n23, m24 = t.n24
        let m31 = t.n31, m32 = t.n32, m33 = t.n33, m34 = t.n34
        t.n21 = c * m21 - s * m31, t.n22 = c * m22 - s * m32, t.n23 = c * m23 - s * m33, t.n24 = c * m24 - s * m34;
        t.n31 = s * m21 + c * m31, t.n32 = s * m22 + c * m32, t.n33 = s * m23 + c * m33, t.n34 = s * m24 + c * m34;
        return t;
    }

    rotateY(angle: number): this {

        // c,  0, s, 0,
        // 0,  1, 0, 0,  *  this
        // -s, 0, c, 0,
        // 0,  0, 0, 1

        angle *= Deg2Rad;

        let c: number = Math.cos(angle);
        let s: number = Math.sin(angle);
        let t = this;

        let m11 = t.n11, m12 = t.n12, m13 = t.n13, m14 = t.n14;
        let m31 = t.n31, m32 = t.n32, m33 = t.n33, m34 = t.n34;

        t.n11 = c * m11 + s * m31, t.n12 = c * m12 + s * m32, t.n13 = c * m13 + s * m33, t.n14 = c * m14 + s * m34;
        t.n31 = -s * m11 + c * m31, t.n32 = -s * m12 + c * m32, t.n33 = -s * m13 + c * m33, t.n34 = -s * m14 + c * m34;

        return t;
    }

    rotateZ(angle: number): this {

        // c, -s, 0, 0,
        // s, c,  0, 0,    *   this
        // 0, 0,  1, 0,
        // 0, 0,  0, 1

        angle *= Deg2Rad;

        let c: number = Math.cos(angle);
        let s: number = Math.sin(angle);
        let t = this;

        let m11 = t.n11, m12 = t.n12, m13 = t.n13, m14 = t.n14;
        let m21 = t.n21, m22 = t.n22, m23 = t.n23, m24 = t.n24;

        t.n11 = c * m11 - s * m21; t.n12 = c * m12 - s * m22; t.n13 = c * m13 - s * m23, t.n14 = c * m14 - s * m24;
        t.n21 = s * m11 + c * m21; t.n22 = s * m12 + c * m22; t.n23 = s * m13 + c * m23, t.n24 = s * m14 + c * m24;

        return t;
    }


    /**
     * 用此变量变换一个点，注意此方法会修改点p
     * @param p 被变换的点
     */
    transformPoint(p: Vector3D): Vector3D {

        // | n11 n12 n13 n14 |      x
        // | n21 n22 n23 n24 |  *   y
        // | n31 n32 n33 n34 |      z
        // | n41 n42 n43 n44 |      1

        let x = p.x, y = p.y, z = p.z, t = this;
        p.x = t.n11 * x + t.n12 * y + t.n13 * z + t.n14;
        p.y = t.n21 * x + t.n22 * y + t.n23 * z + t.n24;
        p.z = t.n31 * x + t.n32 * y + t.n33 * z + t.n34;
        p.w = t.n41 * x + t.n42 * y + t.n43 * z + t.n44;
        return p;
    }

    /**
     * 用此变量变换方向v,注意此方法会修改方向v
     * @param v 被变换的向量
     */
    transformVecotr(v: Vector3D): Vector3D {

        // | n11 n12 n13 n14 |      x
        // | n21 n22 n23 n24 |  *   y
        // | n31 n32 n33 n34 |      z
        // | n41 n42 n43 n44 |      0

        let x = v.x, y = v.y, z = v.z, t = this;
        v.x = t.n11 * x + t.n12 * y + t.n13 * z;
        v.y = t.n21 * x + t.n22 * y + t.n23 * z;
        v.z = t.n31 * x + t.n32 * y + t.n33 * z;
        v.w = t.n41 * x + t.n42 * y + t.n43 * z;
        return v;
    }

    copyFrom(m: Matrix3D): this {

        return this.reset(
            m.n11, m.n12, m.n13, m.n14,
            m.n21, m.n22, m.n23, m.n24,
            m.n31, m.n32, m.n33, m.n34,
            m.n41, m.n42, m.n43, m.n44)
    }

    clone(): Matrix3D {

        return new Matrix3D(
            this.n11, this.n12, this.n13, this.n14,
            this.n21, this.n22, this.n23, this.n24,
            this.n31, this.n32, this.n33, this.n34,
            this.n41, this.n42, this.n43, this.n44
        )
    }




    //if M = T(t)R(φ), then M−1 = R(−φ)T(−t).
    // invertTR() {
    //     // this method can only be used if the matrix is a translation/rotation matrix.
    //     // the below asserts will trigger if this is not the case.
    //     // if (__DEBUG__) {
    //     // each basis vector should be length 1

    //     // Math.abs(getForwardVector().lengthSqr() - 1 ) < 0.00001
    //     // Math.abs(upVector().lengthSqr() - 1 ) < 0.00001
    //     // Math.abs(RightVector().lengthSqr() - 1 ) < 0.00001

    //     // Math.abs(frowardVector().dot(upVector)) < 0.00001 // all vectors should be orthogonal
    //     // Math.abs(frowardVector().dot(rightVector)) < 0.00001 // all vectors should be orthogonal
    //     // Math.abs(rightVector().dot(upVector)) < 0.00001 // all vectors should be orthogonal
    //     // }



    //     return new Matrix3D();
    // }

    /**
     * column major order
     */
    get float32Array(): Float32Array {
        return this.toArray(this._temp, true);
    }

    set float32Array(arr: Float32Array) {
        this.fromArray(arr, true)
    }

    toArray(out?: Float32Array, columnMajor: boolean = true) {
        let t = this;
        if (!out)
            out = new Float32Array(16);
        if (columnMajor) {
            out[0] = t.n11; out[4] = t.n12; out[8] = t.n13; out[12] = t.n14;
            out[1] = t.n21; out[5] = t.n22; out[9] = t.n23; out[13] = t.n24;
            out[2] = t.n31; out[6] = t.n32; out[10] = t.n33; out[14] = t.n34;
            out[3] = t.n41; out[7] = t.n42; out[11] = t.n43; out[15] = t.n44;
        } else {
            out[0] = t.n11; out[1] = t.n12; out[2] = t.n13; out[3] = t.n14;
            out[4] = t.n21; out[5] = t.n22; out[6] = t.n23; out[7] = t.n24;
            out[8] = t.n31; out[9] = t.n32; out[10] = t.n33; out[11] = t.n34;
            out[12] = t.n41; out[13] = t.n42; out[14] = t.n43; out[15] = t.n44;
        }
        return out;
    }

    fromArray(arr: Float32Array, columnMajor: boolean = true) {
        let t = this;
        if (columnMajor) {
            t.n11 = arr[0]; t.n12 = arr[4]; t.n13 = arr[8]; t.n14 = arr[12];
            t.n21 = arr[1]; t.n22 = arr[5]; t.n23 = arr[9]; t.n24 = arr[13];
            t.n31 = arr[2]; t.n32 = arr[6]; t.n33 = arr[10]; t.n34 = arr[14];
            t.n41 = arr[3]; t.n42 = arr[7]; t.n43 = arr[11]; t.n44 = arr[15];
        } else {
            t.n11 = arr[0]; t.n12 = arr[1]; t.n13 = arr[2]; t.n14 = arr[3];
            t.n21 = arr[4]; t.n22 = arr[5]; t.n23 = arr[6]; t.n24 = arr[7];
            t.n31 = arr[8]; t.n32 = arr[9]; t.n33 = arr[10]; t.n34 = arr[11];
            t.n41 = arr[12]; t.n42 = arr[13]; t.n43 = arr[14]; t.n44 = arr[15];
        }
    }

    toString(): string {
        return '|  ' + this.n11 + ',' + this.n12 + ',' + this.n13 + ',' + this.n14 + '\n'
            + '|  ' + this.n21 + ',' + this.n22 + ',' + this.n23 + ',' + this.n24 + '\n'
            + '|  ' + this.n31 + ',' + this.n32 + ',' + this.n33 + ',' + this.n34 + '\n'
            + '|  ' + this.n41 + ',' + this.n42 + ',' + this.n43 + ',' + this.n44 + '\n'

    }

}