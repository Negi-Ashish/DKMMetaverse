import { createStore } from "zustand/vanilla";

const assetsToLoad = [
  {
    id: "avatar",
    path: "/models/avatar.glb",
    type: "model",
  },
  {
    id: "environment",
    path: "/models/metaverseedited5.glb",
    type: "model",
  },
];

// addLoad function is just adding assets to loadedAssets object once they are loaded
const assetStore = createStore((set) => ({
  assetsToLoad,
  loadedAssets: {},
  addLoadedAsset: (asset, id) =>
    set((state) => ({
      loadedAssets: {
        ...state.loadedAssets,
        [id]: asset,
      },
    })),
}));
export default assetStore;
