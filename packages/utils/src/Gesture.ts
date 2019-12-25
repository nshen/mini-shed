/*
TODO:
swip : escapeVelocity  最小速度:0.2 ， maxRestTime 100
输出 velocity currentDirection
rotate
输出 angle distanceFromOrigin distanceFromLast
 */
import { Vector2D } from "@shed/math";
import { Platform } from "@shed/platform";
import { EventDispatcher } from "./EventDispatcher";
import { Tap, Zoom, Drag, Hold } from "./gestures";

export interface IGesture {
    start(touches: TouchList, changedTouches: TouchList, timeStamp: number): void;
    move(touches: TouchList, changedTouches: TouchList, timeStamp: number): void;
    cancel(touches: TouchList, changedTouches: TouchList, timeStamp: number): void;
    end(touches: TouchList, changedTouches: TouchList, timeStamp: number): void;
}

// todo: typed dispatcher
type GestureEvents = {
    'tap': (x: number, y: number) => void;
};

/**
 *  This is a singleton class use Gesture.get();
 */
export class Gesture {

    public static TAP: string = 'tap';
    public static ZOOM_START: string = 'zoom_start';
    public static ZOOM: string = 'zoom';
    public static DRAG: string = 'drag';
    public static HOLD: string = 'hold';

    // public static tap: boolean = false;
    protected _gestures: { [key: string]: IGesture; } = {};
    protected _dispatcher: EventDispatcher = new EventDispatcher();

    protected static _instance: Gesture;
    public static get(): Gesture {
        if (!Gesture._instance) {
            Gesture._instance = new Gesture();
        }
        return Gesture._instance;
    }

    private constructor() {
        this._initTouch();
    }

    onTap(fn: (x: number, y: number) => void, context: any) {
        if (!this._gestures[Gesture.TAP])
            this._gestures[Gesture.TAP] = new Tap(this._dispatcher);
        this._dispatcher.on(Gesture.TAP, fn, context);
    }

    onZoomStart(fn: (...args: any) => any, context: any) {
        if (!this._gestures[Gesture.ZOOM])
            this._gestures[Gesture.ZOOM] = new Zoom(this._dispatcher);
        this._dispatcher.on(Gesture.ZOOM_START, fn, context);
    }
    onZoom(fn: (startDistance: number, distance: number, center: Vector2D) => void, context: any) {
        if (!this._gestures[Gesture.ZOOM])
            this._gestures[Gesture.ZOOM] = new Zoom(this._dispatcher);
        this._dispatcher.on(Gesture.ZOOM, fn, context);
    }

    onDrag(fn: (...args: any) => any, context: any) {
        if (!this._gestures[Gesture.DRAG])
            this._gestures[Gesture.DRAG] = new Drag(this._dispatcher);
        this._dispatcher.on(Gesture.DRAG, fn, context);
    }

    onHold(fn: (...args: any) => void, context: any) {
        if (!this._gestures[Gesture.HOLD])
            this._gestures[Gesture.HOLD] = new Hold(this._dispatcher);
        this._dispatcher.on(Gesture.HOLD, fn, context);
    }

    protected _initTouch() {
        Platform.get().onTouchStart((res) => {
            for (let i in this._gestures) {
                this._gestures[i].start(res.touches, res.changedTouches, res.timeStamp);
            }
        });
        Platform.get().onTouchMove((res) => {
            for (let i in this._gestures) {
                this._gestures[i].move(res.touches, res.changedTouches, res.timeStamp);
            }
        });
        Platform.get().onTouchCancel((res) => {
            for (let i in this._gestures) {
                this._gestures[i].cancel(res.touches, res.changedTouches, res.timeStamp);
            }
        });
        Platform.get().onTouchEnd((res) => {
            for (let i in this._gestures) {
                this._gestures[i].end(res.touches, res.changedTouches, res.timeStamp);
            }
        });
    };

}