import * as THREE from "three";

import App from "../App.js";

// Used for addding Lights to our scene
export default class Environment {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    this.physics = this.app.world.physics;

    this.loadEnvironment();
    this.addMeshes();
  }

  loadEnvironment() {
    // lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(1, 1, 1);
    this.directionalLight.castShadow = true;
    this.scene.add(this.directionalLight);
  }

  addMeshes() {
    // Create ThreeJS Mesh
    const geomentry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: "orange" });
    this.cubeMesh = new THREE.Mesh(geomentry, material);
    this.cubeMesh.position.y = 10;
    this.cubeMesh.rotation.x = 1;
    this.cubeMesh.rotation.z = 1;
    this.scene.add(this.cubeMesh);

    this.physics.add(this.cubeMesh);
  }
}
