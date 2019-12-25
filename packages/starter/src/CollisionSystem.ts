import { System, ECS, Group, Entity } from "@shed/ecs";
import { PrefebPool } from "./utils/PrefebPool";

export class CollisionSystem extends System {

    protected _enemys: Group;
    protected _bullets: Group;
    protected _players: Group;
    protected _pool: PrefebPool;

    init() {
        this._enemys = this._ecs.getGroup('enemy', 'transform', 'render2d');
        this._bullets = this._ecs.getGroup('bullet', 'transform', 'render2d');
        this._players = this._ecs.getGroup('player', 'transform', 'render2d');
        this._pool = this._ecs.state.pool;
    }

    /**
     * 简单的碰撞检测定义：
     * 另一个精灵的中心点处于本精灵所在的矩形内即可
     * @param{Sprite} sp: Sptite的实例
     */
    isCollide(a: Entity, point: Entity) {
        let trans = a.get('transform');
        let ax = trans.x;
        let ay = trans.y;
        let ahw = trans.width * .5;
        let ahh = trans.height * .5;
        trans = point.get('transform');
        let bx = trans.x;
        let by = trans.y;

        return (
            bx >= ax - ahw
            && bx <= ax + ahw
            && by >= ay - ahh
            && by <= ay + ahh
        );
    }

    update() {
        let e: Entity;
        let b: Entity;
        let player: Entity;

        for (let i in this._enemys.entityMap) {
            e = this._enemys.entityMap[i];
            for (let j in this._bullets.entityMap) {
                b = this._bullets.entityMap[j];
                if (this.isCollide(e, b)) { // 子弹中心碰撞到敌人
                    let ex = this._pool.getExplosion(e.get('transform').x, e.get('transform').y);
                    this._ecs.addEntity(ex);
                    this._pool.releaseBullet(b);
                    this._pool.releaseEnemy(e);
                    break;

                }
            }
        }


        // for(let i in this._enemys.entityMap){
        //     e = this._enemys.entityMap[i];
        //     for(let j in this._players.entityMap){
        //         player = this._players.entityMap[j];
        //         if(this.isCollide(player,e)){
        //             console.log('game over');
        //             break;
        //         }
        //     }
        // }



    }
}