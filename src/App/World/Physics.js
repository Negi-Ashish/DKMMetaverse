import * as THREE from "three";
import App from "../App.js";
import { appStateStore } from "../Utils/Store.js";

export default class Physics {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;

    this.meshMap = new Map();

    import("@dimforge/rapier3d").then((RAPIER) => {
      const gravity = { x: 0, y: -9.81, z: 0 };
      this.world = new RAPIER.World(gravity);
      this.rapier = RAPIER;

      const groundGeometry = new THREE.BoxGeometry(10, 1, 10);
      const groundMaterial = new THREE.MeshStandardMaterial({ color: "red" });
      this.groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
      this.scene.add(this.groundMesh);

      const groundRigidBodyType = RAPIER.RigidBodyDesc.fixed();
      this.groundRigidBody = this.world.createRigidBody(groundRigidBodyType);

      const groundColliderType = RAPIER.ColliderDesc.cuboid(5, 0.5, 5);
      this.world.createCollider(groundColliderType, this.groundRigidBody);

      this.rapierLoaded = true;
      appStateStore.setState({ physicsReady: true });
    });
  }

  add(mesh) {
    // Create Physics Wolrld Object
    const rigidBodyType = this.rapier.RigidBodyDesc.dynamic();
    this.rigidBody = this.world.createRigidBody(rigidBodyType);
    this.rigidBody.setTranslation(mesh.position);
    this.rigidBody.setRotation(mesh.quaternion);

    const dimensions = this.computeCuboidDimensions(mesh);

    // The dimension passed here needs to be dynamic and the way we will get it is not direct.
    // We will create a compute function which will calculate the dimensions for us dynamically.
    const colliderType = this.rapier.ColliderDesc.cuboid(
      dimensions.x / 2,
      dimensions.y / 2,
      dimensions.z / 2
    );
    this.world.createCollider(colliderType, this.rigidBody);

    this.meshMap.set(mesh, this.rigidBody);
  }

  // mesh.geometry.boundingBox is initially null until you run the computeBoundingBox() function.
  // The getSize function is a bit unusual: it requires a vector as an argument and then returns the updated vector.
  // It would be more convenient if it directly returned the result, but it needs a Vector input.
  // We need getWorldScale because scaling the geometry directly can cause incorrect physics behavior.
  computeCuboidDimensions(mesh) {
    mesh.geometry.computeBoundingBox();
    const size = mesh.geometry.boundingBox.getSize(new THREE.Vector3());
    const worldScale = mesh.getWorldScale(new THREE.Vector3());
    size.multiply(worldScale);
    return size;
  }

  loop() {
    // Update the ThreeJS Mesh According to Physics World Object
    if (!this.rapierLoaded) return;

    this.world.step();

    this.meshMap.forEach((rigidBody, mesh) => {
      const position = rigidBody.translation();
      const rotation = rigidBody.rotation();

      mesh.position.copy(position);
      mesh.quaternion.copy(rotation);
    });
  }
}
