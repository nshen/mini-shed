import { ECS } from "./ECS";

export class System {

    protected _ecs: ECS;

    constructor(ecs: ECS) {
        this._ecs = ecs;
    }

    /**
     * 在 init() 之前执行，ECS 会确保所有 prepare Promise 完成才会开始 init
     */
    async prepare(): Promise<void> {
        return Promise.resolve();
    }

    init(): void { };

    update(): void { };
}