import { Platform } from "@shed/platform";
import { Camera } from "./Camera";
import { FreeCamera } from "./FreeCamera";

export class CameraController {

    protected rotateRate: number;
    protected panRate: number;
    protected zoomRate: number;
    protected offsetX: number;
    protected offsetY: number;
    protected initX: number;
    protected initY: number;
    protected prevX: number;
    protected prevY: number;

    protected touching: boolean = false;


    constructor(public camera: FreeCamera) {


        this.rotateRate = -300;							//How fast to rotate, degrees per dragging delta
        this.panRate = 5;								//How fast to pan, max unit per dragging delta
        this.zoomRate = 200;							//How fast to zoom or can be viewed as forward/backward movement

        this.offsetX = 0;						//Help calc global x,y mouse cords.
        this.offsetY = 0;

        this.initX = 0;									//Starting X,Y position on mouse down
        this.initY = 0;
        this.prevX = 0;									//Previous X,Y position on mouse move
        this.prevY = 0;

        Platform.get().onTouchStart((res) => {
            this.initX = this.prevX = 0
            this.initY = this.prevY = 0

            if (res.touches.length === 1)
                this.touching = true;
            else
                this.touching = false

        })

        Platform.get().onTouchMove((res) => {


            if (this.touching) {

                let dx = res.touches[0].clientX - this.prevX;
                let dy = res.touches[0].clientY - this.prevY;

                this.camera.panX(-dx * (this.panRate / 500))
                this.camera.panY(-dy * (this.panRate / 500))
                this.prevX = res.touches[0].clientX;
                this.prevY = res.touches[0].clientY;


            }

        })
    }



}