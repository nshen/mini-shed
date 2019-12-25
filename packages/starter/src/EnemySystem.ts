
import { System, ECS, Group, Entity } from "@shed/ecs";
import { PrefebPool } from "./utils/PrefebPool";
import { TransformComponent } from "@shed/render2d-system";

function rnd(start: number, end: number) {
    return Math.floor(Math.random() * (end - start) + start);
}

export class EnemySystem extends System {

    protected _group: Group;
    protected _frame: number = 0;
    protected _pool: PrefebPool;

    init() {
        this._group = this._ecs.getGroup('enemy', 'transform', 'render2d');
        this._pool = this._ecs.state.pool;
    }


    update() {
        let e: Entity;
        if (++this._frame % 1 === 0) {
            this._ecs.addEntity(this._createEnemy());
            // this._ecs.addEntity(this._createEnemy());
            // this._ecs.addEntity(this._createEnemy());
            // this._ecs.addEntity(this._createEnemy());
        }

        let trans: TransformComponent;
        this._group.forEach(e => {
            trans = e.get('transform');
            if (trans.y > this._ecs.state.ctx.height) {
                this._pool.releaseEnemy(e);
            } else {
                trans.y += 6;
            }
        });
    }

    protected _createEnemy(): Entity {
        let e = this._pool.getEnemy();
        let half = e.get('transform').width * .5;
        e.get('transform').x = rnd(half, this._ecs.state.ctx.width - half);
        e.get('transform').y = -half;
        return e;
    }
}