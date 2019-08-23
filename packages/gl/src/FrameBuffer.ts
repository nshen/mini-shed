import { Context } from "./Context";

export class FrameBuffer {

    protected static BINDING: FrameBuffer | null;
    protected _ctx: Context;
    protected _glFB: WebGLFramebuffer;
    constructor(ctx: Context) {
        this._ctx = ctx;
        this._glFB = ctx._gl.createFramebuffer() as WebGLFramebuffer;

    }

    bind() {
        if (FrameBuffer.BINDING === this)
            return;
        let gl = this._ctx._gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._glFB)
        FrameBuffer.BINDING = this;
    }

    unbind() {
        if (FrameBuffer.BINDING !== this)
            return;
        let gl = this._ctx._gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        FrameBuffer.BINDING = null;

    }
}