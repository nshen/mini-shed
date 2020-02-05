/**
 * 负责 update(),fixUpdate() 调用
 * 
 * 参考：
 * http://gameprogrammingpatterns.com/game-loop.html
 * https://gafferongames.com/post/fix_your_timestep/
 * 
 * @export
 * @class GameLoop
 */

interface ILoopable {
    update: (elapsed: number) => void;
    fixUpdate?: (elapsed: number) => void;
}
export class Gameloop {

    public static Time: number;

    protected _mpf: number; // 每帧的固定时间，一般为16m

    protected _running: boolean = false;

    protected _prev: number = 0;
    protected _lag: number = 0;
    protected _elapsed: number = 0;

    private __bindloop: FrameRequestCallback;
    // private __performance: wx.Performance = wx.getPerformance();

    constructor(protected _looper: ILoopable, protected useFixUpdate: boolean = false, protected _fps: number = 60) {
        this._mpf = 1000 / _fps;

        // requestAnimationFrame
        if (useFixUpdate && _looper.fixUpdate) {
            this.__bindloop = this._loop.bind(this);
        } else {
            this.__bindloop = this._simpleLoop.bind(this); // 默认不用fixUpdate
        }
    }

    start(): void {
        if (this._running)
            return;

        // this._prev = this.__performance.now(); // wechat bug: 跟loop传进来的值差太多
        this._prev = 0;
        this._lag = 0;
        this._elapsed = 0;

        requestAnimationFrame(this.__bindloop);
        this._running = true;
    }

    stop(): void {
        this._running = false;
    }

    protected _simpleLoop(now: number): void {
        Gameloop.Time = now;
        if (!this._running)
            return;
        if (this._prev === 0) { // wx bug
            this._prev = now;
            requestAnimationFrame(this.__bindloop);
            return;
        }

        this._elapsed = now - this._prev; // real time passed since the last frame
        this._prev = now;

        this._looper.update(this._elapsed);

        requestAnimationFrame(this.__bindloop);
    }

    protected _loop(now: number): void {
        Gameloop.Time = now;
        if (!this._running)
            return;

        let w = this._looper;
        if (!w.fixUpdate)
            return;

        this._elapsed = now - this._prev; // real time passed since the last frame
        this._prev = now;
        this._lag += this._elapsed;

        while (this._lag >= this._mpf) {
            w.fixUpdate(this._mpf); // 小心必须小于mpf
            this._lag -= this._mpf
        }

        w.update(this._elapsed);

        requestAnimationFrame(this.__bindloop);

    }



}