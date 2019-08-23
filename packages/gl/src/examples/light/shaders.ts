import * as names from "../common/names";




export const vs = `
attribute vec3 ${names.aVertexPosition};
attribute vec3 ${names.aVertexNormal};
 
uniform mat4 ${names.uMVMatrix} ;
uniform mat4 ${names.uPMatrix};
uniform mat4 ${names.uNMatrix};
 
// lights
uniform vec3 ${names.uLightDirection};   	//light direction
uniform vec4 ${names.uLightAmbient};		//ambiental light
uniform vec4 ${names.uLightDiffuse};		//light color
uniform vec4 ${names.uLightSpecular}; 

// materials
uniform vec4 ${names.uMaterialAmbient};
uniform vec4 ${names.uMaterialSpecular};
uniform vec4 ${names.uMaterialDiffuse};	
uniform float ${names.uShininess};
 
varying vec4 ${names.vFinalColor};

 
void main(void) {
    vec3 N = vec3(${names.uNMatrix} * vec4(${names.aVertexNormal}, 1.0));
    vec3 L = normalize(${names.uLightDirection});
	
	//Lambert's cosine law
	float lambertTerm = dot(N,-L);
    
	//Ambient Term
    vec4 Ia = ${names.uLightAmbient} * ${names.uMaterialAmbient};
	
	//Diffuse Term
	vec4 Id =  ${names.uMaterialDiffuse} * ${names.uLightDiffuse} * lambertTerm;

	//
	vec4 vertex = ${names.uMVMatrix} * vec4(${names.aVertexPosition},1.0);
	vec3 eyeVec = -vec3(vertex.xyz);
	vec3 E = normalize(eyeVec);
	vec3 R = reflect(L,N);
	float specular = pow(max(dot(R,E),0.0),${names.uShininess});
	vec4 Is = ${names.uLightSpecular} * ${names.uMaterialSpecular} * specular;


	
	//Final Color
	${names.vFinalColor} = vec4(vec3(Ia + Id + Is),1.0);
    
	//transformed vertex position
    ${names.gl_Position} = ${names.uPMatrix} * vertex;
}
`;


export const fs = `

${names.precision_mediump_float};
varying vec4  ${names.vFinalColor};
void main(void)  {
	${names.gl_FragColor} = ${names.vFinalColor};
}
`;





export const phongVS = `
attribute vec3 ${names.aVertexPosition};
attribute vec3 ${names.aVertexNormal};

varying vec3 ${names.vNormal};
varying vec3 vEyeVector;
 
uniform mat4 ${names.uMVMatrix} ;
uniform mat4 ${names.uPMatrix};
uniform mat4 ${names.uNMatrix};
 
void main(void) {
 
	vec4 vertex = ${names.uMVMatrix} * vec4(${names.aVertexPosition},1.0);

	${names.vNormal} = vec3(${names.uNMatrix} * vec4(${names.aVertexNormal}, 1.0));
    vEyeVector = -vec3(vertex.xyz);
    
	//transformed vertex position
    ${names.gl_Position} = ${names.uPMatrix} * vertex;
}
`;


export const phongFS = `

${names.precision_mediump_float};

// lights
uniform vec3 ${ names.uLightDirection};   	//light direction
uniform vec4 ${ names.uLightAmbient};		//ambiental light
uniform vec4 ${ names.uLightDiffuse};		//light color
uniform vec4 ${ names.uLightSpecular};

// materials
uniform vec4 ${ names.uMaterialAmbient};
uniform vec4 ${ names.uMaterialSpecular};
uniform vec4 ${ names.uMaterialDiffuse};
uniform float ${ names.uShininess};

varying vec3 ${names.vNormal};
varying vec3 vEyeVector;

void main(void)  {
	// Normalized light direction
	vec3 L = normalize(${ names.uLightDirection});
	// Normalized normal
	vec3 N = normalize(${ names.vNormal});
	float lambertTerm = dot(N, -L);

	// Ambient
	vec4 Ia = ${ names.uLightAmbient} * ${names.uMaterialAmbient};

	//Diffuse Term
	vec4 Id = ${ names.uMaterialDiffuse} * ${names.uLightDiffuse} * lambertTerm;

	
	vec3 E = normalize(vEyeVector);
	vec3 R = reflect(L, N);
	float specular = pow( max(dot(R, E), 0.0), ${names.uShininess});
	vec4 Is = uLightSpecular * uMaterialSpecular * specular;
	${names.gl_FragColor} = vec4(vec3(Ia + Id + Is), 1.0);;
}
`;
