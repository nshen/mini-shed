import { Vector3D, Matrix3D, Deg2Rad } from "@shed/math";

export class Transform {

    public pos: Vector3D = new Vector3D();
    public scale: Vector3D = new Vector3D(1, 1, 1);
    public rotation: Vector3D = new Vector3D(); // degrees

    public _mat = new Matrix3D();

    public forward: Vector3D = new Vector3D(0, 0, 1);
    public right: Vector3D = new Vector3D(1, 0, 0);
    public up: Vector3D = new Vector3D(0, 1, 0);

    constructor() {
    }

    updateMatrix() {

        this._mat.identity()
            .scale(this.scale.x, this.scale.y, this.scale.z)
            .rotateY(this.rotation.y * Deg2Rad)
            .rotateZ(this.rotation.z * Deg2Rad)
            .rotateX(this.rotation.x * Deg2Rad)
            .translate(this.pos.x, this.pos.y, this.pos.z);

        this._mat.transformVecotr(this.right);
        this._mat.transformVecotr(this.up);
        this._mat.transformVecotr(this.forward);
    }

    updateDirection() {
        this._mat.transformVecotr(this.forward.reset(0, 0, 1));
        this._mat.transformVecotr(this.up.reset(0, 1, 0));
        this._mat.transformVecotr(this.right.reset(1, 0, 0));
    }


    reset() {
        this.pos.reset();
        this.scale.reset(1, 1, 1);
        this.rotation.reset();
    }
}