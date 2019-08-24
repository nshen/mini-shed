import { ECS, Entity } from "@shed/ecs";
import { Context } from "@shed/gl";
import { RenderSystem } from "@shed/render-system"
import { Gameloop } from "@shed/utils";
import { Platform } from "@shed/platform";

import { AssetsSystem } from "./assets-system/AssetsSystem";
import { PlayerSystem } from "./PlayerSystem";
import { BulletSystem } from "./BulletSystem";
import { EnemySystem } from "./EnemySystem";
import { CollisionSystem } from "./CollisionSystem";
// import { RenderSystem } from "./texture-system/RenderSystem";
import { SpriteSheetAnimationSystem } from "./SpriteSheetAnimationSystem";
import { BackgroundSystem } from "./BackgroundSystem";
import { PrefebPool } from "./utils/PrefebPool";

export class Main {

    protected _gameloop = new Gameloop(this);
    protected _canvas = Platform.get().getMainCanvas();
    protected _ctx: Context;
    protected _ecs!: ECS;

    protected bullets: Entity[] = [];

    constructor() {
        this.init();
    }

    protected async init() {
        await this._loadAssets();
        this._initContext();
        this.restart();
    }

    protected async _loadAssets(){
        //if#wechat

    }

    protected _initContext(): void {
        let gl = this._canvas.getContext('webgl') as WebGLRenderingContext;
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        this._ctx = new Context(gl);
        this._ctx.cullFace = 'BACK';
        this._ctx.depthTest = false;
        this._ctx.viewport(0, 0, this._canvas.width, this._canvas.height);
    }

    restart() {
        this._ecs = new ECS();
        // state 可以储存任何东西
        this._ecs.state.ctx = this._ctx;
        this._ecs.state.canvas = this._canvas;
        // this._ecs.state.info = wx.getSystemInfoSync();

        let wxAssets = new AssetsSystem(this._ecs);
        wxAssets.addImage('images/bg.jpg');
        wxAssets.addSpriteSheet('images/spritesheet');

        let pool = new PrefebPool(this._ecs);
        this._ecs.state.pool = pool;
        this._ecs.addSystem(wxAssets);
        this._ecs.addSystem(new BackgroundSystem(this._ecs));
        this._ecs.addSystem(new PlayerSystem(this._ecs));
        this._ecs.addSystem(new BulletSystem(this._ecs));
        this._ecs.addSystem(new EnemySystem(this._ecs));
        this._ecs.addSystem(new CollisionSystem(this._ecs));
        this._ecs.addSystem(new SpriteSheetAnimationSystem(this._ecs, pool.recycleExplosion))

        let renderSystem = new RenderSystem(this._ecs)
        renderSystem.addLayer(this._ecs.getGroup('bg', 'render', 'transform'))
        renderSystem.addLayer(this._ecs.getGroup('enemy', 'render', 'transform'));
        renderSystem.addLayer(this._ecs.getGroup('bullet', 'render', 'transform'));
        renderSystem.addLayer(this._ecs.getGroup('player', 'render', 'transform'));
        renderSystem.addLayer(this._ecs.getGroup('explosion', 'render', 'transform'));
        this._ecs.addSystem(renderSystem);

        this._gameloop.start();
    }

    update(elapsed: number) {
        // console.log('update: ', elapsed);
        this._ctx.clear();
        this._ecs.state.elapsed = elapsed;
        this._ecs.update();
    }
}

new Main();