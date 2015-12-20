precision mediump float;

uniform vec3 Ambient;
uniform vec3 LightColour;
uniform vec3 LightDirection;

varying vec3 vertexColour;
varying vec3 vertexNormal;

void main(void) {
	float diffuse = max(0.0, dot(vertexNormal, LightDirection));
	vec3 scatteredLight = Ambient + LightColour*diffuse;
	vec3 rgb = min(vertexColour.rgb * scatteredLight, vec3(1.0));

	gl_FragColor = vec4(rgb, 1);
}
