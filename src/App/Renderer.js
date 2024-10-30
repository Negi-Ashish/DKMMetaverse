import * as THREE from "three";
import App from "./App";
import { sizesStore } from "./Utils/Store";

export default class Renderer {
  constructor() {
    console.log("Renderer Init");
    this.app = new App();
    this.canvas = this.app.canvas;
    this.camera = this.app.camera;
    this.scene = this.app.scene;
    // Code to resize
    this.sizesStore = sizesStore;
    this.sizes = this.sizesStore.getState();

    this.setInstance();
    this.setResizeListner();
  }

  setInstance() {
    console.log("Renderer setInstance Called");

    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
  }

  setResizeListner() {
    this.sizesStore.subscribe((sizes) => {
      this.instance.setSize(sizes.width, sizes.height);
      this.instance.setPixelRatio(sizes.pixelRatio);
    });
  }

  loop() {
    this.instance.render(this.scene, this.camera.instance);
  }
}
