import { Context, Color } from '@shed/gl';
import { Camera } from '../3d/Camera';
import { FreeCamera } from '../3d/FreeCamera';
import { CameraController } from '../3d/CameraController';

let canvas: HTMLCanvasElement = document.getElementById('c') as HTMLCanvasElement;
let gl = canvas.getContext('webgl');
if (gl) {
    let ctx = new Context(gl);
    // 蓝色背景清空
    ctx.clearColor = Color.BLUE;
    ctx.clear();

    // let shade

    let camera = new FreeCamera(45, ctx.width / ctx.height, 0.1, 1000);
    camera.transform.pos.reset(0, 1, 3);
    let cameraControl = new CameraController(camera);

} else {
    console.log('no webgl support');
}