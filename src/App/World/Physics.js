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

      const groundGeometry = new THREE.BoxGeometry(50, 1, 50);
      const groundMaterial = new THREE.MeshStandardMaterial({ color: "red" });
      this.groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
      this.scene.add(this.groundMesh);

      const groundRigidBodyType = RAPIER.RigidBodyDesc.fixed();
      this.groundRigidBody = this.world.createRigidBody(groundRigidBodyType);

      const groundColliderType = RAPIER.ColliderDesc.cuboid(25, 0.5, 25);
      this.world.createCollider(groundColliderType, this.groundRigidBody);

      this.rapierLoaded = true;
      appStateStore.setState({ physicsReady: true });
    });
  }

  add(mesh) {
    // Create Physics Wolrld Object
    const rigidBodyType = this.rapier.RigidBodyDesc.dynamic();
    this.rigidBody = this.world.createRigidBody(rigidBodyType);

    const worldPosition = mesh.getWorldPosition(new THREE.Vector3());
    const worldRotation = mesh.getWorldQuaternion(new THREE.Quaternion());

    this.rigidBody.setTranslation(worldPosition);
    this.rigidBody.setRotation(worldRotation);

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
      const position = new THREE.Vector3().copy(rigidBody.translation());
      const rotation = new THREE.Quaternion().copy(rigidBody.rotation());

      // for position
      mesh.parent.worldToLocal(position);

      // for rotation
      const inverseParentMatrix = new THREE.Matrix4()
        .extractRotation(mesh.parent.matrixWorld)
        .invert();
      const inverseParentRotation =
        new THREE.Quaternion().setFromRotationMatrix(inverseParentMatrix);

      rotation.premultiply(inverseParentRotation);

      mesh.position.copy(position);
      mesh.quaternion.copy(rotation);
    });
  }
}
