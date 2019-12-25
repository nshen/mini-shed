import { System, Group, ECS, Entity } from "@shed/ecs";
import { Context, Texture, Color } from "@shed/gl";
import { Matrix2D, topleft2D } from "@shed/math";
import { Batcher } from "./utils/Batcher";

interface IRenderLayer {
    entityGroup: Group;
    options: ILayerOptions;
}

interface ILayerOptions {
    inCamera: boolean;
}

// export type ColorData = { r: number; g: number; b: number; a: number; };
// export type ImageData = { src: string, region?: { l: number, r: number, t: number, b: number; }, repeat?: boolean, linear?: boolean; };
// export type WireframeData = { type: string, color: { r: number; g: number; b: number; a: number; }, [key: string]: any; };

export type TransformComponent = {
    type: 'transform',
    x: number, y: number,
    width: number, height: number,
    rotation: number; // 角度值
};

type Render2DComponentBase = {
    type: 'render2d';
    visible: boolean;
    color: { r: number; g: number; b: number; a: number; }; // normalized
    image: {
        src: string;
        region: { l: number, r: number, t: number, b: number; };
        repeat: boolean;
        linear: boolean;
    };
    wireframe: { kind: 'line', x1: number, y1: number, x2: number, y2: number, color: { r: number; g: number; b: number; a: number; }; };
};

export type Quad2D = Omit<Render2DComponentBase, 'image' | 'wireframe'>;
export type Image2D = Omit<Render2DComponentBase, 'color' | 'wireframe'>;
export type Wireframe2D = Omit<Render2DComponentBase, 'color' | 'image'>;

export type Render2DComponent<T extends Image2D | Quad2D | Wireframe2D = Quad2D> = T;
// T extends ColorData ? ColorData :
// T extends ImageData ? ImageData :
// T extends WireframeData ? WireframeData :
// never;


// let aa: Render2DComponent<ColorData> = { type: 'render2d' , };
// export type Render2DComponent<T extends ImageData | ColorData = ImageData> = T extends ColorData ? {
//     type: 'render2d',
//     visible?: boolean;
//     color?: { r: number; g: number; b: number; a: number; },

// } :
//     {
//         type: 'render2d',
//         visible?: boolean;
//         image?: ImageData,
//         wireframe?: WireframeData;
//     };
export function createTransformComponent(x = 0, y = 0, width = 1, height = 1, rotation = 0): TransformComponent {
    return { type: 'transform', x, y, width, height, rotation };
}

export function createRender2DComponentImage(src: string, region = { l: 0.0, r: 1.0, t: 0.0, b: 1.0 }, linear = false, repeat = false): Render2DComponent<Image2D> {
    return { type: "render2d", visible: true, image: { src, linear, region, repeat } };
}

export function createRender2DComponentQuad(color: Color): Render2DComponent<Quad2D> {
    return { type: 'render2d', visible: true, color: { r: color.r, g: color.g, b: color.b, a: color.a } };
};

export function createRender2DComponentLine(color: Color, x1: number, y1: number, x2: number, y2: number): Render2DComponent<Wireframe2D> {
    return { type: 'render2d', visible: true, wireframe: { kind: 'line', color: { r: color.r, g: color.g, b: color.b, a: color.a }, x1, y1, x2, y2 } };
}


export class Render2DSystem extends System {

    static type: 'render2d' = 'render2d';
    static TRANSFORM_TYPE: 'transform' = 'transform';

    protected _ctx: Context;
    protected _batcher: Batcher;
    protected _srt: Matrix2D = new Matrix2D();
    protected _textureMap: { [entityID: string]: Texture; } = {};
    protected _allRenderable: Group | undefined;
    protected _layers: IRenderLayer[] = [];
    protected _lastLayerOptions: ILayerOptions = { inCamera: true };
    protected _imageStore: { [key: string]: HTMLImageElement; };

    protected _vpMatrix!: Matrix2D;
    protected _penColor: Color = Color.LIGHT_GRAY.clone();

    /**
     * 创建一个2d渲染系统 
     * @param ecs 
     * @param ctx @shed/gl/Context
     * @param imageStore 存储图片的位置，默认为 ecs.state.assets 下
     * @param layered 分层渲染，默认为false，需调用addLayer添加层。如为false则一次渲染所有含'render'和'transform'组件的Entity。
     */
    constructor(ecs: ECS, ctx: Context, imageStore: { [key: string]: HTMLImageElement; } = ecs.state.assets, layered: boolean = false) {
        super(ecs);
        if (!layered) {
            this._allRenderable = ecs.getGroup(Render2DSystem.type, 'transform');
        }
        this._ctx = ctx;
        this._imageStore = imageStore;
        this._renderEntity = this._renderEntity.bind(this);
        this._batcher = new Batcher(this._ctx);

        // Camera System
        //ecs.state.projectMatrix
        //ecs.state.viewMatrix
        this._vpMatrix = topleft2D(this._ctx.width, this._ctx.height);

    }

    addLayer(group: Group, options: ILayerOptions = { inCamera: false }) {
        this._layers.push({ entityGroup: group, options: options });
        // console.log('addLayer:', group, options.inCamera)
    }

    update() {
        if (!this._ecs.state.vpMatrix)
            this._ecs.state.vpMatrix = this._vpMatrix;

        if (this._layers.length > 0) {
            let layer: IRenderLayer;
            for (let i: number = 0; i < this._layers.length; i++) {
                layer = this._layers[i];
                // 层状态改变需要结束 draw call
                if (this._layerOptionsChanged(layer.options)) {
                    this._batcher.flush();
                }
                if (layer.options.inCamera === false) {
                    this._batcher.vpMatrix = this._vpMatrix;
                } else {
                    this._batcher.vpMatrix = this._ecs.state.vpMatrix;
                }
                layer.entityGroup.forEach(this._renderEntity);
            }
        } else {
            this._batcher.vpMatrix = this._ecs.state.vpMatrix;
            if (this._allRenderable) {
                this._allRenderable.forEach(this._renderEntity);
            }
        }
        this._batcher.flush();
    }

    protected _layerOptionsChanged(options: ILayerOptions): boolean {
        if (this._lastLayerOptions.inCamera !== options.inCamera) {
            this._lastLayerOptions = options;
            return true;
        } else {
            this._lastLayerOptions = options;
            return false;
        }
    }

    protected _initTexture(imageInfo: Image2D['image'], img: HTMLImageElement) {
        let ctx = this._ctx;
        let texture = new Texture(ctx, img);
        if (imageInfo.repeat) {
            texture.setWrapsRepeat();
        }
        if (imageInfo.linear) {
            texture.setFiltersLinear();
        }
        this._textureMap[imageInfo.src] = texture;
    }

    // protected _readTransformComp(e: Entity) {
    //     let o = e.get('transform');
    //     if (o.x === undefined || Number.isNaN(o.x))
    //         o.x = 0;
    //     if (o.y === undefined || Number.isNaN(o.y))
    //         o.y = 0;
    //     if (o.rotation === undefined || Number.isNaN(o.rotation))
    //         o.rotation = 0;
    //     if (o.width === undefined || Number.isNaN(o.width))
    //         o.width = 0;
    //     if (o.height === undefined || Number.isNaN(o.height))
    //         o.height = 0;

    //     return o;
    // }

    protected _renderImage(renderComp: Render2DComponent<Image2D>, transComp: TransformComponent): void {
        let src = renderComp.image.src;
        let img = this._imageStore[src];
        if (!img) return; // 图片没有加载

        // if (!renderComp.image.region) {
        //     renderComp.image.region = { l: 0.0, r: 1.0, t: 0.0, b: 1.0 };
        // }

        if (!this._textureMap[src]) {
            this._initTexture(renderComp.image, img);

            // 未指定尺寸使用图片尺寸
            if (transComp.width <= 1) {
                transComp.width = img.width;
            }
            if (transComp.height <= 1) {
                transComp.height = img.height;
            }
        }


        this._srt.fromSRT(transComp.width, transComp.height, transComp.rotation, transComp.x, transComp.y);
        this._batcher.drawTexture(this._srt, this._textureMap[src], renderComp.image.region);
    }

    protected _renderQuad(renderComp: Render2DComponent<Quad2D>, transComp: TransformComponent): void {
        this._srt.fromSRT(transComp.width, transComp.height, transComp.rotation, transComp.x, transComp.y);
        this._batcher.drawQuad(this._srt, renderComp.color);
    }

    protected _renderWireframe(renderComp: Render2DComponent<Wireframe2D>, transComp: TransformComponent): void {
        let w = renderComp.wireframe;
        transComp.width = transComp.height = 1;
        this._srt.fromSRT(transComp.width, transComp.height, transComp.rotation, transComp.x, transComp.y);
        switch (w.kind) {
            case 'line':
                let c = renderComp.wireframe.color;
                if (c) {
                    this._penColor.reset(c.r, c.g, c.b, c.a);
                }
                this._batcher.drawLine(this._srt, w.x1, w.y1, w.x2, w.y2, this._penColor);
                break;

            default:
                break;
        }
    }

    protected _renderEntity(e: Entity) {
        let renderComp = e.get<Render2DComponentBase>(Render2DSystem.type);
        if (renderComp.visible === false)
            return;
        // let transComp = this._readTransformComp(e);
        let transComp = e.get<TransformComponent>('transform');
        if (renderComp.image) {
            this._renderImage(renderComp as Render2DComponent<Image2D>, transComp);
        } else if (renderComp.color) {
            this._renderQuad(renderComp as Render2DComponent<Quad2D>, transComp);
        } else if (renderComp.wireframe) {
            this._renderWireframe(renderComp as Render2DComponent<Wireframe2D>, transComp);
        } else {
            console.warn('cant render Entity', renderComp);
        }

    }

}