import { Color } from "./Color";
declare var __DEBUG__: boolean;

export class Context {

    readonly POINTS: number = 0x0000; // WebGLRenderingContext.POINTS;
    readonly LINES: number = 0x0001;  // WebGLRenderingContext.LINES;
    readonly LINE_LOOP: number = 0x0002; // WebGLRenderingContext.LINE_LOOP;
    readonly LINE_STRIP: number = 0x0003; // WebGLRenderingContext.LINE_STRIP;
    readonly TRIANGLES: number = 0x0004; // WebGLRenderingContext.TRIANGLES;
    readonly TRIANGLE_STRIP: number = 0x0005; // WebGLRenderingContext.TRIANGLE_STRIP;
    readonly TRIANGLE_FAN: number = 0x0006; // WebGLRenderingContext.TRIANGLE_FAN;

    protected _drawCall: number = 0;
    protected _depthEnabled: boolean = false;
    protected _clearMask = 0;

    public _gl: WebGLRenderingContext;

    constructor(ctx: WebGLRenderingContext) {
        this._gl = ctx;
        this.clearColor = Color.GRAY;
        this._clearMask = this._gl.COLOR_BUFFER_BIT;
    }

    static fromCanvas(canvas: HTMLCanvasElement) {
        return new Context(canvas.getContext('webgl') as WebGLRenderingContext);
    }

    get gl(): WebGLRenderingContext {
        return this._gl;
    }
    get drawCall(): number {
        return this._drawCall;
    }

    get width() {
        return this._gl.drawingBufferWidth;
    }

    get height() {
        return this._gl.drawingBufferHeight;
    }

    enableDepthTest() {
        let gl = this._gl;
        gl.enable(gl.DEPTH_TEST);
        this._clearMask |= gl.DEPTH_BUFFER_BIT;
    }

    disableDepthTest() {
        let gl = this._gl;
        gl.disable(gl.DEPTH_TEST);
        this._clearMask &= ~gl.DEPTH_BUFFER_BIT;
    }

    enableStencilTest() {
        let gl = this._gl;
        gl.enable(gl.STENCIL_TEST);
        this._clearMask |= gl.STENCIL_BUFFER_BIT;
    }

    disableStencilTest() {
        let gl = this._gl;
        gl.disable(gl.STENCIL_TEST);
        this._clearMask &= ~gl.STENCIL_BUFFER_BIT;
    }

    enableBlend() {
        let gl = this._gl;
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    }

    blendPremultipliedAlpha() {
        let gl = this._gl;
        gl.enable(gl.BLEND);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    }

    blendNotPremultipliedAlpha() {
        let gl = this._gl;
        gl.enable(gl.BLEND);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }


    disableBlend() {
        let gl = this._gl;
        gl.disable(gl.BLEND);
    }

    set premultipiledAlpha(b: boolean) {
        let gl = this._gl;
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, b);
    }

    set depthTest(b: boolean) {
        let gl = this._gl;
        if (b)
            gl.enable(gl.DEPTH_TEST);
        else
            gl.disable(gl.DEPTH_TEST);
    }

    cullFace(face: 'BACK' | 'FRONT' | 'BOTH' | 'NONE') {
        let gl = this._gl;
        switch (face) {
            case 'BACK':
                gl.enable(gl.CULL_FACE);
                gl.cullFace(gl.BACK);
                break;
            case 'FRONT':
                gl.enable(gl.CULL_FACE);
                gl.cullFace(gl.FRONT);
                break;
            case 'BOTH':
                gl.enable(gl.CULL_FACE);
                gl.cullFace(gl.FRONT_AND_BACK);
                break;
            case 'NONE':
                gl.disable(gl.CULL_FACE);
                break;
        }
    }

    // set color
    set clearColor(c: Color) {
        this._gl.clearColor(c.r, c.g, c.b, c.a);
    }

    clear(): void {
        this._gl.clear(this._clearMask);
        this._drawCall = 0;
    }

    clearColorBuffer() {
        this._gl.clear(this._gl.COLOR_BUFFER_BIT);
        this._drawCall = 0;
    }

    // turn off the color channel
    colorMask(r: boolean, g: boolean, b: boolean, a: boolean): void {
        this._gl.colorMask(r, g, b, a);
    }

    flipY(boole: boolean = true) {
        this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL, boole ? 1 : 0);
    }

    // 没有indexbuffer时调用
    // @primitiveType: gl.POINTS, gl.LINES, gl.LINE_STRIP, gl.LINE_LOOP, gl.TRIANGLES, gl.TRIANGLE_STRIP, gl. TRIANGLE_FAN.
    drawArrays(primitiveType: GLenum, count: number, offset: number = 0) {
        this._gl.drawArrays(primitiveType, offset, count);
        this._drawCall++;
    }

    drawArraysTriangles(count: number, offset: number = 0) {
        let gl = this._gl;
        gl.drawArrays(gl.TRIANGLES, offset, count);
        this._drawCall++;
    }

    // drawArraysPoints(offset: number, count: number) {
    //     let gl = this._gl;
    //     gl.drawArrays(gl.POINTS, offset, count);
    //     this._drawCall++;
    // }
    // drawArraysLines(offset: number, count: number) {
    //     let gl = this._gl;
    //     gl.drawArrays(gl.LINES, offset, count);
    //     this._drawCall++;
    // }
    // drawArraysLineStrip(offset: number, count: number) {
    //     let gl = this._gl;
    //     gl.drawArrays(gl.LINE_STRIP, offset, count);
    //     this._drawCall++;
    // }
    // drawArraysLineLoop(offset: number, count: number) {
    //     let gl = this._gl;
    //     gl.drawArrays(gl.LINE_LOOP, offset, count);
    //     this._drawCall++;
    // }

    // drawArraysTriangleStrip(offset: number, count: number) {
    //     let gl = this._gl;
    //     gl.drawArrays(gl.TRIANGLE_STRIP, offset, count);
    //     this._drawCall++;
    // }
    // drawArraysTriangleFan(offset: number, count: number) {
    //     let gl = this._gl;
    //     gl.drawArrays(gl.TRIANGLE_FAN, offset, count);
    //     this._drawCall++;
    // }

    drawElements(primitiveType: number, count: number, offset: number = 0) {
        let gl = this._gl;
        gl.drawElements(primitiveType, count, gl.UNSIGNED_SHORT, offset);
        this._drawCall++;
    }

    drawElementsTriangle(count: number, offset: number = 0) {
        let gl = this._gl;
        gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, offset);
        this._drawCall++;
    }

    viewport(x: number, y: number, width: number, height: number) {
        this._gl.viewport(x, y, width, height);
    }

    /**
     * 在浏览器环境中，可能由于窗口变化，或CSS影响，需要调用此方法重新适配Canvas大小
     * 注意：只应在浏览器环境中调用此方法，在小游戏环境中调用会报错
     * 参考：https://webglfundamentals.org/webgl/lessons/webgl-resizing-the-canvas.html
     */
    adjustSize(): boolean {
        let canvas = this._gl.canvas;
        // Lookup the size the browser is displaying the canvas.
        let displayWidth = (canvas as HTMLElement).clientWidth;
        let displayHeight = (canvas as HTMLElement).clientHeight;

        // Check if the canvas is not the same size.
        if (canvas.width != displayWidth ||
            canvas.height != displayHeight) {
            if (__DEBUG__) {
                console.log('context.adjustSize:', displayWidth, displayHeight);
            }

            // Make the canvas the same size
            canvas.width = displayWidth;
            canvas.height = displayHeight;
            this._gl.viewport(0, 0, displayWidth, displayHeight);
            return true;
        }
        return false;
    }

    adjustHDSize(realToCSSPixels: number = window.devicePixelRatio): boolean {
        let canvas = this._gl.canvas;

        // Lookup the size the browser is displaying the canvas in CSS pixels
        // and compute a size needed to make our drawingbuffer match it in
        // device pixels.
        var displayWidth = Math.floor((canvas as HTMLElement).clientWidth * realToCSSPixels);
        var displayHeight = Math.floor((canvas as HTMLElement).clientHeight * realToCSSPixels);

        // Check if the canvas is not the same size.
        if (canvas.width !== displayWidth ||
            canvas.height !== displayHeight) {

            // Make the canvas the same size
            canvas.width = displayWidth;
            canvas.height = displayHeight;
            this._gl.viewport(0, 0, displayWidth, displayHeight);
            return true;
        }
        return false;
    }

    // registMouseDown(fun: (x: number, y: number) => any) {
    //     let gl = this._gl;
    //     let canvas = gl.canvas;
    //     canvas.onmousedown = (ev) => {
    //         let x = ev.clientX;
    //         let y = ev.clientY;
    //         let rect = canvas.getBoundingClientRect();
    //         fun(x - rect.left, y - rect.top);
    //     }
    // }

}