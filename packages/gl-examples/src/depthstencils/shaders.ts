export const vs = `
attribute vec3 aVertexPosition;
attribute vec3 aVertexColor;
attribute vec2 aVertexUV;

uniform mat4 uModel; 
uniform mat4 uView;
uniform mat4 uProj;
 
varying vec3 vColor;
varying vec2 vTexcoord;
 
void main(void) {
	vColor = aVertexColor;
	vTexcoord = aVertexUV;
	gl_Position = vec4(aVertexPosition,1.0);
}
`;

// uProj * uView * uModel * 

export const fs = `
varying vec3 vColor;
varying vec2 vTexcoord;
 
uniform sampler2D tex1;
uniform sampler2D tex2;
void main(void)  {
	gl_FragColor = vec4(vColor, 1.0) * mix(texture2D(tex1, Texcoord), texture2D(tex2, Texcoord), 0.5);
};
`




// export const fs = `
// precision highp float;

// varying vec3 vColor;
// varying vec2 vTexcoord;
 
// uniform sampler2D tex1;
// uniform sampler2D tex2;

// void main(void)  {
// 	gl_FragColor = vec4(vColor, 1.0) * mix(texture2D(tex1, Texcoord), texture2D(tex2, Texcoord), 0.5);
// };
// `;