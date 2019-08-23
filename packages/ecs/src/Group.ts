import { Entity } from "./Entity";
import { ECS } from "./ECS";
import { EventDispatcher } from "@shed/utils";

export class Group {

    public static ENTITY_ADDED: string = 'ENTITY_ADDED';
    public static ENTITY_REMOVED: string = 'ENTITY_REMOVED';

    protected _ecs: ECS;
    protected _length: number = 0;
    protected _key: string;
    protected _componentTypes: string[];
    protected _entityMap: { [key: string]: Entity } = {};

    protected _emitter: EventDispatcher = new EventDispatcher();

    /** @internal */
    constructor(ecs: ECS, key: string, ...componentTypes: string[]) {
        if (componentTypes.length <= 0)
            console.error('group must have componentType they care');
        this._componentTypes = componentTypes;
        this._ecs = ecs;
        this._key = key;
    }

    onEntityAdded(f: (entity: Entity) => void, context: unknown): void {
        this._emitter.on(Group.ENTITY_ADDED, f, context)
    }

    offEntityAdded(f: (entity: Entity) => void, context: unknown): void {
        this._emitter.off(Group.ENTITY_ADDED, f, context)
    }

    onEntityRemoved(f: (entityID: string) => void, context: unknown): void {
        this._emitter.on(Group.ENTITY_REMOVED, f, context)
    }

    offEntityRemoved(f: (entityID: string) => void, context: unknown): void {
        this._emitter.off(Group.ENTITY_REMOVED, f, context)
    }

    // support for..of this group
    /*
    *[Symbol.iterator]() {
        for (let i in this._entityMap) {
            yield this._entityMap[i];
        }
    }
    */

    forEach(f: (e: Entity) => void): void {
        for (let i in this._entityMap) {
            f(this._entityMap[i]);
        }
    }

    removeAllEntities(): void {
        for (let i in this._entityMap) {
            this._ecs.removeEntity(this._entityMap[i]);
        }
    }

    get key(): string {
        return this._key;
    }

    get length(): number {
        return this._length;
    }

    // get entityMap() {
    //     return this._entityMap; //todo: 确保外部不要修改这个数组
    // }

    /** @internal */
    __remove(entity: Entity): void {
        if (this._entityMap[entity.id]) {
            delete this._entityMap[entity.id];
            this._length--;
            this._emitter.emit(Group.ENTITY_REMOVED, entity.id);
        }
    }

    /** @internal */
    __removeAll(): void {

        let _lastMap = this._entityMap;
        this._entityMap = {};
        this._length = 0;
        for (let i in _lastMap) {
            this._emitter.emit(Group.ENTITY_REMOVED, _lastMap[i].id);
        }

    }

    /** @internal */
    __match(entity: Entity): void {
        let id = entity.id;
        if (this._entityMap[id]) {
            if (!entity.has(...this._componentTypes)) {
                delete this._entityMap[id];
                this._length--;
                this._emitter.emit(Group.ENTITY_REMOVED, entity.id);
            }
        } else {
            if (entity.has(...this._componentTypes)) {
                this._entityMap[id] = entity;
                this._length++;
                this._emitter.emit(Group.ENTITY_ADDED, entity);
            }
        }
    }

}