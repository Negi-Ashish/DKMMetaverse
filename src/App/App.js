import * as THREE from "three";
import Camera from "./Camera";
import Renderer from "./Renderer";
import Loop from "./Utils/Loop";
import World from "./World/World";
import Resize from "./Utils/Resize";
import AssetLoader from "./Utils/AssetLoader";
import Preloader from "./UI/Preloader";
import InputController from "./UI/InputController";

let instance = null;
export default class App {
  constructor() {
    console.log("App Init");
    if (instance) return instance;
    instance = this;

    // Canvas & Scene
    this.canvas = document.querySelector("canvas.threejs");
    this.scene = new THREE.Scene();

    // Load Assets
    this.assetLoader = new AssetLoader();
    this.preLoader = new Preloader();
    this.InputController = new InputController();

    // World
    this.world = new World();

    // Camera & Renderer
    this.camera = new Camera();
    this.renderer = new Renderer();

    // Important Utils
    this.loop = new Loop();
    this.resize = new Resize();
  }
}
