import { Entity } from './Entity';
import { Group } from './Group';
import { System } from './System';
import { IComponent } from './IComponent';

export class ECS {

    protected _entityMap: { [key: string]: Entity; } = {};

    // 永远不能删除_groupCache，因为system中保存着引用
    protected _groupCache: { [key: string]: Group; } = {};
    protected _groupNum: number = 0;

    protected _systems: System[] = [];
    protected _dirtyMap: { [key: string]: Entity; } = {};

    // all systems share data here
    public state: { [key: string]: any; } = {};

    public addNewEntity<T extends IComponent[]>(name: string, ...components: T): Entity {
        let e = new Entity(this, name);
        this._entityMap[e.id] = e;
        if (components.length > 0) {
            e.add(...components);
        }
        return e;
    }

    public newEntity<T extends IComponent[]>(name: string, ...components: T): Entity {
        let e = new Entity(this, name);
        if (components.length > 0) {
            e.add(...components);
        }
        return e;
    }

    public addEntity(e: Entity): void {
        if (!this._entityMap[e.id]) {
            this._entityMap[e.id] = e;
            this.__dirty(e);
        }
    }

    // 直接删除，包括从所有组删除
    public removeEntity(entity: Entity): Entity {
        if (this._entityMap[entity.id]) {
            delete this._entityMap[entity.id];
            if (this._dirtyMap[entity.id])
                delete this._dirtyMap[entity.id];
            for (let g in this._groupCache) {
                this._groupCache[g].__remove(entity);
            }
        }
        return entity;
    }

    public removeAllEntities(): void {
        this._entityMap = {};
        this._dirtyMap = {};
        for (let g in this._groupCache) {
            this._groupCache[g].__removeAll();
        }
    }

    public getGroup<T extends IComponent[]>(...componentTypes: T[number]['type'][]): Group {
        let key = componentTypes.sort().join('_');
        if (this._groupCache[key])
            return this._groupCache[key];
        let g = new Group(this, key, ...componentTypes);
        for (const id in this._entityMap) {
            g.__match(this._entityMap[id]);
        }
        this._groupCache[key] = g;
        this._groupNum++;
        return g;
    }

    public addSystem<T extends System>(sys: T): void {
        this._systems.push(sys);
    }

    static groups: Readonly<{ [key: string]: Group; }>;
    async init(): Promise<void> {
        try {
            ECS.groups = this._groupCache;
            const len = this._systems.length;
            for (let i = 0; i < len; i++) {
                await this._systems[i].prepare();
            }

            for (let i = 0; i < len; i++) {
                this._systems[i].init();
            }
        } catch (error) {
            console.error(error);
        }
        this.__assignDirties2Group(); //等全部系统初始化完成再分配到group，保证Group事件正确
    }

    update(): void {
        for (let i = 0; i < this._systems.length; i++) {
            this._systems[i].update();
            this.__assignDirties2Group();
        }
    }

    __assignDirties2Group(): void {
        for (let i in this._dirtyMap) {
            for (let g in this._groupCache) {
                this._groupCache[g].__match(this._dirtyMap[i]);
            }
            delete this._dirtyMap[i];
        }
        // this._dirtyMap = {};
    }

    // 新添加的entity，或者entity本身添加删除components时被调用
    /** @internal */
    __dirty(entity: Entity): void {
        // 标记dirty，每个system.update后统一调用___assignDirtyEntities匹配到group
        this._dirtyMap[entity.id] = entity;
    }
}