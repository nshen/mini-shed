import { Matrix3D, perspectiveFieldOfViewRH, Vector3D } from "@shed/math";
import { Transform } from "./Transform";

// https://www.3dgep.com/understanding-the-view-matrix/

export class Camera {

    protected _projectionMatrix: Matrix3D;
    protected _viewMatrix: Matrix3D = new Matrix3D();
    public transform: Transform = new Transform();

    constructor(fov: number, aspect: number, near: number, far: number) {

        this._projectionMatrix = perspectiveFieldOfViewRH(fov, aspect, near, far);
    }

    // panX() {
    //     this.updateViewMatrix();
    // }

    // updateViewMatrix() {
    //     this._viewMatrix.identity().translate(this._pos.x, this._pos.y, this._pos.z).rotateX()

    // }

    lookat(eye: Vector3D, target: Vector3D, up: Vector3D = new Vector3D(0, 1, 0)) {


        let e, fx, fy, fz, rlf, rx, ry, rz, rls, ux, uy, uz;

        // foward vector
        fx = eye.x - target.x;
        fy = eye.y - target.y;
        fz = eye.z - target.z;

        // Normalize foward.
        rlf = 1 / Math.sqrt(fx * fx + fy * fy + fz * fz);
        fx *= rlf;
        fy *= rlf;
        fz *= rlf;

        // Calculate cross product of f and up.
        rx = fy * up.z - fz * up.y;
        ry = fz * up.x - fx * up.z;
        rz = fx * up.y - fy * up.x;

        // Normalize right vector.
        rls = 1 / Math.sqrt(rx * rx + ry * ry + rz * rz);
        rx *= rls;
        ry *= rls;
        rz *= rls;

        // Calculate cross product of r and f.
        ux = ry * fz - rz * fy;
        uy = rz * fx - rx * fz;
        uz = rx * fy - ry * fx;

        let t = this._viewMatrix;

        t.n11 = rx; t.n12 = ry; t.n13 = rz; t.n14 = -eye.x * rx - eye.y * ry - eye.z * rz;
        t.n21 = ux; t.n22 = uy; t.n23 = uz; t.n24 = -eye.x * ux - eye.y * uy - eye.z * uz;
        t.n31 = fx; t.n32 = fy; t.n33 = fz; t.n34 = -eye.x * fx - eye.y * fy - eye.z * fz;
        t.n41 = 0; t.n42 = 0; t.n43 = 0; t.n44 = 1;

    }
}