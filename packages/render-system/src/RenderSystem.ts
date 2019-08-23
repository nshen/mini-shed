import { System, Group, ECS, Entity } from "@shed/ecs";
import { Context, Texture, Color } from "@shed/gl";
import { Matrix2D, topleft2D } from "@shed/math";
import { Batcher } from "./utils/Batcher";

interface LayerOptions {
    inCamera: boolean;
}
// export type ColorInfo = { r: number, g: number, b: number, a: number };
// export type ImageInfo = { src: string, region: { l: number, r: number, t: number, b: number }, repeat?: boolean, linear?: boolean }
// export type WireframeInfo = { type: string, [key: string]: any };
// export type RenderComponent = {
//     type: 'render',
//     visible?: boolean
//     color?: ColorInfo,
//     image?: ImageInfo,
//     wireframe?: WireframeInfo
// };

export interface ColorInfo { r: number; g: number; b: number; a: number; }
export interface ImageInfo { src: string, region?: { l: number, r: number, t: number, b: number }, repeat?: boolean, linear?: boolean }
export interface WireframeInfo { type: string, [key: string]: any };
export interface RenderComponent {
    type: 'render',
    visible?: boolean
    color?: ColorInfo,
    image?: ImageInfo,
    wireframe?: WireframeInfo
};

export class RenderSystem extends System {

    protected _ctx: Context;
    protected _batcher: Batcher;
    protected _srt: Matrix2D = new Matrix2D();
    protected _textureMap: { [entityID: string]: Texture } = {};
    protected _allRenderable: Group | undefined;
    protected _layers: { group: Group, options: LayerOptions }[] = [];
    protected _lastLayerOptions: LayerOptions = { inCamera: true };

    protected _vpMatrix!: Matrix2D;
    protected _penColor: Color = Color.LIGHT_GRAY.clone();

    /**
     * 创建一个2d渲染系统 
     * @param ecs 
     * @param layered 分层渲染，默认为false，需调用addLayer添加层。如为false则一次渲染所有含'render'和'transform'组件的Entity。
     */
    constructor(ecs: ECS, layered: boolean = false) {
        super(ecs);
        if (!layered) {
            this._allRenderable = ecs.getGroup('render', 'transform');
        }
        this._ctx = ecs.state.ctx;
        this._renderEntity = this._renderEntity.bind(this);
        this._batcher = new Batcher(this._ctx);

        // Camera System
        //ecs.state.projectMatrix
        //ecs.state.viewMatrix
        this._vpMatrix = topleft2D(this._ctx.width, this._ctx.height);

    }

    addLayer(group: Group, options: LayerOptions = { inCamera: true }) {
        this._layers.push({ group: group, options: options });
        // console.log('addLayer:', group, options.inCamera)
    }

    update() {
        if (!this._ecs.state.vpMatrix)
            this._ecs.state.vpMatrix = this._vpMatrix;

        if (this._layers.length > 0) {
            let layer
            for (let i: number = 0; i < this._layers.length; i++) {
                layer = this._layers[i];
                // console.log(layer.group.key)
                if (this._layerOptionsChanged(layer.options)) {
                    this._batcher.flush();
                }
                if (layer.options.inCamera === false) {
                    this._batcher.vpMatrix = this._vpMatrix;
                } else {
                    this._batcher.vpMatrix = this._ecs.state.vpMatrix;
                }
                layer.group.forEach(this._renderEntity)
            }
        } else {
            this._batcher.vpMatrix = this._ecs.state.vpMatrix;
            if (this._allRenderable) {
                this._allRenderable.forEach(this._renderEntity);
            }
        }
        this._batcher.flush();
    }

    protected _layerOptionsChanged(options: LayerOptions): boolean {
        if (this._lastLayerOptions.inCamera !== options.inCamera) {
            this._lastLayerOptions = options
            return true;
        } else {
            this._lastLayerOptions = options
            return false;
        }
    }

    protected _initTexture(imageInfo: ImageInfo, img: HTMLImageElement) {
        let ctx = this._ctx;
        let texture = new Texture(ctx, img);
        this._textureMap[imageInfo.src] = texture;
        if (imageInfo.repeat) {
            texture.setWraps(ctx._gl.REPEAT, ctx._gl.REPEAT);
        }
        if (imageInfo.linear) {
            texture.setFilters(ctx._gl.LINEAR, ctx._gl.LINEAR);
        }
    }

    protected _readTransformComp(e: Entity) {
        let o = e.get('transform');
        if (o.x === undefined || Number.isNaN(o.x))
            o.x = 0;
        if (o.y === undefined || Number.isNaN(o.y))
            o.y = 0;
        if (o.rotation === undefined || Number.isNaN(o.rotation))
            o.rotation = 0;
        if (o.width === undefined || Number.isNaN(o.width))
            o.width = 0;
        if (o.height === undefined || Number.isNaN(o.height))
            o.height = 0;

        return o;
    }

    protected _renderEntity(e: Entity) {

        let renderComp: RenderComponent = e.get('render') as RenderComponent;
        if (renderComp.visible === false)
            return;
        let transComp = this._readTransformComp(e);
        if (renderComp.image) { // render image!!
            let img = this._ecs.state.assets[renderComp.image.src];
            if (!img) return; // 图片没有加载
            if (!renderComp.image.region) {
                renderComp.image.region = { l: 0.0, r: 1.0, t: 0.0, b: 1.0 };
            }

            if (!this._textureMap[renderComp.image.src]) {
                this._initTexture(renderComp.image, img);
                // 未指定尺寸使用图片尺寸
                if (transComp.width <= 0) {
                    transComp.width = img.width;
                }
                if (transComp.height <= 0) {
                    transComp.height = img.height;
                }
            }

            this._srt.fromSRT(transComp.width, transComp.height, transComp.rotation, transComp.x, transComp.y);
            this._batcher.drawTexture(this._srt, this._textureMap[renderComp.image.src], renderComp.image.region);
        } else if (renderComp.color) {
            this._srt.fromSRT(transComp.width, transComp.height, transComp.rotation, transComp.x, transComp.y);
            this._batcher.drawQuad(this._srt, renderComp.color)
        } else if (renderComp.wireframe) {
            // TODO
            let w = renderComp.wireframe;
            transComp.width = transComp.height = 1;

            this._srt.fromSRT(transComp.width, transComp.height, transComp.rotation, transComp.x, transComp.y);

            switch (w.type) {
                case 'line':
                    let c = renderComp.wireframe.color
                    if (c) {
                        this._penColor.reset(c.r, c.g, c.b, c.a);
                    }
                    this._batcher.drawLine(this._srt, w.x1, w.y1, w.x2, w.y2, this._penColor);
                    break;

                default:
                    break;
            }

        } else {
            console.log('???????')
        }

    }

}