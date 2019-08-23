import { Vector2D } from "@shed/math";
import { EventDispatcher } from "../EventDispatcher";
import { IGesture, Gesture } from "../Gesture";

export class Drag implements IGesture {

    protected _checking: boolean = true;

    protected _point: Vector2D = new Vector2D(); //初始点
    protected _lastPoint: Vector2D = new Vector2D();

    protected _holding: boolean = false;

    constructor(protected _dispatcher: EventDispatcher) {
        Gesture.get().onHold(this._onHold, this);
    }

    protected _onHold(state: boolean): void {
        this._holding = state;
    }

    start(touches: TouchList, changedTouches: TouchList, timeStamp: number) {

        if (touches.length !== 1) {
            this._checking = false
            return;
        }
        this._checking = true;
        this._point.reset(touches[0].clientX, touches[0].clientY);
        this._lastPoint.copyFrom(this._point);

    }

    move(touches: TouchList, changedTouches: TouchList, timeStamp: number) {
        if (!this._checking)
            return;

        if (touches[0].clientX !== this._point.x || touches[0].clientY !== this._point.y) {
            this._dispatcher.emit(Gesture.DRAG, this._point.x, this._point.y, touches[0].clientX, touches[0].clientY, this._lastPoint.x, this._lastPoint.y, this._holding)
            this._lastPoint.reset(touches[0].clientX, touches[0].clientY);
        }
    }

    cancel(touches: TouchList, changedTouches: TouchList, timeStamp: number) {
        this._checking = false;
    }

    end(touches: TouchList, changedTouches: TouchList, timeStamp: number) {
        this._checking = false;
    }
}