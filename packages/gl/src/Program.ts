import { Context } from "./Context";

export class Program {

    protected static BINDING: Program | null;

    protected _ctx: Context;
    protected _glProgram: WebGLProgram;

    protected _vsSource: string;
    protected _fsSource: string;

    protected _uniformLocationMap: { [name: string]: WebGLUniformLocation } = {};
    protected _attributeLocationMap: { [name: string]: number } = {};

    constructor(ctx: Context, vsSource: string, fsSource: string) {

        this._ctx = ctx;
        this._vsSource = vsSource;
        this._fsSource = fsSource;
        this._glProgram = this._createGLProgram(vsSource, fsSource) as WebGLProgram;

        //  gets all uniforms location
        let gl: WebGLRenderingContext = this._ctx._gl;
        const numUniforms = gl.getProgramParameter(this._glProgram, gl.ACTIVE_UNIFORMS);

        let uniformInfo: WebGLActiveInfo;
        for (let i = 0; i < numUniforms; i++) {
            uniformInfo = gl.getActiveUniform(this._glProgram, i) as WebGLActiveInfo;
            if (!uniformInfo) {
                continue;
            }

            var name = uniformInfo.name;
            // remove the array suffix.
            if (name.substr(-3) === "[0]") {
                name = name.substr(0, name.length - 3);
            }

            this._uniformLocationMap[name] = gl.getUniformLocation(this._glProgram, uniformInfo.name) as WebGLUniformLocation;
            // uniformInfo.type  , uniformInfo.size
            if (__DEBUG__) {
                console.log('###Program uniforms: ###', uniformInfo.name, this._uniformLocationMap[name]);
            }
        }
        let numAttribs: number = gl.getProgramParameter(this._glProgram, gl.ACTIVE_ATTRIBUTES);
        let attribInfo: WebGLActiveInfo | null;
        for (let i = 0; i < numAttribs; i++) {
            attribInfo = gl.getActiveAttrib(this._glProgram, i);
            if (!attribInfo) {
                continue;
            }
            this._attributeLocationMap[attribInfo.name] = gl.getAttribLocation(this._glProgram, attribInfo.name);
            if (__DEBUG__) {
                console.log('###Program attributes: ###', attribInfo.name, this._attributeLocationMap[attribInfo.name]);
            }
        }

    }

    public getAttributeLocation(attribute: string) {
        if (__DEBUG__) {
            if (this._attributeLocationMap[attribute] === undefined)
                console.error('getAttributeLocation error:', attribute);
        }
        return this._attributeLocationMap[attribute];
    }

    public getUniformLocation(uniform: string) {
        if (__DEBUG__) {
            if (this._uniformLocationMap[uniform] === undefined)
                console.error('getUniformLocation error:', uniform);
        }
        return this._uniformLocationMap[uniform];
    }

    public uniformi(uniform: string, value: number) {
        this.bind();
        this._ctx._gl.uniform1i(this.getUniformLocation(uniform), value);
    }

    public uniform1f(uniform: string, value: number) {
        this.bind();
        this._ctx._gl.uniform1f(this.getUniformLocation(uniform), value);
    }

    /**
     * uniform float u_kernel[9] => uniform1fv('u_kernel',[1,1,1,1,1,1,1,1,1])
     * @param uniform 
     * @param value array
     */
    public uniform1fv(uniform: string, value: Float32List) {
        this.bind();
        this._ctx._gl.uniform1fv(this.getUniformLocation(uniform), value)
    }

    public uVec2(uniform: string, value: number, value2: number) {
        this.bind();
        this._ctx._gl.uniform2f(this.getUniformLocation(uniform), value, value2);
    }

    public uVec2v(name: string, value: Float32List) {
        this.bind();
        this._ctx._gl.uniform2fv(this.getUniformLocation(name), value);
    }
    
    /**
     * uniform vec3 name
     * @param name 
     * @param value 
     * @param value2 
     * @param value3 
     */
    public uVec3(name: string, value: number, value2: number, value3: number) {
        this.bind();
        this._ctx._gl.uniform3f(this.getUniformLocation(name), value, value2, value3);
    }

    public uVec3v(name: string, value: Float32List) {
        this.bind();
        this._ctx._gl.uniform3fv(this.getUniformLocation(name), value);
    }

    public uVec4(name: string, value: number, value2: number, value3: number, value4: number) {
        this.bind();
        this._ctx._gl.uniform4f(this.getUniformLocation(name), value, value2, value3, value4);
    }

    public uVec4v(name: string, value: Float32List) {
        this.bind();
        this._ctx._gl.uniform4fv(this.getUniformLocation(name), value);
    }

    public uMat2(name: string, array4: Float32Array) {
        this.bind();
        this._ctx._gl.uniformMatrix2fv(this.getUniformLocation(name), false, array4);
    }

    /**
     * upload 3x3 uniform
     * uniform mat3 mvp;
     * uniformMat3('mvp',new Float32Array([1,2,3,4,5,6,7,8,9]))
     * @param uniform 
     * @param array9 
     */
    public uMat3(uniform: string, array9: Float32Array) {
        this.bind();
        this._ctx._gl.uniformMatrix3fv(this.getUniformLocation(uniform), false, array9);
    }

    public uMat4(uniform: string, array16: Float32Array) {
        this.bind();
        this._ctx._gl.uniformMatrix4fv(this.getUniformLocation(uniform), false, array16);
    }

    /**
     * set texture unit n to the sampler
     * @param uniform 
     * @param n 
     *  uniform sampler2D u_Sampler
     *  ctx.uSampler('u_Sampler',0);
     */
    public uSampler2D(uniform: string, n: number) {
        this.bind();
        this._ctx._gl.uniform1i(this.getUniformLocation(uniform), n);
    }

    public bind(): Program {
        if (Program.BINDING === this) {
            return this;
        }
        this._ctx._gl.useProgram(this._glProgram);
        Program.BINDING = this;
        return this;
    }

    public unbind() {
        if (Program.BINDING !== this)
            return;
        this._ctx._gl.useProgram(null);
        Program.BINDING = null;
    }

    protected _createGLProgram(vsSource: string, fsSource: string): WebGLProgram {

        let gl: WebGLRenderingContext = this._ctx._gl;
        let vsShader: WebGLShader = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
        gl.shaderSource(vsShader, vsSource);
        gl.compileShader(vsShader);

        if (__DEBUG__) {
            if (!gl.getShaderParameter(vsShader, gl.COMPILE_STATUS)) {
                console.error(`vertex shader compiling error occurred: ${gl.getShaderInfoLog(vsShader)}`);
                gl.deleteShader(vsShader);
            }
        }

        let fsShader: WebGLShader = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
        gl.shaderSource(fsShader, fsSource);
        gl.compileShader(fsShader);

        if (__DEBUG__) {
            // 立刻查询是否有编译错误
            if (!gl.getShaderParameter(fsShader, gl.COMPILE_STATUS)) {
                console.error(`fragment shader compiling error occurred: ${gl.getShaderInfoLog(fsShader)}`);
                gl.deleteShader(fsShader);
            }
        }

        let pm: WebGLProgram = gl.createProgram() as WebGLProgram;
        gl.attachShader(pm, vsShader);
        gl.attachShader(pm, fsShader);
        gl.linkProgram(pm);

        if (__DEBUG__) {
            if (!gl.getProgramParameter(pm, gl.LINK_STATUS)) {
                console.error(`Error linking shader: ${gl.getProgramInfoLog(pm)}`);
                gl.deleteProgram(pm);
            }
        }
        // clean up shaders
        gl.deleteShader(vsShader);
        gl.deleteShader(fsShader);

        return pm;
    }

    dispose() {
        this.unbind();
        this._ctx._gl.deleteProgram(this._glProgram);
    }

}
