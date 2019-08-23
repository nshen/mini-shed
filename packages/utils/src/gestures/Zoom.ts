import { Vector2D } from "@shed/math";
import { EventDispatcher } from "../EventDispatcher";
import { IGesture, Gesture } from "../Gesture";

export class Zoom implements IGesture {

    protected _checking: boolean = true;
    protected _tempV: Vector2D = new Vector2D();

    protected _startDistance: number = 0;
    protected _distance: number = 0;
    protected _center: Vector2D = new Vector2D();

    constructor(protected _dispatcher: EventDispatcher) { }

    start(touches: TouchList, changedTouches: TouchList, timeStamp: number) {

        if (touches.length !== 2) {
            this._checking = false
            return;
        }
        this._checking = true;
        let xDistance = touches[1].clientX - touches[0].clientX;
        let yDistance = touches[1].clientY - touches[0].clientY;
        this._startDistance = this._tempV.reset(xDistance, yDistance).length;
        this._center.reset(xDistance / 2 + touches[0].clientX, yDistance / 2 + touches[0].clientY);
        this._dispatcher.emit(Gesture.ZOOM_START, this._startDistance, this._center);

    }

    move(touches: TouchList, changedTouches: TouchList, timeStamp: number) {
        if (this._checking) {
            let xDistance = touches[1].clientX - touches[0].clientX;
            let yDistance = touches[1].clientY - touches[0].clientY;
            let newDistance = this._tempV.reset(xDistance, yDistance).length;
            if (this._distance !== newDistance) {
                this._distance = this._tempV.reset(xDistance, yDistance).length;
                this._center.reset(xDistance / 2 + touches[0].clientX, yDistance / 2 + touches[0].clientY);
                this._dispatcher.emit(Gesture.ZOOM, this._startDistance, this._distance, this._center);
            }
        }
    }

    cancel(touches: TouchList, changedTouches: TouchList, timeStamp: number) {
        this._checking = false;
    }

    end(touches: TouchList, changedTouches: TouchList, timeStamp: number) {
        this._checking = false;
    }
}