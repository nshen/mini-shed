import { System, ECS, Entity } from "@shed/ecs";
import { Render2DSystem, Render2DComponent, Image2D, createRender2DComponentImage, createTransformComponent, TransformComponent } from "@shed/render2d-system";

export class BackgroundSystem extends System {

    protected bg!: Entity;

    init() {
        let ctx = this._ecs.state.ctx;
        this.bg = this._ecs.addNewEntity<[Render2DComponent<Image2D>, TransformComponent, { type: 'bg'; }]>('bg',
            { type: 'render2d', visible: true, image: { src: 'images/bg.jpg', region: { l: 0, r: 1, t: 0, b: 1.5 }, repeat: true, linear: true } },
            // createRender2DComponentImage('images/bg.jpg', true, true),
            { type: 'transform', x: ctx.width / 2, y: ctx.height / 2, width: ctx.width, height: ctx.height, rotation: 0 },
            // createTransformComponent(ctx.width / 2, ctx.height / 2, ctx.width, ctx.height, 0),
            { type: 'bg' });
    }

    update() {
        this.bg.get<Render2DComponent<Image2D>>(Render2DSystem.type).image.region.t -= 0.001; // 完整写法
        this.bg.get('render2d').image.region.b -= 0.001; // 省略类型，无报错，但没有类型提示
    }
    
}