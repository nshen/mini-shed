export const vs = `
attribute vec3 aVertexPosition;
void main(void) {
    gl_Position = vec4(aVertexPosition, 1.0); 
    gl_PointSize = 4.0;
}
`;


export const fs = `
precision highp float;
void main(void) {
    gl_FragColor = vec4(0.2,0.5,0.5, 1.0);
}`;