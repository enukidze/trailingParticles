import * as THREE from "three";
import fragment from "./shader/fragment.glsl";
import vertex from "./shader/vertexParticles.glsl";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { sRGBEncoding } from "three";

export default class Sketch {
  constructor(options) {
    this.scene = new THREE.Scene();

    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGLRenderer(
   {   preserveDrawingBuffer: true,
      alpha: true}
    );
    this.renderer.autoClear = false;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xeeeeee, 1); 


    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    );

    // var frustumSize = 10;
    // var aspect = window.innerWidth / window.innerHeight;
    // this.camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, -1000, 1000 );
    this.camera.position.set(0, 0, 2);
   // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;

    this.isPlaying = true;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    
    this.addObjects();
    this.resize();
    this.render();
    this.mouseMove();
    this.setupResize();
     this.settings();
  }

  settings() {
    let that = this;
    this.settings = {
      progress: 0,
     };
    // this.gui = new dat.GUI();
    // this.gui.add(this.settings, "progress", 0, 1, 0.01);
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  addObjects() {
    let that = this;
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable"
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: {
          type: "f",
          value: 0
        },
        uMouse: {
          type: "v2",
          value: new THREE.Vector2(0,0)
        },
        resolution: {
          type: "v4",
          value: new THREE.Vector4()
        },
        uvRate1: {
          value: new THREE.Vector2(1, 1)
        }
      },
      // wireframe: true,
      transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment,
      depthTest: false,
      depthWrite: false
    });

    this.geometry = new THREE.BufferGeometry();

    let num = 2500;

    let positions = new Float32Array(num * 3)
    let angle = new Float32Array(num)
    let life = new Float32Array(num)
    let offset = new Float32Array(num)



    for (let i = 0; i < num; i++) {
      positions.set([
          Math.random() * 0.1,
          Math.random() * 0.1,
          Math.random() * 0.1
        ], 3 * i),


        angle.set(
          [Math.random() * Math.PI * 2],
          i
        ),

        life.set(
          [4 + Math.random() * 10],
          i
        ),

        offset.set(
          [1000 * Math.random()],
          i
        )

    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.geometry.setAttribute('angle', new THREE.BufferAttribute(angle, 1))
    this.geometry.setAttribute('life', new THREE.BufferAttribute(life, 1))
    this.geometry.setAttribute('offset', new THREE.BufferAttribute(life, 1))



    this.dots = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.dots);

    this.clearPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(7, 7),
      new THREE.MeshBasicMaterial({
        transparent: true,
        color: "#161c34",
        opacity: 0.01
      })
    )
    this.scene.add(this.clearPlane)

  }

  mouseMove() {
    let self = this
    console.log('dad');
    function onMouseMove(event) {

      // calculate pointer position in normalized device coordinates
      // (-1 to +1) for both components

      self.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      self.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // update the picking ray with the camera and pointer position
      self.raycaster.setFromCamera(self.mouse, self.camera);

      // calculate objects intersecting the picking ray
      let intersects = self.raycaster.intersectObjects([self.clearPlane]);

      if(intersects[0]) {
        let p = intersects[0].point;
        console.log(p);
        self.material.uniforms.uMouse.value = new THREE.Vector2(p.x,p.y)
      }

    }
    
    window.addEventListener( 'pointermove', onMouseMove );
 
  }

  stop() {
    this.isPlaying = false;
  }

  play() {
    if(!this.isPlaying){
      this.render()
      this.isPlaying = true;
    }
  }

  render() {
    if (!this.isPlaying) return;
    this.time += 0.05;
    this.material.uniforms.time.value = this.time;
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

new Sketch({
  dom: document.getElementById("container")
});
