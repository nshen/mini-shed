import { IGesture, Gesture } from "../Gesture";
import { Vector2D } from "@shed/math";
import { EventDispatcher } from "../EventDispatcher";

export class Hold implements IGesture {

    public tolerance = 5;
    public milliseconds = 200;
    protected _checking: boolean = true;
    protected _temp: Vector2D = new Vector2D();
    protected _startPos: Vector2D = new Vector2D();

    // protected _point: Vector2D = new Vector2D(); 
    // protected _lastPoint: Vector2D = new Vector2D();
    protected _startTime: number = 0;

    protected _timeoutID!: NodeJS.Timeout;
    constructor(protected _dispatcher: EventDispatcher) { }

    protected _holding: boolean = false;

    start(touches: TouchList, changedTouches: TouchList, timeStamp: number) {
        if (touches.length !== 1) {
            this._checking = false
            return;
        }
        this._checking = true;
        this._startPos.reset(touches[0].clientX, touches[0].clientY)
        this._timeoutID = setTimeout(() => {
            if (this._checking) {
                this._holding = true;
                this._dispatcher.emit(Gesture.HOLD, true);
            } else {
                this._holding = false;
            }

        }, this.milliseconds);
        // this._point.reset(touches[0].clientX, touches[0].clientY);
        // this._lastPoint.copyFrom(this._point);

    }

    move(touches: TouchList, changedTouches: TouchList, timeStamp: number) {
        if (!this._checking)
            return;
        this._temp.reset(this._startPos.x - touches[0].clientX, this._startPos.y - touches[0].clientY);
        if (this._temp.length > this.tolerance) {
            this._checking = false;
            clearTimeout(this._timeoutID);
        }
    }

    cancel(touches: TouchList, changedTouches: TouchList, timeStamp: number) {
        this._cancel();
    }

    end(touches: TouchList, changedTouches: TouchList, timeStamp: number) {
        this._cancel();
    }

    protected _cancel() {
        this._checking = false;
        clearTimeout(this._timeoutID);
        if (this._holding) {
            this._holding = false
            this._dispatcher.emit(Gesture.HOLD, false)
        }
    }
}
