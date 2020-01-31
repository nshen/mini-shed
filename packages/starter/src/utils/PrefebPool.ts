import { Entity, ECS } from "@shed/ecs";
import { SpriteSheetData, } from "./SpriteSheetData";
import { TransformComponent, Render2DComponent, Image2D, createRender2DComponentImage, createTransformComponent } from "@shed/render2d-system";
import { SpriteSheetAnimationComponent } from "../SpriteSheetAnimationSystem";

type EnemyComponents = [TransformComponent, Render2DComponent<Image2D>, { type: 'enemy'; }];
type BulletComponents = [TransformComponent, Render2DComponent<Image2D>, { type: 'bullet'; speed: number; }];
type ExplosionComponents = [TransformComponent, Render2DComponent<Image2D>, SpriteSheetAnimationComponent, { type: 'explosion'; }];

export class PrefebPool {

    protected _enemies: Entity[] = [];
    protected _explosions: Entity[] = [];
    protected _bullets: Entity[] = [];

    protected _spritesheet: SpriteSheetData;
    protected readonly _ENEMY_PNG = 'enemy.png';
    protected readonly _enemyWidth: number = 60;
    protected readonly _enemyHeight: number = 60;
    protected readonly _bulletWidth: number = 16;
    protected readonly _bulletHeight: number = 30;
    protected readonly _explosionWidth: number = 72;
    protected readonly _explosionHeight: number = 102;

    constructor(protected _ecs: ECS, spritesheet: SpriteSheetData) {
        this._spritesheet = spritesheet;
        this.releaseExplosion = this.releaseExplosion.bind(this); // animation call back
    }

    getEnemy(): Entity {
        if (this._enemies.length > 0)
            return this._enemies.pop() as Entity;

        return this._ecs.addNewEntity<EnemyComponents>('enemy',
            // { type: 'transform', x: 0, y: 0, width: this._enemyWidth, height: this._enemyHeight, rotation: 0 }
            createTransformComponent(0, 0, this._enemyWidth, this._enemyHeight),
            createRender2DComponentImage(this._spritesheet.src, this._spritesheet.getRegion(this._ENEMY_PNG)),
            { type: 'enemy' }
        );
    }

    releaseEnemy(e: Entity) {
        this._ecs.removeEntity(e);
        this._enemies.push(e);
    }

    getBullet(x: number, y: number): Entity {
        if (this._bullets.length > 0) {
            let b = this._bullets.pop() as Entity;
            b.get('transform').x = x;
            b.get('transform').y = y;
            return b;
        }

        return this._ecs.addNewEntity<BulletComponents>('bullet',
            { type: 'transform', x: x, y: y, width: this._bulletWidth, height: this._bulletHeight, rotation: 0 },
            { type: 'render2d', visible: true, image: { src: this._spritesheet.src, region: this._spritesheet.getRegion('bullet.png'), linear: false, repeat: false } },
            { type: 'bullet', speed: 10 }
        );

    }

    releaseBullet(b: Entity) {
        this._ecs.removeEntity(b);
        this._bullets.push(b);
    }

    getExplosion(x: number, y: number): Entity {
        if (this._explosions.length > 0) {
            let e = this._explosions.pop() as Entity;
            e.get('transform').x = x;
            e.get('transform').y = y;
            e.get('spriteSheetAnimation')._initialized = false;
            return e;
        }

        return this._ecs.addNewEntity<ExplosionComponents>('explosion',
            { type: 'transform', x: x, y: y, width: this._explosionWidth, height: this._explosionHeight, rotation: 0 },
            { type: 'render2d', visible: true, image: { src: this._spritesheet.src, region: this._spritesheet.getRegion('explosion1.png'), linear: false, repeat: false } },
            { type: 'spriteSheetAnimation', spritesheet: 'spritesheet', fps: 60, playing: 'explosion' },
            { type: 'explosion' },
        );
    }

    releaseExplosion(e: Entity) {
        this._ecs.removeEntity(e);
        this._explosions.push(e);
    }

}