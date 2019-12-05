import { floatEqual } from "./MathUtils";
import { ICommonMethod } from "./ICommonMethod";
export class Vector2D implements ICommonMethod<Vector2D> {

    static X_AXIS: Vector2D = new Vector2D(1, 0);
    static Y_AXIS: Vector2D = new Vector2D(0, 1);

    public x: number;
    public y: number;

    public constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    public static Lerp(v1: Vector2D, v2: Vector2D, t: number = 0, out: Vector2D = new Vector2D()): Vector2D {
        out.x = v1.x + (v2.x - v1.x) * t;
        out.y = v1.y + (v2.y - v1.y) * t;
        // same as
        // nx = v1.x * (1 - t) + v2.x * t;
        // ny = v1.y * (1 - t) + v2.y * t;
        return out;
    }

    /**
     * 返回一个指定长度的随机方向向量
     * @static
     * @param scale 向量长度，默认为1
     * @param out 省略则返回一个新创建的 Vector2D 否则复制到 out 向量
     */
    public static Random(scale: number = 1, out?: Vector2D): Vector2D {
        let r: number = Math.random() * 2 * Math.PI;
        let nx: number = Math.cos(r) * scale;
        let ny: number = Math.sin(r) * scale;
        if (out) {
            out.x = nx;
            out.y = ny;
            return out;
        }

        return new Vector2D(nx, ny);
    }

    /**
     * 取得两向量之间夹角的弧度值，逆时针为正    
     * @static 
     * @param {Vector2D} v1
     * @param {Vector2D} v2
     * @returns {number} 两向量之间夹角，单位为弧度得
     * 
     * @memberOf Vector2D
     */
    public static AngleBetween(v1: Vector2D, v2: Vector2D): number {
        return Math.atan2(v1.cross(v2), v1.dot(v2)); //  tan = sin / cos
    }

    /**
     * 极坐标转换为笛卡尔坐标 
     * 
     * @static
     * @param {number} len 半径长度
     * @param {number} radians 弧度值
     * @returns
     * 
     * @memberOf Vector2D
     */
    public static fromPolar(len: number, radians: number, out?: Vector2D) {
        let nx: number = len * Math.cos(radians)
        let ny: number = len * Math.sin(radians)
        if (out) {

            out.x = nx;
            out.y = ny;
            return out;
        }
        return new Vector2D(nx, ny);
    }


    /*-------------- getter setter -------------*/


    /**
     * 取向量长度
     * @type {number}
     * @memberOf Vector2D
     */
    public get length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * 设置向量长度
     * @memberOf Vector2D
     */
    public set length(value: number) {
        let angle: number = Math.atan2(this.y, this.x);
        this.x = Math.cos(angle) * value;
        this.y = Math.sin(angle) * value;
    }

    /**
     * 取向量长度的平方，由于不用开方运算，效率更高
     * @readonly
     * @type {number}
     * @memberOf Vector2D
     */
    public get lengthSquared(): number {
        return this.x * this.x + this.y * this.y;
    }


    /*-------------- public methods -------------*/

    /**
     * 是否为0向量
     * @readonly
     * @type {boolean}
     * @memberOf Vector2D
     */
    public isZero(): boolean {
        return ((this.x === 0) && (this.y === 0));
    }

    /**
     * 向量相加
     * 
     * @param {Vector2D} v
     * @returns {Vector2D} this = this + v
     * 
     * @memberOf Vector2D
     */
    public add(v: Vector2D): this {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    /**
     * 向量相减
     * @param {Vector2D} v
     * @return {Vector2D} this = this - v
     */
    public sub(v: Vector2D): this {

        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    public minus = this.sub;

    /**
     * 向量相乘
     * @param {Vector2D} v
     * @returns {Vector2D} this = this multiply v 
     * 
     * @memberOf Vector2D
     */
    public multiply(v: Vector2D): this {
        this.x *= v.x;
        this.y *= v.y;
        return this;
    }

    /**
     * 向量相除
     * 
     * @param {Vector2D} v
     * @returns {Vector2D} this  = this / v
     * 
     * @memberOf Vector2D
     */
    public divide(v: Vector2D): this {
        this.x /= v.x
        this.y /= v.y;
        return this;
    }



    public closeTo(v: Vector2D, tolerance: number = 0.0001): boolean {
        let abs = Math.abs;
        return ((abs(this.x - v.x) < tolerance) && (abs(this.y - v.y) < tolerance));
    }

    /**
     * 缩放向量
     * 
     * @param {number} s
     * @returns {Vector2D} this = this * s
     * 
     * @memberOf Vector2D
     */
    public scale(s: number): this {
        this.x *= s;
        this.y *= s;
        return this;
    }

    /**
     * 基于某个点缩放
     * @param {Vector2D} point 基于该点缩放
     * @param {number} sx (description)
     * @param {number} sy (description)
     * @returns {Vector2D} (description)
     */
    public scaleAbout(point: Vector2D, sx: number, sy: number): Vector2D {
        //  TODO: 图形实例
        ///////////////////////////
        // |sx  0  px(1-sx)|     x
        // |0  sy  py(1-sy)|  *  y
        // |0   0      1   |     1
        ////////////////////////////
        this.x = sx * this.x + point.x * (1 - sx);
        this.y = sy * this.y + point.y * (1 - sy);
        return this;
    }

    /**
     * 与缩放过的v相加
     * @param {Vector2D} v
     * @param {number} scale
     * @returns {Vector2D}
     * 
     * @memberOf Vector2D
     */
    public scaleAndAdd(v: Vector2D, scale: number): Vector2D {
        this.x = this.x + v.x * scale;
        this.y = this.y + v.y * scale;
        return this;
    }

    /**
     * 返回从此点到p2点之间的距离
     */
    public distanceTo(p2: Vector2D): number {
        let x: number = p2.x - this.x;
        let y: number = p2.y - this.y;
        return Math.sqrt(x * x + y * y);
    }

    /**
     * 此点到p2距离的平方
     */
    public squaredDistanceTo(p2: Vector2D): number {
        let x: number = p2.x - this.x;
        let y: number = p2.y - this.y;
        return x * x + y * y;
    }

    /**
     * x,y取负
     * @returns {Vector2D}
     * 
     * @memberOf Vector2D
     */
    public negate(): Vector2D {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }

    /**
     * 转为单位向量,数学上经常在向量上加个小帽子^表示 :)
     * @returns {Vector2D}
     * 
     * @memberOf Vector2D
     */
    public normalize(): this {
        let len: number = this.x * this.x + this.y * this.y;
        if (len === 0) {
            this.x = 1;
            this.y = 0;
        } else {
            len = 1 / Math.sqrt(len);
            this.x *= len;
            this.y *= len;
        }
        return this;
    }


    // ----------------------点乘的性质--------------------------//
    // a点乘b == 0 ，两向量垂直
    // a点乘b > 0 ，同向（夹角小于90度）
    // a点乘b < 0 ,反向（夹角大于90度）
    // a点乘b ==  length(a) * length(b)，共线且同向 (如果a与b都为单位向量则等于 +1)
    // a点乘b == -length(a) * length(b) ,共线且逆向（如果a与b都为单位向量则等于 -1）
    // a点乘a == a长度的平方
    // --------------------------------------------------------//

    /**
     * 点乘
     * 结果等于|a||b|cos夹角
     * @param v
     * @returns {number}
     */
    public dot(v: Vector2D): number {
        return this.x * v.x + this.y * v.y;
    }


    // ----------------------2d cross--------------------------//
    //
    //    http://allenchou.net/2013/07/cross-product-of-2d-vectors/
    //
    //    the sign of the cross product of 2D vectors tells you whether the second vector is on the left or right side of the first vector .
    //
    //   float cross(const Vec2 &a, const Vec2 &b)
    //    {
    //         Vec3 v1(a.x, a.y, 0.0f);
    //         Vec3 v2(b.x, b.y, 0.0f);
    //
    //        return cross(v1, v2).z;
    //    }
    //
    // --------------------------------------------------------//

    /**
     * 2d叉乘
     * 2d叉乘并不常见，与3d不同，结果是一个数值，相当于3d叉乘的z轴
     * 
     * @param {Vector2D} v
     * @returns {number}
     * 
     * @memberOf Vector2D
     */
    public cross(v: Vector2D): number {
        return this.x * v.y - this.y * v.x;
    }

    /**
     * 返回左垂直向量
     * 
     * @returns {Vector2D} 非单位向量
     * @memberOf Vector2D
     */
    public leftHandNormal(): Vector2D {
        let xx: number = this.x;
        this.x = -this.y;
        this.y = xx;
        return this;
    }

    /**
     * 返回右垂直向量
     * 
     * @returns {Vector2D} 非单位向量
     * @memberOf Vector2D
     */
    public rightHandNormal(): Vector2D {
        let xx: number = this.x;
        this.x = this.y;
        this.y = -xx;
        return this;
    }

    /**
     * 将极坐标转为笛卡尔坐标
     * 
     * @warning 修改自身
     * @param r 半径长度
     * @param radians 弧度值 ,逆时针正角度
     * @param return 返回自身
     */
    public fromPolar(r: number, radians: number): Vector2D {
        this.x = r * Math.cos(radians);
        this.y = r * Math.sin(radians);
        return this;
    }

    /**
      * 将此向量转为极坐标输出
      * 
      * @returns {{ r: number; radians: number }} 角度为弧度值表示
      * 
      * @memberOf Vector2D
      */
    public toPolar(): { r: number; radians: number } {
        let len: number = Math.sqrt(this.x * this.x + this.y * this.y);
        let radians: number = Math.atan2(this.y, this.x);
        return { r: len, radians: radians };
    }

    /**
     * 按最大长度夹断 
     * 
     * @warning 修改本身
     * @param {number} max 最大长度
     * @returns {Vector2D}
     * 
     * @memberOf Vector2D
     */
    public clampMax(max: number): Vector2D {
        let l: number = Math.sqrt(this.x * this.x + this.y * this.y);
        if (l > max) {
            l = max / l;
            this.x *= l;
            this.y *= l;
        }
        return this;
    }

    /**
      * 绕原点旋转一个角度 ，逆时针为正，浮点数计算会有误差
      * 
      * @param {number} radians 弧度值
      * @returns {Vector2D} 旋转后的向量
      * 
      * @memberOf Vector2D
      */
    public rotate(radians: number): Vector2D {

        // （矩阵乘法） 
        ////////////////////////////////
        //  |cos  -sin  0|      x
        //  |sin   cos  0|  *   y
        //  | 0     0   1|      1
        ////////////////////////////////
        let cos: number = Math.cos(radians);
        let sin: number = Math.sin(radians);
        let _x: number = this.x;
        let _y: number = this.y;
        this.x = _x * cos - _y * sin;
        this.y = _x * sin + _y * cos;
        return this;
    }

    /**
     * 绕某个点旋转
     * todo: example
     * 
     * @param {number} radians 弧度值表示的角度
     * @param {Vector2D} point
     * @returns {Vector2D}
     * 
     * @memberOf Vector2D
     */
    public rotateAbout(radians: number, point: Vector2D): Vector2D {
        let c = this.clone();
        this.sub(point).rotate(radians).add(c);
        return this;
    }

    /**
     * 旋转一个向量表示的角度，与rotate方法类似，但节省了计算sin/cos所以效率更高
     * 要注意如果v非单位向量则旋转后向量长度会改变
     * 
     * @param {Vector2D} v
     * @param {Vector2D} [out]
     * @returns {Vector2D}
     * 
     * @memberOf Vector2D
     */
    public rotateByVector(v: Vector2D): Vector2D {
        let _x: number = this.x;
        let _y: number = this.y;
        this.x = _x * v.x - _y * v.y;
        this.y = _x * v.y + _y * v.x;
        return this;
    }

    /**
     *  取得此向量在v向量上投影后的向量
     * 
     * @param {Vector2D} v
     * @returns {Vector2D}
     * 
     * @memberOf Vector2D
     */
    public projectOntoV(v: Vector2D): Vector2D {
        //
        //         /|
        //   this / | 
        //       /  |
        //     |----|----  v
        //      ProjV
        //
        // -------------------------
        //
        //     |a||b|cos
        //    ----------- b
        //       |b|^2
        let dp: number = this.x * v.x + this.y * v.y; // this.dot(v)
        let f: number = dp / (v.x * v.x + v.y * v.y);  // divide by |b|^2
        this.x = f * v.x;
        this.y = f * v.y;
        return this;
    }

    /**
      * 
      * 取得此向量在v法线上投影后的向量
      * 
      * @param {Vector2D} v
      * @returns {Vector2D}
      * 
      * @memberOf Vector2D
      */
    public projectOntoPerpV(v: Vector2D): Vector2D {

        //---------------------------------
        //           /|
        //     this / | PerpV
        //         /  |
        //        --------
        //            v
        // --------------------------------

        // var v:Vector2D = this.getProjV(v);
        // return this.subtract(v,result);

        let dp: number = this.x * v.x + this.y * v.y; // this.dot(v)
        let f: number = dp / (v.x * v.x + v.y * v.y);  // divide by |b|^2
        this.x -= f * v.x;
        this.y -= f * v.y;
        return this;
    }



    /**
     * 根据入射角 = 反射角理论，计算此向量经过法向量反射后的向量
     * @param n 单位法向量
     * @returns {Vector2D} 反射后得到的向量
     */
    public reflect(n: Vector2D): Vector2D {
        //  ---------------------------
        //  tail\  |  / head
        //       \ |n/
        //   head \|/ tail
        //    ------------
        //  --------------------------  
        // v = u - 2(u.n)n

        let nc = n.clone(); // 不能改变 n
        this.sub(nc.scale((2 * this.dot(nc))));
        return this;

    }

    // ICommonMethod

    public reset(x: number = 0, y: number = 0): this {
        this.x = x;
        this.y = y;
        return this;
    }

    public equal(v: Vector2D): boolean {
        return (floatEqual(this.x, v.x) && floatEqual(this.y, v.y));
    }

    /**
     * 从另一个向量拷贝 xy 值
     * 
     * @param {Vector2D} v
     * @returns {Vector2D}
     * 
     * @memberOf Vector2D
     */
    public copyFrom(v: Vector2D): this {
        this.x = v.x;
        this.y = v.y;
        return this;
    }


    /**
     * 复制一个向量
     * 
     * @returns {Vector2D}
     * 
     * @memberOf Vector2D
     */
    public clone(): Vector2D {
        return new Vector2D(this.x, this.y);
    }

    /**
     * 输出字符串
     * 
     * @returns {string}
     * 
     * @memberOf Vector2D
     */
    public toString(): string {
        return "[Vector2D] (x:" + this.x + " ,y:" + this.y + ")";
    }

}