import assetStore from "../Utils/AssetStore";
import { appStateStore } from "../Utils/Store";

export default class Preloader {
  constructor() {
    this.assetStore = assetStore;

    // Hiding the Screen before everything gets loaded
    this.overlay = document.querySelector(".overlay");
    this.loading = document.querySelector(".loading");
    this.startButton = document.querySelector(".start");

    this.assetStore.subscribe((state) => {
      // console.log("STATE", state.loadedAssets);
      this.numberOfLoadedAssets = Object.keys(state.loadedAssets).length;
      this.numberOfAssetsToLoad = state.assetsToLoad.length;
      this.progress = this.numberOfLoadedAssets / this.numberOfAssetsToLoad;
      // console.log("progress", this.progress);

      document.getElementById("progressPercentage").innerHTML = Math.trunc(
        this.progress * 100
      );

      if (this.progress === 1) {
        appStateStore.setState({ assetsReady: true });
        this.loading.classList.add("fade");
        window.setTimeout(() => this.ready(), 1200);
      }
    });
  }

  ready() {
    // remove the loading elelemnt from DOM
    this.loading.remove();

    this.startButton.style.display = "inline";
    this.startButton.classList.add("fadeIn");

    this.startButton.addEventListener(
      "click",
      () => {
        this.overlay.classList.add("fade");
        this.startButton.classList.add("fadeOut");

        // remove the overlay  and startButton elelemnt from DOM
        window.setTimeout(() => {
          this.overlay.remove();
          this.startButton.remove();
        }, 2000);
      },
      { once: true }
    );
  }
}
