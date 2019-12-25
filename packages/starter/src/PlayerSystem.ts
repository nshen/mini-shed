import { System, ECS, Group, Entity } from "@shed/ecs";
import { Render2DComponent, Image2D, TransformComponent } from "@shed/render2d-system";
import { Platform } from "@shed/platform";
import { SpriteSheetData } from "./utils/SpriteSheetData";
import { PrefebPool } from "./utils/PrefebPool";

export type PlayerComponent = { type: 'player'; };

export class PlayerSystem extends System {

    // protected _group: Group;
    protected _touchingX: number = -1;
    protected _touchingY: number = -1;
    protected _player!: Entity;
    protected _spritesheet: SpriteSheetData;
    protected _pool: PrefebPool;
    protected _frame: number = 0;

    constructor(ecs: ECS) {
        super(ecs);
        let ctx = ecs.state.ctx;
        this._pool = ecs.state.pool;
        this._spritesheet = this._ecs.state.assets['spritesheet'];
        this._player = this._ecs.addNewEntity<[PlayerComponent, Render2DComponent<Image2D>, TransformComponent]>(
            'player',
            { type: 'player' },
            { type: 'render2d', image: { src: this._spritesheet.src, region: this._spritesheet.getRegion('hero.png'), repeat: false, linear: false }, visible: true },
            { type: 'transform', x: ctx.width / 2, y: ctx.height - 80 - 30, width: 80, height: 80, rotation: 0 },
        );
        // this._group = ecs.getGroup('player', 'transform', 'render');
        this._initTouch();
    }

    protected _initTouch() {

        let platform = Platform.get();

        platform.onTouchStart(res => {
            this._touchingX = res.touches[0].clientX;
            this._touchingY = res.touches[0].clientY;
        });

        platform.onTouchMove(res => {
            this._touchingX = res.touches[0].clientX;
            this._touchingY = res.touches[0].clientY;
        });

        platform.onTouchEnd(res => {
            this._touchingX = this._touchingY = -1;
        });

    }

    /**
     * 当手指触摸屏幕的时候
     * 判断手指是否在飞机上
     * @param {Number} x: 手指的X轴坐标
     * @param {Number} y: 手指的Y轴坐标
     * @return {Boolean}: 用于标识手指是否在飞机上的布尔值
     */
    checkIsFingerOnAir(x: number, y: number) {
        const deviation = 30 + 40;
        return (
            this._touchingX > x - deviation
            && this._touchingX < x + deviation
            && this._touchingY > y - deviation
            && this._touchingY < y + deviation
        );

    }

    /**
     * 根据手指的位置设置飞机的位置
     * 保证手指处于飞机中间
     * 同时限定飞机的活动范围限制在屏幕中
     */
    setAirPosAcrossFingerPosZ(trans: TransformComponent) {

        let disX = this._touchingX;
        let disY = this._touchingY;
        let screenW = this._ecs.state.ctx.width;
        let screenH = this._ecs.state.ctx.height;

        let hw = trans.width / 2;
        let hh = trans.height / 2;

        if (disX < hw)
            disX = hw;
        else if (disX > screenW - hw)
            disX = screenW - hw;

        if (disY < hh)
            disY = hh;
        else if (disY > screenH - hh)
            disY = screenH - hh;

        trans.x = disX;
        trans.y = disY;

    }

    update() {
        let trans = this._player.get<TransformComponent>('transform');
        if (++this._frame % 1 === 0) {
            this._ecs.addEntity(this._pool.getBullet(trans.x-15, trans.y - 10));
            this._ecs.addEntity(this._pool.getBullet(trans.x-30, trans.y - 10));
            this._ecs.addEntity(this._pool.getBullet(trans.x+15, trans.y - 10));
            this._ecs.addEntity(this._pool.getBullet(trans.x+30, trans.y - 10));
        }
        if (this.checkIsFingerOnAir(trans.x, trans.y)) {
            this.setAirPosAcrossFingerPosZ(trans);
        }
    }
}