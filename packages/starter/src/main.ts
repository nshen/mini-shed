// main.ts 是游戏入口
import { Gameloop } from "@shed/utils";
import { Context } from "@shed/gl";
import { Platform } from "@shed/platform";
import { ECS, Entity } from "@shed/ecs";
import { Render2DSystem, Render2DComponent } from "@shed/render2d-system";

import { SpriteSheetData } from "./utils/SpriteSheetData";
import { PrefebPool } from "./utils/PrefebPool";
import { BackgroundSystem } from "./BackgroundSystem";
import { PlayerSystem } from "./PlayerSystem";
import { BulletSystem } from "./BulletSystem";
import { EnemySystem } from "./EnemySystem";
import { CollisionSystem } from "./CollisionSystem";
import { SpriteSheetAnimationSystem } from "./SpriteSheetAnimationSystem";

export class Main {

    protected _gameloop = new Gameloop(this);
    protected _canvas: HTMLCanvasElement;
    protected _ctx: Context;
    protected _ecs!: ECS;

    constructor() {
        console.log('game start!!!!');
        this.init();
    }

    async init() {
        this.initContext();
        await this.initECS();
        this._gameloop.start();
    }

    update(elapsed: number) {
        // console.log('update: ', elapsed);
        this._ctx.clear();
        this._ecs.state.elapsed = elapsed;
        this._ecs.update();
    }

    private async initECS() {
        this._ecs = new ECS();
        this._ecs.state.ctx = this._ctx;
        this._ecs.state.canvas = this._canvas;
        this._ecs.state.assets = await this.loadAssets();
        this._ecs.state.pool = new PrefebPool(this._ecs, this._ecs.state.assets['spritesheet'] as SpriteSheetData);
        this._ecs.addSystem(new BackgroundSystem(this._ecs));
        this._ecs.addSystem(new PlayerSystem(this._ecs));
        this._ecs.addSystem(new BulletSystem(this._ecs));
        this._ecs.addSystem(new EnemySystem(this._ecs));
        this._ecs.addSystem(new CollisionSystem(this._ecs));
        const spritesheetSystem = new SpriteSheetAnimationSystem(
            this._ecs,
            this._ecs.state.pool.releaseExplosion,
            this._ecs.state.assets
        );
        // 预定义一个爆炸动画
        spritesheetSystem.addAnimation('spritesheet', 'explosion', false,
            [
                'explosion1.png',
                'explosion2.png',
                'explosion3.png',
                'explosion4.png',
                'explosion5.png',
                'explosion6.png',
                'explosion7.png',
                'explosion8.png',
                'explosion9.png',
                'explosion10.png',
                'explosion11.png',
                'explosion12.png',
                'explosion13.png',
                'explosion14.png',
                'explosion15.png',
                'explosion16.png',
                'explosion17.png',
                'explosion18.png',
                'explosion19.png'
            ]);
        this._ecs.addSystem(spritesheetSystem);
        // 分层渲染
        const renderSystem = new Render2DSystem(this._ecs, this._ctx, this._ecs.state.assets, true);
        renderSystem.addLayer(this._ecs.getGroup('bg', 'render2d', 'transform'));
        renderSystem.addLayer(this._ecs.getGroup('enemy', 'render2d', 'transform'));
        renderSystem.addLayer(this._ecs.getGroup('bullet', 'render2d', 'transform'));
        renderSystem.addLayer(this._ecs.getGroup('player', 'render2d', 'transform'));
        renderSystem.addLayer(this._ecs.getGroup('spriteSheetAnimation', 'render2d', 'transform'));//explosion
        this._ecs.addSystem(renderSystem);
        await this._ecs.init();
    }

    private async loadAssets(): Promise<{ [key: string]: any; }> {
        try {
            let store = {};
            store['images/bg.jpg'] = await Platform.get().loadImage('images/bg.jpg');
            store['images/spritesheet.png'] = await Platform.get().loadImage('images/spritesheet.png');
            store['images/spritesheet.json'] = await (await fetch('images/spritesheet.json')).json();
            store['spritesheet'] = new SpriteSheetData('images/spritesheet.png', store['images/spritesheet.json']);
            return store;
        }
        catch (error) {
            console.warn(error, '加载资源失败');
        }
    }

    private initContext() {
        this._canvas = Platform.get().getMainCanvas();
        this._ctx = Context.fromCanvas(this._canvas);
        this._ctx.blendPremultipliedAlpha();
        this._ctx.disableDepthTest();
        this._ctx.cullFace('BACK');
        this._ctx.viewport(0, 0, this._canvas.width, this._canvas.height);
    }

}

new Main();