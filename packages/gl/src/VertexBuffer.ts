import { Context } from "./Context";

export type aaa = number;

export class VertexBuffer {

    // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants#Standard_WebGL_1_constants

    protected static _attributeTypeMap = {
        'FLOAT': 0x1406, // Float32Array
        'BYTE': 0x1400,
        'SHORT': 0x1402,
        'UNSIGNED_SHORT': 0x1403,// Uint16Array
        'INT': 0x1404,
        'UNSIGNED_INT': 0x1405// Uint32Array
    }

    protected static BINDING: VertexBuffer | null;

    protected _ctx: Context;
    protected _glBuffer: WebGLBuffer;
    // protected _glUsage: number | undefined; // gl.DYNAMIC_DRAW | gl.STATIC_DRAW
    // protected _data: Float32Array;
    protected _attributes: Attribute[] = [];
    protected _stride: number = 0 // 一个点的总 bytes 数

    constructor(ctx: Context) {

        this._ctx = ctx;
        let gl = this._ctx._gl;
        this._glBuffer = gl.createBuffer() as WebGLBuffer;
    }

    /**
     * @param data 
     * @param dynamic 默认为true
     */
    setData(data: ArrayBufferView, dynamic: boolean = true): void {
        this.bind();
        let gl = this._ctx._gl;
        gl.bufferData(gl.ARRAY_BUFFER, data, dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW)
    }

    /**
     * 
     * @location: 调用 shader.getAttributeLocation("a_position") 获得
     * @numElements: float vec2 vec3 vec4 分别对应1,2,3,4
     * @type: VertexBuffer.Float | VertexBuffer.BYTE | ...
     */
    addAttribute(location: number, numElements: 1 | 2 | 3 | 4,
        type: 'FLOAT' | 'BYTE' | 'SHORT' | 'UNSIGNED_SHORT' | 'INT' | 'UNSIGNED_INT' = 'FLOAT'): VertexBuffer {

        let item = new Attribute(location, numElements, VertexBuffer._attributeTypeMap[type]);
        item.byteOffset = this._stride;
        this._attributes.push(item);
        this._stride += numElements * 4; // 1个 float = 4 bytes
        return this;
    }

    clearAttributes(): void {
        let gl = this._ctx._gl;
        for (let i = 0; i < this._attributes.length; i++) {
            gl.disableVertexAttribArray(this._attributes[i].location);
        }
        this._attributes.length = this._stride = 0;
    }

    public bindAttributes(): void {
        this.bind()
        let gl = this._ctx._gl;
        let item: Attribute;
        for (let i = 0; i < this._attributes.length; i++) {
            item = this._attributes[i];
            gl.enableVertexAttribArray(item.location);
            gl.vertexAttribPointer(
                item.location,
                item.numElements,
                item.type, // gl.FLOAT
                false, // don't normalized the data
                this._stride,
                item.byteOffset
            )
        }
    }

    bind() {
        if (VertexBuffer.BINDING === this)
            return;
        let gl = this._ctx._gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this._glBuffer);
        VertexBuffer.BINDING = this;
    }

    unbind() {
        if (VertexBuffer.BINDING !== this)
            return;
        let gl = this._ctx._gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        VertexBuffer.BINDING = null;
    }

    dispose() {
        this.unbind();
        this._ctx._gl.deleteBuffer(this._glBuffer);
    }
}

class Attribute {

    byteOffset: number = 0; // 整个元素在开始的byte偏移
    // type = gl.FLOAT
    constructor(public location: number, public numElements: 1 | 2 | 3 | 4, public type: GLenum) { }
}