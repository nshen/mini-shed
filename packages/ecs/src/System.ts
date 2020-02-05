import { ECS } from "./ECS";

export class System {


    protected _ecs: ECS;

    constructor(ecs: ECS) {
        this._ecs = ecs;
    }

    /**
     * 在 init() 之前执行，ECS 会确保所有 prepare Promise 完成才会开始 init
     * 可用来加载资源等
     */
    async prepare(): Promise<void> {
        return Promise.resolve();
    }

    /**
     * 初始化
     */
    init(): void { };

    /**
     * 每帧调用
     */
    update(): void { };
}