uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
varying float vAlpha;
uniform sampler2D texture1;



uniform vec2 uMouse;

float PI = 3.141592653589793238;

attribute float angle;
attribute float life;
attribute float offset;

void main() {
  vUv = uv;

  float current = mod(offset + time/2.,life);
  float precent = current / life;

  vec3 newpos = position;

  vAlpha = smoothstep(0.,0.05,precent);
 
  vAlpha -= smoothstep(0.85,1.,precent);
 
   float dir = angle + sin(time/10.);
  
  newpos.x += cos(angle) * current * 0.2 ;//* 0.15;
  newpos.y += sin(angle) * current * 0.2;//* 0.15;

  vec3 curpos = newpos;
  float mouseRadius = 0.35;
  float dist = distance(curpos.xy,uMouse);
  float strength = dist / mouseRadius;
  strength = 1. - smoothstep(0.,1.,strength);
  float dx = uMouse.x - curpos.x;
  float dy = uMouse.y - curpos.y;
  float angleangle = atan(dy,dx);

  newpos.x += cos(angleangle) * strength* 0.1;
  newpos.y += sin(angleangle) * strength* 0.1;

  vec4 mvPosition = modelViewMatrix * vec4( newpos, 1. );
  gl_PointSize = 30. * ( 1. / - mvPosition.z );
  gl_Position = projectionMatrix * mvPosition;
}