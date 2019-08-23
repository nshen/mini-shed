import { Matrix3D } from "./Matrix3D";
import { Quaternion } from "./Quaternion";

/*

y
|  /
| /
|/ pitch
|-----------z


z
|   /
|  /
| /
|/  head(yaw)
------------- x

*/

// based on real time rendering 4th
export class Euler {

    /**
     * E(h,p,r) = RzRxRy  three order === 'ZXY'
     * 
     * @param head (yaw)绕y轴 左右移动
     * @param pitch 绕x轴 上下移动
     * @param roll 绕z轴
     */
    constructor(
        public head: number = 0,
        public pitch: number = 0,
        public roll: number = 0) {
    }


    // real time rendering 4th p74
    fromMatrix(m: Matrix3D): this {

        this.head = Math.atan2(-m.n31, m.n33);
        this.pitch = Math.asin(m.n32);
        this.roll = Math.atan2(-m.n12, m.n22);
        return this;
    }

    fromQuaternion(q: Quaternion): this {
        //TODO: from Quaternion to Euler
        return this;
    }


}