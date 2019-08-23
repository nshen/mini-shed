export const vs = `
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
 
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;
 
// lights
uniform vec4 uLightAmbient;		//ambiental light
uniform vec3 uLightDirection;	//light direction
uniform vec4 uLightDiffuse;		//light color
// uniform vec4 uLightSpecular; 

// materials
// uniform vec4 uMaterialAmbient;
// uniform vec4 uMaterialSpecular;
// uniform float uShininess;

uniform vec4 uMaterialDiffuse;	//object color
 
varying vec4 vFinalColor;
 
void main(void) {
	//Transformed normal position
    vec3 N = vec3(uNMatrix * vec4(aVertexNormal, 1.0));
    
	//Transformed light position
	vec3 light = vec3(uMVMatrix * vec4(uLightDirection, 0.0));
    vec3 L = normalize(light);
	
	//Lambert's cosine law
	float lambertTerm = dot(N,-L);
    
	//Ambient Term
    vec4 Ia = uMaterialDiffuse * uLightAmbient;
	
	//Diffuse Term
	vec4 Id =  uMaterialDiffuse * uLightDiffuse * lambertTerm;
	
	//Final Color
	vFinalColor = Ia + Id;
	vFinalColor.a = 1.0;
    
	//transformed vertex position
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}
`;


export const fs = `
precision highp float;
varying vec4  vFinalColor;
 
void main(void)  {
	gl_FragColor = vFinalColor;
}
`;