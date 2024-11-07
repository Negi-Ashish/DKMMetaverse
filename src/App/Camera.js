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

    this.instance.position.z = 100;
    this.instance.position.y = 20;
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

    // Checking if the charcater is ready, i.e. Physics is ready and character is loaded.
    this.character = this.app.world.character?.rigidBody;
    if (this.character) {
      const characterRotation = this.character.rotation();
      const characterPosition = this.character.translation();

      const cameraOffset = new THREE.Vector3(0, 30, 55);
      cameraOffset.applyQuaternion(characterRotation);
      cameraOffset.add(characterPosition);

      const targetOffset = new THREE.Vector3(0, 10, 0);
      targetOffset.applyQuaternion(characterRotation);
      targetOffset.add(characterPosition);

      // Play with this properties to deal with how fast does camera roatates and come back to original position
      // And How fast with the camera follow the character.
      this.instance.position.lerp(cameraOffset, 0.05);
      this.controls.target.lerp(targetOffset, 0.1);

      // Commented function is a look at function for a camera
      // this.instance.lookAt(camerLookat);
    }

    // console.log("Camera loop called");
  }
}
