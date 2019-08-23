'use strict';

class Color {
  // 深灰 
  // 浅灰
  // 蓝绿

  /**
   *  颜色混合
   * @static
   * @param {Color} c1
   * @param {Color} c2
   * @param {number} ratio 0~1 之间的值
   * @returns {Color}
   */
  static Mix(c1, c2, ratio) {
    let oneMinusR = 1 - ratio;
    return new Color(c1.r * oneMinusR + c2.r * ratio, c1.g * oneMinusR + c2.g * ratio, c1.b * oneMinusR + c2.b * ratio, c1.a * oneMinusR + c2.a * ratio);
  }

  static fromHex(v) {
    let inv255 = 1 / 255;
    return new Color(((v & 0xff000000) >>> 24) * inv255, ((v & 0x00ff0000) >>> 16) * inv255, ((v & 0x0000ff00) >>> 8) * inv255, (v & 0x000000ff) * inv255);
  }

  static _hue2rgb(p, q, t) {
    if (t < 0) t += 1;else if (t > 1) t -= 1;
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


  static fromHSLA(h, s, l, alpha = 1) {
    if (s === 0) {
      return new Color(l, l, l);
    } else {
      let q = l <= 0.5 ? l * (1 + s) : l + s - l * s;
      let p = 2 * l - q;
      return new Color(Color._hue2rgb(p, q, h + 1 / 3), Color._hue2rgb(p, q, h), Color._hue2rgb(p, q, h - 1 / 3), alpha);
    }
  }

  toHSLA() {
    let r = this.r,
        g = this.g,
        b = this.b;
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let hue = 0,
        saturation = 0;
    let lightness = (min + max) / 2.0;

    if (min !== max) {
      let delta = max - min;
      saturation = lightness <= 0.5 ? delta / (max + min) : delta / (2 - max - min);

      switch (max) {
        case r:
          hue = (g - b) / delta + (g < b ? 6 : 0);
          break;

        case g:
          hue = (b - r) / delta + 2;
          break;

        case b:
          hue = (r - g) / delta + 4;
          break;
      }

      hue /= 6;
    }

    return {
      h: hue,
      s: saturation,
      l: lightness,
      a: this.a
    };
  }

  static random() {
    return Color.fromHex(Math.random() * 0xffffffff); // return new Color(Math.random(), Math.random(), Math.random(), Math.random());
  }
  /**
   * WebGl需要值范围在 0 ~ 1 之间
   * 
   * @type {number}
   */


  /**
   * Creates an instance of Color.
   * 
   * @param {number} [r=1] 0~1 之间
   * @param {number} [g=1] 0~1 之间
   * @param {number} [b=1] 0~1 之间
   * @param {number} [a=1] 0~1 之间
   */
  constructor(r = 1, g = 1, b = 1, a = 1) {
    this.r = void 0;
    this.g = void 0;
    this.b = void 0;
    this.a = void 0;
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  reset(r = 1, g = 1, b = 1, a = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    return this;
  }

  reset255(r = 255, g = 255, b = 255, a = 255) {
    this.a255 = a;
    this.r255 = r;
    this.g255 = g;
    this.b255 = b;
    return this;
  }

  get r255() {
    return Math.round(this.r * 255);
  }

  set r255(v) {
    if (isNaN(v)) return;
    this.r = v / 255;
  }

  get g255() {
    return Math.round(this.g * 255);
  }

  set g255(v) {
    if (isNaN(v)) return;
    this.g = v / 255;
  }

  get b255() {
    return Math.round(this.b * 255);
  }

  set b255(v) {
    if (isNaN(v)) return;
    this.b = v / 255;
  }

  get a255() {
    return Math.round(this.a * 255);
  }

  set a255(v) {
    if (isNaN(v)) return;
    this.a = v / 255;
  }
  /**
   *  设置 0xRRGGBBAA 格式
   */


  set hex(v) {
    this.r255 = (v & 0xff000000) >>> 24;
    this.g255 = (v & 0x00ff0000) >>> 16;
    this.b255 = (v & 0x0000ff00) >>> 8;
    this.a255 = v & 0x000000ff;
  }
  /**
   * 返回 16进制数字 RRGGBBAA 格式
   * 
   * @type {number}
   */


  get hex() {
    return this.r255 << 24 | this.g255 << 16 | this.b255 << 8 | this.a255;
  }

  toFloat32Array(target) {
    if (!target) {
      target = new Float32Array(4);
    }

    target[0] = this.r;
    target[1] = this.g;
    target[2] = this.b;
    target[3] = this.a;
    return target;
  }

  equal(c) {
    let e = 0.001;

    if (Math.abs(this.r - c.r) > e || Math.abs(this.g - c.g) > e || Math.abs(this.b - c.b) > e || Math.abs(this.a - c.a) > e) {
      return false;
    }

    return true;
  }

  copyFrom(c) {
    return this.reset(c.r, c.g, c.b, c.a);
  }

  clone() {
    return new Color(this.r, this.g, this.b, this.a);
  } // from rgb(1,1,1)


  fromString(rgb255) {
    let arr = /rgb\((\d+),\s(\d+),\s(\d+)/.exec(rgb255);
    if (arr) this.reset255(Number(arr[1]), Number(arr[2]), Number(arr[3]), 255);
  }
  /**
   * return rgb(r255,g255,b255)
   */


  toString() {
    return `rgba(${this.r255}, ${this.g255}, ${this.b255}, ${this.a255})`;
  }

  toGray() {
    let gray = (this.r + this.g + this.b) / 3;
    this.r = this.g = this.b = gray;
    return this;
  }

}
Color.TRANSPARENT = new Color(0.0, 0.0, 0.0, 0.0);
Color.WHITE = new Color(1.0, 1.0, 1.0, 1.0);
Color.BLACK = new Color(0.0, 0.0, 0.0, 1.0);
Color.GRAY = new Color(0.5, 0.5, 0.5, 1.0);
Color.DARK_GRAY = new Color(0.3, 0.3, 0.3, 1.0);
Color.LIGHT_GRAY = new Color(0.7, 0.7, 0.7, 1.0);
Color.RED = new Color(1.0, 0, 0, 1.0);
Color.GREEN = new Color(0, 1.0, 0, 1.0);
Color.BLUE = new Color(0, 0, 1.0, 1.0);
Color.YELLOW = new Color(1.0, 1.0, 0, 1.0);
Color.CYAN = new Color(0, 1.0, 1.0, 1.0);

class Context {
  // 
  constructor(ctx) {
    this.POINTS = WebGLRenderingContext.POINTS;
    this.LINES = WebGLRenderingContext.LINES;
    this.LINE_STRIP = WebGLRenderingContext.LINE_STRIP;
    this.LINE_LOOP = WebGLRenderingContext.LINE_LOOP;
    this.TRIANGLES = WebGLRenderingContext.TRIANGLES;
    this.TRIANGLE_FAN = WebGLRenderingContext.TRIANGLE_FAN;
    this.TRIANGLE_STRIP = WebGLRenderingContext.TRIANGLE_STRIP;
    this._drawCall = 0;
    this._gl = void 0;
    this._gl = ctx;
    this.clearColor = Color.GRAY;
  }

  get drawCall() {
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
  }

  disableDepthTest() {
    let gl = this._gl;
    gl.disable(gl.DEPTH_TEST);
  }

  set depthTest(b) {
    let gl = this._gl;
    if (b) gl.enable(gl.DEPTH_TEST);else gl.disable(gl.DEPTH_TEST);
  }

  set cullFace(face) {
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
  } // set color


  set clearColor(c) {
    this._gl.clearColor(c.r, c.g, c.b, c.a);
  }

  clear(depth = false, stencil = false) {
    let gl = this._gl;
    let mask = gl.COLOR_BUFFER_BIT;
    if (depth) mask |= gl.DEPTH_BUFFER_BIT;
    if (stencil) mask |= gl.STENCIL_BUFFER_BIT;

    this._gl.clear(mask);

    this._drawCall = 0;
  }

  clearColorBuffer() {
    this._gl.clear(this._gl.COLOR_BUFFER_BIT);

    this._drawCall = 0;
  } // turn off the color channel


  colorMask(r, g, b, a) {
    this._gl.colorMask(r, g, b, a);
  }

  flipY(boole = true) {
    this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL, boole ? 1 : 0);
  } // 没有indexbuffer时调用
  // @primitiveType: gl.POINTS, gl.LINES, gl.LINE_STRIP, gl.LINE_LOOP, gl.TRIANGLES, gl.TRIANGLE_STRIP, gl. TRIANGLE_FAN.


  drawArrays(primitiveType, count, offset = 0) {
    this._gl.drawArrays(primitiveType, offset, count);

    this._drawCall++;
  }

  drawArraysTriangles(count, offset = 0) {
    let gl = this._gl;
    gl.drawArrays(gl.TRIANGLES, offset, count);
    this._drawCall++;
  } // drawArraysPoints(offset: number, count: number) {
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


  drawElements(primitiveType, count, offset = 0) {
    let gl = this._gl;
    gl.drawElements(primitiveType, count, gl.UNSIGNED_SHORT, offset);
    this._drawCall++;
  }

  drawElementsTriangle(count, offset = 0) {
    let gl = this._gl;
    gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, offset);
    this._drawCall++;
  } //-------------------------------


  viewport(x, y, width, height) {
    this._gl.viewport(x, y, width, height);
  } // 根据css大小设置 drawingbuffer 实际大小 微信环境不支持！！！


  adjustSize() {
    let canvas = this._gl.canvas; // Lookup the size the browser is displaying the canvas.

    let displayWidth = canvas.clientWidth;
    let displayHeight = canvas.clientHeight; // Check if the canvas is not the same size.

    if (canvas.width != displayWidth || canvas.height != displayHeight) {


      canvas.width = displayWidth;
      canvas.height = displayHeight;

      this._gl.viewport(0, 0, displayWidth, displayHeight);
    }
  }

  adjustHDSize(realToCSSPixels = window.devicePixelRatio) {
    let canvas = this._gl.canvas; // Lookup the size the browser is displaying the canvas in CSS pixels
    // and compute a size needed to make our drawingbuffer match it in
    // device pixels.

    var displayWidth = Math.floor(canvas.clientWidth * realToCSSPixels);
    var displayHeight = Math.floor(canvas.clientHeight * realToCSSPixels); // Check if the canvas is not the same size.

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      // Make the canvas the same size
      canvas.width = displayWidth;
      canvas.height = displayHeight;

      this._gl.viewport(0, 0, displayWidth, displayHeight);
    }
  } // registMouseDown(fun: (x: number, y: number) => any) {
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

class Program {
  constructor(ctx, vsSource, fsSource) {
    this._ctx = void 0;
    this._glProgram = void 0;
    this._vsSource = void 0;
    this._fsSource = void 0;
    this._uniformLocationMap = {};
    this._attributeLocationMap = {};
    this._ctx = ctx;
    this._vsSource = vsSource;
    this._fsSource = fsSource;
    this._glProgram = this._createGLProgram(vsSource, fsSource); //  gets all uniforms location

    let gl = this._ctx._gl;
    const numUniforms = gl.getProgramParameter(this._glProgram, gl.ACTIVE_UNIFORMS);
    let uniformInfo;

    for (let i = 0; i < numUniforms; i++) {
      uniformInfo = gl.getActiveUniform(this._glProgram, i);

      if (!uniformInfo) {
        continue;
      }

      var name = uniformInfo.name; // remove the array suffix.

      if (name.substr(-3) === "[0]") {
        name = name.substr(0, name.length - 3);
      }

      this._uniformLocationMap[name] = gl.getUniformLocation(this._glProgram, uniformInfo.name); // uniformInfo.type  , uniformInfo.size
    }

    let numAttribs = gl.getProgramParameter(this._glProgram, gl.ACTIVE_ATTRIBUTES);
    let attribInfo;

    for (let i = 0; i < numAttribs; i++) {
      attribInfo = gl.getActiveAttrib(this._glProgram, i);

      if (!attribInfo) {
        continue;
      }

      this._attributeLocationMap[attribInfo.name] = gl.getAttribLocation(this._glProgram, attribInfo.name);
    }
  }

  getAttributeLocation(attribute) {

    return this._attributeLocationMap[attribute];
  }

  getUniformLocation(uniform) {

    return this._uniformLocationMap[uniform];
  }

  uniformi(uniform, value) {
    this.bind();

    this._ctx._gl.uniform1i(this.getUniformLocation(uniform), value);
  }

  uniform1f(uniform, value) {
    this.bind();

    this._ctx._gl.uniform1f(this.getUniformLocation(uniform), value);
  }
  /**
   * uniform float u_kernel[9] => uniform1fv('u_kernel',[1,1,1,1,1,1,1,1,1])
   * @param uniform 
   * @param value array
   */


  uniform1fv(uniform, value) {
    this.bind();

    this._ctx._gl.uniform1fv(this.getUniformLocation(uniform), value);
  }

  uVec2(uniform, value, value2) {
    this.bind();

    this._ctx._gl.uniform2f(this.getUniformLocation(uniform), value, value2);
  }

  uVec2v(name, value) {
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


  uVec3(name, value, value2, value3) {
    this.bind();

    this._ctx._gl.uniform3f(this.getUniformLocation(name), value, value2, value3);
  }

  uVec3v(name, value) {
    this.bind();

    this._ctx._gl.uniform3fv(this.getUniformLocation(name), value);
  }

  uVec4(name, value, value2, value3, value4) {
    this.bind();

    this._ctx._gl.uniform4f(this.getUniformLocation(name), value, value2, value3, value4);
  }

  uVec4v(name, value) {
    this.bind();

    this._ctx._gl.uniform4fv(this.getUniformLocation(name), value);
  }

  uMat2(name, array4) {
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


  uMat3(uniform, array9) {
    this.bind();

    this._ctx._gl.uniformMatrix3fv(this.getUniformLocation(uniform), false, array9);
  }

  uMat4(uniform, array16) {
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


  uSampler2D(uniform, n) {
    this.bind();

    this._ctx._gl.uniform1i(this.getUniformLocation(uniform), n);
  }

  bind() {
    if (Program.BINDING === this) {
      return this;
    }

    this._ctx._gl.useProgram(this._glProgram);

    Program.BINDING = this;
    return this;
  }

  unbind() {
    if (Program.BINDING !== this) return;

    this._ctx._gl.useProgram(null);

    Program.BINDING = null;
  }

  _createGLProgram(vsSource, fsSource) {
    let gl = this._ctx._gl;
    let vsShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vsShader, vsSource);
    gl.compileShader(vsShader);

    let fsShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fsShader, fsSource);
    gl.compileShader(fsShader);

    let pm = gl.createProgram();
    gl.attachShader(pm, vsShader);
    gl.attachShader(pm, fsShader);
    gl.linkProgram(pm);


    gl.deleteShader(vsShader);
    gl.deleteShader(fsShader);
    return pm;
  }

  dispose() {
    this.unbind();

    this._ctx._gl.deleteProgram(this._glProgram);
  }

}
Program.BINDING = void 0;

class VertexBuffer {
  // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants#Standard_WebGL_1_constants
  // protected _glUsage: number | undefined; // gl.DYNAMIC_DRAW | gl.STATIC_DRAW
  // protected _data: Float32Array;
  // 一个点的总 bytes 数
  constructor(ctx) {
    this._ctx = void 0;
    this._glBuffer = void 0;
    this._attributes = [];
    this._stride = 0;
    this._ctx = ctx;
    let gl = this._ctx._gl;
    this._glBuffer = gl.createBuffer();
  }
  /**
   * @param data 
   * @param dynamic 默认为true
   */


  setData(data, dynamic = true) {
    this.bind();
    let gl = this._ctx._gl;
    gl.bufferData(gl.ARRAY_BUFFER, data, dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);
  }
  /**
   * 
   * @location: 调用 shader.getAttributeLocation("a_position") 获得
   * @numElements: float vec2 vec3 vec4 分别对应1,2,3,4
   * @type: VertexBuffer.Float | VertexBuffer.BYTE | ...
   */


  addAttribute(location, numElements, type = 'FLOAT') {
    let item = new Attribute(location, numElements, VertexBuffer._attributeTypeMap[type]);
    item.byteOffset = this._stride;

    this._attributes.push(item);

    this._stride += numElements * 4; // 1个 float = 4 bytes

    return this;
  }

  clearAttributes() {
    let gl = this._ctx._gl;

    for (let i = 0; i < this._attributes.length; i++) {
      gl.disableVertexAttribArray(this._attributes[i].location);
    }

    this._attributes.length = this._stride = 0;
  }

  bindAttributes() {
    this.bind();
    let gl = this._ctx._gl;
    let item;

    for (let i = 0; i < this._attributes.length; i++) {
      item = this._attributes[i];
      gl.enableVertexAttribArray(item.location);
      gl.vertexAttribPointer(item.location, item.numElements, item.type, // gl.FLOAT
      false, // don't normalized the data
      this._stride, item.byteOffset);
    }
  }

  bind() {
    if (VertexBuffer.BINDING === this) return;
    let gl = this._ctx._gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this._glBuffer);
    VertexBuffer.BINDING = this;
  }

  unbind() {
    if (VertexBuffer.BINDING !== this) return;
    let gl = this._ctx._gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    VertexBuffer.BINDING = null;
  }

  dispose() {
    this.unbind();

    this._ctx._gl.deleteBuffer(this._glBuffer);
  }

}
VertexBuffer._attributeTypeMap = {
  'FLOAT': 0x1406,
  'BYTE': 0x1400,
  'SHORT': 0x1402,
  'UNSIGNED_SHORT': 0x1403,
  'INT': 0x1404,
  'UNSIGNED_INT': 0x1405
};
VertexBuffer.BINDING = void 0;

class Attribute {
  // 整个元素在开始的byte偏移
  // type = gl.FLOAT
  constructor(location, numElements, type) {
    this.location = location;
    this.numElements = numElements;
    this.type = type;
    this.byteOffset = 0;
  }

}

class IndexBuffer {
  // protected _glUsage: number; // gl.DYNAMIC_DRAW | gl.STATIC_DRAW
  get length() {
    return this._length;
  }

  constructor(ctx) {
    this._ctx = void 0;
    this._glBuffer = void 0;
    this._length = 0;
    this._ctx = ctx;
    let gl = this._ctx._gl;
    this._glBuffer = gl.createBuffer();
  } // Since the indices support in WebGL1.0 is restricted to 16 bit integers, an index array can only be 65,535 elements in length. 


  setData(data, dynamic = false) {
    this.bind();
    let gl = this._ctx._gl;
    this._length = data.length;
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);
  }

  bind() {
    if (IndexBuffer.BINDING === this) return;
    let gl = this._ctx._gl;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._glBuffer);
    IndexBuffer.BINDING = this;
  }

  unbind() {
    if (IndexBuffer.BINDING !== this) return;
    let gl = this._ctx._gl;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    IndexBuffer.BINDING = null;
  }

  dispose() {
    this.unbind();

    this._ctx._gl.deleteBuffer(this._glBuffer);
  }

}
IndexBuffer.BINDING = void 0;

// TODO: gl.TEXTURE_CUBE_MAP

/**
 * dat-gui JavaScript Controller Library
 * http://code.google.com/p/dat-gui
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

function ___$insertStyle(css) {
  if (!css) {
    return;
  }
  if (typeof window === 'undefined') {
    return;
  }

  var style = document.createElement('style');

  style.setAttribute('type', 'text/css');
  style.innerHTML = css;
  document.head.appendChild(style);

  return css;
}

function colorToString (color, forceCSSHex) {
  var colorFormat = color.__state.conversionName.toString();
  var r = Math.round(color.r);
  var g = Math.round(color.g);
  var b = Math.round(color.b);
  var a = color.a;
  var h = Math.round(color.h);
  var s = color.s.toFixed(1);
  var v = color.v.toFixed(1);
  if (forceCSSHex || colorFormat === 'THREE_CHAR_HEX' || colorFormat === 'SIX_CHAR_HEX') {
    var str = color.hex.toString(16);
    while (str.length < 6) {
      str = '0' + str;
    }
    return '#' + str;
  } else if (colorFormat === 'CSS_RGB') {
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  } else if (colorFormat === 'CSS_RGBA') {
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  } else if (colorFormat === 'HEX') {
    return '0x' + color.hex.toString(16);
  } else if (colorFormat === 'RGB_ARRAY') {
    return '[' + r + ',' + g + ',' + b + ']';
  } else if (colorFormat === 'RGBA_ARRAY') {
    return '[' + r + ',' + g + ',' + b + ',' + a + ']';
  } else if (colorFormat === 'RGB_OBJ') {
    return '{r:' + r + ',g:' + g + ',b:' + b + '}';
  } else if (colorFormat === 'RGBA_OBJ') {
    return '{r:' + r + ',g:' + g + ',b:' + b + ',a:' + a + '}';
  } else if (colorFormat === 'HSV_OBJ') {
    return '{h:' + h + ',s:' + s + ',v:' + v + '}';
  } else if (colorFormat === 'HSVA_OBJ') {
    return '{h:' + h + ',s:' + s + ',v:' + v + ',a:' + a + '}';
  }
  return 'unknown format';
}

var ARR_EACH = Array.prototype.forEach;
var ARR_SLICE = Array.prototype.slice;
var Common = {
  BREAK: {},
  extend: function extend(target) {
    this.each(ARR_SLICE.call(arguments, 1), function (obj) {
      var keys = this.isObject(obj) ? Object.keys(obj) : [];
      keys.forEach(function (key) {
        if (!this.isUndefined(obj[key])) {
          target[key] = obj[key];
        }
      }.bind(this));
    }, this);
    return target;
  },
  defaults: function defaults(target) {
    this.each(ARR_SLICE.call(arguments, 1), function (obj) {
      var keys = this.isObject(obj) ? Object.keys(obj) : [];
      keys.forEach(function (key) {
        if (this.isUndefined(target[key])) {
          target[key] = obj[key];
        }
      }.bind(this));
    }, this);
    return target;
  },
  compose: function compose() {
    var toCall = ARR_SLICE.call(arguments);
    return function () {
      var args = ARR_SLICE.call(arguments);
      for (var i = toCall.length - 1; i >= 0; i--) {
        args = [toCall[i].apply(this, args)];
      }
      return args[0];
    };
  },
  each: function each(obj, itr, scope) {
    if (!obj) {
      return;
    }
    if (ARR_EACH && obj.forEach && obj.forEach === ARR_EACH) {
      obj.forEach(itr, scope);
    } else if (obj.length === obj.length + 0) {
      var key = void 0;
      var l = void 0;
      for (key = 0, l = obj.length; key < l; key++) {
        if (key in obj && itr.call(scope, obj[key], key) === this.BREAK) {
          return;
        }
      }
    } else {
      for (var _key in obj) {
        if (itr.call(scope, obj[_key], _key) === this.BREAK) {
          return;
        }
      }
    }
  },
  defer: function defer(fnc) {
    setTimeout(fnc, 0);
  },
  debounce: function debounce(func, threshold, callImmediately) {
    var timeout = void 0;
    return function () {
      var obj = this;
      var args = arguments;
      function delayed() {
        timeout = null;
        if (!callImmediately) func.apply(obj, args);
      }
      var callNow = callImmediately || !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(delayed, threshold);
      if (callNow) {
        func.apply(obj, args);
      }
    };
  },
  toArray: function toArray(obj) {
    if (obj.toArray) return obj.toArray();
    return ARR_SLICE.call(obj);
  },
  isUndefined: function isUndefined(obj) {
    return obj === undefined;
  },
  isNull: function isNull(obj) {
    return obj === null;
  },
  isNaN: function (_isNaN) {
    function isNaN(_x) {
      return _isNaN.apply(this, arguments);
    }
    isNaN.toString = function () {
      return _isNaN.toString();
    };
    return isNaN;
  }(function (obj) {
    return isNaN(obj);
  }),
  isArray: Array.isArray || function (obj) {
    return obj.constructor === Array;
  },
  isObject: function isObject(obj) {
    return obj === Object(obj);
  },
  isNumber: function isNumber(obj) {
    return obj === obj + 0;
  },
  isString: function isString(obj) {
    return obj === obj + '';
  },
  isBoolean: function isBoolean(obj) {
    return obj === false || obj === true;
  },
  isFunction: function isFunction(obj) {
    return Object.prototype.toString.call(obj) === '[object Function]';
  }
};

var INTERPRETATIONS = [
{
  litmus: Common.isString,
  conversions: {
    THREE_CHAR_HEX: {
      read: function read(original) {
        var test = original.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
        if (test === null) {
          return false;
        }
        return {
          space: 'HEX',
          hex: parseInt('0x' + test[1].toString() + test[1].toString() + test[2].toString() + test[2].toString() + test[3].toString() + test[3].toString(), 0)
        };
      },
      write: colorToString
    },
    SIX_CHAR_HEX: {
      read: function read(original) {
        var test = original.match(/^#([A-F0-9]{6})$/i);
        if (test === null) {
          return false;
        }
        return {
          space: 'HEX',
          hex: parseInt('0x' + test[1].toString(), 0)
        };
      },
      write: colorToString
    },
    CSS_RGB: {
      read: function read(original) {
        var test = original.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
        if (test === null) {
          return false;
        }
        return {
          space: 'RGB',
          r: parseFloat(test[1]),
          g: parseFloat(test[2]),
          b: parseFloat(test[3])
        };
      },
      write: colorToString
    },
    CSS_RGBA: {
      read: function read(original) {
        var test = original.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
        if (test === null) {
          return false;
        }
        return {
          space: 'RGB',
          r: parseFloat(test[1]),
          g: parseFloat(test[2]),
          b: parseFloat(test[3]),
          a: parseFloat(test[4])
        };
      },
      write: colorToString
    }
  }
},
{
  litmus: Common.isNumber,
  conversions: {
    HEX: {
      read: function read(original) {
        return {
          space: 'HEX',
          hex: original,
          conversionName: 'HEX'
        };
      },
      write: function write(color) {
        return color.hex;
      }
    }
  }
},
{
  litmus: Common.isArray,
  conversions: {
    RGB_ARRAY: {
      read: function read(original) {
        if (original.length !== 3) {
          return false;
        }
        return {
          space: 'RGB',
          r: original[0],
          g: original[1],
          b: original[2]
        };
      },
      write: function write(color) {
        return [color.r, color.g, color.b];
      }
    },
    RGBA_ARRAY: {
      read: function read(original) {
        if (original.length !== 4) return false;
        return {
          space: 'RGB',
          r: original[0],
          g: original[1],
          b: original[2],
          a: original[3]
        };
      },
      write: function write(color) {
        return [color.r, color.g, color.b, color.a];
      }
    }
  }
},
{
  litmus: Common.isObject,
  conversions: {
    RGBA_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.r) && Common.isNumber(original.g) && Common.isNumber(original.b) && Common.isNumber(original.a)) {
          return {
            space: 'RGB',
            r: original.r,
            g: original.g,
            b: original.b,
            a: original.a
          };
        }
        return false;
      },
      write: function write(color) {
        return {
          r: color.r,
          g: color.g,
          b: color.b,
          a: color.a
        };
      }
    },
    RGB_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.r) && Common.isNumber(original.g) && Common.isNumber(original.b)) {
          return {
            space: 'RGB',
            r: original.r,
            g: original.g,
            b: original.b
          };
        }
        return false;
      },
      write: function write(color) {
        return {
          r: color.r,
          g: color.g,
          b: color.b
        };
      }
    },
    HSVA_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.h) && Common.isNumber(original.s) && Common.isNumber(original.v) && Common.isNumber(original.a)) {
          return {
            space: 'HSV',
            h: original.h,
            s: original.s,
            v: original.v,
            a: original.a
          };
        }
        return false;
      },
      write: function write(color) {
        return {
          h: color.h,
          s: color.s,
          v: color.v,
          a: color.a
        };
      }
    },
    HSV_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.h) && Common.isNumber(original.s) && Common.isNumber(original.v)) {
          return {
            space: 'HSV',
            h: original.h,
            s: original.s,
            v: original.v
          };
        }
        return false;
      },
      write: function write(color) {
        return {
          h: color.h,
          s: color.s,
          v: color.v
        };
      }
    }
  }
}];
var result = void 0;
var toReturn = void 0;
var interpret = function interpret() {
  toReturn = false;
  var original = arguments.length > 1 ? Common.toArray(arguments) : arguments[0];
  Common.each(INTERPRETATIONS, function (family) {
    if (family.litmus(original)) {
      Common.each(family.conversions, function (conversion, conversionName) {
        result = conversion.read(original);
        if (toReturn === false && result !== false) {
          toReturn = result;
          result.conversionName = conversionName;
          result.conversion = conversion;
          return Common.BREAK;
        }
      });
      return Common.BREAK;
    }
  });
  return toReturn;
};

var tmpComponent = void 0;
var ColorMath = {
  hsv_to_rgb: function hsv_to_rgb(h, s, v) {
    var hi = Math.floor(h / 60) % 6;
    var f = h / 60 - Math.floor(h / 60);
    var p = v * (1.0 - s);
    var q = v * (1.0 - f * s);
    var t = v * (1.0 - (1.0 - f) * s);
    var c = [[v, t, p], [q, v, p], [p, v, t], [p, q, v], [t, p, v], [v, p, q]][hi];
    return {
      r: c[0] * 255,
      g: c[1] * 255,
      b: c[2] * 255
    };
  },
  rgb_to_hsv: function rgb_to_hsv(r, g, b) {
    var min = Math.min(r, g, b);
    var max = Math.max(r, g, b);
    var delta = max - min;
    var h = void 0;
    var s = void 0;
    if (max !== 0) {
      s = delta / max;
    } else {
      return {
        h: NaN,
        s: 0,
        v: 0
      };
    }
    if (r === max) {
      h = (g - b) / delta;
    } else if (g === max) {
      h = 2 + (b - r) / delta;
    } else {
      h = 4 + (r - g) / delta;
    }
    h /= 6;
    if (h < 0) {
      h += 1;
    }
    return {
      h: h * 360,
      s: s,
      v: max / 255
    };
  },
  rgb_to_hex: function rgb_to_hex(r, g, b) {
    var hex = this.hex_with_component(0, 2, r);
    hex = this.hex_with_component(hex, 1, g);
    hex = this.hex_with_component(hex, 0, b);
    return hex;
  },
  component_from_hex: function component_from_hex(hex, componentIndex) {
    return hex >> componentIndex * 8 & 0xFF;
  },
  hex_with_component: function hex_with_component(hex, componentIndex, value) {
    return value << (tmpComponent = componentIndex * 8) | hex & ~(0xFF << tmpComponent);
  }
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var Color$1 = function () {
  function Color() {
    classCallCheck(this, Color);
    this.__state = interpret.apply(this, arguments);
    if (this.__state === false) {
      throw new Error('Failed to interpret color arguments');
    }
    this.__state.a = this.__state.a || 1;
  }
  createClass(Color, [{
    key: 'toString',
    value: function toString() {
      return colorToString(this);
    }
  }, {
    key: 'toHexString',
    value: function toHexString() {
      return colorToString(this, true);
    }
  }, {
    key: 'toOriginal',
    value: function toOriginal() {
      return this.__state.conversion.write(this);
    }
  }]);
  return Color;
}();
function defineRGBComponent(target, component, componentHexIndex) {
  Object.defineProperty(target, component, {
    get: function get$$1() {
      if (this.__state.space === 'RGB') {
        return this.__state[component];
      }
      Color$1.recalculateRGB(this, component, componentHexIndex);
      return this.__state[component];
    },
    set: function set$$1(v) {
      if (this.__state.space !== 'RGB') {
        Color$1.recalculateRGB(this, component, componentHexIndex);
        this.__state.space = 'RGB';
      }
      this.__state[component] = v;
    }
  });
}
function defineHSVComponent(target, component) {
  Object.defineProperty(target, component, {
    get: function get$$1() {
      if (this.__state.space === 'HSV') {
        return this.__state[component];
      }
      Color$1.recalculateHSV(this);
      return this.__state[component];
    },
    set: function set$$1(v) {
      if (this.__state.space !== 'HSV') {
        Color$1.recalculateHSV(this);
        this.__state.space = 'HSV';
      }
      this.__state[component] = v;
    }
  });
}
Color$1.recalculateRGB = function (color, component, componentHexIndex) {
  if (color.__state.space === 'HEX') {
    color.__state[component] = ColorMath.component_from_hex(color.__state.hex, componentHexIndex);
  } else if (color.__state.space === 'HSV') {
    Common.extend(color.__state, ColorMath.hsv_to_rgb(color.__state.h, color.__state.s, color.__state.v));
  } else {
    throw new Error('Corrupted color state');
  }
};
Color$1.recalculateHSV = function (color) {
  var result = ColorMath.rgb_to_hsv(color.r, color.g, color.b);
  Common.extend(color.__state, {
    s: result.s,
    v: result.v
  });
  if (!Common.isNaN(result.h)) {
    color.__state.h = result.h;
  } else if (Common.isUndefined(color.__state.h)) {
    color.__state.h = 0;
  }
};
Color$1.COMPONENTS = ['r', 'g', 'b', 'h', 's', 'v', 'hex', 'a'];
defineRGBComponent(Color$1.prototype, 'r', 2);
defineRGBComponent(Color$1.prototype, 'g', 1);
defineRGBComponent(Color$1.prototype, 'b', 0);
defineHSVComponent(Color$1.prototype, 'h');
defineHSVComponent(Color$1.prototype, 's');
defineHSVComponent(Color$1.prototype, 'v');
Object.defineProperty(Color$1.prototype, 'a', {
  get: function get$$1() {
    return this.__state.a;
  },
  set: function set$$1(v) {
    this.__state.a = v;
  }
});
Object.defineProperty(Color$1.prototype, 'hex', {
  get: function get$$1() {
    if (!this.__state.space !== 'HEX') {
      this.__state.hex = ColorMath.rgb_to_hex(this.r, this.g, this.b);
    }
    return this.__state.hex;
  },
  set: function set$$1(v) {
    this.__state.space = 'HEX';
    this.__state.hex = v;
  }
});

var Controller = function () {
  function Controller(object, property) {
    classCallCheck(this, Controller);
    this.initialValue = object[property];
    this.domElement = document.createElement('div');
    this.object = object;
    this.property = property;
    this.__onChange = undefined;
    this.__onFinishChange = undefined;
  }
  createClass(Controller, [{
    key: 'onChange',
    value: function onChange(fnc) {
      this.__onChange = fnc;
      return this;
    }
  }, {
    key: 'onFinishChange',
    value: function onFinishChange(fnc) {
      this.__onFinishChange = fnc;
      return this;
    }
  }, {
    key: 'setValue',
    value: function setValue(newValue) {
      this.object[this.property] = newValue;
      if (this.__onChange) {
        this.__onChange.call(this, newValue);
      }
      this.updateDisplay();
      return this;
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      return this.object[this.property];
    }
  }, {
    key: 'updateDisplay',
    value: function updateDisplay() {
      return this;
    }
  }, {
    key: 'isModified',
    value: function isModified() {
      return this.initialValue !== this.getValue();
    }
  }]);
  return Controller;
}();

var EVENT_MAP = {
  HTMLEvents: ['change'],
  MouseEvents: ['click', 'mousemove', 'mousedown', 'mouseup', 'mouseover'],
  KeyboardEvents: ['keydown']
};
var EVENT_MAP_INV = {};
Common.each(EVENT_MAP, function (v, k) {
  Common.each(v, function (e) {
    EVENT_MAP_INV[e] = k;
  });
});
var CSS_VALUE_PIXELS = /(\d+(\.\d+)?)px/;
function cssValueToPixels(val) {
  if (val === '0' || Common.isUndefined(val)) {
    return 0;
  }
  var match = val.match(CSS_VALUE_PIXELS);
  if (!Common.isNull(match)) {
    return parseFloat(match[1]);
  }
  return 0;
}
var dom = {
  makeSelectable: function makeSelectable(elem, selectable) {
    if (elem === undefined || elem.style === undefined) return;
    elem.onselectstart = selectable ? function () {
      return false;
    } : function () {};
    elem.style.MozUserSelect = selectable ? 'auto' : 'none';
    elem.style.KhtmlUserSelect = selectable ? 'auto' : 'none';
    elem.unselectable = selectable ? 'on' : 'off';
  },
  makeFullscreen: function makeFullscreen(elem, hor, vert) {
    var vertical = vert;
    var horizontal = hor;
    if (Common.isUndefined(horizontal)) {
      horizontal = true;
    }
    if (Common.isUndefined(vertical)) {
      vertical = true;
    }
    elem.style.position = 'absolute';
    if (horizontal) {
      elem.style.left = 0;
      elem.style.right = 0;
    }
    if (vertical) {
      elem.style.top = 0;
      elem.style.bottom = 0;
    }
  },
  fakeEvent: function fakeEvent(elem, eventType, pars, aux) {
    var params = pars || {};
    var className = EVENT_MAP_INV[eventType];
    if (!className) {
      throw new Error('Event type ' + eventType + ' not supported.');
    }
    var evt = document.createEvent(className);
    switch (className) {
      case 'MouseEvents':
        {
          var clientX = params.x || params.clientX || 0;
          var clientY = params.y || params.clientY || 0;
          evt.initMouseEvent(eventType, params.bubbles || false, params.cancelable || true, window, params.clickCount || 1, 0,
          0,
          clientX,
          clientY,
          false, false, false, false, 0, null);
          break;
        }
      case 'KeyboardEvents':
        {
          var init = evt.initKeyboardEvent || evt.initKeyEvent;
          Common.defaults(params, {
            cancelable: true,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            keyCode: undefined,
            charCode: undefined
          });
          init(eventType, params.bubbles || false, params.cancelable, window, params.ctrlKey, params.altKey, params.shiftKey, params.metaKey, params.keyCode, params.charCode);
          break;
        }
      default:
        {
          evt.initEvent(eventType, params.bubbles || false, params.cancelable || true);
          break;
        }
    }
    Common.defaults(evt, aux);
    elem.dispatchEvent(evt);
  },
  bind: function bind(elem, event, func, newBool) {
    var bool = newBool || false;
    if (elem.addEventListener) {
      elem.addEventListener(event, func, bool);
    } else if (elem.attachEvent) {
      elem.attachEvent('on' + event, func);
    }
    return dom;
  },
  unbind: function unbind(elem, event, func, newBool) {
    var bool = newBool || false;
    if (elem.removeEventListener) {
      elem.removeEventListener(event, func, bool);
    } else if (elem.detachEvent) {
      elem.detachEvent('on' + event, func);
    }
    return dom;
  },
  addClass: function addClass(elem, className) {
    if (elem.className === undefined) {
      elem.className = className;
    } else if (elem.className !== className) {
      var classes = elem.className.split(/ +/);
      if (classes.indexOf(className) === -1) {
        classes.push(className);
        elem.className = classes.join(' ').replace(/^\s+/, '').replace(/\s+$/, '');
      }
    }
    return dom;
  },
  removeClass: function removeClass(elem, className) {
    if (className) {
      if (elem.className === className) {
        elem.removeAttribute('class');
      } else {
        var classes = elem.className.split(/ +/);
        var index = classes.indexOf(className);
        if (index !== -1) {
          classes.splice(index, 1);
          elem.className = classes.join(' ');
        }
      }
    } else {
      elem.className = undefined;
    }
    return dom;
  },
  hasClass: function hasClass(elem, className) {
    return new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)').test(elem.className) || false;
  },
  getWidth: function getWidth(elem) {
    var style = getComputedStyle(elem);
    return cssValueToPixels(style['border-left-width']) + cssValueToPixels(style['border-right-width']) + cssValueToPixels(style['padding-left']) + cssValueToPixels(style['padding-right']) + cssValueToPixels(style.width);
  },
  getHeight: function getHeight(elem) {
    var style = getComputedStyle(elem);
    return cssValueToPixels(style['border-top-width']) + cssValueToPixels(style['border-bottom-width']) + cssValueToPixels(style['padding-top']) + cssValueToPixels(style['padding-bottom']) + cssValueToPixels(style.height);
  },
  getOffset: function getOffset(el) {
    var elem = el;
    var offset = { left: 0, top: 0 };
    if (elem.offsetParent) {
      do {
        offset.left += elem.offsetLeft;
        offset.top += elem.offsetTop;
        elem = elem.offsetParent;
      } while (elem);
    }
    return offset;
  },
  isActive: function isActive(elem) {
    return elem === document.activeElement && (elem.type || elem.href);
  }
};

var BooleanController = function (_Controller) {
  inherits(BooleanController, _Controller);
  function BooleanController(object, property) {
    classCallCheck(this, BooleanController);
    var _this2 = possibleConstructorReturn(this, (BooleanController.__proto__ || Object.getPrototypeOf(BooleanController)).call(this, object, property));
    var _this = _this2;
    _this2.__prev = _this2.getValue();
    _this2.__checkbox = document.createElement('input');
    _this2.__checkbox.setAttribute('type', 'checkbox');
    function onChange() {
      _this.setValue(!_this.__prev);
    }
    dom.bind(_this2.__checkbox, 'change', onChange, false);
    _this2.domElement.appendChild(_this2.__checkbox);
    _this2.updateDisplay();
    return _this2;
  }
  createClass(BooleanController, [{
    key: 'setValue',
    value: function setValue(v) {
      var toReturn = get(BooleanController.prototype.__proto__ || Object.getPrototypeOf(BooleanController.prototype), 'setValue', this).call(this, v);
      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
      this.__prev = this.getValue();
      return toReturn;
    }
  }, {
    key: 'updateDisplay',
    value: function updateDisplay() {
      if (this.getValue() === true) {
        this.__checkbox.setAttribute('checked', 'checked');
        this.__checkbox.checked = true;
        this.__prev = true;
      } else {
        this.__checkbox.checked = false;
        this.__prev = false;
      }
      return get(BooleanController.prototype.__proto__ || Object.getPrototypeOf(BooleanController.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return BooleanController;
}(Controller);

var OptionController = function (_Controller) {
  inherits(OptionController, _Controller);
  function OptionController(object, property, opts) {
    classCallCheck(this, OptionController);
    var _this2 = possibleConstructorReturn(this, (OptionController.__proto__ || Object.getPrototypeOf(OptionController)).call(this, object, property));
    var options = opts;
    var _this = _this2;
    _this2.__select = document.createElement('select');
    if (Common.isArray(options)) {
      var map = {};
      Common.each(options, function (element) {
        map[element] = element;
      });
      options = map;
    }
    Common.each(options, function (value, key) {
      var opt = document.createElement('option');
      opt.innerHTML = key;
      opt.setAttribute('value', value);
      _this.__select.appendChild(opt);
    });
    _this2.updateDisplay();
    dom.bind(_this2.__select, 'change', function () {
      var desiredValue = this.options[this.selectedIndex].value;
      _this.setValue(desiredValue);
    });
    _this2.domElement.appendChild(_this2.__select);
    return _this2;
  }
  createClass(OptionController, [{
    key: 'setValue',
    value: function setValue(v) {
      var toReturn = get(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'setValue', this).call(this, v);
      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
      return toReturn;
    }
  }, {
    key: 'updateDisplay',
    value: function updateDisplay() {
      if (dom.isActive(this.__select)) return this;
      this.__select.value = this.getValue();
      return get(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return OptionController;
}(Controller);

var StringController = function (_Controller) {
  inherits(StringController, _Controller);
  function StringController(object, property) {
    classCallCheck(this, StringController);
    var _this2 = possibleConstructorReturn(this, (StringController.__proto__ || Object.getPrototypeOf(StringController)).call(this, object, property));
    var _this = _this2;
    function onChange() {
      _this.setValue(_this.__input.value);
    }
    function onBlur() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    _this2.__input = document.createElement('input');
    _this2.__input.setAttribute('type', 'text');
    dom.bind(_this2.__input, 'keyup', onChange);
    dom.bind(_this2.__input, 'change', onChange);
    dom.bind(_this2.__input, 'blur', onBlur);
    dom.bind(_this2.__input, 'keydown', function (e) {
      if (e.keyCode === 13) {
        this.blur();
      }
    });
    _this2.updateDisplay();
    _this2.domElement.appendChild(_this2.__input);
    return _this2;
  }
  createClass(StringController, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      if (!dom.isActive(this.__input)) {
        this.__input.value = this.getValue();
      }
      return get(StringController.prototype.__proto__ || Object.getPrototypeOf(StringController.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return StringController;
}(Controller);

function numDecimals(x) {
  var _x = x.toString();
  if (_x.indexOf('.') > -1) {
    return _x.length - _x.indexOf('.') - 1;
  }
  return 0;
}
var NumberController = function (_Controller) {
  inherits(NumberController, _Controller);
  function NumberController(object, property, params) {
    classCallCheck(this, NumberController);
    var _this = possibleConstructorReturn(this, (NumberController.__proto__ || Object.getPrototypeOf(NumberController)).call(this, object, property));
    var _params = params || {};
    _this.__min = _params.min;
    _this.__max = _params.max;
    _this.__step = _params.step;
    if (Common.isUndefined(_this.__step)) {
      if (_this.initialValue === 0) {
        _this.__impliedStep = 1;
      } else {
        _this.__impliedStep = Math.pow(10, Math.floor(Math.log(Math.abs(_this.initialValue)) / Math.LN10)) / 10;
      }
    } else {
      _this.__impliedStep = _this.__step;
    }
    _this.__precision = numDecimals(_this.__impliedStep);
    return _this;
  }
  createClass(NumberController, [{
    key: 'setValue',
    value: function setValue(v) {
      var _v = v;
      if (this.__min !== undefined && _v < this.__min) {
        _v = this.__min;
      } else if (this.__max !== undefined && _v > this.__max) {
        _v = this.__max;
      }
      if (this.__step !== undefined && _v % this.__step !== 0) {
        _v = Math.round(_v / this.__step) * this.__step;
      }
      return get(NumberController.prototype.__proto__ || Object.getPrototypeOf(NumberController.prototype), 'setValue', this).call(this, _v);
    }
  }, {
    key: 'min',
    value: function min(minValue) {
      this.__min = minValue;
      return this;
    }
  }, {
    key: 'max',
    value: function max(maxValue) {
      this.__max = maxValue;
      return this;
    }
  }, {
    key: 'step',
    value: function step(stepValue) {
      this.__step = stepValue;
      this.__impliedStep = stepValue;
      this.__precision = numDecimals(stepValue);
      return this;
    }
  }]);
  return NumberController;
}(Controller);

function roundToDecimal(value, decimals) {
  var tenTo = Math.pow(10, decimals);
  return Math.round(value * tenTo) / tenTo;
}
var NumberControllerBox = function (_NumberController) {
  inherits(NumberControllerBox, _NumberController);
  function NumberControllerBox(object, property, params) {
    classCallCheck(this, NumberControllerBox);
    var _this2 = possibleConstructorReturn(this, (NumberControllerBox.__proto__ || Object.getPrototypeOf(NumberControllerBox)).call(this, object, property, params));
    _this2.__truncationSuspended = false;
    var _this = _this2;
    var prevY = void 0;
    function onChange() {
      var attempted = parseFloat(_this.__input.value);
      if (!Common.isNaN(attempted)) {
        _this.setValue(attempted);
      }
    }
    function onFinish() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    function onBlur() {
      onFinish();
    }
    function onMouseDrag(e) {
      var diff = prevY - e.clientY;
      _this.setValue(_this.getValue() + diff * _this.__impliedStep);
      prevY = e.clientY;
    }
    function onMouseUp() {
      dom.unbind(window, 'mousemove', onMouseDrag);
      dom.unbind(window, 'mouseup', onMouseUp);
      onFinish();
    }
    function onMouseDown(e) {
      dom.bind(window, 'mousemove', onMouseDrag);
      dom.bind(window, 'mouseup', onMouseUp);
      prevY = e.clientY;
    }
    _this2.__input = document.createElement('input');
    _this2.__input.setAttribute('type', 'text');
    dom.bind(_this2.__input, 'change', onChange);
    dom.bind(_this2.__input, 'blur', onBlur);
    dom.bind(_this2.__input, 'mousedown', onMouseDown);
    dom.bind(_this2.__input, 'keydown', function (e) {
      if (e.keyCode === 13) {
        _this.__truncationSuspended = true;
        this.blur();
        _this.__truncationSuspended = false;
        onFinish();
      }
    });
    _this2.updateDisplay();
    _this2.domElement.appendChild(_this2.__input);
    return _this2;
  }
  createClass(NumberControllerBox, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      this.__input.value = this.__truncationSuspended ? this.getValue() : roundToDecimal(this.getValue(), this.__precision);
      return get(NumberControllerBox.prototype.__proto__ || Object.getPrototypeOf(NumberControllerBox.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return NumberControllerBox;
}(NumberController);

function map(v, i1, i2, o1, o2) {
  return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
}
var NumberControllerSlider = function (_NumberController) {
  inherits(NumberControllerSlider, _NumberController);
  function NumberControllerSlider(object, property, min, max, step) {
    classCallCheck(this, NumberControllerSlider);
    var _this2 = possibleConstructorReturn(this, (NumberControllerSlider.__proto__ || Object.getPrototypeOf(NumberControllerSlider)).call(this, object, property, { min: min, max: max, step: step }));
    var _this = _this2;
    _this2.__background = document.createElement('div');
    _this2.__foreground = document.createElement('div');
    dom.bind(_this2.__background, 'mousedown', onMouseDown);
    dom.bind(_this2.__background, 'touchstart', onTouchStart);
    dom.addClass(_this2.__background, 'slider');
    dom.addClass(_this2.__foreground, 'slider-fg');
    function onMouseDown(e) {
      document.activeElement.blur();
      dom.bind(window, 'mousemove', onMouseDrag);
      dom.bind(window, 'mouseup', onMouseUp);
      onMouseDrag(e);
    }
    function onMouseDrag(e) {
      e.preventDefault();
      var bgRect = _this.__background.getBoundingClientRect();
      _this.setValue(map(e.clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));
      return false;
    }
    function onMouseUp() {
      dom.unbind(window, 'mousemove', onMouseDrag);
      dom.unbind(window, 'mouseup', onMouseUp);
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    function onTouchStart(e) {
      if (e.touches.length !== 1) {
        return;
      }
      dom.bind(window, 'touchmove', onTouchMove);
      dom.bind(window, 'touchend', onTouchEnd);
      onTouchMove(e);
    }
    function onTouchMove(e) {
      var clientX = e.touches[0].clientX;
      var bgRect = _this.__background.getBoundingClientRect();
      _this.setValue(map(clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));
    }
    function onTouchEnd() {
      dom.unbind(window, 'touchmove', onTouchMove);
      dom.unbind(window, 'touchend', onTouchEnd);
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    _this2.updateDisplay();
    _this2.__background.appendChild(_this2.__foreground);
    _this2.domElement.appendChild(_this2.__background);
    return _this2;
  }
  createClass(NumberControllerSlider, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      var pct = (this.getValue() - this.__min) / (this.__max - this.__min);
      this.__foreground.style.width = pct * 100 + '%';
      return get(NumberControllerSlider.prototype.__proto__ || Object.getPrototypeOf(NumberControllerSlider.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return NumberControllerSlider;
}(NumberController);

var FunctionController = function (_Controller) {
  inherits(FunctionController, _Controller);
  function FunctionController(object, property, text) {
    classCallCheck(this, FunctionController);
    var _this2 = possibleConstructorReturn(this, (FunctionController.__proto__ || Object.getPrototypeOf(FunctionController)).call(this, object, property));
    var _this = _this2;
    _this2.__button = document.createElement('div');
    _this2.__button.innerHTML = text === undefined ? 'Fire' : text;
    dom.bind(_this2.__button, 'click', function (e) {
      e.preventDefault();
      _this.fire();
      return false;
    });
    dom.addClass(_this2.__button, 'button');
    _this2.domElement.appendChild(_this2.__button);
    return _this2;
  }
  createClass(FunctionController, [{
    key: 'fire',
    value: function fire() {
      if (this.__onChange) {
        this.__onChange.call(this);
      }
      this.getValue().call(this.object);
      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
    }
  }]);
  return FunctionController;
}(Controller);

var ColorController = function (_Controller) {
  inherits(ColorController, _Controller);
  function ColorController(object, property) {
    classCallCheck(this, ColorController);
    var _this2 = possibleConstructorReturn(this, (ColorController.__proto__ || Object.getPrototypeOf(ColorController)).call(this, object, property));
    _this2.__color = new Color$1(_this2.getValue());
    _this2.__temp = new Color$1(0);
    var _this = _this2;
    _this2.domElement = document.createElement('div');
    dom.makeSelectable(_this2.domElement, false);
    _this2.__selector = document.createElement('div');
    _this2.__selector.className = 'selector';
    _this2.__saturation_field = document.createElement('div');
    _this2.__saturation_field.className = 'saturation-field';
    _this2.__field_knob = document.createElement('div');
    _this2.__field_knob.className = 'field-knob';
    _this2.__field_knob_border = '2px solid ';
    _this2.__hue_knob = document.createElement('div');
    _this2.__hue_knob.className = 'hue-knob';
    _this2.__hue_field = document.createElement('div');
    _this2.__hue_field.className = 'hue-field';
    _this2.__input = document.createElement('input');
    _this2.__input.type = 'text';
    _this2.__input_textShadow = '0 1px 1px ';
    dom.bind(_this2.__input, 'keydown', function (e) {
      if (e.keyCode === 13) {
        onBlur.call(this);
      }
    });
    dom.bind(_this2.__input, 'blur', onBlur);
    dom.bind(_this2.__selector, 'mousedown', function ()        {
      dom.addClass(this, 'drag').bind(window, 'mouseup', function ()        {
        dom.removeClass(_this.__selector, 'drag');
      });
    });
    dom.bind(_this2.__selector, 'touchstart', function ()        {
      dom.addClass(this, 'drag').bind(window, 'touchend', function ()        {
        dom.removeClass(_this.__selector, 'drag');
      });
    });
    var valueField = document.createElement('div');
    Common.extend(_this2.__selector.style, {
      width: '122px',
      height: '102px',
      padding: '3px',
      backgroundColor: '#222',
      boxShadow: '0px 1px 3px rgba(0,0,0,0.3)'
    });
    Common.extend(_this2.__field_knob.style, {
      position: 'absolute',
      width: '12px',
      height: '12px',
      border: _this2.__field_knob_border + (_this2.__color.v < 0.5 ? '#fff' : '#000'),
      boxShadow: '0px 1px 3px rgba(0,0,0,0.5)',
      borderRadius: '12px',
      zIndex: 1
    });
    Common.extend(_this2.__hue_knob.style, {
      position: 'absolute',
      width: '15px',
      height: '2px',
      borderRight: '4px solid #fff',
      zIndex: 1
    });
    Common.extend(_this2.__saturation_field.style, {
      width: '100px',
      height: '100px',
      border: '1px solid #555',
      marginRight: '3px',
      display: 'inline-block',
      cursor: 'pointer'
    });
    Common.extend(valueField.style, {
      width: '100%',
      height: '100%',
      background: 'none'
    });
    linearGradient(valueField, 'top', 'rgba(0,0,0,0)', '#000');
    Common.extend(_this2.__hue_field.style, {
      width: '15px',
      height: '100px',
      border: '1px solid #555',
      cursor: 'ns-resize',
      position: 'absolute',
      top: '3px',
      right: '3px'
    });
    hueGradient(_this2.__hue_field);
    Common.extend(_this2.__input.style, {
      outline: 'none',
      textAlign: 'center',
      color: '#fff',
      border: 0,
      fontWeight: 'bold',
      textShadow: _this2.__input_textShadow + 'rgba(0,0,0,0.7)'
    });
    dom.bind(_this2.__saturation_field, 'mousedown', fieldDown);
    dom.bind(_this2.__saturation_field, 'touchstart', fieldDown);
    dom.bind(_this2.__field_knob, 'mousedown', fieldDown);
    dom.bind(_this2.__field_knob, 'touchstart', fieldDown);
    dom.bind(_this2.__hue_field, 'mousedown', fieldDownH);
    dom.bind(_this2.__hue_field, 'touchstart', fieldDownH);
    function fieldDown(e) {
      setSV(e);
      dom.bind(window, 'mousemove', setSV);
      dom.bind(window, 'touchmove', setSV);
      dom.bind(window, 'mouseup', fieldUpSV);
      dom.bind(window, 'touchend', fieldUpSV);
    }
    function fieldDownH(e) {
      setH(e);
      dom.bind(window, 'mousemove', setH);
      dom.bind(window, 'touchmove', setH);
      dom.bind(window, 'mouseup', fieldUpH);
      dom.bind(window, 'touchend', fieldUpH);
    }
    function fieldUpSV() {
      dom.unbind(window, 'mousemove', setSV);
      dom.unbind(window, 'touchmove', setSV);
      dom.unbind(window, 'mouseup', fieldUpSV);
      dom.unbind(window, 'touchend', fieldUpSV);
      onFinish();
    }
    function fieldUpH() {
      dom.unbind(window, 'mousemove', setH);
      dom.unbind(window, 'touchmove', setH);
      dom.unbind(window, 'mouseup', fieldUpH);
      dom.unbind(window, 'touchend', fieldUpH);
      onFinish();
    }
    function onBlur() {
      var i = interpret(this.value);
      if (i !== false) {
        _this.__color.__state = i;
        _this.setValue(_this.__color.toOriginal());
      } else {
        this.value = _this.__color.toString();
      }
    }
    function onFinish() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.__color.toOriginal());
      }
    }
    _this2.__saturation_field.appendChild(valueField);
    _this2.__selector.appendChild(_this2.__field_knob);
    _this2.__selector.appendChild(_this2.__saturation_field);
    _this2.__selector.appendChild(_this2.__hue_field);
    _this2.__hue_field.appendChild(_this2.__hue_knob);
    _this2.domElement.appendChild(_this2.__input);
    _this2.domElement.appendChild(_this2.__selector);
    _this2.updateDisplay();
    function setSV(e) {
      if (e.type.indexOf('touch') === -1) {
        e.preventDefault();
      }
      var fieldRect = _this.__saturation_field.getBoundingClientRect();
      var _ref = e.touches && e.touches[0] || e,
          clientX = _ref.clientX,
          clientY = _ref.clientY;
      var s = (clientX - fieldRect.left) / (fieldRect.right - fieldRect.left);
      var v = 1 - (clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);
      if (v > 1) {
        v = 1;
      } else if (v < 0) {
        v = 0;
      }
      if (s > 1) {
        s = 1;
      } else if (s < 0) {
        s = 0;
      }
      _this.__color.v = v;
      _this.__color.s = s;
      _this.setValue(_this.__color.toOriginal());
      return false;
    }
    function setH(e) {
      if (e.type.indexOf('touch') === -1) {
        e.preventDefault();
      }
      var fieldRect = _this.__hue_field.getBoundingClientRect();
      var _ref2 = e.touches && e.touches[0] || e,
          clientY = _ref2.clientY;
      var h = 1 - (clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);
      if (h > 1) {
        h = 1;
      } else if (h < 0) {
        h = 0;
      }
      _this.__color.h = h * 360;
      _this.setValue(_this.__color.toOriginal());
      return false;
    }
    return _this2;
  }
  createClass(ColorController, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      var i = interpret(this.getValue());
      if (i !== false) {
        var mismatch = false;
        Common.each(Color$1.COMPONENTS, function (component) {
          if (!Common.isUndefined(i[component]) && !Common.isUndefined(this.__color.__state[component]) && i[component] !== this.__color.__state[component]) {
            mismatch = true;
            return {};
          }
        }, this);
        if (mismatch) {
          Common.extend(this.__color.__state, i);
        }
      }
      Common.extend(this.__temp.__state, this.__color.__state);
      this.__temp.a = 1;
      var flip = this.__color.v < 0.5 || this.__color.s > 0.5 ? 255 : 0;
      var _flip = 255 - flip;
      Common.extend(this.__field_knob.style, {
        marginLeft: 100 * this.__color.s - 7 + 'px',
        marginTop: 100 * (1 - this.__color.v) - 7 + 'px',
        backgroundColor: this.__temp.toHexString(),
        border: this.__field_knob_border + 'rgb(' + flip + ',' + flip + ',' + flip + ')'
      });
      this.__hue_knob.style.marginTop = (1 - this.__color.h / 360) * 100 + 'px';
      this.__temp.s = 1;
      this.__temp.v = 1;
      linearGradient(this.__saturation_field, 'left', '#fff', this.__temp.toHexString());
      this.__input.value = this.__color.toString();
      Common.extend(this.__input.style, {
        backgroundColor: this.__color.toHexString(),
        color: 'rgb(' + flip + ',' + flip + ',' + flip + ')',
        textShadow: this.__input_textShadow + 'rgba(' + _flip + ',' + _flip + ',' + _flip + ',.7)'
      });
    }
  }]);
  return ColorController;
}(Controller);
var vendors = ['-moz-', '-o-', '-webkit-', '-ms-', ''];
function linearGradient(elem, x, a, b) {
  elem.style.background = '';
  Common.each(vendors, function (vendor) {
    elem.style.cssText += 'background: ' + vendor + 'linear-gradient(' + x + ', ' + a + ' 0%, ' + b + ' 100%); ';
  });
}
function hueGradient(elem) {
  elem.style.background = '';
  elem.style.cssText += 'background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);';
  elem.style.cssText += 'background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  elem.style.cssText += 'background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  elem.style.cssText += 'background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  elem.style.cssText += 'background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
}

var css = {
  load: function load(url, indoc) {
    var doc = indoc || document;
    var link = doc.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = url;
    doc.getElementsByTagName('head')[0].appendChild(link);
  },
  inject: function inject(cssContent, indoc) {
    var doc = indoc || document;
    var injected = document.createElement('style');
    injected.type = 'text/css';
    injected.innerHTML = cssContent;
    var head = doc.getElementsByTagName('head')[0];
    try {
      head.appendChild(injected);
    } catch (e) {
    }
  }
};

var saveDialogContents = "<div id=\"dg-save\" class=\"dg dialogue\">\n\n  Here's the new load parameter for your <code>GUI</code>'s constructor:\n\n  <textarea id=\"dg-new-constructor\"></textarea>\n\n  <div id=\"dg-save-locally\">\n\n    <input id=\"dg-local-storage\" type=\"checkbox\"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id=\"dg-local-explain\">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n\n    </div>\n\n  </div>\n\n</div>";

var ControllerFactory = function ControllerFactory(object, property) {
  var initialValue = object[property];
  if (Common.isArray(arguments[2]) || Common.isObject(arguments[2])) {
    return new OptionController(object, property, arguments[2]);
  }
  if (Common.isNumber(initialValue)) {
    if (Common.isNumber(arguments[2]) && Common.isNumber(arguments[3])) {
      if (Common.isNumber(arguments[4])) {
        return new NumberControllerSlider(object, property, arguments[2], arguments[3], arguments[4]);
      }
      return new NumberControllerSlider(object, property, arguments[2], arguments[3]);
    }
    if (Common.isNumber(arguments[4])) {
      return new NumberControllerBox(object, property, { min: arguments[2], max: arguments[3], step: arguments[4] });
    }
    return new NumberControllerBox(object, property, { min: arguments[2], max: arguments[3] });
  }
  if (Common.isString(initialValue)) {
    return new StringController(object, property);
  }
  if (Common.isFunction(initialValue)) {
    return new FunctionController(object, property, '');
  }
  if (Common.isBoolean(initialValue)) {
    return new BooleanController(object, property);
  }
  return null;
};

function requestAnimationFrame$1(callback) {
  setTimeout(callback, 1000 / 60);
}
var requestAnimationFrame$1$1 = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || requestAnimationFrame$1;

var CenteredDiv = function () {
  function CenteredDiv() {
    classCallCheck(this, CenteredDiv);
    this.backgroundElement = document.createElement('div');
    Common.extend(this.backgroundElement.style, {
      backgroundColor: 'rgba(0,0,0,0.8)',
      top: 0,
      left: 0,
      display: 'none',
      zIndex: '1000',
      opacity: 0,
      WebkitTransition: 'opacity 0.2s linear',
      transition: 'opacity 0.2s linear'
    });
    dom.makeFullscreen(this.backgroundElement);
    this.backgroundElement.style.position = 'fixed';
    this.domElement = document.createElement('div');
    Common.extend(this.domElement.style, {
      position: 'fixed',
      display: 'none',
      zIndex: '1001',
      opacity: 0,
      WebkitTransition: '-webkit-transform 0.2s ease-out, opacity 0.2s linear',
      transition: 'transform 0.2s ease-out, opacity 0.2s linear'
    });
    document.body.appendChild(this.backgroundElement);
    document.body.appendChild(this.domElement);
    var _this = this;
    dom.bind(this.backgroundElement, 'click', function () {
      _this.hide();
    });
  }
  createClass(CenteredDiv, [{
    key: 'show',
    value: function show() {
      var _this = this;
      this.backgroundElement.style.display = 'block';
      this.domElement.style.display = 'block';
      this.domElement.style.opacity = 0;
      this.domElement.style.webkitTransform = 'scale(1.1)';
      this.layout();
      Common.defer(function () {
        _this.backgroundElement.style.opacity = 1;
        _this.domElement.style.opacity = 1;
        _this.domElement.style.webkitTransform = 'scale(1)';
      });
    }
  }, {
    key: 'hide',
    value: function hide() {
      var _this = this;
      var hide = function hide() {
        _this.domElement.style.display = 'none';
        _this.backgroundElement.style.display = 'none';
        dom.unbind(_this.domElement, 'webkitTransitionEnd', hide);
        dom.unbind(_this.domElement, 'transitionend', hide);
        dom.unbind(_this.domElement, 'oTransitionEnd', hide);
      };
      dom.bind(this.domElement, 'webkitTransitionEnd', hide);
      dom.bind(this.domElement, 'transitionend', hide);
      dom.bind(this.domElement, 'oTransitionEnd', hide);
      this.backgroundElement.style.opacity = 0;
      this.domElement.style.opacity = 0;
      this.domElement.style.webkitTransform = 'scale(1.1)';
    }
  }, {
    key: 'layout',
    value: function layout() {
      this.domElement.style.left = window.innerWidth / 2 - dom.getWidth(this.domElement) / 2 + 'px';
      this.domElement.style.top = window.innerHeight / 2 - dom.getHeight(this.domElement) / 2 + 'px';
    }
  }]);
  return CenteredDiv;
}();

var styleSheet = ___$insertStyle(".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear;border:0;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button.close-top{position:relative}.dg.main .close-button.close-bottom{position:absolute}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-y:visible}.dg.a.has-save>ul.close-top{margin-top:0}.dg.a.has-save>ul.close-bottom{margin-top:27px}.dg.a.has-save>ul.closed{margin-top:0}.dg.a .save-row{top:0;z-index:1002}.dg.a .save-row.close-top{position:relative}.dg.a .save-row.close-bottom{position:fixed}.dg li{-webkit-transition:height .1s ease-out;-o-transition:height .1s ease-out;-moz-transition:height .1s ease-out;transition:height .1s ease-out;-webkit-transition:overflow .1s linear;-o-transition:overflow .1s linear;-moz-transition:overflow .1s linear;transition:overflow .1s linear}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li>*{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px;overflow:hidden}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .c{float:left;width:60%;position:relative}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:7px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .cr.color{overflow:visible}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.color{border-left:3px solid}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2FA1D6}.dg .cr.number input[type=text]{color:#2FA1D6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2FA1D6;max-width:100%}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}\n");

css.inject(styleSheet);
var CSS_NAMESPACE = 'dg';
var HIDE_KEY_CODE = 72;
var CLOSE_BUTTON_HEIGHT = 20;
var DEFAULT_DEFAULT_PRESET_NAME = 'Default';
var SUPPORTS_LOCAL_STORAGE = function () {
  try {
    return !!window.localStorage;
  } catch (e) {
    return false;
  }
}();
var SAVE_DIALOGUE = void 0;
var autoPlaceVirgin = true;
var autoPlaceContainer = void 0;
var hide = false;
var hideableGuis = [];
var GUI = function GUI(pars) {
  var _this = this;
  var params = pars || {};
  this.domElement = document.createElement('div');
  this.__ul = document.createElement('ul');
  this.domElement.appendChild(this.__ul);
  dom.addClass(this.domElement, CSS_NAMESPACE);
  this.__folders = {};
  this.__controllers = [];
  this.__rememberedObjects = [];
  this.__rememberedObjectIndecesToControllers = [];
  this.__listening = [];
  params = Common.defaults(params, {
    closeOnTop: false,
    autoPlace: true,
    width: GUI.DEFAULT_WIDTH
  });
  params = Common.defaults(params, {
    resizable: params.autoPlace,
    hideable: params.autoPlace
  });
  if (!Common.isUndefined(params.load)) {
    if (params.preset) {
      params.load.preset = params.preset;
    }
  } else {
    params.load = { preset: DEFAULT_DEFAULT_PRESET_NAME };
  }
  if (Common.isUndefined(params.parent) && params.hideable) {
    hideableGuis.push(this);
  }
  params.resizable = Common.isUndefined(params.parent) && params.resizable;
  if (params.autoPlace && Common.isUndefined(params.scrollable)) {
    params.scrollable = true;
  }
  var useLocalStorage = SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(this, 'isLocal')) === 'true';
  var saveToLocalStorage = void 0;
  var titleRow = void 0;
  Object.defineProperties(this,
  {
    parent: {
      get: function get$$1() {
        return params.parent;
      }
    },
    scrollable: {
      get: function get$$1() {
        return params.scrollable;
      }
    },
    autoPlace: {
      get: function get$$1() {
        return params.autoPlace;
      }
    },
    closeOnTop: {
      get: function get$$1() {
        return params.closeOnTop;
      }
    },
    preset: {
      get: function get$$1() {
        if (_this.parent) {
          return _this.getRoot().preset;
        }
        return params.load.preset;
      },
      set: function set$$1(v) {
        if (_this.parent) {
          _this.getRoot().preset = v;
        } else {
          params.load.preset = v;
        }
        setPresetSelectIndex(this);
        _this.revert();
      }
    },
    width: {
      get: function get$$1() {
        return params.width;
      },
      set: function set$$1(v) {
        params.width = v;
        setWidth(_this, v);
      }
    },
    name: {
      get: function get$$1() {
        return params.name;
      },
      set: function set$$1(v) {
        params.name = v;
        if (titleRow) {
          titleRow.innerHTML = params.name;
        }
      }
    },
    closed: {
      get: function get$$1() {
        return params.closed;
      },
      set: function set$$1(v) {
        params.closed = v;
        if (params.closed) {
          dom.addClass(_this.__ul, GUI.CLASS_CLOSED);
        } else {
          dom.removeClass(_this.__ul, GUI.CLASS_CLOSED);
        }
        this.onResize();
        if (_this.__closeButton) {
          _this.__closeButton.innerHTML = v ? GUI.TEXT_OPEN : GUI.TEXT_CLOSED;
        }
      }
    },
    load: {
      get: function get$$1() {
        return params.load;
      }
    },
    useLocalStorage: {
      get: function get$$1() {
        return useLocalStorage;
      },
      set: function set$$1(bool) {
        if (SUPPORTS_LOCAL_STORAGE) {
          useLocalStorage = bool;
          if (bool) {
            dom.bind(window, 'unload', saveToLocalStorage);
          } else {
            dom.unbind(window, 'unload', saveToLocalStorage);
          }
          localStorage.setItem(getLocalStorageHash(_this, 'isLocal'), bool);
        }
      }
    }
  });
  if (Common.isUndefined(params.parent)) {
    this.closed = params.closed || false;
    dom.addClass(this.domElement, GUI.CLASS_MAIN);
    dom.makeSelectable(this.domElement, false);
    if (SUPPORTS_LOCAL_STORAGE) {
      if (useLocalStorage) {
        _this.useLocalStorage = true;
        var savedGui = localStorage.getItem(getLocalStorageHash(this, 'gui'));
        if (savedGui) {
          params.load = JSON.parse(savedGui);
        }
      }
    }
    this.__closeButton = document.createElement('div');
    this.__closeButton.innerHTML = GUI.TEXT_CLOSED;
    dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BUTTON);
    if (params.closeOnTop) {
      dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_TOP);
      this.domElement.insertBefore(this.__closeButton, this.domElement.childNodes[0]);
    } else {
      dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BOTTOM);
      this.domElement.appendChild(this.__closeButton);
    }
    dom.bind(this.__closeButton, 'click', function () {
      _this.closed = !_this.closed;
    });
  } else {
    if (params.closed === undefined) {
      params.closed = true;
    }
    var titleRowName = document.createTextNode(params.name);
    dom.addClass(titleRowName, 'controller-name');
    titleRow = addRow(_this, titleRowName);
    var onClickTitle = function onClickTitle(e) {
      e.preventDefault();
      _this.closed = !_this.closed;
      return false;
    };
    dom.addClass(this.__ul, GUI.CLASS_CLOSED);
    dom.addClass(titleRow, 'title');
    dom.bind(titleRow, 'click', onClickTitle);
    if (!params.closed) {
      this.closed = false;
    }
  }
  if (params.autoPlace) {
    if (Common.isUndefined(params.parent)) {
      if (autoPlaceVirgin) {
        autoPlaceContainer = document.createElement('div');
        dom.addClass(autoPlaceContainer, CSS_NAMESPACE);
        dom.addClass(autoPlaceContainer, GUI.CLASS_AUTO_PLACE_CONTAINER);
        document.body.appendChild(autoPlaceContainer);
        autoPlaceVirgin = false;
      }
      autoPlaceContainer.appendChild(this.domElement);
      dom.addClass(this.domElement, GUI.CLASS_AUTO_PLACE);
    }
    if (!this.parent) {
      setWidth(_this, params.width);
    }
  }
  this.__resizeHandler = function () {
    _this.onResizeDebounced();
  };
  dom.bind(window, 'resize', this.__resizeHandler);
  dom.bind(this.__ul, 'webkitTransitionEnd', this.__resizeHandler);
  dom.bind(this.__ul, 'transitionend', this.__resizeHandler);
  dom.bind(this.__ul, 'oTransitionEnd', this.__resizeHandler);
  this.onResize();
  if (params.resizable) {
    addResizeHandle(this);
  }
  saveToLocalStorage = function saveToLocalStorage() {
    if (SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(_this, 'isLocal')) === 'true') {
      localStorage.setItem(getLocalStorageHash(_this, 'gui'), JSON.stringify(_this.getSaveObject()));
    }
  };
  this.saveToLocalStorageIfPossible = saveToLocalStorage;
  function resetWidth() {
    var root = _this.getRoot();
    root.width += 1;
    Common.defer(function () {
      root.width -= 1;
    });
  }
  if (!params.parent) {
    resetWidth();
  }
};
GUI.toggleHide = function () {
  hide = !hide;
  Common.each(hideableGuis, function (gui) {
    gui.domElement.style.display = hide ? 'none' : '';
  });
};
GUI.CLASS_AUTO_PLACE = 'a';
GUI.CLASS_AUTO_PLACE_CONTAINER = 'ac';
GUI.CLASS_MAIN = 'main';
GUI.CLASS_CONTROLLER_ROW = 'cr';
GUI.CLASS_TOO_TALL = 'taller-than-window';
GUI.CLASS_CLOSED = 'closed';
GUI.CLASS_CLOSE_BUTTON = 'close-button';
GUI.CLASS_CLOSE_TOP = 'close-top';
GUI.CLASS_CLOSE_BOTTOM = 'close-bottom';
GUI.CLASS_DRAG = 'drag';
GUI.DEFAULT_WIDTH = 245;
GUI.TEXT_CLOSED = 'Close Controls';
GUI.TEXT_OPEN = 'Open Controls';
GUI._keydownHandler = function (e) {
  if (document.activeElement.type !== 'text' && (e.which === HIDE_KEY_CODE || e.keyCode === HIDE_KEY_CODE)) {
    GUI.toggleHide();
  }
};
dom.bind(window, 'keydown', GUI._keydownHandler, false);
Common.extend(GUI.prototype,
{
  add: function add(object, property) {
    return _add(this, object, property, {
      factoryArgs: Array.prototype.slice.call(arguments, 2)
    });
  },
  addColor: function addColor(object, property) {
    return _add(this, object, property, {
      color: true
    });
  },
  remove: function remove(controller) {
    this.__ul.removeChild(controller.__li);
    this.__controllers.splice(this.__controllers.indexOf(controller), 1);
    var _this = this;
    Common.defer(function () {
      _this.onResize();
    });
  },
  destroy: function destroy() {
    if (this.parent) {
      throw new Error('Only the root GUI should be removed with .destroy(). ' + 'For subfolders, use gui.removeFolder(folder) instead.');
    }
    if (this.autoPlace) {
      autoPlaceContainer.removeChild(this.domElement);
    }
    var _this = this;
    Common.each(this.__folders, function (subfolder) {
      _this.removeFolder(subfolder);
    });
    dom.unbind(window, 'keydown', GUI._keydownHandler, false);
    removeListeners(this);
  },
  addFolder: function addFolder(name) {
    if (this.__folders[name] !== undefined) {
      throw new Error('You already have a folder in this GUI by the' + ' name "' + name + '"');
    }
    var newGuiParams = { name: name, parent: this };
    newGuiParams.autoPlace = this.autoPlace;
    if (this.load &&
    this.load.folders &&
    this.load.folders[name]) {
      newGuiParams.closed = this.load.folders[name].closed;
      newGuiParams.load = this.load.folders[name];
    }
    var gui = new GUI(newGuiParams);
    this.__folders[name] = gui;
    var li = addRow(this, gui.domElement);
    dom.addClass(li, 'folder');
    return gui;
  },
  removeFolder: function removeFolder(folder) {
    this.__ul.removeChild(folder.domElement.parentElement);
    delete this.__folders[folder.name];
    if (this.load &&
    this.load.folders &&
    this.load.folders[folder.name]) {
      delete this.load.folders[folder.name];
    }
    removeListeners(folder);
    var _this = this;
    Common.each(folder.__folders, function (subfolder) {
      folder.removeFolder(subfolder);
    });
    Common.defer(function () {
      _this.onResize();
    });
  },
  open: function open() {
    this.closed = false;
  },
  close: function close() {
    this.closed = true;
  },
  hide: function hide() {
    this.domElement.style.display = 'none';
  },
  show: function show() {
    this.domElement.style.display = '';
  },
  onResize: function onResize() {
    var root = this.getRoot();
    if (root.scrollable) {
      var top = dom.getOffset(root.__ul).top;
      var h = 0;
      Common.each(root.__ul.childNodes, function (node) {
        if (!(root.autoPlace && node === root.__save_row)) {
          h += dom.getHeight(node);
        }
      });
      if (window.innerHeight - top - CLOSE_BUTTON_HEIGHT < h) {
        dom.addClass(root.domElement, GUI.CLASS_TOO_TALL);
        root.__ul.style.height = window.innerHeight - top - CLOSE_BUTTON_HEIGHT + 'px';
      } else {
        dom.removeClass(root.domElement, GUI.CLASS_TOO_TALL);
        root.__ul.style.height = 'auto';
      }
    }
    if (root.__resize_handle) {
      Common.defer(function () {
        root.__resize_handle.style.height = root.__ul.offsetHeight + 'px';
      });
    }
    if (root.__closeButton) {
      root.__closeButton.style.width = root.width + 'px';
    }
  },
  onResizeDebounced: Common.debounce(function () {
    this.onResize();
  }, 50),
  remember: function remember() {
    if (Common.isUndefined(SAVE_DIALOGUE)) {
      SAVE_DIALOGUE = new CenteredDiv();
      SAVE_DIALOGUE.domElement.innerHTML = saveDialogContents;
    }
    if (this.parent) {
      throw new Error('You can only call remember on a top level GUI.');
    }
    var _this = this;
    Common.each(Array.prototype.slice.call(arguments), function (object) {
      if (_this.__rememberedObjects.length === 0) {
        addSaveMenu(_this);
      }
      if (_this.__rememberedObjects.indexOf(object) === -1) {
        _this.__rememberedObjects.push(object);
      }
    });
    if (this.autoPlace) {
      setWidth(this, this.width);
    }
  },
  getRoot: function getRoot() {
    var gui = this;
    while (gui.parent) {
      gui = gui.parent;
    }
    return gui;
  },
  getSaveObject: function getSaveObject() {
    var toReturn = this.load;
    toReturn.closed = this.closed;
    if (this.__rememberedObjects.length > 0) {
      toReturn.preset = this.preset;
      if (!toReturn.remembered) {
        toReturn.remembered = {};
      }
      toReturn.remembered[this.preset] = getCurrentPreset(this);
    }
    toReturn.folders = {};
    Common.each(this.__folders, function (element, key) {
      toReturn.folders[key] = element.getSaveObject();
    });
    return toReturn;
  },
  save: function save() {
    if (!this.load.remembered) {
      this.load.remembered = {};
    }
    this.load.remembered[this.preset] = getCurrentPreset(this);
    markPresetModified(this, false);
    this.saveToLocalStorageIfPossible();
  },
  saveAs: function saveAs(presetName) {
    if (!this.load.remembered) {
      this.load.remembered = {};
      this.load.remembered[DEFAULT_DEFAULT_PRESET_NAME] = getCurrentPreset(this, true);
    }
    this.load.remembered[presetName] = getCurrentPreset(this);
    this.preset = presetName;
    addPresetOption(this, presetName, true);
    this.saveToLocalStorageIfPossible();
  },
  revert: function revert(gui) {
    Common.each(this.__controllers, function (controller) {
      if (!this.getRoot().load.remembered) {
        controller.setValue(controller.initialValue);
      } else {
        recallSavedValue(gui || this.getRoot(), controller);
      }
      if (controller.__onFinishChange) {
        controller.__onFinishChange.call(controller, controller.getValue());
      }
    }, this);
    Common.each(this.__folders, function (folder) {
      folder.revert(folder);
    });
    if (!gui) {
      markPresetModified(this.getRoot(), false);
    }
  },
  listen: function listen(controller) {
    var init = this.__listening.length === 0;
    this.__listening.push(controller);
    if (init) {
      updateDisplays(this.__listening);
    }
  },
  updateDisplay: function updateDisplay() {
    Common.each(this.__controllers, function (controller) {
      controller.updateDisplay();
    });
    Common.each(this.__folders, function (folder) {
      folder.updateDisplay();
    });
  }
});
function addRow(gui, newDom, liBefore) {
  var li = document.createElement('li');
  if (newDom) {
    li.appendChild(newDom);
  }
  if (liBefore) {
    gui.__ul.insertBefore(li, liBefore);
  } else {
    gui.__ul.appendChild(li);
  }
  gui.onResize();
  return li;
}
function removeListeners(gui) {
  dom.unbind(window, 'resize', gui.__resizeHandler);
  if (gui.saveToLocalStorageIfPossible) {
    dom.unbind(window, 'unload', gui.saveToLocalStorageIfPossible);
  }
}
function markPresetModified(gui, modified) {
  var opt = gui.__preset_select[gui.__preset_select.selectedIndex];
  if (modified) {
    opt.innerHTML = opt.value + '*';
  } else {
    opt.innerHTML = opt.value;
  }
}
function augmentController(gui, li, controller) {
  controller.__li = li;
  controller.__gui = gui;
  Common.extend(controller,                                   {
    options: function options(_options) {
      if (arguments.length > 1) {
        var nextSibling = controller.__li.nextElementSibling;
        controller.remove();
        return _add(gui, controller.object, controller.property, {
          before: nextSibling,
          factoryArgs: [Common.toArray(arguments)]
        });
      }
      if (Common.isArray(_options) || Common.isObject(_options)) {
        var _nextSibling = controller.__li.nextElementSibling;
        controller.remove();
        return _add(gui, controller.object, controller.property, {
          before: _nextSibling,
          factoryArgs: [_options]
        });
      }
    },
    name: function name(_name) {
      controller.__li.firstElementChild.firstElementChild.innerHTML = _name;
      return controller;
    },
    listen: function listen() {
      controller.__gui.listen(controller);
      return controller;
    },
    remove: function remove() {
      controller.__gui.remove(controller);
      return controller;
    }
  });
  if (controller instanceof NumberControllerSlider) {
    var box = new NumberControllerBox(controller.object, controller.property, { min: controller.__min, max: controller.__max, step: controller.__step });
    Common.each(['updateDisplay', 'onChange', 'onFinishChange', 'step', 'min', 'max'], function (method) {
      var pc = controller[method];
      var pb = box[method];
      controller[method] = box[method] = function () {
        var args = Array.prototype.slice.call(arguments);
        pb.apply(box, args);
        return pc.apply(controller, args);
      };
    });
    dom.addClass(li, 'has-slider');
    controller.domElement.insertBefore(box.domElement, controller.domElement.firstElementChild);
  } else if (controller instanceof NumberControllerBox) {
    var r = function r(returned) {
      if (Common.isNumber(controller.__min) && Common.isNumber(controller.__max)) {
        var oldName = controller.__li.firstElementChild.firstElementChild.innerHTML;
        var wasListening = controller.__gui.__listening.indexOf(controller) > -1;
        controller.remove();
        var newController = _add(gui, controller.object, controller.property, {
          before: controller.__li.nextElementSibling,
          factoryArgs: [controller.__min, controller.__max, controller.__step]
        });
        newController.name(oldName);
        if (wasListening) newController.listen();
        return newController;
      }
      return returned;
    };
    controller.min = Common.compose(r, controller.min);
    controller.max = Common.compose(r, controller.max);
  } else if (controller instanceof BooleanController) {
    dom.bind(li, 'click', function () {
      dom.fakeEvent(controller.__checkbox, 'click');
    });
    dom.bind(controller.__checkbox, 'click', function (e) {
      e.stopPropagation();
    });
  } else if (controller instanceof FunctionController) {
    dom.bind(li, 'click', function () {
      dom.fakeEvent(controller.__button, 'click');
    });
    dom.bind(li, 'mouseover', function () {
      dom.addClass(controller.__button, 'hover');
    });
    dom.bind(li, 'mouseout', function () {
      dom.removeClass(controller.__button, 'hover');
    });
  } else if (controller instanceof ColorController) {
    dom.addClass(li, 'color');
    controller.updateDisplay = Common.compose(function (val) {
      li.style.borderLeftColor = controller.__color.toString();
      return val;
    }, controller.updateDisplay);
    controller.updateDisplay();
  }
  controller.setValue = Common.compose(function (val) {
    if (gui.getRoot().__preset_select && controller.isModified()) {
      markPresetModified(gui.getRoot(), true);
    }
    return val;
  }, controller.setValue);
}
function recallSavedValue(gui, controller) {
  var root = gui.getRoot();
  var matchedIndex = root.__rememberedObjects.indexOf(controller.object);
  if (matchedIndex !== -1) {
    var controllerMap = root.__rememberedObjectIndecesToControllers[matchedIndex];
    if (controllerMap === undefined) {
      controllerMap = {};
      root.__rememberedObjectIndecesToControllers[matchedIndex] = controllerMap;
    }
    controllerMap[controller.property] = controller;
    if (root.load && root.load.remembered) {
      var presetMap = root.load.remembered;
      var preset = void 0;
      if (presetMap[gui.preset]) {
        preset = presetMap[gui.preset];
      } else if (presetMap[DEFAULT_DEFAULT_PRESET_NAME]) {
        preset = presetMap[DEFAULT_DEFAULT_PRESET_NAME];
      } else {
        return;
      }
      if (preset[matchedIndex] && preset[matchedIndex][controller.property] !== undefined) {
        var value = preset[matchedIndex][controller.property];
        controller.initialValue = value;
        controller.setValue(value);
      }
    }
  }
}
function _add(gui, object, property, params) {
  if (object[property] === undefined) {
    throw new Error('Object "' + object + '" has no property "' + property + '"');
  }
  var controller = void 0;
  if (params.color) {
    controller = new ColorController(object, property);
  } else {
    var factoryArgs = [object, property].concat(params.factoryArgs);
    controller = ControllerFactory.apply(gui, factoryArgs);
  }
  if (params.before instanceof Controller) {
    params.before = params.before.__li;
  }
  recallSavedValue(gui, controller);
  dom.addClass(controller.domElement, 'c');
  var name = document.createElement('span');
  dom.addClass(name, 'property-name');
  name.innerHTML = controller.property;
  var container = document.createElement('div');
  container.appendChild(name);
  container.appendChild(controller.domElement);
  var li = addRow(gui, container, params.before);
  dom.addClass(li, GUI.CLASS_CONTROLLER_ROW);
  if (controller instanceof ColorController) {
    dom.addClass(li, 'color');
  } else {
    dom.addClass(li, _typeof(controller.getValue()));
  }
  augmentController(gui, li, controller);
  gui.__controllers.push(controller);
  return controller;
}
function getLocalStorageHash(gui, key) {
  return document.location.href + '.' + key;
}
function addPresetOption(gui, name, setSelected) {
  var opt = document.createElement('option');
  opt.innerHTML = name;
  opt.value = name;
  gui.__preset_select.appendChild(opt);
  if (setSelected) {
    gui.__preset_select.selectedIndex = gui.__preset_select.length - 1;
  }
}
function showHideExplain(gui, explain) {
  explain.style.display = gui.useLocalStorage ? 'block' : 'none';
}
function addSaveMenu(gui) {
  var div = gui.__save_row = document.createElement('li');
  dom.addClass(gui.domElement, 'has-save');
  gui.__ul.insertBefore(div, gui.__ul.firstChild);
  dom.addClass(div, 'save-row');
  var gears = document.createElement('span');
  gears.innerHTML = '&nbsp;';
  dom.addClass(gears, 'button gears');
  var button = document.createElement('span');
  button.innerHTML = 'Save';
  dom.addClass(button, 'button');
  dom.addClass(button, 'save');
  var button2 = document.createElement('span');
  button2.innerHTML = 'New';
  dom.addClass(button2, 'button');
  dom.addClass(button2, 'save-as');
  var button3 = document.createElement('span');
  button3.innerHTML = 'Revert';
  dom.addClass(button3, 'button');
  dom.addClass(button3, 'revert');
  var select = gui.__preset_select = document.createElement('select');
  if (gui.load && gui.load.remembered) {
    Common.each(gui.load.remembered, function (value, key) {
      addPresetOption(gui, key, key === gui.preset);
    });
  } else {
    addPresetOption(gui, DEFAULT_DEFAULT_PRESET_NAME, false);
  }
  dom.bind(select, 'change', function () {
    for (var index = 0; index < gui.__preset_select.length; index++) {
      gui.__preset_select[index].innerHTML = gui.__preset_select[index].value;
    }
    gui.preset = this.value;
  });
  div.appendChild(select);
  div.appendChild(gears);
  div.appendChild(button);
  div.appendChild(button2);
  div.appendChild(button3);
  if (SUPPORTS_LOCAL_STORAGE) {
    var explain = document.getElementById('dg-local-explain');
    var localStorageCheckBox = document.getElementById('dg-local-storage');
    var saveLocally = document.getElementById('dg-save-locally');
    saveLocally.style.display = 'block';
    if (localStorage.getItem(getLocalStorageHash(gui, 'isLocal')) === 'true') {
      localStorageCheckBox.setAttribute('checked', 'checked');
    }
    showHideExplain(gui, explain);
    dom.bind(localStorageCheckBox, 'change', function () {
      gui.useLocalStorage = !gui.useLocalStorage;
      showHideExplain(gui, explain);
    });
  }
  var newConstructorTextArea = document.getElementById('dg-new-constructor');
  dom.bind(newConstructorTextArea, 'keydown', function (e) {
    if (e.metaKey && (e.which === 67 || e.keyCode === 67)) {
      SAVE_DIALOGUE.hide();
    }
  });
  dom.bind(gears, 'click', function () {
    newConstructorTextArea.innerHTML = JSON.stringify(gui.getSaveObject(), undefined, 2);
    SAVE_DIALOGUE.show();
    newConstructorTextArea.focus();
    newConstructorTextArea.select();
  });
  dom.bind(button, 'click', function () {
    gui.save();
  });
  dom.bind(button2, 'click', function () {
    var presetName = prompt('Enter a new preset name.');
    if (presetName) {
      gui.saveAs(presetName);
    }
  });
  dom.bind(button3, 'click', function () {
    gui.revert();
  });
}
function addResizeHandle(gui) {
  var pmouseX = void 0;
  gui.__resize_handle = document.createElement('div');
  Common.extend(gui.__resize_handle.style, {
    width: '6px',
    marginLeft: '-3px',
    height: '200px',
    cursor: 'ew-resize',
    position: 'absolute'
  });
  function drag(e) {
    e.preventDefault();
    gui.width += pmouseX - e.clientX;
    gui.onResize();
    pmouseX = e.clientX;
    return false;
  }
  function dragStop() {
    dom.removeClass(gui.__closeButton, GUI.CLASS_DRAG);
    dom.unbind(window, 'mousemove', drag);
    dom.unbind(window, 'mouseup', dragStop);
  }
  function dragStart(e) {
    e.preventDefault();
    pmouseX = e.clientX;
    dom.addClass(gui.__closeButton, GUI.CLASS_DRAG);
    dom.bind(window, 'mousemove', drag);
    dom.bind(window, 'mouseup', dragStop);
    return false;
  }
  dom.bind(gui.__resize_handle, 'mousedown', dragStart);
  dom.bind(gui.__closeButton, 'mousedown', dragStart);
  gui.domElement.insertBefore(gui.__resize_handle, gui.domElement.firstElementChild);
}
function setWidth(gui, w) {
  gui.domElement.style.width = w + 'px';
  if (gui.__save_row && gui.autoPlace) {
    gui.__save_row.style.width = w + 'px';
  }
  if (gui.__closeButton) {
    gui.__closeButton.style.width = w + 'px';
  }
}
function getCurrentPreset(gui, useInitialValues) {
  var toReturn = {};
  Common.each(gui.__rememberedObjects, function (val, index) {
    var savedValues = {};
    var controllerMap = gui.__rememberedObjectIndecesToControllers[index];
    Common.each(controllerMap, function (controller, property) {
      savedValues[property] = useInitialValues ? controller.initialValue : controller.getValue();
    });
    toReturn[index] = savedValues;
  });
  return toReturn;
}
function setPresetSelectIndex(gui) {
  for (var index = 0; index < gui.__preset_select.length; index++) {
    if (gui.__preset_select[index].value === gui.preset) {
      gui.__preset_select.selectedIndex = index;
    }
  }
}
function updateDisplays(controllerArray) {
  if (controllerArray.length !== 0) {
    requestAnimationFrame$1$1.call(window, function () {
      updateDisplays(controllerArray);
    });
  }
  Common.each(controllerArray, function (c) {
    c.updateDisplay();
  });
}
var GUI$1 = GUI;

/** convert degrees to radians */
const Deg2Rad = Math.PI / 180;
/** convert radians to degrees */

const Rad2Deg = 180 / Math.PI;
/**
 * 浮点数相等
 */

function floatEqual(float1, float2, diff = 0.0000005) {
  return Math.abs(float1 - float2) < diff;
} // https://www.youtube.com/watch?v=qJq7I2DLGzI&list=PLW3Zl3wyJwWOpdhYedlD-yCB7WQoHf-My&index=12

/*
      x   y   z   t
   -------------------
   | n11 n12 n13 n14 |
   | n21 n22 n23 n24 |
   | n31 n32 n33 n34 |
   | n41 n42 n43 n44 |

    // orthogonal matrix is simply one whose inverse is equal to its transpose.
    // An orthogonal matrix M can only have a determinant of 1 or −1. If det 1 M = ,
    // the matrix M represents a pure rotation. If det 1 M = − , then the matrix M represents a rotation followed by a reflection.
*/
class Matrix3D {
  // tx
  // ty
  // tz
  constructor(p11 = 1, p12 = 0, p13 = 0, p14 = 0, p21 = 0, p22 = 1, p23 = 0, p24 = 0, p31 = 0, p32 = 0, p33 = 1, p34 = 0, p41 = 0, p42 = 0, p43 = 0, p44 = 1) {
    this.n11 = 1;
    this.n12 = 0;
    this.n13 = 0;
    this.n14 = 0;
    this.n21 = 0;
    this.n22 = 1;
    this.n23 = 0;
    this.n24 = 0;
    this.n31 = 0;
    this.n32 = 0;
    this.n33 = 1;
    this.n34 = 0;
    this.n41 = 0;
    this.n42 = 0;
    this.n43 = 0;
    this.n44 = 1;
    this._temp = new Float32Array(16);
    this.multiply = this.prepend;
    this.n11 = p11;
    this.n12 = p12;
    this.n13 = p13;
    this.n14 = p14;
    this.n21 = p21;
    this.n22 = p22;
    this.n23 = p23;
    this.n24 = p24;
    this.n31 = p31;
    this.n32 = p32;
    this.n33 = p33;
    this.n34 = p34;
    this.n41 = p41;
    this.n42 = p42;
    this.n43 = p43;
    this.n44 = p44;
  }

  get determinant() {
    //http://www.euclideanspace.com/maths/algebra/matrix/functions/determinant/fourD/index.htm
    let m00 = this.n11,
        m01 = this.n12,
        m02 = this.n13,
        m03 = this.n14,
        m10 = this.n21,
        m11 = this.n22,
        m12 = this.n23,
        m13 = this.n24,
        m20 = this.n31,
        m21 = this.n32,
        m22 = this.n33,
        m23 = this.n34,
        m30 = this.n41,
        m31 = this.n42,
        m32 = this.n43,
        m33 = this.n44;
    return m03 * m12 * m21 * m30 - m02 * m13 * m21 * m30 - m03 * m11 * m22 * m30 + m01 * m13 * m22 * m30 + m02 * m11 * m23 * m30 - m01 * m12 * m23 * m30 - m03 * m12 * m20 * m31 + m02 * m13 * m20 * m31 + m03 * m10 * m22 * m31 - m00 * m13 * m22 * m31 - m02 * m10 * m23 * m31 + m00 * m12 * m23 * m31 + m03 * m11 * m20 * m32 - m01 * m13 * m20 * m32 - m03 * m10 * m21 * m32 + m00 * m13 * m21 * m32 + m01 * m10 * m23 * m32 - m00 * m11 * m23 * m32 - m02 * m11 * m20 * m33 + m01 * m12 * m20 * m33 + m02 * m10 * m21 * m33 - m00 * m12 * m21 * m33 - m01 * m10 * m22 * m33 + m00 * m11 * m22 * m33;
  }

  reset(p11 = 1, p12 = 0, p13 = 0, p14 = 0, p21 = 0, p22 = 1, p23 = 0, p24 = 0, p31 = 0, p32 = 0, p33 = 1, p34 = 0, p41 = 0, p42 = 0, p43 = 0, p44 = 1) {
    let t = this;
    t.n11 = p11;
    t.n12 = p12;
    t.n13 = p13;
    t.n14 = p14;
    t.n21 = p21;
    t.n22 = p22;
    t.n23 = p23;
    t.n24 = p24;
    t.n31 = p31;
    t.n32 = p32;
    t.n33 = p33;
    t.n34 = p34;
    t.n41 = p41;
    t.n42 = p42;
    t.n43 = p43;
    t.n44 = p44;
    return t;
  }

  fromBasis(right, up, forward) {
    return this.reset(right.x, up.x, forward.x, 0, right.y, up.y, forward.y, 0, right.z, up.z, forward.z, 0, 0, 0, 0, 1);
  }

  fromTranslation(x, y, z) {
    return this.reset(1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1);
  }

  fromRotationX(rad) {
    let c = Math.cos(rad);
    let s = Math.sin(rad);
    return this.reset(1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1);
  }

  fromRotationY(rad) {
    let c = Math.cos(rad);
    let s = Math.sin(rad);
    return this.reset(c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1);
  }

  fromRotationZ(rad) {
    let c = Math.cos(rad);
    let s = Math.sin(rad);
    return this.reset(c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }

  fromScale(x, y, z) {
    return this.reset(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1);
  }

  fromShear(x, y, z) {
    return this.reset(1, y, z, 0, x, 1, z, 0, x, y, 1, 0, 0, 0, 0, 1);
  }
  /**
   * 相当于.rotateY(head).rotateX(pitch).rotateZ(roll);
   */


  fromEuler(e) {
    // Realtime rendering 4th p72
    let r = e.roll,
        h = e.head,
        p = e.pitch;
    let cos = Math.cos,
        sin = Math.sin;
    let sinr = sin(r),
        cosr = cos(r),
        sinp = sin(p),
        cosp = cos(p),
        sinh = sin(h),
        cosh = cos(h);
    return this.reset(cosr * cosh - sinr * sinp * sinh, -sinr * cosp, cosr * sinh + sinr * sinp * cosh, 0, sinr * cosh + cosr * sinp * sinh, cosr * cosp, sinr * sinh - cosr * sinp * cosh, 0, -cosp * sinh, sinp, cosp * cosh, 0, 0, 0, 0, 1);
  }

  fromQuaternion(q) {
    let x = q.x,
        y = q.y,
        z = q.z,
        w = q.w;
    let x2 = x + x;
    let y2 = y + y;
    let z2 = z + z;
    let xx = x * x2;
    let xy = x * y2;
    let xz = x * z2;
    let yy = y * y2;
    let yz = y * z2;
    let zz = z * z2;
    let wx = w * x2;
    let wy = w * y2;
    let wz = w * z2;
    this.n11 = 1 - yy - zz;
    this.n21 = xy + wz;
    this.n31 = xz - wy;
    this.n41 = 0;
    this.n12 = xy - wz;
    this.n22 = 1 - (xx + zz);
    this.n32 = yz + wx;
    this.n42 = 0;
    this.n13 = xz + wy;
    this.n23 = yz - wx;
    this.n33 = 1 - xx - yy;
    this.n43 = 0;
    this.n14 = 0;
    this.n24 = 0;
    this.n34 = 0;
    this.n44 = 1;
    return this;
  }
  /**
   * Rotation Translation
   * @param r 
   * @param t 
   */


  fromRT(r, t) {
    let x = r.x,
        y = r.y,
        z = r.z,
        w = r.w;
    let x2 = x + x;
    let y2 = y + y;
    let z2 = z + z;
    let xx = x * x2;
    let xy = x * y2;
    let xz = x * z2;
    let yy = y * y2;
    let yz = y * z2;
    let zz = z * z2;
    let wx = w * x2;
    let wy = w * y2;
    let wz = w * z2;
    this.n11 = 1 - yy - zz;
    this.n21 = xy + wz;
    this.n31 = xz - wy;
    this.n41 = 0;
    this.n12 = xy - wz;
    this.n22 = 1 - (xx + zz);
    this.n32 = yz + wx;
    this.n42 = 0;
    this.n13 = xz + wy;
    this.n23 = yz - wx;
    this.n33 = 1 - xx - yy;
    this.n43 = 0;
    this.n14 = t.x;
    this.n24 = t.y;
    this.n34 = t.z;
    this.n44 = 1;
    return this;
  }

  fromSRT(s, r, t) {
    let x = r.x,
        y = r.y,
        z = r.z,
        w = r.w;
    let x2 = x + x;
    let y2 = y + y;
    let z2 = z + z;
    let xx = x * x2;
    let xy = x * y2;
    let xz = x * z2;
    let yy = y * y2;
    let yz = y * z2;
    let zz = z * z2;
    let wx = w * x2;
    let wy = w * y2;
    let wz = w * z2;
    let sx = s.x;
    let sy = s.y;
    let sz = s.z;
    this.n11 = (1 - yy - zz) * sx;
    this.n21 = (xy + wz) * sx;
    this.n31 = (xz - wy) * sx;
    this.n41 = 0;
    this.n12 = (xy - wz) * sy;
    this.n22 = (1 - (xx + zz)) * sy;
    this.n32 = (yz + wx) * sy;
    this.n42 = 0;
    this.n13 = (xz + wy) * sz;
    this.n23 = (yz - wx) * sz;
    this.n33 = (1 - xx - yy) * sz;
    this.n43 = 0;
    this.n14 = t.x;
    this.n24 = t.y;
    this.n34 = t.z;
    this.n44 = 1;
    return this;
  }

  fromLookAt(eyeX, eyeY, eyeZ, targetX, targetY, targetZ, upX, upY, upZ) {
    let fx, fy, fz, rlf, rx, ry, rz, rls, ux, uy, uz; // foward vector

    fx = eyeX - targetX;
    fy = eyeY - targetY;
    fz = eyeZ - targetZ; // Normalize foward.

    rlf = 1 / Math.sqrt(fx * fx + fy * fy + fz * fz);
    fx *= rlf;
    fy *= rlf;
    fz *= rlf; // Calculate cross product of f and up.

    rx = fy * upZ - fz * upY;
    ry = fz * upX - fx * upZ;
    rz = fx * upY - fy * upX; // Normalize right vector.

    rls = 1 / Math.sqrt(rx * rx + ry * ry + rz * rz);
    rx *= rls;
    ry *= rls;
    rz *= rls; // Calculate cross product of r and f.

    ux = ry * fz - rz * fy;
    uy = rz * fx - rx * fz;
    uz = rx * fy - ry * fx;
    let t = this; // Set to this.

    t.n11 = rx;
    t.n12 = ux;
    t.n13 = fx;
    t.n14 = eyeX;
    t.n21 = ry;
    t.n22 = uy;
    t.n23 = fy;
    t.n24 = eyeY;
    t.n31 = rz;
    t.n32 = uz;
    t.n33 = fz;
    t.n34 = eyeZ;
    t.n41 = 0;
    t.n42 = 0;
    t.n43 = 0;
    t.n44 = 1;
    return t;
  }

  identity() {
    return this.reset(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }

  isRigidTransform() {
    return this.determinant === 1;
  }
  /**
   * singular 矩阵不可逆
   */


  isSingular() {
    return this.determinant === 0;
  }

  transpose() {
    let tmp,
        t = this;
    tmp = t.n12;
    t.n12 = t.n21;
    t.n21 = tmp;
    tmp = t.n13;
    t.n13 = t.n31;
    t.n31 = tmp;
    tmp = t.n14;
    t.n14 = t.n41;
    t.n41 = tmp;
    tmp = t.n23;
    t.n23 = t.n32;
    t.n32 = tmp;
    tmp = t.n24;
    t.n24 = t.n42;
    t.n42 = tmp;
    tmp = t.n34;
    t.n34 = t.n43;
    t.n43 = tmp;
    return this;
  }
  /**
   *  非常耗时，如果可以的话速度优化
   *  to invert a pure rotation then we just take the transpose of the 3x3 part of the matrix.
   *  to invert a pure translation the we just negate the translation
   */


  invert() {
    // http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
    // https://github.com/toji/gl-matrix/blob/master/src/mat4.js
    let a00 = this.n11,
        a01 = this.n21,
        a02 = this.n31,
        a03 = this.n41;
    let a10 = this.n12,
        a11 = this.n22,
        a12 = this.n32,
        a13 = this.n42;
    let a20 = this.n13,
        a21 = this.n23,
        a22 = this.n33,
        a23 = this.n43;
    let a30 = this.n14,
        a31 = this.n24,
        a32 = this.n34,
        a33 = this.n44;
    let b00 = a00 * a11 - a01 * a10;
    let b01 = a00 * a12 - a02 * a10;
    let b02 = a00 * a13 - a03 * a10;
    let b03 = a01 * a12 - a02 * a11;
    let b04 = a01 * a13 - a03 * a11;
    let b05 = a02 * a13 - a03 * a12;
    let b06 = a20 * a31 - a21 * a30;
    let b07 = a20 * a32 - a22 * a30;
    let b08 = a20 * a33 - a23 * a30;
    let b09 = a21 * a32 - a22 * a31;
    let b10 = a21 * a33 - a23 * a31;
    let b11 = a22 * a33 - a23 * a32; // Calculate the determinant

    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) {
      return null;
    }

    det = 1.0 / det;
    this.n11 = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    this.n21 = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    this.n31 = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    this.n41 = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    this.n12 = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    this.n22 = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    this.n32 = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    this.n42 = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    this.n13 = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    this.n23 = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    this.n33 = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    this.n43 = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    this.n14 = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    this.n24 = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    this.n34 = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    this.n44 = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return this;
  }

  equal(m) {
    let t = this;
    return floatEqual(t.n11, m.n11) && floatEqual(t.n12, m.n12) && floatEqual(t.n13, m.n13) && floatEqual(t.n14, m.n14) && floatEqual(t.n21, m.n21) && floatEqual(t.n22, m.n22) && floatEqual(t.n23, m.n23) && floatEqual(t.n24, m.n24) && floatEqual(t.n31, m.n31) && floatEqual(t.n32, m.n32) && floatEqual(t.n33, m.n33) && floatEqual(t.n34, m.n34) && floatEqual(t.n41, m.n41) && floatEqual(t.n42, m.n42) && floatEqual(t.n43, m.n43) && floatEqual(t.n44, m.n44);
  }
  /**
   *  this =  m * this 
   * @param m 
   */


  append(m) {
    let t11 = this.n11,
        t12 = this.n12,
        t13 = this.n13,
        t14 = this.n14;
    let t21 = this.n21,
        t22 = this.n22,
        t23 = this.n23,
        t24 = this.n24;
    let t31 = this.n31,
        t32 = this.n32,
        t33 = this.n33,
        t34 = this.n34;
    let t41 = this.n41,
        t42 = this.n42,
        t43 = this.n43,
        t44 = this.n44;
    this.n11 = m.n11 * t11 + m.n12 * t21 + m.n13 * t31 + m.n14 * t41;
    this.n12 = m.n11 * t12 + m.n12 * t22 + m.n13 * t32 + m.n14 * t42;
    this.n13 = m.n11 * t13 + m.n12 * t23 + m.n13 * t33 + m.n14 * t43;
    this.n14 = m.n11 * t14 + m.n12 * t24 + m.n13 * t34 + m.n14 * t44;
    this.n21 = m.n21 * t11 + m.n22 * t21 + m.n23 * t31 + m.n24 * t41;
    this.n22 = m.n21 * t12 + m.n22 * t22 + m.n23 * t32 + m.n24 * t42;
    this.n23 = m.n21 * t13 + m.n22 * t23 + m.n23 * t33 + m.n24 * t43;
    this.n24 = m.n21 * t14 + m.n22 * t24 + m.n23 * t34 + m.n24 * t44;
    this.n31 = m.n31 * t11 + m.n32 * t21 + m.n33 * t31 + m.n34 * t41;
    this.n32 = m.n31 * t12 + m.n32 * t22 + m.n33 * t32 + m.n34 * t42;
    this.n33 = m.n31 * t13 + m.n32 * t23 + m.n33 * t33 + m.n34 * t43;
    this.n34 = m.n31 * t14 + m.n32 * t24 + m.n33 * t34 + m.n34 * t44;
    this.n41 = m.n41 * t11 + m.n42 * t21 + m.n43 * t31 + m.n44 * t41;
    this.n42 = m.n41 * t12 + m.n42 * t22 + m.n43 * t32 + m.n44 * t42;
    this.n43 = m.n41 * t13 + m.n42 * t23 + m.n43 * t33 + m.n44 * t43;
    this.n44 = m.n41 * t14 + m.n42 * t24 + m.n43 * t34 + m.n44 * t44;
    return this;
  }
  /**
   * this = this * m
   * @param m 
   */


  prepend(m) {
    let t11 = this.n11,
        t12 = this.n12,
        t13 = this.n13,
        t14 = this.n14;
    let t21 = this.n21,
        t22 = this.n22,
        t23 = this.n23,
        t24 = this.n24;
    let t31 = this.n31,
        t32 = this.n32,
        t33 = this.n33,
        t34 = this.n34;
    let t41 = this.n41,
        t42 = this.n42,
        t43 = this.n43,
        t44 = this.n44;
    this.n11 = t11 * m.n11 + t12 * m.n21 + t13 * m.n31 + t14 * m.n41;
    this.n12 = t11 * m.n12 + t12 * m.n22 + t13 * m.n32 + t14 * m.n42;
    this.n13 = t11 * m.n13 + t12 * m.n23 + t13 * m.n33 + t14 * m.n43;
    this.n14 = t11 * m.n14 + t12 * m.n24 + t13 * m.n34 + t14 * m.n44;
    this.n21 = t21 * m.n11 + t22 * m.n21 + t23 * m.n31 + t24 * m.n41;
    this.n22 = t21 * m.n12 + t22 * m.n22 + t23 * m.n32 + t24 * m.n42;
    this.n23 = t21 * m.n13 + t22 * m.n23 + t23 * m.n33 + t24 * m.n43;
    this.n24 = t21 * m.n14 + t22 * m.n24 + t23 * m.n34 + t24 * m.n44;
    this.n31 = t31 * m.n11 + t32 * m.n21 + t33 * m.n31 + t34 * m.n41;
    this.n32 = t31 * m.n12 + t32 * m.n22 + t33 * m.n32 + t34 * m.n42;
    this.n33 = t31 * m.n13 + t32 * m.n23 + t33 * m.n33 + t34 * m.n43;
    this.n34 = t31 * m.n14 + t32 * m.n24 + t33 * m.n34 + t34 * m.n44;
    this.n41 = t41 * m.n11 + t42 * m.n21 + t43 * m.n31 + t44 * m.n41;
    this.n42 = t41 * m.n12 + t42 * m.n22 + t43 * m.n32 + t44 * m.n42;
    this.n43 = t41 * m.n13 + t42 * m.n23 + t43 * m.n33 + t44 * m.n43;
    this.n44 = t41 * m.n14 + t42 * m.n24 + t43 * m.n34 + t44 * m.n44;
    return this;
  }

  translate(x, y, z) {
    /*
    *   1 0 0 x
    *   0 1 0 y   *  this
    *   0 0 1 z
    *   0 0 0 1
    */
    this.n11 += this.n41 * x, this.n12 += this.n42 * x, this.n13 += this.n43 * x, this.n14 += this.n44 * x;
    this.n21 += this.n41 * y, this.n22 += this.n42 * y, this.n23 += this.n43 * y, this.n24 += this.n44 * y;
    this.n31 += this.n41 * z, this.n32 += this.n42 * z, this.n33 += this.n43 * z, this.n34 += this.n44 * z;
    return this;
  }

  scale(x, y = x, z = x) {
    /*
    *   x 0 0 0
    *   0 y 0 0    *  this
    *   0 0 z 0
    *   0 0 0 1
    */
    let t = this;
    t.n11 *= x, t.n12 *= x, t.n13 *= x, t.n14 *= x;
    t.n21 *= y, t.n22 *= y, t.n23 *= y, t.n24 *= y;
    t.n31 *= z, t.n32 *= z, t.n33 *= z, t.n34 *= z;
    return this;
  }

  rotateX(radians) {
    // 1, 0,  0, 0,
    // 0, c, -s, 0,  *  this
    // 0, s,  c, 0,
    let c = Math.cos(radians);
    let s = Math.sin(radians);
    let t = this;
    let m21 = t.n21,
        m22 = t.n22,
        m23 = t.n23,
        m24 = t.n24;
    let m31 = t.n31,
        m32 = t.n32,
        m33 = t.n33,
        m34 = t.n34;
    t.n21 = c * m21 - s * m31, t.n22 = c * m22 - s * m32, t.n23 = c * m23 - s * m33, t.n24 = c * m24 - s * m34;
    t.n31 = s * m21 + c * m31, t.n32 = s * m22 + c * m32, t.n33 = s * m23 + c * m33, t.n34 = s * m24 + c * m34;
    return t;
  }

  rotateY(radians) {
    // c,  0, s, 0,
    // 0,  1, 0, 0,  *  this
    // -s, 0, c, 0,
    let c = Math.cos(radians);
    let s = Math.sin(radians);
    let t = this;
    let m11 = t.n11,
        m12 = t.n12,
        m13 = t.n13,
        m14 = t.n14;
    let m31 = t.n31,
        m32 = t.n32,
        m33 = t.n33,
        m34 = t.n34;
    t.n11 = c * m11 + s * m31, t.n12 = c * m12 + s * m32, t.n13 = c * m13 + s * m33, t.n14 = c * m14 + s * m34;
    t.n31 = -s * m11 + c * m31, t.n32 = -s * m12 + c * m32, t.n33 = -s * m13 + c * m33, t.n34 = -s * m14 + c * m34;
    return t;
  }

  rotateZ(radians) {
    // c, -s, 0, 0,
    // s, c,  0, 0,    *   this
    // 0, 0,  1, 0,
    let c = Math.cos(radians);
    let s = Math.sin(radians);
    let t = this;
    let m11 = t.n11,
        m12 = t.n12,
        m13 = t.n13,
        m14 = t.n14;
    let m21 = t.n21,
        m22 = t.n22,
        m23 = t.n23,
        m24 = t.n24;
    t.n11 = c * m11 - s * m21;
    t.n12 = c * m12 - s * m22;
    t.n13 = c * m13 - s * m23, t.n14 = c * m14 - s * m24;
    t.n21 = s * m11 + c * m21;
    t.n22 = s * m12 + c * m22;
    t.n23 = s * m13 + c * m23, t.n24 = s * m14 + c * m24;
    return t;
  }
  /**
   * 用此变量变换一个点，注意此方法会修改点p
   * @param p 被变换的点
   */


  transformPoint(p) {
    // | n11 n12 n13 n14 |      x
    // | n21 n22 n23 n24 |  *   y
    // | n31 n32 n33 n34 |      z
    // | n41 n42 n43 n44 |      1
    let x = p.x,
        y = p.y,
        z = p.z,
        t = this;
    p.x = t.n11 * x + t.n12 * y + t.n13 * z + t.n14;
    p.y = t.n21 * x + t.n22 * y + t.n23 * z + t.n24;
    p.z = t.n31 * x + t.n32 * y + t.n33 * z + t.n34;
    p.w = t.n41 * x + t.n42 * y + t.n43 * z + t.n44;
    return p;
  }
  /**
   * 用此变量变换方向v,注意此方法会修改方向v
   * @param v 被变换的向量
   */


  transformVecotr(v) {
    // | n11 n12 n13 n14 |      x
    // | n21 n22 n23 n24 |  *   y
    // | n31 n32 n33 n34 |      z
    // | n41 n42 n43 n44 |      0
    let x = v.x,
        y = v.y,
        z = v.z,
        t = this;
    v.x = t.n11 * x + t.n12 * y + t.n13 * z;
    v.y = t.n21 * x + t.n22 * y + t.n23 * z;
    v.z = t.n31 * x + t.n32 * y + t.n33 * z;
    v.w = t.n41 * x + t.n42 * y + t.n43 * z;
    return v;
  }

  copyFrom(m) {
    return this.reset(m.n11, m.n12, m.n13, m.n14, m.n21, m.n22, m.n23, m.n24, m.n31, m.n32, m.n33, m.n34, m.n41, m.n42, m.n43, m.n44);
  }

  clone() {
    return new Matrix3D(this.n11, this.n12, this.n13, this.n14, this.n21, this.n22, this.n23, this.n24, this.n31, this.n32, this.n33, this.n34, this.n41, this.n42, this.n43, this.n44);
  } //if M = T(t)R(φ), then M−1 = R(−φ)T(−t).
  // invertTR() {
  //     // this method can only be used if the matrix is a translation/rotation matrix.
  //     // the below asserts will trigger if this is not the case.
  //     // if (__DEBUG__) {
  //     // each basis vector should be length 1
  //     // Math.abs(getForwardVector().lengthSqr() - 1 ) < 0.00001
  //     // Math.abs(upVector().lengthSqr() - 1 ) < 0.00001
  //     // Math.abs(RightVector().lengthSqr() - 1 ) < 0.00001
  //     // Math.abs(frowardVector().dot(upVector)) < 0.00001 // all vectors should be orthogonal
  //     // Math.abs(frowardVector().dot(rightVector)) < 0.00001 // all vectors should be orthogonal
  //     // Math.abs(rightVector().dot(upVector)) < 0.00001 // all vectors should be orthogonal
  //     // }
  //     return new Matrix3D();
  // }

  /**
   * column major order
   */


  get float32Array() {
    return this.toArray(this._temp, true);
  }

  set float32Array(arr) {
    this.fromArray(arr, true);
  }

  toArray(out, columnMajor = true) {
    let t = this;
    if (!out) out = new Float32Array(16);

    if (columnMajor) {
      out[0] = t.n11;
      out[4] = t.n12;
      out[8] = t.n13;
      out[12] = t.n14;
      out[1] = t.n21;
      out[5] = t.n22;
      out[9] = t.n23;
      out[13] = t.n24;
      out[2] = t.n31;
      out[6] = t.n32;
      out[10] = t.n33;
      out[14] = t.n34;
      out[3] = t.n41;
      out[7] = t.n42;
      out[11] = t.n43;
      out[15] = t.n44;
    } else {
      out[0] = t.n11;
      out[1] = t.n12;
      out[2] = t.n13;
      out[3] = t.n14;
      out[4] = t.n21;
      out[5] = t.n22;
      out[6] = t.n23;
      out[7] = t.n24;
      out[8] = t.n31;
      out[9] = t.n32;
      out[10] = t.n33;
      out[11] = t.n34;
      out[12] = t.n41;
      out[13] = t.n42;
      out[14] = t.n43;
      out[15] = t.n44;
    }

    return out;
  }

  fromArray(arr, columnMajor = true) {
    let t = this;

    if (columnMajor) {
      t.n11 = arr[0];
      t.n12 = arr[4];
      t.n13 = arr[8];
      t.n14 = arr[12];
      t.n21 = arr[1];
      t.n22 = arr[5];
      t.n23 = arr[9];
      t.n24 = arr[13];
      t.n31 = arr[2];
      t.n32 = arr[6];
      t.n33 = arr[10];
      t.n34 = arr[14];
      t.n41 = arr[3];
      t.n42 = arr[7];
      t.n43 = arr[11];
      t.n44 = arr[15];
    } else {
      t.n11 = arr[0];
      t.n12 = arr[1];
      t.n13 = arr[2];
      t.n14 = arr[3];
      t.n21 = arr[4];
      t.n22 = arr[5];
      t.n23 = arr[6];
      t.n24 = arr[7];
      t.n31 = arr[8];
      t.n32 = arr[9];
      t.n33 = arr[10];
      t.n34 = arr[11];
      t.n41 = arr[12];
      t.n42 = arr[13];
      t.n43 = arr[14];
      t.n44 = arr[15];
    }
  }

  toString() {
    return '|  ' + this.n11 + ',' + this.n12 + ',' + this.n13 + ',' + this.n14 + '\n' + '|  ' + this.n21 + ',' + this.n22 + ',' + this.n23 + ',' + this.n24 + '\n' + '|  ' + this.n31 + ',' + this.n32 + ',' + this.n33 + ',' + this.n34 + '\n' + '|  ' + this.n41 + ',' + this.n42 + ',' + this.n43 + ',' + this.n44 + '\n';
  }

}
function perspectiveFieldOfViewRH(fieldOfViewY, aspectRatio, zNear, zFar) {
  let yScale = 1.0 / Math.tan(fieldOfViewY / 2.0);
  let xScale = yScale / aspectRatio;
  return new Matrix3D(xScale, 0.0, 0.0, 0.0, 0.0, yScale, 0.0, 0.0, 0.0, 0.0, (zFar + zNear) / (zNear - zFar), 2.0 * zNear * zFar / (zNear - zFar), 0.0, 0.0, -1.0, 0.0);
}

const uLightDirection = 'uLightDirection';
const uLightDiffuse = 'uLightDiffuse';
const uLightAmbient = 'uLightAmbient';
const uLightSpecular = 'uLightSpecular';
const uMaterialDiffuse = 'uMaterialDiffuse';
const uMaterialAmbient = 'uMaterialAmbient';
const uMaterialSpecular = 'uMaterialSpecular';
const uShininess = 'uShininess';
const uMVMatrix = 'uMVMatrix';
const uPMatrix = 'uPMatrix';
const uNMatrix = 'uNMatrix';
const aVertexPosition = 'aVertexPosition';
const aVertexNormal = 'aVertexNormal';
const vFinalColor = 'vFinalColor';
const vNormal = 'vNormal';
const gl_Position = 'gl_Position';
const gl_FragColor = 'gl_FragColor';
const precision_mediump_float = 'precision mediump float';

const vs = `
attribute vec3 ${aVertexPosition};
attribute vec3 ${aVertexNormal};
 
uniform mat4 ${uMVMatrix} ;
uniform mat4 ${uPMatrix};
uniform mat4 ${uNMatrix};
 
// lights
uniform vec3 ${uLightDirection};   	//light direction
uniform vec4 ${uLightAmbient};		//ambiental light
uniform vec4 ${uLightDiffuse};		//light color
uniform vec4 ${uLightSpecular}; 

// materials
uniform vec4 ${uMaterialAmbient};
uniform vec4 ${uMaterialSpecular};
uniform vec4 ${uMaterialDiffuse};	
uniform float ${uShininess};
 
varying vec4 ${vFinalColor};

 
void main(void) {
    vec3 N = vec3(${uNMatrix} * vec4(${aVertexNormal}, 1.0));
    vec3 L = normalize(${uLightDirection});
	
	//Lambert's cosine law
	float lambertTerm = dot(N,-L);
    
	//Ambient Term
    vec4 Ia = ${uLightAmbient} * ${uMaterialAmbient};
	
	//Diffuse Term
	vec4 Id =  ${uMaterialDiffuse} * ${uLightDiffuse} * lambertTerm;

	//
	vec4 vertex = ${uMVMatrix} * vec4(${aVertexPosition},1.0);
	vec3 eyeVec = -vec3(vertex.xyz);
	vec3 E = normalize(eyeVec);
	vec3 R = reflect(L,N);
	float specular = pow(max(dot(R,E),0.0),${uShininess});
	vec4 Is = ${uLightSpecular} * ${uMaterialSpecular} * specular;


	
	//Final Color
	${vFinalColor} = vec4(vec3(Ia + Id + Is),1.0);
    
	//transformed vertex position
    ${gl_Position} = ${uPMatrix} * vertex;
}
`;
const fs = `

${precision_mediump_float};
varying vec4  ${vFinalColor};
void main(void)  {
	${gl_FragColor} = ${vFinalColor};
}
`;
const phongVS = `
attribute vec3 ${aVertexPosition};
attribute vec3 ${aVertexNormal};

varying vec3 ${vNormal};
varying vec3 vEyeVector;
 
uniform mat4 ${uMVMatrix} ;
uniform mat4 ${uPMatrix};
uniform mat4 ${uNMatrix};
 
void main(void) {
 
	vec4 vertex = ${uMVMatrix} * vec4(${aVertexPosition},1.0);

	${vNormal} = vec3(${uNMatrix} * vec4(${aVertexNormal}, 1.0));
    vEyeVector = -vec3(vertex.xyz);
    
	//transformed vertex position
    ${gl_Position} = ${uPMatrix} * vertex;
}
`;
const phongFS = `

${precision_mediump_float};

// lights
uniform vec3 ${uLightDirection};   	//light direction
uniform vec4 ${uLightAmbient};		//ambiental light
uniform vec4 ${uLightDiffuse};		//light color
uniform vec4 ${uLightSpecular};

// materials
uniform vec4 ${uMaterialAmbient};
uniform vec4 ${uMaterialSpecular};
uniform vec4 ${uMaterialDiffuse};
uniform float ${uShininess};

varying vec3 ${vNormal};
varying vec3 vEyeVector;

void main(void)  {
	// Normalized light direction
	vec3 L = normalize(${uLightDirection});
	// Normalized normal
	vec3 N = normalize(${vNormal});
	float lambertTerm = dot(N, -L);

	// Ambient
	vec4 Ia = ${uLightAmbient} * ${uMaterialAmbient};

	//Diffuse Term
	vec4 Id = ${uMaterialDiffuse} * ${uLightDiffuse} * lambertTerm;

	
	vec3 E = normalize(vEyeVector);
	vec3 R = reflect(L, N);
	float specular = pow( max(dot(R, E), 0.0), ${uShininess});
	vec4 Is = uLightSpecular * uMaterialSpecular * specular;
	${gl_FragColor} = vec4(vec3(Ia + Id + Is), 1.0);;
}
`;

function calculateNormals(vs, ind) {
  const x = 0;
  const y = 1;
  const z = 2;
  const ns = [];

  for (let i = 0; i < vs.length; i++) {
    //for each vertex, initialize normal x, normal y, normal z
    ns[i] = 0.0;
  }

  for (var i = 0; i < ind.length; i = i + 3) {
    //we work on triads of vertices to calculate normals so i = i+3 (i = indices index)
    var v1 = [];
    var v2 = [];
    var normal = []; // p2 - p1

    v1[x] = vs[3 * ind[i + 2] + x] - vs[3 * ind[i + 1] + x];
    v1[y] = vs[3 * ind[i + 2] + y] - vs[3 * ind[i + 1] + y];
    v1[z] = vs[3 * ind[i + 2] + z] - vs[3 * ind[i + 1] + z]; // p0 - p1

    v2[x] = vs[3 * ind[i] + x] - vs[3 * ind[i + 1] + x];
    v2[y] = vs[3 * ind[i] + y] - vs[3 * ind[i + 1] + y];
    v2[z] = vs[3 * ind[i] + z] - vs[3 * ind[i + 1] + z];
    normal[x] = v1[y] * v2[z] - v1[z] * v2[y];
    normal[y] = v1[z] * v2[x] - v1[x] * v2[z];
    normal[z] = v1[x] * v2[y] - v1[y] * v2[x];

    for (let j = 0; j < 3; j++) {
      //update the normals of that triangle: sum of vectors
      ns[3 * ind[i + j] + x] = ns[3 * ind[i + j] + x] + normal[x];
      ns[3 * ind[i + j] + y] = ns[3 * ind[i + j] + y] + normal[y];
      ns[3 * ind[i + j] + z] = ns[3 * ind[i + j] + z] + normal[z];
    }
  } // Normalize the result.
  // The increment here is because each vertex occurs.


  for (let i = 0; i < vs.length; i += 3) {
    // With an offset of 3 in the array (due to x, y, z contiguous values)
    const nn = [];
    nn[x] = ns[i + x];
    nn[y] = ns[i + y];
    nn[z] = ns[i + z];
    let len = Math.sqrt(nn[x] * nn[x] + nn[y] * nn[y] + nn[z] * nn[z]);
    if (len === 0) len = 1.0;
    nn[x] = nn[x] / len;
    nn[y] = nn[y] / len;
    nn[z] = nn[z] / len;
    ns[i + x] = nn[x];
    ns[i + y] = nn[y];
    ns[i + z] = nn[z];
  }

  return ns;
}

const vertices = [0.0540595, 0.0, 0.497069, 0.0528782, 0.0112396, 0.497069, 0.0, 0.0, 0.5, 0.0493858, 0.021988, 0.497069, 0.0437351, 0.0317754, 0.497069, 0.0361729, 0.040174, 0.497069, 0.0270298, 0.0468169, 0.497069, 0.0167053, 0.0514137, 0.497069, 0.00565076, 0.0537634, 0.497069, -0.00565076, 0.0537634, 0.497069, -0.0167053, 0.0514136, 0.497069, -0.0270298, 0.0468169, 0.497069, -0.0361729, 0.040174, 0.497069, -0.0437351, 0.0317754, 0.497069, -0.0493858, 0.021988, 0.497069, -0.0528782, 0.0112396, 0.497069, -0.0540595, -4.72603e-09, 0.497069, -0.0528782, -0.0112396, 0.497069, -0.0493858, -0.021988, 0.497069, -0.0437351, -0.0317754, 0.497069, -0.0361729, -0.040174, 0.497069, -0.0270297, -0.0468169, 0.497069, -0.0167053, -0.0514137, 0.497069, -0.00565075, -0.0537634, 0.497069, 0.00565076, -0.0537634, 0.497069, 0.0167053, -0.0514136, 0.497069, 0.0270298, -0.0468169, 0.497069, 0.0361729, -0.040174, 0.497069, 0.0437351, -0.0317754, 0.497069, 0.0493858, -0.021988, 0.497069, 0.0528782, -0.0112396, 0.497069, 0.0540595, 0.0, -0.497069, 0.0, 0.0, -0.5, 0.0528781, 0.0112396, -0.497069, 0.0493858, 0.021988, -0.497069, 0.043735, 0.0317754, -0.497069, 0.0361728, 0.040174, -0.497069, 0.0270297, 0.0468169, -0.497069, 0.0167053, 0.0514136, -0.497069, 0.00565075, 0.0537633, -0.497069, -0.00565076, 0.0537633, -0.497069, -0.0167053, 0.0514136, -0.497069, -0.0270297, 0.0468169, -0.497069, -0.0361728, 0.040174, -0.497069, -0.043735, 0.0317754, -0.497069, -0.0493858, 0.021988, -0.497069, -0.0528781, 0.0112396, -0.497069, -0.0540595, -4.72603e-09, -0.497069, -0.0528781, -0.0112396, -0.497069, -0.0493858, -0.021988, -0.497069, -0.043735, -0.0317754, -0.497069, -0.0361728, -0.040174, -0.497069, -0.0270297, -0.0468169, -0.497069, -0.0167053, -0.0514136, -0.497069, -0.00565075, -0.0537633, -0.497069, 0.00565076, -0.0537633, -0.497069, 0.0167053, -0.0514136, -0.497069, 0.0270297, -0.0468169, -0.497069, 0.0361729, -0.040174, -0.497069, 0.043735, -0.0317754, -0.497069, 0.0493858, -0.021988, -0.497069, 0.0528781, -0.0112396, -0.497069, 0.107485, 0.0, 0.48831, 0.105136, 0.0223474, 0.48831, 0.159651, 0.0, 0.473827, 0.156162, 0.0331933, 0.473827, 0.209945, 0.0, 0.453788, 0.205357, 0.0436499, 0.453788, 0.257777, 0.0, 0.428429, 0.252144, 0.0535948, 0.428429, 0.302587, 0.0, 0.398047, 0.295975, 0.0629114, 0.398047, 0.34385, 0.0, 0.362998, 0.336336, 0.0714904, 0.362998, 0.381081, 0.0, 0.323693, 0.372754, 0.0792312, 0.323693, 0.413844, 0.0, 0.280594, 0.404801, 0.0860431, 0.280594, 0.441756, 0.0, 0.234204, 0.432103, 0.0918462, 0.234204, 0.464488, 0.0, 0.185069, 0.454338, 0.0965726, 0.185069, 0.481775, 0.0, 0.133764, 0.471247, 0.100167, 0.133764, 0.493413, 0.0, 0.080891, 0.482631, 0.102586, 0.080891, 0.499267, 0.0, 0.0270694, 0.488357, 0.103803, 0.0270694, 0.499267, 0.0, -0.0270695, 0.488357, 0.103803, -0.0270695, 0.493413, 0.0, -0.080891, 0.482631, 0.102586, -0.080891, 0.481775, 0.0, -0.133764, 0.471247, 0.100167, -0.133764, 0.464488, 0.0, -0.185069, 0.454338, 0.0965726, -0.185069, 0.441756, 0.0, -0.234204, 0.432103, 0.0918462, -0.234204, 0.413844, 0.0, -0.280594, 0.404801, 0.0860431, -0.280594, 0.381081, 0.0, -0.323693, 0.372753, 0.0792312, -0.323693, 0.34385, 0.0, -0.362998, 0.336336, 0.0714904, -0.362998, 0.302587, 0.0, -0.398047, 0.295975, 0.0629114, -0.398047, 0.257777, 0.0, -0.428429, 0.252144, 0.0535948, -0.428429, 0.209945, 0.0, -0.453788, 0.205357, 0.0436499, -0.453788, 0.159651, 0.0, -0.473827, 0.156162, 0.0331933, -0.473827, 0.107485, 0.0, -0.48831, 0.105136, 0.0223474, -0.48831, 0.0981926, 0.0437182, 0.48831, 0.145848, 0.0649358, 0.473827, 0.191794, 0.0853921, 0.453788, 0.235491, 0.104847, 0.428429, 0.276427, 0.123073, 0.398047, 0.314122, 0.139856, 0.362998, 0.348135, 0.155, 0.323693, 0.378066, 0.168326, 0.280594, 0.403564, 0.179678, 0.234204, 0.424331, 0.188924, 0.185069, 0.440123, 0.195956, 0.133764, 0.450755, 0.200689, 0.080891, 0.456103, 0.20307, 0.0270694, 0.456103, 0.20307, -0.0270695, 0.450755, 0.200689, -0.080891, 0.440123, 0.195956, -0.133764, 0.424331, 0.188924, -0.185069, 0.403564, 0.179678, -0.234204, 0.378066, 0.168326, -0.280594, 0.348135, 0.155, -0.323693, 0.314122, 0.139856, -0.362998, 0.276427, 0.123073, -0.398047, 0.235491, 0.104847, -0.428429, 0.191794, 0.0853921, -0.453788, 0.145848, 0.0649358, -0.473827, 0.0981926, 0.0437182, -0.48831, 0.0869574, 0.0631782, 0.48831, 0.12916, 0.0938404, 0.473827, 0.169849, 0.123402, 0.453788, 0.208546, 0.151517, 0.428429, 0.244798, 0.177856, 0.398047, 0.27818, 0.20211, 0.362998, 0.308301, 0.223994, 0.323693, 0.334807, 0.243252, 0.280594, 0.357388, 0.259658, 0.234204, 0.375779, 0.273019, 0.185069, 0.389764, 0.28318, 0.133764, 0.39918, 0.290021, 0.080891, 0.403915, 0.293462, 0.0270694, 0.403915, 0.293462, -0.0270695, 0.39918, 0.290021, -0.080891, 0.389764, 0.28318, -0.133764, 0.375779, 0.273019, -0.185069, 0.357388, 0.259658, -0.234204, 0.334807, 0.243252, -0.280594, 0.308301, 0.223994, -0.323693, 0.27818, 0.20211, -0.362998, 0.244798, 0.177856, -0.398047, 0.208546, 0.151517, -0.428429, 0.169849, 0.123402, -0.453788, 0.12916, 0.0938403, -0.473827, 0.0869573, 0.0631782, -0.48831, 0.0719217, 0.0798771, 0.48831, 0.106827, 0.118644, 0.473827, 0.14048, 0.156019, 0.453788, 0.172486, 0.191566, 0.428429, 0.20247, 0.224866, 0.398047, 0.23008, 0.25553, 0.362998, 0.254993, 0.283198, 0.323693, 0.276916, 0.307546, 0.280594, 0.295592, 0.328289, 0.234204, 0.310803, 0.345182, 0.185069, 0.32237, 0.358029, 0.133764, 0.330158, 0.366678, 0.080891, 0.334075, 0.371027, 0.0270694, 0.334075, 0.371027, -0.0270695, 0.330158, 0.366678, -0.080891, 0.32237, 0.358029, -0.133764, 0.310803, 0.345182, -0.185069, 0.295592, 0.328289, -0.234204, 0.276916, 0.307546, -0.280594, 0.254993, 0.283198, -0.323693, 0.23008, 0.25553, -0.362998, 0.20247, 0.224866, -0.398047, 0.172486, 0.191566, -0.428429, 0.14048, 0.156019, -0.453788, 0.106827, 0.118644, -0.473827, 0.0719216, 0.0798771, -0.48831, 0.0537426, 0.0930849, 0.48831, 0.0798254, 0.138262, 0.473827, 0.104972, 0.181817, 0.453788, 0.128888, 0.223241, 0.428429, 0.151294, 0.262048, 0.398047, 0.171925, 0.297783, 0.362998, 0.190541, 0.330026, 0.323693, 0.206922, 0.3584, 0.280594, 0.220878, 0.382572, 0.234204, 0.232244, 0.402259, 0.185069, 0.240887, 0.417229, 0.133764, 0.246707, 0.427308, 0.080891, 0.249633, 0.432378, 0.0270694, 0.249633, 0.432378, -0.0270695, 0.246707, 0.427308, -0.080891, 0.240887, 0.417229, -0.133764, 0.232244, 0.402259, -0.185069, 0.220878, 0.382572, -0.234204, 0.206922, 0.3584, -0.280594, 0.19054, 0.330026, -0.323693, 0.171925, 0.297783, -0.362998, 0.151294, 0.262048, -0.398047, 0.128888, 0.223241, -0.428429, 0.104972, 0.181817, -0.453788, 0.0798254, 0.138262, -0.473827, 0.0537426, 0.0930849, -0.48831, 0.0332148, 0.102225, 0.48831, 0.0493348, 0.151837, 0.473827, 0.0648764, 0.199669, 0.453788, 0.0796574, 0.24516, 0.428429, 0.0935045, 0.287777, 0.398047, 0.106255, 0.327021, 0.362998, 0.117761, 0.36243, 0.323693, 0.127885, 0.39359, 0.280594, 0.13651, 0.420135, 0.234204, 0.143535, 0.441755, 0.185069, 0.148877, 0.458195, 0.133764, 0.152473, 0.469264, 0.080891, 0.154282, 0.474831, 0.0270694, 0.154282, 0.474831, -0.0270695, 0.152473, 0.469264, -0.080891, 0.148877, 0.458195, -0.133764, 0.143535, 0.441755, -0.185069, 0.13651, 0.420135, -0.234204, 0.127885, 0.393589, -0.280594, 0.11776, 0.36243, -0.323693, 0.106255, 0.32702, -0.362998, 0.0935045, 0.287777, -0.398047, 0.0796574, 0.24516, -0.428429, 0.0648764, 0.199669, -0.453788, 0.0493348, 0.151837, -0.473827, 0.0332147, 0.102224, -0.48831, 0.0112353, 0.106896, 0.48831, 0.016688, 0.158776, 0.473827, 0.0219452, 0.208794, 0.453788, 0.026945, 0.256365, 0.428429, 0.031629, 0.30093, 0.398047, 0.0359421, 0.341966, 0.362998, 0.0398338, 0.378993, 0.323693, 0.0432585, 0.411577, 0.280594, 0.0461761, 0.439336, 0.234204, 0.0485522, 0.461944, 0.185069, 0.0503592, 0.479136, 0.133764, 0.0515757, 0.49071, 0.080891, 0.0521876, 0.496532, 0.0270694, 0.0521876, 0.496532, -0.0270695, 0.0515757, 0.49071, -0.080891, 0.0503592, 0.479136, -0.133764, 0.0485522, 0.461944, -0.185069, 0.0461761, 0.439336, -0.234204, 0.0432585, 0.411577, -0.280594, 0.0398338, 0.378993, -0.323693, 0.0359421, 0.341966, -0.362998, 0.031629, 0.300929, -0.398047, 0.026945, 0.256365, -0.428429, 0.0219452, 0.208794, -0.453788, 0.016688, 0.158776, -0.473827, 0.0112353, 0.106896, -0.48831, -0.0112353, 0.106896, 0.48831, -0.0166881, 0.158776, 0.473827, -0.0219452, 0.208794, 0.453788, -0.026945, 0.256365, 0.428429, -0.031629, 0.30093, 0.398047, -0.0359421, 0.341966, 0.362998, -0.0398338, 0.378993, 0.323693, -0.0432585, 0.411577, 0.280594, -0.0461761, 0.439336, 0.234204, -0.0485523, 0.461944, 0.185069, -0.0503592, 0.479136, 0.133764, -0.0515758, 0.49071, 0.080891, -0.0521876, 0.496532, 0.0270694, -0.0521876, 0.496532, -0.0270695, -0.0515758, 0.49071, -0.080891, -0.0503592, 0.479136, -0.133764, -0.0485523, 0.461944, -0.185069, -0.0461761, 0.439336, -0.234204, -0.0432585, 0.411577, -0.280594, -0.0398338, 0.378993, -0.323693, -0.0359421, 0.341966, -0.362998, -0.031629, 0.300929, -0.398047, -0.026945, 0.256365, -0.428429, -0.0219452, 0.208794, -0.453788, -0.0166881, 0.158776, -0.473827, -0.0112353, 0.106896, -0.48831, -0.0332148, 0.102225, 0.48831, -0.0493348, 0.151837, 0.473827, -0.0648764, 0.199669, 0.453788, -0.0796575, 0.24516, 0.428429, -0.0935046, 0.287777, 0.398047, -0.106255, 0.327021, 0.362998, -0.117761, 0.36243, 0.323693, -0.127885, 0.393589, 0.280594, -0.13651, 0.420135, 0.234204, -0.143535, 0.441755, 0.185069, -0.148877, 0.458195, 0.133764, -0.152473, 0.469264, 0.080891, -0.154282, 0.474831, 0.0270694, -0.154282, 0.474831, -0.0270695, -0.152473, 0.469264, -0.080891, -0.148877, 0.458195, -0.133764, -0.143535, 0.441755, -0.185069, -0.13651, 0.420135, -0.234204, -0.127885, 0.393589, -0.280594, -0.117761, 0.36243, -0.323693, -0.106255, 0.32702, -0.362998, -0.0935046, 0.287777, -0.398047, -0.0796575, 0.24516, -0.428429, -0.0648764, 0.199669, -0.453788, -0.0493348, 0.151837, -0.473827, -0.0332148, 0.102224, -0.48831, -0.0537426, 0.0930849, 0.48831, -0.0798254, 0.138262, 0.473827, -0.104972, 0.181817, 0.453788, -0.128888, 0.223241, 0.428429, -0.151294, 0.262048, 0.398047, -0.171925, 0.297783, 0.362998, -0.190541, 0.330026, 0.323693, -0.206922, 0.3584, 0.280594, -0.220878, 0.382572, 0.234204, -0.232244, 0.402259, 0.185069, -0.240888, 0.417229, 0.133764, -0.246707, 0.427308, 0.080891, -0.249633, 0.432378, 0.0270694, -0.249633, 0.432378, -0.0270695, -0.246707, 0.427308, -0.080891, -0.240888, 0.417229, -0.133764, -0.232244, 0.402259, -0.185069, -0.220878, 0.382572, -0.234204, -0.206922, 0.3584, -0.280594, -0.190541, 0.330026, -0.323693, -0.171925, 0.297783, -0.362998, -0.151294, 0.262048, -0.398047, -0.128888, 0.223241, -0.428429, -0.104972, 0.181817, -0.453788, -0.0798254, 0.138262, -0.473827, -0.0537426, 0.0930849, -0.48831, -0.0719217, 0.0798771, 0.48831, -0.106827, 0.118644, 0.473827, -0.14048, 0.156019, 0.453788, -0.172486, 0.191566, 0.428429, -0.20247, 0.224866, 0.398047, -0.23008, 0.25553, 0.362998, -0.254993, 0.283198, 0.323693, -0.276916, 0.307546, 0.280594, -0.295592, 0.328289, 0.234204, -0.310803, 0.345182, 0.185069, -0.32237, 0.358029, 0.133764, -0.330158, 0.366677, 0.080891, -0.334075, 0.371027, 0.0270694, -0.334075, 0.371027, -0.0270695, -0.330158, 0.366677, -0.080891, -0.32237, 0.358029, -0.133764, -0.310803, 0.345182, -0.185069, -0.295592, 0.328289, -0.234204, -0.276916, 0.307546, -0.280594, -0.254993, 0.283198, -0.323693, -0.23008, 0.25553, -0.362998, -0.20247, 0.224866, -0.398047, -0.172486, 0.191566, -0.428429, -0.14048, 0.156019, -0.453788, -0.106827, 0.118644, -0.473827, -0.0719216, 0.079877, -0.48831, -0.0869574, 0.0631782, 0.48831, -0.12916, 0.0938404, 0.473827, -0.169849, 0.123402, 0.453788, -0.208546, 0.151517, 0.428429, -0.244798, 0.177856, 0.398047, -0.27818, 0.20211, 0.362998, -0.308301, 0.223994, 0.323693, -0.334807, 0.243252, 0.280594, -0.357388, 0.259658, 0.234204, -0.375779, 0.273019, 0.185069, -0.389764, 0.28318, 0.133764, -0.39918, 0.290021, 0.080891, -0.403915, 0.293462, 0.0270694, -0.403915, 0.293462, -0.0270695, -0.39918, 0.290021, -0.080891, -0.389764, 0.28318, -0.133764, -0.375779, 0.273019, -0.185069, -0.357388, 0.259658, -0.234204, -0.334807, 0.243252, -0.280594, -0.308301, 0.223994, -0.323693, -0.27818, 0.20211, -0.362998, -0.244798, 0.177856, -0.398047, -0.208546, 0.151517, -0.428429, -0.169849, 0.123402, -0.453788, -0.12916, 0.0938403, -0.473827, -0.0869573, 0.0631782, -0.48831, -0.0981926, 0.0437182, 0.48831, -0.145848, 0.0649358, 0.473827, -0.191794, 0.0853921, 0.453788, -0.235491, 0.104847, 0.428429, -0.276427, 0.123073, 0.398047, -0.314122, 0.139856, 0.362998, -0.348135, 0.155, 0.323693, -0.378066, 0.168326, 0.280594, -0.403564, 0.179678, 0.234204, -0.424331, 0.188924, 0.185069, -0.440123, 0.195956, 0.133764, -0.450755, 0.200689, 0.080891, -0.456103, 0.20307, 0.0270694, -0.456103, 0.20307, -0.0270695, -0.450755, 0.200689, -0.080891, -0.440123, 0.195956, -0.133764, -0.424331, 0.188924, -0.185069, -0.403564, 0.179678, -0.234204, -0.378066, 0.168326, -0.280594, -0.348135, 0.155, -0.323693, -0.314122, 0.139856, -0.362998, -0.276427, 0.123073, -0.398047, -0.235491, 0.104847, -0.428429, -0.191794, 0.0853921, -0.453788, -0.145848, 0.0649358, -0.473827, -0.0981926, 0.0437182, -0.48831, -0.105136, 0.0223474, 0.48831, -0.156162, 0.0331932, 0.473827, -0.205357, 0.0436499, 0.453788, -0.252144, 0.0535948, 0.428429, -0.295975, 0.0629114, 0.398047, -0.336336, 0.0714904, 0.362998, -0.372754, 0.0792312, 0.323693, -0.404801, 0.0860431, 0.280594, -0.432103, 0.0918462, 0.234204, -0.454338, 0.0965725, 0.185069, -0.471247, 0.100167, 0.133764, -0.482631, 0.102586, 0.080891, -0.488357, 0.103803, 0.0270694, -0.488357, 0.103803, -0.0270695, -0.482631, 0.102586, -0.080891, -0.471247, 0.100167, -0.133764, -0.454338, 0.0965725, -0.185069, -0.432103, 0.0918462, -0.234204, -0.404801, 0.0860431, -0.280594, -0.372753, 0.0792312, -0.323693, -0.336336, 0.0714903, -0.362998, -0.295975, 0.0629114, -0.398047, -0.252144, 0.0535948, -0.428429, -0.205357, 0.0436499, -0.453788, -0.156162, 0.0331932, -0.473827, -0.105136, 0.0223474, -0.48831, -0.107485, -9.39666e-09, 0.48831, -0.159651, -1.39571e-08, 0.473827, -0.209945, -1.83539e-08, 0.453788, -0.257777, -2.25356e-08, 0.428429, -0.302587, -2.6453e-08, 0.398047, -0.34385, -3.00603e-08, 0.362998, -0.381081, -3.33152e-08, 0.323693, -0.413844, -3.61794e-08, 0.280594, -0.441756, -3.86195e-08, 0.234204, -0.464488, -4.06069e-08, 0.185069, -0.481775, -4.21181e-08, 0.133764, -0.493413, -4.31356e-08, 0.080891, -0.499267, -4.36473e-08, 0.0270694, -0.499267, -4.36473e-08, -0.0270695, -0.493413, -4.31356e-08, -0.080891, -0.481775, -4.21181e-08, -0.133764, -0.464488, -4.06069e-08, -0.185069, -0.441756, -3.86195e-08, -0.234204, -0.413844, -3.61794e-08, -0.280594, -0.381081, -3.33152e-08, -0.323693, -0.34385, -3.00603e-08, -0.362998, -0.302587, -2.6453e-08, -0.398047, -0.257777, -2.25356e-08, -0.428429, -0.209945, -1.83539e-08, -0.453788, -0.159651, -1.39571e-08, -0.473827, -0.107485, -9.39665e-09, -0.48831, -0.105136, -0.0223474, 0.48831, -0.156162, -0.0331933, 0.473827, -0.205357, -0.0436499, 0.453788, -0.252144, -0.0535949, 0.428429, -0.295975, -0.0629114, 0.398047, -0.336336, -0.0714904, 0.362998, -0.372754, -0.0792312, 0.323693, -0.404801, -0.0860431, 0.280594, -0.432103, -0.0918463, 0.234204, -0.454338, -0.0965726, 0.185069, -0.471247, -0.100167, 0.133764, -0.482631, -0.102586, 0.080891, -0.488357, -0.103803, 0.0270694, -0.488357, -0.103803, -0.0270695, -0.482631, -0.102586, -0.080891, -0.471247, -0.100167, -0.133764, -0.454338, -0.0965726, -0.185069, -0.432103, -0.0918463, -0.234204, -0.404801, -0.0860431, -0.280594, -0.372753, -0.0792312, -0.323693, -0.336336, -0.0714904, -0.362998, -0.295975, -0.0629114, -0.398047, -0.252144, -0.0535949, -0.428429, -0.205357, -0.0436499, -0.453788, -0.156162, -0.0331933, -0.473827, -0.105136, -0.0223474, -0.48831, -0.0981926, -0.0437182, 0.48831, -0.145848, -0.0649358, 0.473827, -0.191794, -0.0853922, 0.453788, -0.235491, -0.104847, 0.428429, -0.276427, -0.123073, 0.398047, -0.314122, -0.139856, 0.362998, -0.348135, -0.155, 0.323693, -0.378066, -0.168326, 0.280594, -0.403564, -0.179678, 0.234204, -0.424331, -0.188924, 0.185069, -0.440123, -0.195956, 0.133764, -0.450755, -0.200689, 0.080891, -0.456103, -0.20307, 0.0270694, -0.456103, -0.20307, -0.0270695, -0.450755, -0.200689, -0.080891, -0.440123, -0.195956, -0.133764, -0.424331, -0.188924, -0.185069, -0.403564, -0.179678, -0.234204, -0.378066, -0.168326, -0.280594, -0.348135, -0.155, -0.323693, -0.314122, -0.139856, -0.362998, -0.276427, -0.123073, -0.398047, -0.235491, -0.104847, -0.428429, -0.191794, -0.0853921, -0.453788, -0.145848, -0.0649358, -0.473827, -0.0981926, -0.0437182, -0.48831, -0.0869574, -0.0631782, 0.48831, -0.12916, -0.0938404, 0.473827, -0.169849, -0.123402, 0.453788, -0.208546, -0.151517, 0.428429, -0.244798, -0.177856, 0.398047, -0.27818, -0.20211, 0.362998, -0.308301, -0.223994, 0.323693, -0.334807, -0.243252, 0.280594, -0.357388, -0.259658, 0.234204, -0.375779, -0.273019, 0.185069, -0.389764, -0.28318, 0.133764, -0.39918, -0.290021, 0.080891, -0.403915, -0.293462, 0.0270694, -0.403915, -0.293462, -0.0270695, -0.39918, -0.290021, -0.080891, -0.389764, -0.28318, -0.133764, -0.375779, -0.273019, -0.185069, -0.357388, -0.259658, -0.234204, -0.334807, -0.243252, -0.280594, -0.308301, -0.223994, -0.323693, -0.27818, -0.20211, -0.362998, -0.244798, -0.177856, -0.398047, -0.208546, -0.151517, -0.428429, -0.169849, -0.123402, -0.453788, -0.12916, -0.0938404, -0.473827, -0.0869573, -0.0631782, -0.48831, -0.0719216, -0.0798771, 0.48831, -0.106827, -0.118644, 0.473827, -0.14048, -0.156019, 0.453788, -0.172486, -0.191566, 0.428429, -0.20247, -0.224866, 0.398047, -0.23008, -0.25553, 0.362998, -0.254993, -0.283198, 0.323693, -0.276916, -0.307546, 0.280594, -0.295592, -0.328289, 0.234204, -0.310803, -0.345182, 0.185069, -0.32237, -0.358029, 0.133764, -0.330158, -0.366678, 0.080891, -0.334075, -0.371027, 0.0270694, -0.334075, -0.371027, -0.0270695, -0.330158, -0.366678, -0.080891, -0.32237, -0.358029, -0.133764, -0.310803, -0.345182, -0.185069, -0.295592, -0.328289, -0.234204, -0.276916, -0.307546, -0.280594, -0.254993, -0.283198, -0.323693, -0.23008, -0.25553, -0.362998, -0.20247, -0.224866, -0.398047, -0.172486, -0.191566, -0.428429, -0.14048, -0.156019, -0.453788, -0.106827, -0.118644, -0.473827, -0.0719216, -0.0798771, -0.48831, -0.0537426, -0.0930849, 0.48831, -0.0798254, -0.138262, 0.473827, -0.104972, -0.181817, 0.453788, -0.128888, -0.223241, 0.428429, -0.151294, -0.262048, 0.398047, -0.171925, -0.297783, 0.362998, -0.19054, -0.330026, 0.323693, -0.206922, -0.3584, 0.280594, -0.220878, -0.382572, 0.234204, -0.232244, -0.402259, 0.185069, -0.240887, -0.417229, 0.133764, -0.246707, -0.427308, 0.080891, -0.249633, -0.432378, 0.0270694, -0.249633, -0.432378, -0.0270695, -0.246707, -0.427308, -0.080891, -0.240887, -0.417229, -0.133764, -0.232244, -0.402259, -0.185069, -0.220878, -0.382572, -0.234204, -0.206922, -0.3584, -0.280594, -0.19054, -0.330026, -0.323693, -0.171925, -0.297783, -0.362998, -0.151294, -0.262048, -0.398047, -0.128888, -0.223241, -0.428429, -0.104972, -0.181817, -0.453788, -0.0798253, -0.138262, -0.473827, -0.0537426, -0.0930849, -0.48831, -0.0332147, -0.102225, 0.48831, -0.0493348, -0.151837, 0.473827, -0.0648764, -0.199669, 0.453788, -0.0796574, -0.24516, 0.428429, -0.0935045, -0.287777, 0.398047, -0.106255, -0.327021, 0.362998, -0.11776, -0.36243, 0.323693, -0.127885, -0.39359, 0.280594, -0.13651, -0.420135, 0.234204, -0.143535, -0.441755, 0.185069, -0.148877, -0.458195, 0.133764, -0.152473, -0.469264, 0.080891, -0.154282, -0.474831, 0.0270694, -0.154282, -0.474831, -0.0270695, -0.152473, -0.469264, -0.080891, -0.148877, -0.458195, -0.133764, -0.143535, -0.441755, -0.185069, -0.13651, -0.420135, -0.234204, -0.127885, -0.393589, -0.280594, -0.11776, -0.36243, -0.323693, -0.106255, -0.327021, -0.362998, -0.0935045, -0.287777, -0.398047, -0.0796574, -0.24516, -0.428429, -0.0648764, -0.199669, -0.453788, -0.0493348, -0.151837, -0.473827, -0.0332147, -0.102224, -0.48831, -0.0112353, -0.106896, 0.48831, -0.016688, -0.158776, 0.473827, -0.0219452, -0.208794, 0.453788, -0.026945, -0.256365, 0.428429, -0.0316289, -0.30093, 0.398047, -0.035942, -0.341966, 0.362998, -0.0398338, -0.378993, 0.323693, -0.0432585, -0.411577, 0.280594, -0.046176, -0.439336, 0.234204, -0.0485522, -0.461944, 0.185069, -0.0503591, -0.479136, 0.133764, -0.0515757, -0.49071, 0.080891, -0.0521875, -0.496532, 0.0270694, -0.0521875, -0.496532, -0.0270695, -0.0515757, -0.49071, -0.080891, -0.0503591, -0.479136, -0.133764, -0.0485522, -0.461944, -0.185069, -0.046176, -0.439336, -0.234204, -0.0432585, -0.411577, -0.280594, -0.0398338, -0.378993, -0.323693, -0.035942, -0.341966, -0.362998, -0.0316289, -0.300929, -0.398047, -0.026945, -0.256365, -0.428429, -0.0219452, -0.208794, -0.453788, -0.016688, -0.158776, -0.473827, -0.0112352, -0.106896, -0.48831, 0.0112353, -0.106896, 0.48831, 0.0166881, -0.158776, 0.473827, 0.0219452, -0.208794, 0.453788, 0.0269451, -0.256365, 0.428429, 0.031629, -0.30093, 0.398047, 0.0359421, -0.341966, 0.362998, 0.0398339, -0.378993, 0.323693, 0.0432586, -0.411577, 0.280594, 0.0461761, -0.439336, 0.234204, 0.0485523, -0.461944, 0.185069, 0.0503593, -0.479136, 0.133764, 0.0515758, -0.49071, 0.080891, 0.0521876, -0.496532, 0.0270694, 0.0521876, -0.496532, -0.0270695, 0.0515758, -0.49071, -0.080891, 0.0503593, -0.479136, -0.133764, 0.0485523, -0.461944, -0.185069, 0.0461761, -0.439336, -0.234204, 0.0432586, -0.411577, -0.280594, 0.0398339, -0.378993, -0.323693, 0.0359421, -0.341966, -0.362998, 0.031629, -0.300929, -0.398047, 0.0269451, -0.256365, -0.428429, 0.0219452, -0.208794, -0.453788, 0.0166881, -0.158776, -0.473827, 0.0112353, -0.106896, -0.48831, 0.0332148, -0.102225, 0.48831, 0.0493348, -0.151837, 0.473827, 0.0648765, -0.199669, 0.453788, 0.0796575, -0.24516, 0.428429, 0.0935046, -0.287777, 0.398047, 0.106255, -0.327021, 0.362998, 0.117761, -0.36243, 0.323693, 0.127885, -0.393589, 0.280594, 0.13651, -0.420135, 0.234204, 0.143535, -0.441755, 0.185069, 0.148877, -0.458195, 0.133764, 0.152473, -0.469264, 0.080891, 0.154282, -0.474831, 0.0270694, 0.154282, -0.474831, -0.0270695, 0.152473, -0.469264, -0.080891, 0.148877, -0.458195, -0.133764, 0.143535, -0.441755, -0.185069, 0.13651, -0.420135, -0.234204, 0.127885, -0.393589, -0.280594, 0.117761, -0.36243, -0.323693, 0.106255, -0.32702, -0.362998, 0.0935046, -0.287777, -0.398047, 0.0796575, -0.24516, -0.428429, 0.0648765, -0.199669, -0.453788, 0.0493348, -0.151837, -0.473827, 0.0332148, -0.102224, -0.48831, 0.0537426, -0.0930849, 0.48831, 0.0798254, -0.138262, 0.473827, 0.104972, -0.181817, 0.453788, 0.128889, -0.223241, 0.428429, 0.151294, -0.262048, 0.398047, 0.171925, -0.297783, 0.362998, 0.190541, -0.330026, 0.323693, 0.206922, -0.3584, 0.280594, 0.220878, -0.382572, 0.234204, 0.232244, -0.402259, 0.185069, 0.240888, -0.417229, 0.133764, 0.246707, -0.427308, 0.080891, 0.249633, -0.432378, 0.0270694, 0.249633, -0.432378, -0.0270695, 0.246707, -0.427308, -0.080891, 0.240888, -0.417229, -0.133764, 0.232244, -0.402259, -0.185069, 0.220878, -0.382572, -0.234204, 0.206922, -0.3584, -0.280594, 0.190541, -0.330026, -0.323693, 0.171925, -0.297783, -0.362998, 0.151294, -0.262048, -0.398047, 0.128888, -0.223241, -0.428429, 0.104972, -0.181817, -0.453788, 0.0798254, -0.138262, -0.473827, 0.0537426, -0.0930849, -0.48831, 0.0719217, -0.0798771, 0.48831, 0.106827, -0.118644, 0.473827, 0.14048, -0.156019, 0.453788, 0.172486, -0.191566, 0.428429, 0.20247, -0.224866, 0.398047, 0.23008, -0.25553, 0.362998, 0.254993, -0.283198, 0.323693, 0.276916, -0.307546, 0.280594, 0.295593, -0.328289, 0.234204, 0.310803, -0.345182, 0.185069, 0.32237, -0.358029, 0.133764, 0.330158, -0.366677, 0.080891, 0.334075, -0.371027, 0.0270694, 0.334075, -0.371027, -0.0270695, 0.330158, -0.366677, -0.080891, 0.32237, -0.358029, -0.133764, 0.310803, -0.345182, -0.185069, 0.295593, -0.328289, -0.234204, 0.276916, -0.307546, -0.280594, 0.254993, -0.283198, -0.323693, 0.23008, -0.25553, -0.362998, 0.20247, -0.224866, -0.398047, 0.172486, -0.191566, -0.428429, 0.14048, -0.156019, -0.453788, 0.106827, -0.118644, -0.473827, 0.0719216, -0.079877, -0.48831, 0.0869574, -0.0631782, 0.48831, 0.12916, -0.0938403, 0.473827, 0.169849, -0.123402, 0.453788, 0.208546, -0.151517, 0.428429, 0.244798, -0.177856, 0.398047, 0.27818, -0.20211, 0.362998, 0.308301, -0.223994, 0.323693, 0.334807, -0.243252, 0.280594, 0.357388, -0.259658, 0.234204, 0.375779, -0.273019, 0.185069, 0.389764, -0.28318, 0.133764, 0.39918, -0.290021, 0.080891, 0.403915, -0.293462, 0.0270694, 0.403915, -0.293462, -0.0270695, 0.39918, -0.290021, -0.080891, 0.389764, -0.28318, -0.133764, 0.375779, -0.273019, -0.185069, 0.357388, -0.259658, -0.234204, 0.334807, -0.243252, -0.280594, 0.308301, -0.223994, -0.323693, 0.27818, -0.20211, -0.362998, 0.244798, -0.177856, -0.398047, 0.208546, -0.151517, -0.428429, 0.169849, -0.123402, -0.453788, 0.12916, -0.0938403, -0.473827, 0.0869574, -0.0631782, -0.48831, 0.0981926, -0.0437182, 0.48831, 0.145848, -0.0649358, 0.473827, 0.191794, -0.0853921, 0.453788, 0.235491, -0.104847, 0.428429, 0.276427, -0.123073, 0.398047, 0.314122, -0.139856, 0.362998, 0.348135, -0.155, 0.323693, 0.378066, -0.168326, 0.280594, 0.403564, -0.179678, 0.234204, 0.424331, -0.188924, 0.185069, 0.440123, -0.195955, 0.133764, 0.450755, -0.200689, 0.080891, 0.456103, -0.20307, 0.0270694, 0.456103, -0.20307, -0.0270695, 0.450755, -0.200689, -0.080891, 0.440123, -0.195955, -0.133764, 0.424331, -0.188924, -0.185069, 0.403564, -0.179678, -0.234204, 0.378066, -0.168326, -0.280594, 0.348135, -0.155, -0.323693, 0.314122, -0.139856, -0.362998, 0.276427, -0.123073, -0.398047, 0.235491, -0.104847, -0.428429, 0.191794, -0.0853921, -0.453788, 0.145848, -0.0649358, -0.473827, 0.0981926, -0.0437181, -0.48831, 0.105136, -0.0223474, 0.48831, 0.156162, -0.0331932, 0.473827, 0.205357, -0.0436499, 0.453788, 0.252144, -0.0535948, 0.428429, 0.295975, -0.0629113, 0.398047, 0.336336, -0.0714903, 0.362998, 0.372754, -0.0792311, 0.323693, 0.404801, -0.086043, 0.280594, 0.432103, -0.0918462, 0.234204, 0.454338, -0.0965725, 0.185069, 0.471247, -0.100167, 0.133764, 0.482631, -0.102586, 0.080891, 0.488357, -0.103803, 0.0270694, 0.488357, -0.103803, -0.0270695, 0.482631, -0.102586, -0.080891, 0.471247, -0.100167, -0.133764, 0.454338, -0.0965725, -0.185069, 0.432103, -0.0918462, -0.234204, 0.404801, -0.086043, -0.280594, 0.372754, -0.0792311, -0.323693, 0.336336, -0.0714903, -0.362998, 0.295975, -0.0629113, -0.398047, 0.252144, -0.0535948, -0.428429, 0.205357, -0.0436499, -0.453788, 0.156162, -0.0331932, -0.473827, 0.105136, -0.0223474, -0.48831];
const indices = [0, 1, 2, 1, 3, 2, 3, 4, 2, 4, 5, 2, 5, 6, 2, 6, 7, 2, 7, 8, 2, 8, 9, 2, 9, 10, 2, 10, 11, 2, 11, 12, 2, 12, 13, 2, 13, 14, 2, 14, 15, 2, 15, 16, 2, 16, 17, 2, 17, 18, 2, 18, 19, 2, 19, 20, 2, 20, 21, 2, 21, 22, 2, 22, 23, 2, 23, 24, 2, 24, 25, 2, 25, 26, 2, 26, 27, 2, 27, 28, 2, 28, 29, 2, 29, 30, 2, 30, 0, 2, 31, 32, 33, 33, 32, 34, 34, 32, 35, 35, 32, 36, 36, 32, 37, 37, 32, 38, 38, 32, 39, 39, 32, 40, 40, 32, 41, 41, 32, 42, 42, 32, 43, 43, 32, 44, 44, 32, 45, 45, 32, 46, 46, 32, 47, 47, 32, 48, 48, 32, 49, 49, 32, 50, 50, 32, 51, 51, 32, 52, 52, 32, 53, 53, 32, 54, 54, 32, 55, 55, 32, 56, 56, 32, 57, 57, 32, 58, 58, 32, 59, 59, 32, 60, 60, 32, 61, 61, 32, 31, 0, 62, 63, 0, 63, 1, 62, 64, 65, 62, 65, 63, 64, 66, 67, 64, 67, 65, 66, 68, 69, 66, 69, 67, 68, 70, 71, 68, 71, 69, 70, 72, 73, 70, 73, 71, 72, 74, 75, 72, 75, 73, 74, 76, 77, 74, 77, 75, 76, 78, 79, 76, 79, 77, 78, 80, 81, 78, 81, 79, 80, 82, 83, 80, 83, 81, 82, 84, 85, 82, 85, 83, 84, 86, 87, 84, 87, 85, 86, 88, 89, 86, 89, 87, 88, 90, 91, 88, 91, 89, 90, 92, 93, 90, 93, 91, 92, 94, 95, 92, 95, 93, 94, 96, 97, 94, 97, 95, 96, 98, 99, 96, 99, 97, 98, 100, 101, 98, 101, 99, 100, 102, 103, 100, 103, 101, 102, 104, 105, 102, 105, 103, 104, 106, 107, 104, 107, 105, 106, 108, 109, 106, 109, 107, 108, 110, 111, 108, 111, 109, 110, 112, 113, 110, 113, 111, 112, 31, 33, 112, 33, 113, 1, 63, 114, 1, 114, 3, 63, 65, 115, 63, 115, 114, 65, 67, 116, 65, 116, 115, 67, 69, 117, 67, 117, 116, 69, 71, 118, 69, 118, 117, 71, 73, 119, 71, 119, 118, 73, 75, 120, 73, 120, 119, 75, 77, 121, 75, 121, 120, 77, 79, 122, 77, 122, 121, 79, 81, 123, 79, 123, 122, 81, 83, 124, 81, 124, 123, 83, 85, 125, 83, 125, 124, 85, 87, 126, 85, 126, 125, 87, 89, 127, 87, 127, 126, 89, 91, 128, 89, 128, 127, 91, 93, 129, 91, 129, 128, 93, 95, 130, 93, 130, 129, 95, 97, 131, 95, 131, 130, 97, 99, 132, 97, 132, 131, 99, 101, 133, 99, 133, 132, 101, 103, 134, 101, 134, 133, 103, 105, 135, 103, 135, 134, 105, 107, 136, 105, 136, 135, 107, 109, 137, 107, 137, 136, 109, 111, 138, 109, 138, 137, 111, 113, 139, 111, 139, 138, 113, 33, 34, 113, 34, 139, 3, 114, 140, 3, 140, 4, 114, 115, 141, 114, 141, 140, 115, 116, 142, 115, 142, 141, 116, 117, 143, 116, 143, 142, 117, 118, 144, 117, 144, 143, 118, 119, 145, 118, 145, 144, 119, 120, 146, 119, 146, 145, 120, 121, 147, 120, 147, 146, 121, 122, 148, 121, 148, 147, 122, 123, 149, 122, 149, 148, 123, 124, 150, 123, 150, 149, 124, 125, 151, 124, 151, 150, 125, 126, 152, 125, 152, 151, 126, 127, 153, 126, 153, 152, 127, 128, 154, 127, 154, 153, 128, 129, 155, 128, 155, 154, 129, 130, 156, 129, 156, 155, 130, 131, 157, 130, 157, 156, 131, 132, 158, 131, 158, 157, 132, 133, 159, 132, 159, 158, 133, 134, 160, 133, 160, 159, 134, 135, 161, 134, 161, 160, 135, 136, 162, 135, 162, 161, 136, 137, 163, 136, 163, 162, 137, 138, 164, 137, 164, 163, 138, 139, 165, 138, 165, 164, 139, 34, 35, 139, 35, 165, 4, 140, 166, 4, 166, 5, 140, 141, 167, 140, 167, 166, 141, 142, 168, 141, 168, 167, 142, 143, 169, 142, 169, 168, 143, 144, 170, 143, 170, 169, 144, 145, 171, 144, 171, 170, 145, 146, 172, 145, 172, 171, 146, 147, 173, 146, 173, 172, 147, 148, 174, 147, 174, 173, 148, 149, 175, 148, 175, 174, 149, 150, 176, 149, 176, 175, 150, 151, 177, 150, 177, 176, 151, 152, 178, 151, 178, 177, 152, 153, 179, 152, 179, 178, 153, 154, 180, 153, 180, 179, 154, 155, 181, 154, 181, 180, 155, 156, 182, 155, 182, 181, 156, 157, 183, 156, 183, 182, 157, 158, 184, 157, 184, 183, 158, 159, 185, 158, 185, 184, 159, 160, 186, 159, 186, 185, 160, 161, 187, 160, 187, 186, 161, 162, 188, 161, 188, 187, 162, 163, 189, 162, 189, 188, 163, 164, 190, 163, 190, 189, 164, 165, 191, 164, 191, 190, 165, 35, 36, 165, 36, 191, 5, 166, 192, 5, 192, 6, 166, 167, 193, 166, 193, 192, 167, 168, 194, 167, 194, 193, 168, 169, 195, 168, 195, 194, 169, 170, 196, 169, 196, 195, 170, 171, 197, 170, 197, 196, 171, 172, 198, 171, 198, 197, 172, 173, 199, 172, 199, 198, 173, 174, 200, 173, 200, 199, 174, 175, 201, 174, 201, 200, 175, 176, 202, 175, 202, 201, 176, 177, 203, 176, 203, 202, 177, 178, 204, 177, 204, 203, 178, 179, 205, 178, 205, 204, 179, 180, 206, 179, 206, 205, 180, 181, 207, 180, 207, 206, 181, 182, 208, 181, 208, 207, 182, 183, 209, 182, 209, 208, 183, 184, 210, 183, 210, 209, 184, 185, 211, 184, 211, 210, 185, 186, 212, 185, 212, 211, 186, 187, 213, 186, 213, 212, 187, 188, 214, 187, 214, 213, 188, 189, 215, 188, 215, 214, 189, 190, 216, 189, 216, 215, 190, 191, 217, 190, 217, 216, 191, 36, 37, 191, 37, 217, 6, 192, 218, 6, 218, 7, 192, 193, 219, 192, 219, 218, 193, 194, 220, 193, 220, 219, 194, 195, 221, 194, 221, 220, 195, 196, 222, 195, 222, 221, 196, 197, 223, 196, 223, 222, 197, 198, 224, 197, 224, 223, 198, 199, 225, 198, 225, 224, 199, 200, 226, 199, 226, 225, 200, 201, 227, 200, 227, 226, 201, 202, 228, 201, 228, 227, 202, 203, 229, 202, 229, 228, 203, 204, 230, 203, 230, 229, 204, 205, 231, 204, 231, 230, 205, 206, 232, 205, 232, 231, 206, 207, 233, 206, 233, 232, 207, 208, 234, 207, 234, 233, 208, 209, 235, 208, 235, 234, 209, 210, 236, 209, 236, 235, 210, 211, 237, 210, 237, 236, 211, 212, 238, 211, 238, 237, 212, 213, 239, 212, 239, 238, 213, 214, 240, 213, 240, 239, 214, 215, 241, 214, 241, 240, 215, 216, 242, 215, 242, 241, 216, 217, 243, 216, 243, 242, 217, 37, 38, 217, 38, 243, 7, 218, 244, 7, 244, 8, 218, 219, 245, 218, 245, 244, 219, 220, 246, 219, 246, 245, 220, 221, 247, 220, 247, 246, 221, 222, 248, 221, 248, 247, 222, 223, 249, 222, 249, 248, 223, 224, 250, 223, 250, 249, 224, 225, 251, 224, 251, 250, 225, 226, 252, 225, 252, 251, 226, 227, 253, 226, 253, 252, 227, 228, 254, 227, 254, 253, 228, 229, 255, 228, 255, 254, 229, 230, 256, 229, 256, 255, 230, 231, 257, 230, 257, 256, 231, 232, 258, 231, 258, 257, 232, 233, 259, 232, 259, 258, 233, 234, 260, 233, 260, 259, 234, 235, 261, 234, 261, 260, 235, 236, 262, 235, 262, 261, 236, 237, 263, 236, 263, 262, 237, 238, 264, 237, 264, 263, 238, 239, 265, 238, 265, 264, 239, 240, 266, 239, 266, 265, 240, 241, 267, 240, 267, 266, 241, 242, 268, 241, 268, 267, 242, 243, 269, 242, 269, 268, 243, 38, 39, 243, 39, 269, 8, 244, 270, 8, 270, 9, 244, 245, 271, 244, 271, 270, 245, 246, 272, 245, 272, 271, 246, 247, 273, 246, 273, 272, 247, 248, 274, 247, 274, 273, 248, 249, 275, 248, 275, 274, 249, 250, 276, 249, 276, 275, 250, 251, 277, 250, 277, 276, 251, 252, 278, 251, 278, 277, 252, 253, 279, 252, 279, 278, 253, 254, 280, 253, 280, 279, 254, 255, 281, 254, 281, 280, 255, 256, 282, 255, 282, 281, 256, 257, 283, 256, 283, 282, 257, 258, 284, 257, 284, 283, 258, 259, 285, 258, 285, 284, 259, 260, 286, 259, 286, 285, 260, 261, 287, 260, 287, 286, 261, 262, 288, 261, 288, 287, 262, 263, 289, 262, 289, 288, 263, 264, 290, 263, 290, 289, 264, 265, 291, 264, 291, 290, 265, 266, 292, 265, 292, 291, 266, 267, 293, 266, 293, 292, 267, 268, 294, 267, 294, 293, 268, 269, 295, 268, 295, 294, 269, 39, 40, 269, 40, 295, 9, 270, 296, 9, 296, 10, 270, 271, 297, 270, 297, 296, 271, 272, 298, 271, 298, 297, 272, 273, 299, 272, 299, 298, 273, 274, 300, 273, 300, 299, 274, 275, 301, 274, 301, 300, 275, 276, 302, 275, 302, 301, 276, 277, 303, 276, 303, 302, 277, 278, 304, 277, 304, 303, 278, 279, 305, 278, 305, 304, 279, 280, 306, 279, 306, 305, 280, 281, 307, 280, 307, 306, 281, 282, 308, 281, 308, 307, 282, 283, 309, 282, 309, 308, 283, 284, 310, 283, 310, 309, 284, 285, 311, 284, 311, 310, 285, 286, 312, 285, 312, 311, 286, 287, 313, 286, 313, 312, 287, 288, 314, 287, 314, 313, 288, 289, 315, 288, 315, 314, 289, 290, 316, 289, 316, 315, 290, 291, 317, 290, 317, 316, 291, 292, 318, 291, 318, 317, 292, 293, 319, 292, 319, 318, 293, 294, 320, 293, 320, 319, 294, 295, 321, 294, 321, 320, 295, 40, 41, 295, 41, 321, 10, 296, 322, 10, 322, 11, 296, 297, 323, 296, 323, 322, 297, 298, 324, 297, 324, 323, 298, 299, 325, 298, 325, 324, 299, 300, 326, 299, 326, 325, 300, 301, 327, 300, 327, 326, 301, 302, 328, 301, 328, 327, 302, 303, 329, 302, 329, 328, 303, 304, 330, 303, 330, 329, 304, 305, 331, 304, 331, 330, 305, 306, 332, 305, 332, 331, 306, 307, 333, 306, 333, 332, 307, 308, 334, 307, 334, 333, 308, 309, 335, 308, 335, 334, 309, 310, 336, 309, 336, 335, 310, 311, 337, 310, 337, 336, 311, 312, 338, 311, 338, 337, 312, 313, 339, 312, 339, 338, 313, 314, 340, 313, 340, 339, 314, 315, 341, 314, 341, 340, 315, 316, 342, 315, 342, 341, 316, 317, 343, 316, 343, 342, 317, 318, 344, 317, 344, 343, 318, 319, 345, 318, 345, 344, 319, 320, 346, 319, 346, 345, 320, 321, 347, 320, 347, 346, 321, 41, 42, 321, 42, 347, 11, 322, 348, 11, 348, 12, 322, 323, 349, 322, 349, 348, 323, 324, 350, 323, 350, 349, 324, 325, 351, 324, 351, 350, 325, 326, 352, 325, 352, 351, 326, 327, 353, 326, 353, 352, 327, 328, 354, 327, 354, 353, 328, 329, 355, 328, 355, 354, 329, 330, 356, 329, 356, 355, 330, 331, 357, 330, 357, 356, 331, 332, 358, 331, 358, 357, 332, 333, 359, 332, 359, 358, 333, 334, 360, 333, 360, 359, 334, 335, 361, 334, 361, 360, 335, 336, 362, 335, 362, 361, 336, 337, 363, 336, 363, 362, 337, 338, 364, 337, 364, 363, 338, 339, 365, 338, 365, 364, 339, 340, 366, 339, 366, 365, 340, 341, 367, 340, 367, 366, 341, 342, 368, 341, 368, 367, 342, 343, 369, 342, 369, 368, 343, 344, 370, 343, 370, 369, 344, 345, 371, 344, 371, 370, 345, 346, 372, 345, 372, 371, 346, 347, 373, 346, 373, 372, 347, 42, 43, 347, 43, 373, 12, 348, 374, 12, 374, 13, 348, 349, 375, 348, 375, 374, 349, 350, 376, 349, 376, 375, 350, 351, 377, 350, 377, 376, 351, 352, 378, 351, 378, 377, 352, 353, 379, 352, 379, 378, 353, 354, 380, 353, 380, 379, 354, 355, 381, 354, 381, 380, 355, 356, 382, 355, 382, 381, 356, 357, 383, 356, 383, 382, 357, 358, 384, 357, 384, 383, 358, 359, 385, 358, 385, 384, 359, 360, 386, 359, 386, 385, 360, 361, 387, 360, 387, 386, 361, 362, 388, 361, 388, 387, 362, 363, 389, 362, 389, 388, 363, 364, 390, 363, 390, 389, 364, 365, 391, 364, 391, 390, 365, 366, 392, 365, 392, 391, 366, 367, 393, 366, 393, 392, 367, 368, 394, 367, 394, 393, 368, 369, 395, 368, 395, 394, 369, 370, 396, 369, 396, 395, 370, 371, 397, 370, 397, 396, 371, 372, 398, 371, 398, 397, 372, 373, 399, 372, 399, 398, 373, 43, 44, 373, 44, 399, 13, 374, 400, 13, 400, 14, 374, 375, 401, 374, 401, 400, 375, 376, 402, 375, 402, 401, 376, 377, 403, 376, 403, 402, 377, 378, 404, 377, 404, 403, 378, 379, 405, 378, 405, 404, 379, 380, 406, 379, 406, 405, 380, 381, 407, 380, 407, 406, 381, 382, 408, 381, 408, 407, 382, 383, 409, 382, 409, 408, 383, 384, 410, 383, 410, 409, 384, 385, 411, 384, 411, 410, 385, 386, 412, 385, 412, 411, 386, 387, 413, 386, 413, 412, 387, 388, 414, 387, 414, 413, 388, 389, 415, 388, 415, 414, 389, 390, 416, 389, 416, 415, 390, 391, 417, 390, 417, 416, 391, 392, 418, 391, 418, 417, 392, 393, 419, 392, 419, 418, 393, 394, 420, 393, 420, 419, 394, 395, 421, 394, 421, 420, 395, 396, 422, 395, 422, 421, 396, 397, 423, 396, 423, 422, 397, 398, 424, 397, 424, 423, 398, 399, 425, 398, 425, 424, 399, 44, 45, 399, 45, 425, 14, 400, 426, 14, 426, 15, 400, 401, 427, 400, 427, 426, 401, 402, 428, 401, 428, 427, 402, 403, 429, 402, 429, 428, 403, 404, 430, 403, 430, 429, 404, 405, 431, 404, 431, 430, 405, 406, 432, 405, 432, 431, 406, 407, 433, 406, 433, 432, 407, 408, 434, 407, 434, 433, 408, 409, 435, 408, 435, 434, 409, 410, 436, 409, 436, 435, 410, 411, 437, 410, 437, 436, 411, 412, 438, 411, 438, 437, 412, 413, 439, 412, 439, 438, 413, 414, 440, 413, 440, 439, 414, 415, 441, 414, 441, 440, 415, 416, 442, 415, 442, 441, 416, 417, 443, 416, 443, 442, 417, 418, 444, 417, 444, 443, 418, 419, 445, 418, 445, 444, 419, 420, 446, 419, 446, 445, 420, 421, 447, 420, 447, 446, 421, 422, 448, 421, 448, 447, 422, 423, 449, 422, 449, 448, 423, 424, 450, 423, 450, 449, 424, 425, 451, 424, 451, 450, 425, 45, 46, 425, 46, 451, 15, 426, 452, 15, 452, 16, 426, 427, 453, 426, 453, 452, 427, 428, 454, 427, 454, 453, 428, 429, 455, 428, 455, 454, 429, 430, 456, 429, 456, 455, 430, 431, 457, 430, 457, 456, 431, 432, 458, 431, 458, 457, 432, 433, 459, 432, 459, 458, 433, 434, 460, 433, 460, 459, 434, 435, 461, 434, 461, 460, 435, 436, 462, 435, 462, 461, 436, 437, 463, 436, 463, 462, 437, 438, 464, 437, 464, 463, 438, 439, 465, 438, 465, 464, 439, 440, 466, 439, 466, 465, 440, 441, 467, 440, 467, 466, 441, 442, 468, 441, 468, 467, 442, 443, 469, 442, 469, 468, 443, 444, 470, 443, 470, 469, 444, 445, 471, 444, 471, 470, 445, 446, 472, 445, 472, 471, 446, 447, 473, 446, 473, 472, 447, 448, 474, 447, 474, 473, 448, 449, 475, 448, 475, 474, 449, 450, 476, 449, 476, 475, 450, 451, 477, 450, 477, 476, 451, 46, 47, 451, 47, 477, 16, 452, 478, 16, 478, 17, 452, 453, 479, 452, 479, 478, 453, 454, 480, 453, 480, 479, 454, 455, 481, 454, 481, 480, 455, 456, 482, 455, 482, 481, 456, 457, 483, 456, 483, 482, 457, 458, 484, 457, 484, 483, 458, 459, 485, 458, 485, 484, 459, 460, 486, 459, 486, 485, 460, 461, 487, 460, 487, 486, 461, 462, 488, 461, 488, 487, 462, 463, 489, 462, 489, 488, 463, 464, 490, 463, 490, 489, 464, 465, 491, 464, 491, 490, 465, 466, 492, 465, 492, 491, 466, 467, 493, 466, 493, 492, 467, 468, 494, 467, 494, 493, 468, 469, 495, 468, 495, 494, 469, 470, 496, 469, 496, 495, 470, 471, 497, 470, 497, 496, 471, 472, 498, 471, 498, 497, 472, 473, 499, 472, 499, 498, 473, 474, 500, 473, 500, 499, 474, 475, 501, 474, 501, 500, 475, 476, 502, 475, 502, 501, 476, 477, 503, 476, 503, 502, 477, 47, 48, 477, 48, 503, 17, 478, 504, 17, 504, 18, 478, 479, 505, 478, 505, 504, 479, 480, 506, 479, 506, 505, 480, 481, 507, 480, 507, 506, 481, 482, 508, 481, 508, 507, 482, 483, 509, 482, 509, 508, 483, 484, 510, 483, 510, 509, 484, 485, 511, 484, 511, 510, 485, 486, 512, 485, 512, 511, 486, 487, 513, 486, 513, 512, 487, 488, 514, 487, 514, 513, 488, 489, 515, 488, 515, 514, 489, 490, 516, 489, 516, 515, 490, 491, 517, 490, 517, 516, 491, 492, 518, 491, 518, 517, 492, 493, 519, 492, 519, 518, 493, 494, 520, 493, 520, 519, 494, 495, 521, 494, 521, 520, 495, 496, 522, 495, 522, 521, 496, 497, 523, 496, 523, 522, 497, 498, 524, 497, 524, 523, 498, 499, 525, 498, 525, 524, 499, 500, 526, 499, 526, 525, 500, 501, 527, 500, 527, 526, 501, 502, 528, 501, 528, 527, 502, 503, 529, 502, 529, 528, 503, 48, 49, 503, 49, 529, 18, 504, 530, 18, 530, 19, 504, 505, 531, 504, 531, 530, 505, 506, 532, 505, 532, 531, 506, 507, 533, 506, 533, 532, 507, 508, 534, 507, 534, 533, 508, 509, 535, 508, 535, 534, 509, 510, 536, 509, 536, 535, 510, 511, 537, 510, 537, 536, 511, 512, 538, 511, 538, 537, 512, 513, 539, 512, 539, 538, 513, 514, 540, 513, 540, 539, 514, 515, 541, 514, 541, 540, 515, 516, 542, 515, 542, 541, 516, 517, 543, 516, 543, 542, 517, 518, 544, 517, 544, 543, 518, 519, 545, 518, 545, 544, 519, 520, 546, 519, 546, 545, 520, 521, 547, 520, 547, 546, 521, 522, 548, 521, 548, 547, 522, 523, 549, 522, 549, 548, 523, 524, 550, 523, 550, 549, 524, 525, 551, 524, 551, 550, 525, 526, 552, 525, 552, 551, 526, 527, 553, 526, 553, 552, 527, 528, 554, 527, 554, 553, 528, 529, 555, 528, 555, 554, 529, 49, 50, 529, 50, 555, 19, 530, 556, 19, 556, 20, 530, 531, 557, 530, 557, 556, 531, 532, 558, 531, 558, 557, 532, 533, 559, 532, 559, 558, 533, 534, 560, 533, 560, 559, 534, 535, 561, 534, 561, 560, 535, 536, 562, 535, 562, 561, 536, 537, 563, 536, 563, 562, 537, 538, 564, 537, 564, 563, 538, 539, 565, 538, 565, 564, 539, 540, 566, 539, 566, 565, 540, 541, 567, 540, 567, 566, 541, 542, 568, 541, 568, 567, 542, 543, 569, 542, 569, 568, 543, 544, 570, 543, 570, 569, 544, 545, 571, 544, 571, 570, 545, 546, 572, 545, 572, 571, 546, 547, 573, 546, 573, 572, 547, 548, 574, 547, 574, 573, 548, 549, 575, 548, 575, 574, 549, 550, 576, 549, 576, 575, 550, 551, 577, 550, 577, 576, 551, 552, 578, 551, 578, 577, 552, 553, 579, 552, 579, 578, 553, 554, 580, 553, 580, 579, 554, 555, 581, 554, 581, 580, 555, 50, 51, 555, 51, 581, 20, 556, 582, 20, 582, 21, 556, 557, 583, 556, 583, 582, 557, 558, 584, 557, 584, 583, 558, 559, 585, 558, 585, 584, 559, 560, 586, 559, 586, 585, 560, 561, 587, 560, 587, 586, 561, 562, 588, 561, 588, 587, 562, 563, 589, 562, 589, 588, 563, 564, 590, 563, 590, 589, 564, 565, 591, 564, 591, 590, 565, 566, 592, 565, 592, 591, 566, 567, 593, 566, 593, 592, 567, 568, 594, 567, 594, 593, 568, 569, 595, 568, 595, 594, 569, 570, 596, 569, 596, 595, 570, 571, 597, 570, 597, 596, 571, 572, 598, 571, 598, 597, 572, 573, 599, 572, 599, 598, 573, 574, 600, 573, 600, 599, 574, 575, 601, 574, 601, 600, 575, 576, 602, 575, 602, 601, 576, 577, 603, 576, 603, 602, 577, 578, 604, 577, 604, 603, 578, 579, 605, 578, 605, 604, 579, 580, 606, 579, 606, 605, 580, 581, 607, 580, 607, 606, 581, 51, 52, 581, 52, 607, 21, 582, 608, 21, 608, 22, 582, 583, 609, 582, 609, 608, 583, 584, 610, 583, 610, 609, 584, 585, 611, 584, 611, 610, 585, 586, 612, 585, 612, 611, 586, 587, 613, 586, 613, 612, 587, 588, 614, 587, 614, 613, 588, 589, 615, 588, 615, 614, 589, 590, 616, 589, 616, 615, 590, 591, 617, 590, 617, 616, 591, 592, 618, 591, 618, 617, 592, 593, 619, 592, 619, 618, 593, 594, 620, 593, 620, 619, 594, 595, 621, 594, 621, 620, 595, 596, 622, 595, 622, 621, 596, 597, 623, 596, 623, 622, 597, 598, 624, 597, 624, 623, 598, 599, 625, 598, 625, 624, 599, 600, 626, 599, 626, 625, 600, 601, 627, 600, 627, 626, 601, 602, 628, 601, 628, 627, 602, 603, 629, 602, 629, 628, 603, 604, 630, 603, 630, 629, 604, 605, 631, 604, 631, 630, 605, 606, 632, 605, 632, 631, 606, 607, 633, 606, 633, 632, 607, 52, 53, 607, 53, 633, 22, 608, 634, 22, 634, 23, 608, 609, 635, 608, 635, 634, 609, 610, 636, 609, 636, 635, 610, 611, 637, 610, 637, 636, 611, 612, 638, 611, 638, 637, 612, 613, 639, 612, 639, 638, 613, 614, 640, 613, 640, 639, 614, 615, 641, 614, 641, 640, 615, 616, 642, 615, 642, 641, 616, 617, 643, 616, 643, 642, 617, 618, 644, 617, 644, 643, 618, 619, 645, 618, 645, 644, 619, 620, 646, 619, 646, 645, 620, 621, 647, 620, 647, 646, 621, 622, 648, 621, 648, 647, 622, 623, 649, 622, 649, 648, 623, 624, 650, 623, 650, 649, 624, 625, 651, 624, 651, 650, 625, 626, 652, 625, 652, 651, 626, 627, 653, 626, 653, 652, 627, 628, 654, 627, 654, 653, 628, 629, 655, 628, 655, 654, 629, 630, 656, 629, 656, 655, 630, 631, 657, 630, 657, 656, 631, 632, 658, 631, 658, 657, 632, 633, 659, 632, 659, 658, 633, 53, 54, 633, 54, 659, 23, 634, 660, 23, 660, 24, 634, 635, 661, 634, 661, 660, 635, 636, 662, 635, 662, 661, 636, 637, 663, 636, 663, 662, 637, 638, 664, 637, 664, 663, 638, 639, 665, 638, 665, 664, 639, 640, 666, 639, 666, 665, 640, 641, 667, 640, 667, 666, 641, 642, 668, 641, 668, 667, 642, 643, 669, 642, 669, 668, 643, 644, 670, 643, 670, 669, 644, 645, 671, 644, 671, 670, 645, 646, 672, 645, 672, 671, 646, 647, 673, 646, 673, 672, 647, 648, 674, 647, 674, 673, 648, 649, 675, 648, 675, 674, 649, 650, 676, 649, 676, 675, 650, 651, 677, 650, 677, 676, 651, 652, 678, 651, 678, 677, 652, 653, 679, 652, 679, 678, 653, 654, 680, 653, 680, 679, 654, 655, 681, 654, 681, 680, 655, 656, 682, 655, 682, 681, 656, 657, 683, 656, 683, 682, 657, 658, 684, 657, 684, 683, 658, 659, 685, 658, 685, 684, 659, 54, 55, 659, 55, 685, 24, 660, 686, 24, 686, 25, 660, 661, 687, 660, 687, 686, 661, 662, 688, 661, 688, 687, 662, 663, 689, 662, 689, 688, 663, 664, 690, 663, 690, 689, 664, 665, 691, 664, 691, 690, 665, 666, 692, 665, 692, 691, 666, 667, 693, 666, 693, 692, 667, 668, 694, 667, 694, 693, 668, 669, 695, 668, 695, 694, 669, 670, 696, 669, 696, 695, 670, 671, 697, 670, 697, 696, 671, 672, 698, 671, 698, 697, 672, 673, 699, 672, 699, 698, 673, 674, 700, 673, 700, 699, 674, 675, 701, 674, 701, 700, 675, 676, 702, 675, 702, 701, 676, 677, 703, 676, 703, 702, 677, 678, 704, 677, 704, 703, 678, 679, 705, 678, 705, 704, 679, 680, 706, 679, 706, 705, 680, 681, 707, 680, 707, 706, 681, 682, 708, 681, 708, 707, 682, 683, 709, 682, 709, 708, 683, 684, 710, 683, 710, 709, 684, 685, 711, 684, 711, 710, 685, 55, 56, 685, 56, 711, 25, 686, 712, 25, 712, 26, 686, 687, 713, 686, 713, 712, 687, 688, 714, 687, 714, 713, 688, 689, 715, 688, 715, 714, 689, 690, 716, 689, 716, 715, 690, 691, 717, 690, 717, 716, 691, 692, 718, 691, 718, 717, 692, 693, 719, 692, 719, 718, 693, 694, 720, 693, 720, 719, 694, 695, 721, 694, 721, 720, 695, 696, 722, 695, 722, 721, 696, 697, 723, 696, 723, 722, 697, 698, 724, 697, 724, 723, 698, 699, 725, 698, 725, 724, 699, 700, 726, 699, 726, 725, 700, 701, 727, 700, 727, 726, 701, 702, 728, 701, 728, 727, 702, 703, 729, 702, 729, 728, 703, 704, 730, 703, 730, 729, 704, 705, 731, 704, 731, 730, 705, 706, 732, 705, 732, 731, 706, 707, 733, 706, 733, 732, 707, 708, 734, 707, 734, 733, 708, 709, 735, 708, 735, 734, 709, 710, 736, 709, 736, 735, 710, 711, 737, 710, 737, 736, 711, 56, 57, 711, 57, 737, 26, 712, 738, 26, 738, 27, 712, 713, 739, 712, 739, 738, 713, 714, 740, 713, 740, 739, 714, 715, 741, 714, 741, 740, 715, 716, 742, 715, 742, 741, 716, 717, 743, 716, 743, 742, 717, 718, 744, 717, 744, 743, 718, 719, 745, 718, 745, 744, 719, 720, 746, 719, 746, 745, 720, 721, 747, 720, 747, 746, 721, 722, 748, 721, 748, 747, 722, 723, 749, 722, 749, 748, 723, 724, 750, 723, 750, 749, 724, 725, 751, 724, 751, 750, 725, 726, 752, 725, 752, 751, 726, 727, 753, 726, 753, 752, 727, 728, 754, 727, 754, 753, 728, 729, 755, 728, 755, 754, 729, 730, 756, 729, 756, 755, 730, 731, 757, 730, 757, 756, 731, 732, 758, 731, 758, 757, 732, 733, 759, 732, 759, 758, 733, 734, 760, 733, 760, 759, 734, 735, 761, 734, 761, 760, 735, 736, 762, 735, 762, 761, 736, 737, 763, 736, 763, 762, 737, 57, 58, 737, 58, 763, 27, 738, 764, 27, 764, 28, 738, 739, 765, 738, 765, 764, 739, 740, 766, 739, 766, 765, 740, 741, 767, 740, 767, 766, 741, 742, 768, 741, 768, 767, 742, 743, 769, 742, 769, 768, 743, 744, 770, 743, 770, 769, 744, 745, 771, 744, 771, 770, 745, 746, 772, 745, 772, 771, 746, 747, 773, 746, 773, 772, 747, 748, 774, 747, 774, 773, 748, 749, 775, 748, 775, 774, 749, 750, 776, 749, 776, 775, 750, 751, 777, 750, 777, 776, 751, 752, 778, 751, 778, 777, 752, 753, 779, 752, 779, 778, 753, 754, 780, 753, 780, 779, 754, 755, 781, 754, 781, 780, 755, 756, 782, 755, 782, 781, 756, 757, 783, 756, 783, 782, 757, 758, 784, 757, 784, 783, 758, 759, 785, 758, 785, 784, 759, 760, 786, 759, 786, 785, 760, 761, 787, 760, 787, 786, 761, 762, 788, 761, 788, 787, 762, 763, 789, 762, 789, 788, 763, 58, 59, 763, 59, 789, 28, 764, 790, 28, 790, 29, 764, 765, 791, 764, 791, 790, 765, 766, 792, 765, 792, 791, 766, 767, 793, 766, 793, 792, 767, 768, 794, 767, 794, 793, 768, 769, 795, 768, 795, 794, 769, 770, 796, 769, 796, 795, 770, 771, 797, 770, 797, 796, 771, 772, 798, 771, 798, 797, 772, 773, 799, 772, 799, 798, 773, 774, 800, 773, 800, 799, 774, 775, 801, 774, 801, 800, 775, 776, 802, 775, 802, 801, 776, 777, 803, 776, 803, 802, 777, 778, 804, 777, 804, 803, 778, 779, 805, 778, 805, 804, 779, 780, 806, 779, 806, 805, 780, 781, 807, 780, 807, 806, 781, 782, 808, 781, 808, 807, 782, 783, 809, 782, 809, 808, 783, 784, 810, 783, 810, 809, 784, 785, 811, 784, 811, 810, 785, 786, 812, 785, 812, 811, 786, 787, 813, 786, 813, 812, 787, 788, 814, 787, 814, 813, 788, 789, 815, 788, 815, 814, 789, 59, 60, 789, 60, 815, 29, 790, 816, 29, 816, 30, 790, 791, 817, 790, 817, 816, 791, 792, 818, 791, 818, 817, 792, 793, 819, 792, 819, 818, 793, 794, 820, 793, 820, 819, 794, 795, 821, 794, 821, 820, 795, 796, 822, 795, 822, 821, 796, 797, 823, 796, 823, 822, 797, 798, 824, 797, 824, 823, 798, 799, 825, 798, 825, 824, 799, 800, 826, 799, 826, 825, 800, 801, 827, 800, 827, 826, 801, 802, 828, 801, 828, 827, 802, 803, 829, 802, 829, 828, 803, 804, 830, 803, 830, 829, 804, 805, 831, 804, 831, 830, 805, 806, 832, 805, 832, 831, 806, 807, 833, 806, 833, 832, 807, 808, 834, 807, 834, 833, 808, 809, 835, 808, 835, 834, 809, 810, 836, 809, 836, 835, 810, 811, 837, 810, 837, 836, 811, 812, 838, 811, 838, 837, 812, 813, 839, 812, 839, 838, 813, 814, 840, 813, 840, 839, 814, 815, 841, 814, 841, 840, 815, 60, 61, 815, 61, 841, 30, 816, 62, 30, 62, 0, 816, 817, 64, 816, 64, 62, 817, 818, 66, 817, 66, 64, 818, 819, 68, 818, 68, 66, 819, 820, 70, 819, 70, 68, 820, 821, 72, 820, 72, 70, 821, 822, 74, 821, 74, 72, 822, 823, 76, 822, 76, 74, 823, 824, 78, 823, 78, 76, 824, 825, 80, 824, 80, 78, 825, 826, 82, 825, 82, 80, 826, 827, 84, 826, 84, 82, 827, 828, 86, 827, 86, 84, 828, 829, 88, 828, 88, 86, 829, 830, 90, 829, 90, 88, 830, 831, 92, 830, 92, 90, 831, 832, 94, 831, 94, 92, 832, 833, 96, 832, 96, 94, 833, 834, 98, 833, 98, 96, 834, 835, 100, 834, 100, 98, 835, 836, 102, 835, 102, 100, 836, 837, 104, 836, 104, 102, 837, 838, 106, 837, 106, 104, 838, 839, 108, 838, 108, 106, 839, 840, 110, 839, 110, 108, 840, 841, 112, 840, 112, 110, 841, 61, 31, 841, 31, 112];
const normals = calculateNormals(vertices, indices);

let lastTime = 0;
let angle = 0;
let ctx;
let shader;
let vertexBuffer;
let normalBuffer;
let indexBuffer;
let pMatrix;
let mvMatrix = new Matrix3D();
let canvas = document.getElementById('c');
let gl = canvas.getContext('webgl');
let light = {
  diffuse: [255, 255, 255, 255],
  ambient: [0.03 * 255, 0.03 * 255, 0.03 * 255, 255],
  specular: [1 * 255, 255, 255, 255],
  direction: [-0.25, -0.25, -0.25],
  needsUpdate: true
};
let material = {
  diffuse: [46, 99, 191, 255],
  ambient: [1 * 255, 255, 255, 255],
  specular: [1 * 255, 255, 255, 255],
  shininess: 10,
  needsUpdate: true
};
let shaders = {
  current: 'phong',
  needsUpdate: true
};
let tmpColor = new Color();
let tmpArray = new Float32Array(4);

function normalizeColorArray(arr) {
  tmpColor.reset255(arr[0], arr[1], arr[2], arr[3]);
  tmpColor.toFloat32Array(tmpArray);
  return tmpArray;
}

let shaderLib = {};

if (gl) {
  ctx = new Context(gl);
  ctx.enableDepthTest();
  ctx.clearColor = Color.LIGHT_GRAY;
  shaderLib['goraud'] = new Program(ctx, vs, fs);
  shaderLib['phong'] = new Program(ctx, phongVS, phongFS);
  shader = shaderLib[shaders['current']];
  shader.bind();
  vertexBuffer = new VertexBuffer(ctx);
  vertexBuffer.setData(new Float32Array(vertices), false);
  vertexBuffer.addAttribute(shader.getAttributeLocation(aVertexPosition), 3);
  normalBuffer = new VertexBuffer(ctx);
  normalBuffer.setData(new Float32Array(normals), false);
  normalBuffer.addAttribute(shader.getAttributeLocation(aVertexNormal), 3);
  indexBuffer = new IndexBuffer(ctx);
  indexBuffer.setData(new Uint16Array(indices));
  addUI();
  loop();
} else {
  console.log('no webgl support');
}

function loop() {
  requestAnimationFrame(loop);
  animate();
  render();
}

function render() {
  angle++;
  ctx.adjustSize();
  ctx.clear(true);
  pMatrix = perspectiveFieldOfViewRH(45, ctx.width / ctx.height, 0.1, 10000);
  mvMatrix.identity();
  mvMatrix.rotateY(angle * Deg2Rad);
  mvMatrix.translate(0, 0, -1.5);

  if (shaders.needsUpdate) {
    shader = shaderLib[shaders['current']];
    shader.bind();
    vertexBuffer.clearAttributes();
    vertexBuffer.addAttribute(shader.getAttributeLocation(aVertexPosition), 3);
    normalBuffer.clearAttributes();
    normalBuffer.addAttribute(shader.getAttributeLocation(aVertexNormal), 3);
    shader.uMat4(uMVMatrix, mvMatrix.toArray());
    shader.uMat4(uPMatrix, pMatrix.toArray());
    shader.uMat4(uNMatrix, mvMatrix.clone().invert().transpose().toArray());
    shaders.needsUpdate = false;
  } // initLights


  if (light.needsUpdate) {
    shader.uVec3v(uLightDirection, light.direction);
    shader.uVec4v(uLightAmbient, normalizeColorArray(light.ambient));
    shader.uVec4v(uLightDiffuse, normalizeColorArray(light.diffuse));
    shader.uVec4v(uLightSpecular, normalizeColorArray(light.specular));
    light.needsUpdate = false;
  }

  if (material.needsUpdate) {
    shader.uVec4v(uMaterialDiffuse, normalizeColorArray(material.diffuse));
    shader.uVec4v(uMaterialAmbient, normalizeColorArray(material.ambient));
    shader.uVec4v(uMaterialSpecular, normalizeColorArray(material.specular));
    shader.uniform1f(uShininess, material.shininess);
    material.needsUpdate = false;
  }

  vertexBuffer.bindAttributes();
  normalBuffer.bindAttributes();
  indexBuffer.bind(); // ctx.drawElements(gl.LINES,indexBuffer.length);

  ctx.drawElementsTriangle(indexBuffer.length);
}

function animate() {
  let timeNow = new Date().getTime();

  if (lastTime != 0) {
    var elapsed = timeNow - lastTime;
    angle += 90 * elapsed / 10000.0;
  }

  lastTime = timeNow;
}

function addUI() {
  let updateLight = () => {
    light.needsUpdate = true;
  };

  let updateMaterial = () => {
    material.needsUpdate = true;
  };

  let gui = new GUI$1();
  gui.add(shaders, 'current', ['phong', 'goraud']).onChange(v => {
    light.needsUpdate = material.needsUpdate = shaders.needsUpdate = true;
  });
  let mUI = gui.addFolder('light');
  mUI.addColor(light, 'diffuse').onChange(updateLight);
  mUI.addColor(light, 'ambient').onChange(updateLight);
  mUI.addColor(light, 'specular').onChange(updateLight);
  mUI.add(light.direction, '0', -10, 10, 0.1).onChange(updateLight);
  mUI.add(light.direction, '1', -10, 10, 0.1).onChange(updateLight);
  mUI.add(light.direction, '2', -10, 10, 0.1).onChange(updateLight);
  mUI.open();
  mUI = gui.addFolder('material');
  mUI.addColor(material, 'diffuse').onChange(updateMaterial);
  mUI.addColor(material, 'ambient').onChange(updateMaterial);
  mUI.addColor(material, 'specular').onChange(updateMaterial);
  mUI.add(material, 'shininess', 0, 100, 5).onChange(updateMaterial);
  mUI.open(); // let lUI = gui.addFolder('light')
} // http://workshop.chromeexperiments.com/examples/gui
//# sourceMappingURL=light.js.map
