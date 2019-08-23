import { Matrix3D } from "./Matrix3D";
import { floatEqual } from "./MathUtils";

export class Vector3D {

    static readonly RIGHT: Vector3D = new Vector3D(1, 0, 0);
    static readonly UP: Vector3D = new Vector3D(0, 1, 0);
    /**
     * z = 1
     */
    static readonly FORWARD: Vector3D = new Vector3D(0, 0, 1);

    static readonly ZERO: Vector3D = new Vector3D();

    x: number;
    y: number;
    z: number;
    w: number; // 1 : point ,  0 : vector 

    constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    /*-------------- static methods -------------*/

    public static angleBetween(a: Vector3D, b: Vector3D): number {
        return Math.acos(a.dot(b) / (a.length * b.length));
    }

    /**
     * [static] Returns the distance between two points.
     */
    public static distance(pt1: Vector3D, pt2: Vector3D): number {
        let x: number = (pt1.x - pt2.x);
        let y: number = (pt1.y - pt2.y);
        let z: number = (pt1.z - pt2.z);
        return Math.sqrt(x * x + y * y + z * z);
    }

    // v × w = −(w × v)
    // 1. 计算平面normal
    // 2. == 0 向量平行
    public static cross(v1: Vector3D, v2: Vector3D, out: Vector3D = new Vector3D()): Vector3D {
        out.x = v1.y * v2.z - v1.z * v2.y;
        out.y = v1.z * v2.x - v1.x * v2.z;
        out.z = v1.x * v2.y - v1.y * v2.x;
        return out;
    }

    /**
     *  return u . (v x w) 
     *  1. 结果为 u, v, w 为边的平行六面体体积，如果等于0，则3向量共面，因为体积为0
     *  2. v,w 与线性无关的向量 u 位置关系，如果 u • (v × w) < 0 则从v 绕u 到w 的最小角度是逆时针，否则 >0 为顺时针
     *  3. Formally, if we have three basis vectors {v0, v1, v2}, 
     *     then they are right-handed if v0 • (v1 × v2) > 0, 
     *     and left-handed if v0 • (v1 × v2) < 0. 
     *     If v0 • (v1 × v2) = 0, we've got a problem our vectors are linearly dependent and hence not a basis.
     */
    public static scalarTripleProduct(u: Vector3D, v: Vector3D, w: Vector3D): number {
        return u.dot(Vector3D.cross(v, w));
    }

    /**
     *  u x ( v x w )
     *  特殊情况，用于计算正交基 w x ( v x w )
     **/
    public static vectorTripleProduct(u: Vector3D, v: Vector3D, w: Vector3D, out: Vector3D = new Vector3D()): Vector3D {
        let vxw = Vector3D.cross(v, w);
        return Vector3D.cross(u, vxw, out);
    }

    /*-------------- getter setter -------------*/

    get length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    set length(value: number) {
        let len = this.x * this.x + this.y * this.y + this.z * this.z;
        if (len === 0) {
            this.x = value;
            this.y = this.z = 0;
        } else {
            len = value / Math.sqrt(len);
            this.x *= len;
            this.y *= len;
            this.z *= len;
        }
    }

    get lengthSquared(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    /*-------------- public methods -------------*/

    public add(v: Vector3D): this {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    public sub(v: Vector3D): Vector3D {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }

    public minus = this.sub;

    public multiply(v: Vector3D): Vector3D {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        return this;
    }

    public divide(v: Vector3D): Vector3D {
        this.x /= v.x;
        this.y /= v.y;
        this.z /= v.z;
        return this;
    }

    public equal(toCompare: Vector3D, allFour: boolean = false): boolean {
        return (floatEqual(this.x, toCompare.x) && floatEqual(this.y, toCompare.y) && floatEqual(this.z, toCompare.z) && (allFour ? floatEqual(this.w, toCompare.w) : true));
    }

    public nearEqual(toCompare: Vector3D, tolerance: number = 0.0001, allFour: boolean = false): boolean {
        let abs: Function = Math.abs;
        return ((abs(this.x - toCompare.x) < tolerance) && (abs(this.y - toCompare.y) < tolerance) && (abs(this.z - toCompare.z) < tolerance) && (allFour ? (abs(this.w - toCompare.w) < tolerance) : true));
    }

    public isZero(): boolean {
        return ((this.x === 0) && (this.y === 0) && (this.z === 0));
    }

    public nearZero(): boolean {
        return this.nearEqual(Vector3D.ZERO);
    }

    public distanceTo(p2: Vector3D): number {
        let x = p2.x - this.x;
        let y = p2.y - this.y;
        let z = p2.z - this.z;
        return Math.sqrt(x * x + y * y + z * z);
    }

    public squaredDistanceTo(p2: Vector3D): number {
        let x = p2.x - this.x;
        let y = p2.y - this.y;
        let z = p2.z - this.z;
        return x * x + y * y + z * z;
    }

    public scale(s: number): Vector3D {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    }

    public negate(): Vector3D {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    }

    public normalize(): Vector3D {
        let len: number = this.x * this.x + this.y * this.y + this.z * this.z;
        if (len === 0) {
            this.x = 1;
            this.y = this.z = 0;
        } else {
            len = 1 / Math.sqrt(len);
            this.x *= len;
            this.y *= len;
            this.z *= len;
        }
        return this;
    }

    // use Vector3D.cross() instead
    // public cross(v: Vector3D): Vector3D {
    //     return new Vector3D(
    //         this.y * v.z - this.z * v.y,
    //         this.z * v.x - this.x * v.z,
    //         this.x * v.y - this.y * v.x);
    // }

    public dot(v: Vector3D): number {
        return (this.x * v.x + this.y * v.y + this.z * v.z);
    }

    /**
     * 投影到 V 向量上ou
     */
    public projectOntoV(v: Vector3D): Vector3D {
        let dp: number = this.x * v.x + this.y * v.y + this.z * v.z; // this.dot(v)
        let f: number = dp / (v.x * v.x + v.y * v.y + v.z * v.z); // divided by |v|^2
        this.x = f * this.x;
        this.y = f * this.y;
        this.z = f * this.z;
        return this;
    }

    /**
     * 取得此向量在v法线上投影后的向量
     */
    public projectOntoPerpV(v: Vector3D): Vector3D {
        let dp: number = this.x * v.x + this.y * v.y + this.z * v.z;
        let f: number = dp / (v.x * v.x + v.y * v.y + v.z * v.z);

        this.x -= f * v.x;
        this.y -= f * v.y;
        this.z -= f * v.z;
        return this;
    }

    public toSphericalCoordinates() {
        let r = this.length;
        let phi = Math.atan2(Math.sqrt(this.x * this.x + this.y * this.y), this.z);
        let theta = Math.atan2(this.y, this.x);
        return { r, phi, theta };

    }

    /**
     * Spherical coordinates (r, θ, φ) as often used in mathematics: 
     * The meanings of θ and φ have been swapped compared to the physics convention.
     * https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/3D_Spherical_2.svg/240px-3D_Spherical_2.svg.png
     *  
     * @param r 半径v的长度 radial distance r 
     * @param phi   φ v到z轴的旋转角度, polar angle φ. 
     * @param theta θ 从x轴绕z轴逆时针旋转到v投影到xy平面, azimuthal angle θ
     */
    public fromSphericalCoordinates(r: number, phi: number, theta: number) {
        let sinPhi = Math.sin(phi)
        this.x = r * sinPhi * Math.cos(theta);
        this.y = r * sinPhi * Math.sin(theta);
        this.z = r * Math.cos(phi)
        return this;
    }


    /**
     * 齐次坐标转笛卡尔坐标
     */
    public project(): Vector3D {
        if (this.w == 0) return this;
        this.x /= this.w;
        this.y /= this.w;
        this.z /= this.w;
        return this;
    }

    /**
     * Copies all of vector data from the source Vector3D object into the calling Vector3D object.
     */
    public copyFrom(v: Vector3D): void {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        this.w = v.w;
    }

    public copyPosition(m: Matrix3D) {
        this.x = m.n14;
        this.y = m.n24;
        this.z = m.n34;
        this.w = m.n44;
    }

    /**
     * Sets the members of Vector3D to the specified values
     */
    public reset(x: number = 0, y: number = 0, z: number = 0): Vector3D {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    public clone(): Vector3D {
        return new Vector3D(this.x, this.y, this.z, this.w);
    }

    public toString(): string {
        return "[Vector3D] (x:" + this.x + " ,y:" + this.y + ", z:" + this.z + ", w:" + this.w + ")";
    }


}