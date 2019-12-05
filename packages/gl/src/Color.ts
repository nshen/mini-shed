export class Color {

    static readonly TRANSPARENT = new Color(0.0, 0.0, 0.0, 0.0);
    static readonly WHITE = new Color(1.0, 1.0, 1.0, 1.0);
    static readonly BLACK = new Color(0.0, 0.0, 0.0, 1.0);
    static readonly GRAY = new Color(0.5, 0.5, 0.5, 1.0);
    static readonly DARK_GRAY = new Color(0.3, 0.3, 0.3, 1.0); // 深灰 
    static readonly LIGHT_GRAY = new Color(0.7, 0.7, 0.7, 1.0); // 浅灰
    static readonly RED = new Color(1.0, 0, 0, 1.0);
    static readonly GREEN = new Color(0, 1.0, 0, 1.0);
    static readonly BLUE = new Color(0, 0, 1.0, 1.0);
    static readonly YELLOW = new Color(1.0, 1.0, 0, 1.0);
    static readonly CYAN = new Color(0, 1.0, 1.0, 1.0); // 蓝绿

    /**
     *  颜色混合
     * @static
     * @param {Color} c1
     * @param {Color} c2
     * @param {number} ratio 0~1 之间的值
     * @returns {Color}
     */
    public static Mix(c1: Color, c2: Color, ratio: number): Color {
        let oneMinusR: number = 1 - ratio;
        return new Color(c1.r * oneMinusR + c2.r * ratio,
            c1.g * oneMinusR + c2.g * ratio,
            c1.b * oneMinusR + c2.b * ratio,
            c1.a * oneMinusR + c2.a * ratio);
    }

    public static fromHex(v: number): Color {
        let inv255: number = 1 / 255;
        return new Color(
            ((v & 0xff000000) >>> 24) * inv255,
            ((v & 0x00ff0000) >>> 16) * inv255,
            ((v & 0x0000ff00) >>> 8) * inv255,
            ((v & 0x000000ff)) * inv255
        );
    }

    /**
     * hex字符串转成 Color
     * 
     * @param str '#FF000000' or '00FF00' or '#0000FF'
     */
    public static fromHexStr(str: string): Color {
        if (str.length >= 6) {
            let p = str[0] === '#' ? 1 : 0;
            let inv255: number = 1 / 255;
            return new Color(
                parseInt(str[p] + str[p + 1], 16) * inv255,
                parseInt(str[p + 2] + str[p + 3], 16) * inv255,
                parseInt(str[p + 4] + str[p + 5], 16) * inv255,
                str[p + 6] ? parseInt(str[p + 6] + str[p + 7], 16) * inv255 : 1.0,
            )
        }
        console.warn("str .length must more than 6");
        return Color.WHITE.clone();
    }

    private static _hue2rgb(p: number, q: number, t: number) {

        if (t < 0) t += 1
        else if (t > 1) t -= 1;

        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * 6 * (2 / 3 - t);
        return p;
    }

    /**
     * 色相、饱和度、亮度 
     * @param hue 色相 (0~1) 红色(0)，绿色(0.33)，蓝色(0.66)
     * @param saturation 饱和度 (0~1) 0：没颜色， 1:饱和
     * @param luminance 亮度 0:黑，0.5:hue，1:白
     * @param alpha 透明度默认为1
     */
    public static fromHSLA(h: number, s: number, l: number, alpha: number = 1) {

        if (s === 0) {
            return new Color(l, l, l);
        } else {

            let q = l <= 0.5 ? l * (1 + s) : l + s - (l * s);
            let p = (2 * l) - q;

            return new Color(
                Color._hue2rgb(p, q, h + 1 / 3),
                Color._hue2rgb(p, q, h),
                Color._hue2rgb(p, q, h - 1 / 3),
                alpha
            )
        }
    }

    public toHSLA(): { h: number, s: number, l: number, a: number } {

        let r = this.r, g = this.g, b = this.b;
        let max = Math.max(r, g, b);
        let min = Math.min(r, g, b);
        let hue = 0, saturation = 0;
        let lightness = (min + max) / 2.0;

        if (min !== max) {
            let delta = max - min;
            saturation = lightness <= 0.5 ? delta / (max + min) : delta / (2 - max - min);
            switch (max) {
                case r: hue = (g - b) / delta + (g < b ? 6 : 0); break;
                case g: hue = (b - r) / delta + 2; break;
                case b: hue = (r - g) / delta + 4; break;
            }
            hue /= 6;
        }
        return { h: hue, s: saturation, l: lightness, a: this.a };
    }


    public static random(): Color {
        return Color.fromHex(Math.random() * 0xffffffff);
        // return new Color(Math.random(), Math.random(), Math.random(), Math.random());
    }

    /**
     * WebGl需要值范围在 0 ~ 1 之间
     * 
     * @type {number}
     */
    public r: number;
    public g: number;
    public b: number;
    public a: number;

    /**
     * Creates an instance of Color.
     * 
     * @param {number} [r=1] 0~1 之间
     * @param {number} [g=1] 0~1 之间
     * @param {number} [b=1] 0~1 之间
     * @param {number} [a=1] 0~1 之间
     */
    constructor(r: number = 1, g: number = 1, b: number = 1, a: number = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    public reset(r: number = 1, g: number = 1, b: number = 1, a: number = 1): Color {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        return this;
    }

    public reset255(r: number = 255, g: number = 255, b: number = 255, a: number = 255): Color {
        this.a255 = a;
        this.r255 = r;
        this.g255 = g;
        this.b255 = b;
        return this;
    }

    public get r255(): number {
        return Math.round(this.r * 255);
    }

    public set r255(v: number) {
        if (isNaN(v))
            return;

        this.r = v / 255;
    }

    public get g255(): number {
        return Math.round(this.g * 255);
    }

    public set g255(v: number) {
        if (isNaN(v))
            return;

        this.g = v / 255;
    }

    public get b255(): number {
        return Math.round(this.b * 255);
    }

    public set b255(v: number) {
        if (isNaN(v))
            return;

        this.b = v / 255;
    }

    public get a255(): number {
        return Math.round(this.a * 255);
    }

    public set a255(v: number) {
        if (isNaN(v))
            return;

        this.a = v / 255;
    }

    /**
     *  设置 0xRRGGBBAA 格式
     */
    public set hex(v: number) {
        this.r255 = ((v & 0xff000000) >>> 24);
        this.g255 = ((v & 0x00ff0000) >>> 16);
        this.b255 = ((v & 0x0000ff00) >>> 8);
        this.a255 = ((v & 0x000000ff));
    }

    /**
     * 返回 16进制数字 RRGGBBAA 格式
     * 
     * @type {number}
     */
    public get hex(): number {
        return (this.r255 << 24) | (this.g255 << 16) | (this.b255 << 8) | (this.a255);
    }

    public toFloat32Array(target?: Float32Array): Float32Array {
        if (!target) {
            target = new Float32Array(4);
        }
        target[0] = this.r;
        target[1] = this.g;
        target[2] = this.b;
        target[3] = this.a;
        return target;
    }

    public equal(c: Color): boolean {
        let e = 0.001;
        if (Math.abs(this.r - c.r) > e
            || Math.abs(this.g - c.g) > e
            || Math.abs(this.b - c.b) > e
            || Math.abs(this.a - c.a) > e) {
            return false;
        }
        return true;
    }

    public copyFrom(c: Color): Color {
        return this.reset(c.r, c.g, c.b, c.a);
    }

    public clone(): Color {
        return new Color(this.r, this.g, this.b, this.a);
    }

    // from rgb(1,1,1)
    public fromString(rgb255: string) {
        let arr = /rgb\((\d+),\s(\d+),\s(\d+)/.exec(rgb255)
        if (arr)
            this.reset255(Number(arr[1]), Number(arr[2]), Number(arr[3]), 255)
    }

    /**
     * return rgb(r255,g255,b255)
     */
    public toString() {
        return `rgba(${this.r255}, ${this.g255}, ${this.b255}, ${this.a255})`;
    }

    public toGray(): Color {
        let gray = (this.r + this.g + this.b) / 3
        this.r = this.g = this.b = gray;
        return this;
    }


}
