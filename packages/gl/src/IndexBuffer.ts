import { Context } from "./Context";

export class IndexBuffer {

    protected static BINDING: IndexBuffer | null;
    protected _ctx: Context;
    protected _glBuffer: WebGLBuffer;
    // protected _glUsage: number; // gl.DYNAMIC_DRAW | gl.STATIC_DRAW

    protected _length: number = 0;

    get length() {
        return this._length;
    }

    constructor(ctx: Context) {

        this._ctx = ctx;
        let gl = this._ctx._gl;
        this._glBuffer = gl.createBuffer() as WebGLBuffer;
    }

    // Since the indices support in WebGL1.0 is restricted to 16 bit integers, an index array can only be 65,535 elements in length. 
    setData(data: Uint16Array, dynamic: boolean = false) {
        this.bind();
        let gl = this._ctx._gl;
        this._length = data.length;
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW)
    }

    bind() {
        if (IndexBuffer.BINDING === this)
            return;
        let gl = this._ctx._gl;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._glBuffer);
        IndexBuffer.BINDING = this;
    }

    unbind() {
        if (IndexBuffer.BINDING !== this)
            return;
        let gl = this._ctx._gl;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        IndexBuffer.BINDING = null;
    }

    dispose() {
        this.unbind();
        this._ctx._gl.deleteBuffer(this._glBuffer);
    }
}