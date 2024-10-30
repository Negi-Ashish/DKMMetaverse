import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import App from "./App";
import { sizesStore } from "./Utils/Store";

export default class Camera {
  constructor() {
    console.log("Camera Init");
    this.app = new App();
    this.canvas = this.app.canvas;

    // Code to resize
    this.sizesStore = sizesStore;
    this.sizes = this.sizesStore.getState();

    this.setInstance();
    this.setControls();
    this.setResizeListner();
  }

  setInstance() {
    console.log("Camera setInstance Called");

    this.instance = new THREE.PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
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

  setResizeListner() {
    this.sizesStore.subscribe((sizes) => {
      this.instance.aspect = sizes.width / sizes.height;
      this.instance.updateProjectionMatrix();
    });
  }

  // This will be called in the renderer loop class
  loop() {
    this.controls.update();
    // console.log("Camera loop called");
  }
}
