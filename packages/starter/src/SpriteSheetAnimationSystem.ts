import { System, ECS, Group, Entity } from "@shed/ecs";
import { Render2DComponent, Image2D } from "@shed/render2d-system";
import { SpriteSheetData } from "./utils/SpriteSheetData";

/**
 * 修改Render2DComponent<Image2D>的region来形成动画效果
 */
export class SpriteSheetAnimationSystem extends System {

    protected _group: Group;
    protected _playOver: (e: Entity) => void;
    protected _animationDic: { [key: string]: Animation; } = {};
    protected _spritesheetDic: { [key: string]: SpriteSheetData; } = {};

    constructor(ecs: ECS, playOver: (e: Entity) => void, store: { [key: string]: SpriteSheetData; }) {
        super(ecs);
        this._playOver = playOver;
        this._spritesheetDic = store;
        // this.updateEntity = this.updateEntity.bind(this);
        this._group = ecs.getGroup('spriteSheetAnimation', 'render2d', 'transform');
    }

    /**
     * 添加一个动画
     * @param spritesheet 动画在哪个spritesheet里
     * @param name 动画名称
     * @param loop 是否循环播放
     * @param frames 图片帧数组
     */
    addAnimation(spritesheet: string, name: string, loop: boolean, frames: string[]) {
        if (!this._spritesheetDic[spritesheet]) {
            console.warn(`${name} 动画没有找到对应的spritesheet: ${spritesheet}`);
            return;
        };
        let regions = frames.map(imgSrc => {
            return this._spritesheetDic[spritesheet].getRegion(imgSrc);
        });
        this._animationDic[name] = { spritesheet, loop, regions };
        // let len = frames.length;
    }

    update() {
        let comp: SpriteSheetAnimationComponent;
        let currentAnimation: Animation;
        this._group.forEach(e => {
            comp = e.get<SpriteSheetAnimationComponent>('spriteSheetAnimation');
            currentAnimation = this._animationDic[comp.playing];
            if (!currentAnimation)
                return;

            if (!comp._initialized) {
                //修改spritesheet属性后要设置为false，强制重新生成
                comp._initialized = true;
                // generate property
                comp._frameElapsed = 0;
                comp._frameLength = 1000 / comp.fps;
                comp._currentFrameIdx = 0;
                // comp._currentSequence = this._animationDic[comp.playing];
            } else {
                comp._frameElapsed += this._ecs.state.elapsed;
                if (comp._frameElapsed >= comp._frameLength) {
                    comp._frameElapsed = 0;
                    if (comp._currentFrameIdx === currentAnimation.regions.length - 1) {
                        if (currentAnimation.loop)
                            comp._currentFrameIdx = 0;
                        else {
                            // play once
                            this._playOver(e);
                        }
                    } else {
                        comp._currentFrameIdx++;
                    }
                }
            }
            // 更新uv
            e.get<Render2DComponent<Image2D>>('render2d').image.region = currentAnimation.regions[comp._currentFrameIdx];
        });
    }
}

type Animation = { spritesheet: string, loop: boolean; regions: { l: number, r: number, t: number, b: number; }[]; };
export type SpriteSheetAnimationComponent = {

    type: 'spriteSheetAnimation';
    spritesheet: string;
    fps: number;
    playing: 'explosion';

    // generate

    /**
     * 是否初始化过
     * @internal
     */
    _initialized?: boolean;
    /**
     * 累计经过时间，超过 _frameLength 后会归0
     * @internal
     */
    _frameElapsed?: number;
    /** 
     * 每一帧时间长度，根据 fps 计算出来
     * @internal 
     */
    _frameLength?: number;
    /**
     * 当前帧索引 (regions索引)
     * @internal
     */
    _currentFrameIdx?: number;
    // _currentSequence?: Animation;
};