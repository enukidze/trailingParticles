uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
varying float vAlpha;

float PI = 3.141592653589793238;
void main()	{
	float d = length(gl_PointCoord - vec2(0.5));

	float a = 1. - smoothstep(0.,0.5,d);
	// vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
	gl_FragColor = vec4(1.,0.,0.,a * vAlpha);
}