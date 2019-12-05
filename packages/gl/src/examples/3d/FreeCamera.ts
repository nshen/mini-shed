import { Camera } from "./Camera";
import { Deg2Rad } from "@shed/math";

export class FreeCamera extends Camera {

    panX(v: number) {

        this.updateMatrix();
        this.transform.pos.x += this.transform.right.x;
        this.transform.pos.y += this.transform.right.y;
        this.transform.pos.z += this.transform.right.z;
    }

    panY(v: number) {
        this.updateMatrix();
        this.transform.pos.x += this.transform.up.x;
        this.transform.pos.y += this.transform.up.y;
        this.transform.pos.z += this.transform.up.z;
    }

    panZ(v: number) {
        this.updateMatrix();
        this.transform.pos.x += this.transform.forward.x;
        this.transform.pos.y += this.transform.forward.y;
        this.transform.pos.z += this.transform.forward.z;

    }

    updateMatrix() {
        this.transform._mat.identity()
            .translate(this.transform.pos.x, this.transform.pos.y, this.transform.pos.z)
            .rotateX(this.transform.rotation.x * Deg2Rad)
            .rotateY(this.transform.rotation.y * Deg2Rad);

        this.transform.updateDirection();
        this._viewMatrix.copyFrom(this.transform._mat).invert();
    }
}