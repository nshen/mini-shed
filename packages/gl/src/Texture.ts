import { Context } from "./Context";
// TODO: gl.TEXTURE_CUBE_MAP
export class Texture {

    protected _ctx: Context;
    protected _glTexture: WebGLTexture;
    protected _boundUnit: number = -1;
    protected _useMipMaps: boolean = false;

    constructor(ctx: Context, image?: HTMLImageElement, useMipMaps: boolean = false) {
        this._ctx = ctx;
        this._glTexture = ctx._gl.createTexture() as WebGLTexture;
        this._useMipMaps = useMipMaps;
        if (image)
            this.image = image;
    }

    set image(image: HTMLImageElement) {
        if (__DEBUG__) {
            if (!this.isPowerOf2(image.width) || !this.isPowerOf2(image.height))
                console.warn('image size is not power of 2');
        }

        let gl = this._ctx._gl;
        gl.bindTexture(gl.TEXTURE_2D, this._glTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        // To prevent texture wrappings
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        if (this._useMipMaps && this.isPowerOf2(image.width) && this.isPowerOf2(image.height)) {

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            gl.generateMipmap(gl.TEXTURE_2D);

        } else {

            // For pixel-graphics where you want the texture to look "sharp" do the following:
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        }
    }

    bind(unit: number = 0) {
        let gl = this._ctx._gl;
        if (unit !== this._boundUnit) {
            gl.activeTexture(gl.TEXTURE0 + unit);
            this._boundUnit = unit;
        }
        gl.bindTexture(gl.TEXTURE_2D, this._glTexture);
        return unit;
    }

    unbind() {

        let gl = this._ctx._gl;
        gl.activeTexture(gl.TEXTURE0 + this._boundUnit);
        gl.bindTexture(gl.TEXTURE_2D, null);
        this._boundUnit = -1;

    }

    /**
     * 
     * 只有三个值合法
     * 
        gl.MIRRORED_REPEAT
        gl.CLAMP_TO_EDGE;
        gl.REPEAT
     */
    setWraps(uWrap: number, vWrap: number): void {
        this.bind(this._boundUnit);
        let gl = this._ctx._gl;
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, uWrap);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, vWrap);
    }

    // NEAREST = choose 1 pixel from the biggest mip
    // LINEAR = choose 4 pixels from the biggest mip and blend them
    // NEAREST_MIPMAP_NEAREST = choose the best mip, then pick one pixel from that mip
    // LINEAR_MIPMAP_NEAREST = choose the best mip, then blend 4 pixels from that mip
    // NEAREST_MIPMAP_LINEAR = choose the best 2 mips, choose 1 pixel from each, blend them
    // LINEAR_MIPMAP_LINEAR = choose the best 2 mips.choose 4 pixels from each, blend them
    public setFilters(minFilter: number, magFilter: number): void {
        let gl = this._ctx._gl;
        this.bind(this._boundUnit);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
    }

    protected isPowerOf2(n: number): boolean {
        return (n & (n - 1)) === 0;
    }
}