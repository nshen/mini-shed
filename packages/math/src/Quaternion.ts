import { Vector3D } from "./Vector3D";
import { Matrix3D } from "./Matrix3D";
import { floatEqual, Deg2Rad, clamp, Rad2Deg } from "./MathUtils";
import { Euler } from "./Euler";

export class Quaternion {

    constructor(
        public x: number = 0,
        public y: number = 0,
        public z: number = 0,
        public w: number = 1) {
    }

    static Slerp(q1: Quaternion, q2: Quaternion, t: number, out: Quaternion = new Quaternion()): Quaternion {

        let sin = Math.sin;
        let dot = q1.x * q2.x + q1.y * q2.y + q1.z * q2.z + q1.w * q2.w;
        // the clamp takes care of floating-point errors
        const omega: number = Math.acos(clamp(dot, -1.0, 1.0));
        const sin_inv: number = 1.0 / sin(omega);

        let q1part = sin((1.0 - t) * omega) * sin_inv;
        let q2part = sin(t * omega) * sin_inv;

        out.x = q1part * q1.x + q2part * q2.x;
        out.y = q1part * q1.y + q2part * q2.y;
        out.z = q1part * q1.z + q2part * q2.z;
        out.w = q1part * q1.w + q2part * q2.w;

        return out;
    }

    static Difference(q1: Quaternion, q2: Quaternion, out: Quaternion = new Quaternion()): Quaternion {
        return out.copyFrom(q1).invert().append(q2);
    }

    static Angle(u: Quaternion, v: Quaternion): number {
        let dot = u.x * v.x + u.y * v.y + u.z * v.z + u.w * v.w;
        return Math.acos(Math.min(Math.abs(dot), 1)) * 2 * Rad2Deg;
    }

    identity(): this {
        this.x = this.y = this.z = 0;
        this.w = 1;
        return this;
    }

    get lengthSquared(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    }

    get length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }

    dot(q: Quaternion): number {
        return this.x * q.x + this.y * q.y + this.z * q.z + this.w * q.w;
    }

    conjugate(): this {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    }

    invert = this.conjugate;

    rotateX(angle: number): this {

        //    w         x       y  z
        // [cosθ / 2, sinθ / 2, 0, 0] * this

        angle = angle * Deg2Rad * 0.5;
        let ax = this.x, ay = this.y, az = this.z, aw = this.w;
        let bx = Math.sin(angle), bw = Math.cos(angle);

        this.w = bw * aw - bx * ax;
        this.x = bw * ax + bx * aw;
        this.y = bw * ay - bx * az;
        this.z = bw * az + bx * ay;
        return this;
    }

    rotateY(angle: number): this {
        //    w         x      y      z
        // [cosθ / 2,  0,   sinθ / 2, 0] * this

        angle = angle * Deg2Rad * 0.5;
        let ax = this.x, ay = this.y, az = this.z, aw = this.w;
        let by = Math.sin(angle), bw = Math.cos(angle);
        this.w = bw * aw - by * ay;
        this.x = bw * ax + by * az;
        this.y = bw * ay + by * aw;
        this.z = bw * az - by * ax;
        return this;
    }

    rotateZ(angle: number): this {
        // Qb: { x: 0, y: 0 , z: sin(rad / 2), w: cos(rad / 2) } * this

        angle = angle * Deg2Rad * 0.5;
        let ax = this.x, ay = this.y, az = this.z, aw = this.w;
        let bz = Math.sin(angle), bw = Math.cos(angle);

        this.w = bw * aw - bz * az;
        this.x = bw * ax - bz * ay;
        this.y = bw * ay + bz * ax;
        this.z = bw * az + bz * aw;
        return this;
    }

    prepend(b: Quaternion): this {

        // a multiply b
        // https://www.youtube.com/watch?v=CRiR2eY5R_s&list=PLW3Zl3wyJwWOpdhYedlD-yCB7WQoHf-My&index=34
        // w = [ aw . bw - av . bv]
        // n = [ aw . bv + bw . av  + av x bv ]

        let ax = this.x, ay = this.y, az = this.z, aw = this.w;
        this.w = aw * b.w - ax * b.x - ay * b.y - az * b.z;
        this.x = aw * b.x + ax * b.w + ay * b.z - az * b.y;
        this.y = aw * b.y + ay * b.w + az * b.x - ax * b.z;
        this.z = aw * b.z + az * b.w + ax * b.y - ay * b.x;
        return this;

    }

    // The quaternion product is also known as the Hamilton product
    // (ab)^−1 = b^−1a^−1
    multiply = this.prepend;

    append(b: Quaternion): this {

        let ax = this.x, ay = this.y, az = this.z, aw = this.w;
        this.w = b.w * aw - b.x * ax - b.y * ay - b.z * az;
        this.x = b.w * ax + b.x * aw + b.y * az - b.z * ay;
        this.y = b.w * ay + b.y * aw + b.z * ax - b.x * az;
        this.z = b.w * az + b.z * aw + b.x * ay - b.y * ax;
        return this;
    }

    rotateVector(v: Vector3D): Vector3D {

        /*

            Rotate a vector with this quaternion.
            http://youtu.be/Ne3RNhEVSIE
            The basic equation is qpq* (the * means inverse) but we use a simplified version of that equation.
            let p: Quaternion = new Quaternion(v.x, v.y, v.z, 0);
            Could do it this way:

            const Quaternion& q = (*this);
            return (q * p * q.Inverted()).v;

            But let's optimize it a bit instead.
            Vector vcV = v.Cross(V);
            return V + vcV * (2 * w) + v.Cross(vcV) * 2;

        */

        // this.v cross v
        let vcVx = this.y * v.z - this.z * v.y;
        let vcVy = this.z * v.x - this.x * v.z;
        let vcVz = this.x * v.y - this.y * v.x;

        // this.v cross vcV
        let vCrossvcVx = this.y * vcVz - this.z * vcVy;
        let vCrossvcVy = this.z * vcVx - this.x * vcVz;
        let vCrossvcVz = this.x * vcVy - this.y * vcVx;

        let w2 = 2 * this.w;

        v.x = v.x + vcVx * w2 + vCrossvcVx * 2;
        v.y = v.y + vcVy * w2 + vCrossvcVy * 2;
        v.z = v.z + vcVz * w2 + vCrossvcVz * 2;

        return v;

    }



    // transformVector(v: Vector3D): Vector3D {

    // }


    fromEuler(e: Euler) {
        // TODO: from Euler to Quaternion
        e;

    }

    fromAxisAngle(axis: Vector3D, angle: number): this {

        // w = cos(rad/2) , 
        // x,y,z = n * sin(rad/2)
        angle = angle * Deg2Rad * 0.5;
        let s = Math.sin(angle);
        this.w = Math.cos(angle);
        this.x = axis.x * s;
        this.y = axis.y * s;
        this.z = axis.z * s;
        return this;
    }

    toAxisAngle(outAxis: Vector3D, outAngle: number) {
        //TODO: Quaternion to AxisAngle
    }

    fromMatrix(m: Matrix3D): this {
        // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
        // article "Quaternion Calculus and Fast Animation".
        let trace = m.n11 + m.n22 + m.n33;
        if (trace > 0) {
            let s = 0.5 / Math.sqrt(trace + 1.0);

            this.w = 0.25 / s;
            this.x = (m.n32 - m.n23) * s;
            this.y = (m.n13 - m.n31) * s;
            this.z = (m.n21 - m.n12) * s;

        } else if ((m.n11 > m.n22) && (m.n11 > m.n33)) {
            let s = 2.0 * Math.sqrt(1.0 + m.n11 - m.n22 - m.n33);

            this.w = (m.n32 - m.n23) / s;
            this.x = 0.25 * s;
            this.y = (m.n12 + m.n21) / s;
            this.z = (m.n13 + m.n31) / s;

        } else if (m.n22 > m.n33) {
            let s = 2.0 * Math.sqrt(1.0 + m.n22 - m.n11 - m.n33);

            this.w = (m.n13 - m.n31) / s;
            this.x = (m.n12 + m.n21) / s;
            this.y = 0.25 * s;
            this.z = (m.n23 + m.n32) / s;

        } else {
            let s = 2.0 * Math.sqrt(1.0 + m.n33 - m.n11 - m.n22);

            this.w = (m.n21 - m.n12) / s;
            this.x = (m.n13 + m.n31) / s;
            this.y = (m.n23 + m.n32) / s;
            this.z = 0.25 * s;
        }
        return this;
    }



    // w 应该为 -  ，3D Math Primer for Graphics and Game Development 2nd 错的？
    // fromMatrix(m: Matrix3D): this {

    //     //   Determine which of w, x, y, or z has the largest absolute value
    //     let fourWSquaredMinus1 = m.n11 + m.n22 + m.n33;
    //     let fourXSquaredMinus1 = m.n11 - m.n22 - m.n33;
    //     let fourYSquaredMinus1 = m.n22 - m.n11 - m.n33;
    //     let fourZSquaredMinus1 = m.n33 - m.n11 - m.n22;

    //     let biggestIndex = 0
    //     let fourBiggestSquaredMinus1 = fourWSquaredMinus1;
    //     if (fourXSquaredMinus1 > fourBiggestSquaredMinus1) {
    //         fourBiggestSquaredMinus1 = fourXSquaredMinus1;
    //         biggestIndex = 1;
    //     }
    //     if (fourYSquaredMinus1 > fourBiggestSquaredMinus1) {
    //         fourBiggestSquaredMinus1 = fourYSquaredMinus1;
    //         biggestIndex = 2;
    //     }
    //     if (fourZSquaredMinus1 > fourBiggestSquaredMinus1) {
    //         fourBiggestSquaredMinus1 = fourZSquaredMinus1;
    //         biggestIndex = 3;
    //     }
    //     // Perform square root and division
    //     let biggestVal = Math.sqrt(fourBiggestSquaredMinus1 + 1.0) * 0.5;
    //     let mult = 0.25 / biggestVal;
    //     // Apply table to compute quaternion values
    //     switch (biggestIndex) {
    //         case 0:
    //             this.w = biggestVal;
    //             this.x = (m.n23 - m.n32) * mult;
    //             this.y = (m.n31 - m.n13) * mult;
    //             this.z = (m.n12 - m.n21) * mult;
    //             break;
    //         case 1:
    //             this.x = biggestVal;
    //             this.w = (m.n23 - m.n32) * mult;
    //             this.y = (m.n12 + m.n21) * mult;
    //             this.z = (m.n31 + m.n13) * mult;
    //             break;
    //         case 2:
    //             this.y = biggestVal;
    //             this.w = (m.n31 - m.n13) * mult;
    //             this.x = (m.n12 + m.n21) * mult;
    //             this.z = (m.n23 + m.n32) * mult;
    //             break;
    //         case 3:
    //             this.z = biggestVal;
    //             this.w = (m.n12 - m.n21) * mult;
    //             this.x = (m.n31 + m.n13) * mult;
    //             this.y = (m.n23 + m.n32) * mult;
    //             break;
    //     }
    //     return this
    // }

    //TODO: Slerp
    //TODO: Lerp
    // TODO: Quaternion.RotateTowards
    // Quaternion.Slerp
    // static multiply(a: Quaternion, b: Quaternion): Quaternion {


    // }



    /**
     * 有些时候由于浮点数误差，需要我们重新normalize
     */
    normalize(): this {
        let len: number = this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
        if (len === 0) {
            this.x = this.y = this.z = 0;
            this.w = 1;
        } else {
            len = 1 / Math.sqrt(len);
            this.x *= len;
            this.y *= len;
            this.z *= len;
            this.w *= len;
        }
        return this;
    }

    LookRotation(forward: Vector3D, upwards: Vector3D = Vector3D.UP): this {
        // TODO: Quaternion.lookrotation

        return this;
    }

    FromToRotation(from: Vector3D, to: Vector3D): this {
        // TODO: Quaternion FromToRotation
        // https://github.com/NickCuso/Tutorials/blob/master/Quaternions.md
        // https://gist.github.com/aeroson/043001ca12fe29ee911e
        // http://lolengine.net/blog/2013/09/18/beautiful-maths-quaternion-from-vectors
        // https://github.com/mrdoob/three.js/blob/dev/src/math/Quaternion.js
        return this;
    }


    // The quaternions q and −q describe the same angular displacement. 
    equal(q: Quaternion): boolean {
        let d = this.dot(q);
        return (floatEqual(d, 1) || floatEqual(d, -1))
        // return floatEqual(this.x, q.x) && floatEqual(this.y, q.y) && floatEqual(this.z, q.z) && floatEqual(this.w, q.w);
    }

    copyFrom(q: Quaternion): this {
        this.x = q.x;
        this.y = q.y;
        this.z = q.z;
        this.w = q.w;
        return this;
    }

    clone(): Quaternion {
        return new Quaternion(this.x, this.y, this.z, this.w);
    }

    toString(): string {
        return "[Quaternion] (x:" + this.x + " ,y:" + this.y + ", z:" + this.z + ", w:" + this.w + ")";
    }

}