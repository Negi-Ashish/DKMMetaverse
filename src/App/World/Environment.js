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
    // const geomentry = new THREE.BoxGeometry(1, 1, 1);
    const geomentry = new THREE.TorusKnotGeometry(1, 0.3, 30, 8);
    const material = new THREE.MeshStandardMaterial({ color: "orange" });
    this.cubeMesh = new THREE.Mesh(geomentry, material);
    this.cubeMesh.position.y = 10;
    this.cubeMesh.rotation.x = 1;
    this.cubeMesh.rotation.z = 1;
    // this.scene.add(this.cubeMesh);

    // another mesh to test group
    const material2 = new THREE.MeshStandardMaterial({ color: "green" });
    this.cubeMesh2 = new THREE.Mesh(geomentry, material2);
    this.cubeMesh2.position.y = 15;
    this.cubeMesh2.rotation.x = 2;
    this.cubeMesh2.rotation.z = 2;
    this.cubeMesh2.scale.set(2, 2, 2);
    // this.scene.add(this.cubeMesh2);

    // dealing with group
    const group = new THREE.Group();
    group.add(this.cubeMesh, this.cubeMesh2);
    group.position.y = 10;
    group.rotation.x = 0.5;
    this.scene.add(group);

    // Apply physics to the meshes
    this.physics.add(this.cubeMesh, "dynamic", "trimesh");
    this.physics.add(this.cubeMesh2, "dynamic", "trimesh");

    const groundGeometry = new THREE.BoxGeometry(50, 1, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: "red" });
    this.groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    this.scene.add(this.groundMesh);
    this.physics.add(this.groundMesh, "fixed", "cuboid");
  }
}
