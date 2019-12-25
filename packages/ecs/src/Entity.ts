import { ECS } from './ECS';
import { IComponent } from "./IComponent";

type UnArray<T> = T extends Array<infer U> ? U : T;

export class Entity {

    protected _ecs: ECS;
    protected _id: string;
    protected _comps: { [key: string]: IComponent; } = {};
    private static __nextID: number = 0;

    constructor(ecs: ECS, name: string = 'Entity') {
        this._id = String(name + Entity.__nextID++);
        this._ecs = ecs;
    }

    get id(): string {
        return this._id;
    }

    add<T extends IComponent[]>(...components: T): void {
        components.forEach(c => {
            if (!this._comps[c.type])
                this._comps[c.type] = c;
        });
        this._ecs.__dirty(this);
    }

    remove(...componentTypes: string[]): void {
        componentTypes.forEach(c => {
            if (this._comps[c])
                delete this._comps[c];
        });
        this._ecs.__dirty(this);
    };

    has(...componentTypes: string[]): boolean {
        for (let i = 0; i < componentTypes.length; i++) {
            if (!this._comps[componentTypes[i]])
                return false;
        }
        return true;
    }

    get<T extends IComponent>(componentType: T['type']): T {
        return this._comps[componentType] as T;
    }

    toString(): string {
        return JSON.stringify({ id: this._id, comps: this._comps }, null, 4);
    }

}