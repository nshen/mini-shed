import { System, Group } from "@shed/ecs";
import { PrefebPool } from "./utils/PrefebPool";
import { TransformComponent, Render2DComponent } from "@shed/render2d-system";

export type BulletComponent = { type: 'bullet'; };
export class BulletSystem extends System {

    protected _group: Group;
    protected _pool: PrefebPool;

    init(): void {
        this._group = this._ecs.getGroup<[TransformComponent, Render2DComponent, BulletComponent]>('bullet', 'transform', 'render2d');
        this._pool = this._ecs.state.pool;
    }

    update() {
        let trans: TransformComponent;
        this._group.forEach(e => {
            trans = e.get<TransformComponent>('transform');
            if (trans.y <= 0)
                this._pool.releaseBullet(e);
            else
                trans.y -= 10;
        });

    }
}