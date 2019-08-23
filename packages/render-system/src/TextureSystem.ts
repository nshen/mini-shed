import { System, Group, ECS, Entity } from "@shed/ecs";
import { Context, Color, Program, VertexBuffer, Texture } from "@shed/gl";
import { center2D, Matrix2D, topleft2D } from "@shed/math";

type TextureComponent = { type: 'texture', image: string, region: { l: number, r: number, t: number, b: number }, repeat?: boolean, linear?: boolean };


class TransformComponentClass {

    TYPE: string = "transform";

    x: number = 0;
    y: number = 0;
    rotation: number = 0;
    width: number = 0;
    height: number = 0;

    read(o: any) {
        if (o.type !== this.TYPE)
            console.log('transformComponent is not invalid');
        if (o.x)
            this.x = o.x;
        else
            o.x = 0;
        if (o.y)
            this.y = o.y;
        else
            this.y = 0;
        if (o.rotation)
            this.rotation = o.rotation;
        else
            this.rotation = 0;
        if (o.width)
            this.width = o.width;
        else
            this.width = 0;

        if (o.height)
            this.height = o.height;
        else
            this.height = 0;

        return this;
    }
}

const A_POS: string = "aPos";
const A_UV: string = "aUV"
const V_UV: string = "vUV"
// const A_COLOR: string = "aColor"
// const V_COLOR: string = "vColor"
const U_M_MATRIX: string = "uM";
const U_VP_MATRIX: string = "uVP";
const U_SAMPLER: string = "uSampler";

export class TextureSystem extends System {

    protected _ctx: Context;
    protected _program: Program;

    // protected _color: Color;
    protected _posBuffer: VertexBuffer;
    protected _texBuffer: VertexBuffer;
    protected _modelMatrix: Matrix2D;

    protected _textureMap: { [entityID: string]: Texture } = {};
    protected _cacheUV = { l: 0.0, r: 1.0, t: 0.0, b: 1.0 }// 用来比对是否需要更新buffer

    protected _group: Group;
    protected _transform_temp: TransformComponentClass = new TransformComponentClass();

    constructor(ecs: ECS) {
        super(ecs);
        this._group = ecs.getGroup('texture', 'transform');
        this._ctx = ecs.state.ctx;
        this._program = this._createProgram().bind();

        this._posBuffer = new VertexBuffer(this._ctx);
        this._posBuffer.addAttribute(this._program.getAttributeLocation(A_POS), 2);

        this._texBuffer = new VertexBuffer(this._ctx);
        this._texBuffer.addAttribute(this._program.getAttributeLocation(A_UV), 2);
        this._updateTexBuffer();

        this._modelMatrix = new Matrix2D();

    }

    protected _createProgram(): Program {
        let vs = `
				attribute vec2 ${A_POS};
				attribute vec2 ${A_UV};
                uniform mat3 ${U_M_MATRIX};
                uniform mat3 ${U_VP_MATRIX};
				varying vec2 ${V_UV};

				void main () {
                    vec3 coords = ${U_VP_MATRIX} * ${U_M_MATRIX} * vec3(${A_POS}, 1.0);
                    gl_Position = vec4(coords.xy, 0.0, 1.0);
                    ${V_UV} = ${A_UV};
				}
			`;

        let fs = `
                precision mediump float;
                uniform sampler2D ${U_SAMPLER};
                varying vec2 ${V_UV};

				void main () {
                    gl_FragColor = texture2D(${U_SAMPLER},${V_UV});
				}
            `;
        return new Program(this._ctx, vs, fs);
    }

    protected _updateTexBuffer(region = { l: 0, r: 1, t: 0, b: 1 }) {
        let cache = this._cacheUV;
        cache.l = region.l;
        cache.r = region.r;
        cache.t = region.t;
        cache.b = region.b;
        this._texBuffer.setData(new Float32Array([
            cache.l, cache.t,
            cache.r, cache.t,
            cache.r, cache.b,
            cache.l, cache.b,
        ]));
    }
    protected _updatePosBuffer(x: number, y: number, width: number, height: number) {
        let hw = width * .5;
        let hh = height * .5;
        let x1 = x - hw;
        let x2 = x + hw;
        let y1 = y - hh;
        let y2 = y + hh;
        // 左上角
        // let x1 = x;
        // let x2 = x + width;
        // let y1 = y ;
        // let y2 = y + height;

        // this._posBuffer.setData(new Float32Array([
        //     x1, y1,
        //     x2, y1,
        //     x2, y2,
        //     x1, y2
        // ]), false)

        this._posBuffer.setData(new Float32Array([
            -0.5, -0.5,
            0.5, -0.5,
            0.5, 0.5,
            -0.5, 0.5
        ]), false)
    }

    protected _render(e: Entity, texComp: TextureComponent, transComp: TransformComponentClass) {

        let ctx = this._ctx;
        let program = this._program;
        let posBuffer = this._posBuffer;
        let texBuffer = this._texBuffer;
        let img = this._ecs.state.assets[texComp.image];
        if (transComp.width <= 0) {
            transComp.width = img.width;
        }
        if (transComp.height <= 0) {
            transComp.height = img.height;
        }

        this._updatePosBuffer(0, 0, transComp.width ? transComp.width : img.width, transComp.height ? transComp.height : img.height);
        posBuffer.bindAttributes();


        texBuffer.bindAttributes();

        if (this._cacheUV.l !== texComp.region.l ||
            this._cacheUV.r !== texComp.region.r ||
            this._cacheUV.t !== texComp.region.t ||
            this._cacheUV.b !== texComp.region.b) {
            this._updateTexBuffer(texComp.region);// 有可能更新uv buffer
        }

        this._program.uMat3(U_M_MATRIX, Matrix2D.SRT(transComp.width, transComp.height, transComp.rotation * (Math.PI / 180), transComp.x, transComp.y).float32Array);
        this._program.uSampler2D(U_SAMPLER, this._textureMap[texComp.image].bind());
        this._ctx.drawArraysTriangleFan(0, 4)
    }

    protected _initTexture(comp: TextureComponent, img: HTMLImageElement) {
        let ctx = this._ctx;
        let texture = new Texture(ctx, img);
        this._textureMap[comp.image] = texture;
        if (comp.repeat) {
            texture.setWraps(ctx._gl.REPEAT, ctx._gl.REPEAT);
        }
        if (comp.linear) {
            texture.setFilters(ctx._gl.LINEAR, ctx._gl.LINEAR);
        }
    }


    // update() {
    //     let e: Entity;
    //     let texComp_temp: TextureComponent;
    //     //TODO: move to camera
    //     let proj = topleft2D(this._ctx.width, this._ctx.height);
    //     this._program.uMat3(U_VP_MATRIX, proj.float32Array);

    //     for (const i in this._group.entityMap) {
    //         e = this._group.entityMap[i];
    //         texComp_temp = e.get('texture') as TextureComponent;
    //         if (!texComp_temp.region) {
    //             texComp_temp.region = { l: 0.0, r: 1.0, t: 0.0, b: 1.0 };
    //         }

    //         this._transform_temp.read(e.get('transform'));

    //         if (!this._textureMap[texComp_temp.image]) {
    //             if (!this._ecs.state.assets[texComp_temp.image])
    //                 continue;
    //             // assets system加载图片成功,初始化texture
    //             this._initTexture(texComp_temp, this._ecs.state.assets[texComp_temp.image]);
    //         }

    //         this._render(e, texComp_temp, this._transform_temp);

    //     }
    // }


}