import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import App from "./App";

export default class Camera {
  constructor() {
    console.log("Camera Init");
    this.app = new App();
    this.canvas = this.app.canvas;
    this.setInstance();
    this.setControls();
  }

  setInstance() {
    console.log("Camera setInstance Called");

    this.instance = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );

    this.instance.position.z = 5;
  }

  setControls() {
    // instantiate the controls
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
  }

  // This will be called in the renderer loop class
  loop() {
    this.controls.update();
    // console.log("Camera loop called");
  }
}
