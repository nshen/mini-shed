import { IGesture, Gesture } from "../Gesture";
import { Vector2D } from "@shed/math";
import { EventDispatcher } from "../EventDispatcher";

export class Tap implements IGesture {

    public maxDelay = 500;
    public tolerance = 5;
    protected _startTime: number = 0
    protected _startPos: Vector2D = new Vector2D();
    protected _temp: Vector2D = new Vector2D();
    protected _checking: boolean = true;

    constructor(protected _dispatcher: EventDispatcher) { }

    start(touches: TouchList, changedTouches: TouchList, timeStamp: number) {

        if (touches.length !== 1) {
            this._checking = false
            return;
        }
        this._checking = true;
        this._startTime = timeStamp;
        this._startPos.reset(touches[0].clientX, touches[0].clientY)
    }

    move(touches: TouchList, changedTouches: TouchList, timeStamp: number) {
        this._temp.reset(this._startPos.x - touches[0].clientX, this._startPos.y - touches[0].clientY);
        if (this._temp.length > this.tolerance)
            this._checking = false;
    }

    cancel(touches: TouchList, changedTouches: TouchList, timeStamp: number) {
        this._checking = false;
    }

    end(touches: TouchList, changedTouches: TouchList, timeStamp: number) {
        if (!this._checking)
            return;
        if (timeStamp - this._startTime < this.maxDelay) {
            this._dispatcher.emit(Gesture.TAP, changedTouches[0].clientX, changedTouches[0].clientY)
        }
    }
}