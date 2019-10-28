'use strict';

NeonFlow.Layer = class Layer {
  /*
  * NOTE: layerIndex = 0 for background
  * layerIndex = (maximum index) for foreground
  */
  constructor (name, layerIndex, action) {
    this.index = layerIndex;
    this.action = action;
    NeonFlow.Layer.layers[name] = this;
    if (NeonFlow.Layer.preSortLayers) {
      NeonFlow.Layer.updatePreSort();
    }
  }

  /* Sets the layer index */
  setLayerIndex (layerIndex) {
    this.index = layerIndex || 0;
    if (NeonFlow.Layer.preSortLayers) {
      NeonFlow.Layer.updatePreSort();
    }
  }

  /* Sets layer index to minimum (background) */
  setLayerIndexToBackground () {
    let tmp = NeonFlow.Layer.getBackgroundLayerIndex();
    if (tmp !== this.index) {
      this.index = tmp - 1;
    }
    if (NeonFlow.Layer.preSortLayers) {
      NeonFlow.Layer.updatePreSort();
    }
  }

  /* Sets layer index to maximum (foreground) */
  setLayerIndexToForeground () {
    let tmp = NeonFlow.Layer.getForegroundLayerIndex();
    if (tmp !== this.index) {
      this.index = tmp + 1;
    }
    if (NeonFlow.Layer.preSortLayers) {
      NeonFlow.Layer.updatePreSort();
    }
  }

  /* Returns the smallest layer index (background) */
  static getBackgroundLayerIndex () {
    return Object.values(NeonFlow.Layer.layers).map((el) => el.index).sort()[0];
  }

  /* Returns the smallest layer index (foreground) */
  static getForegroundLayerIndex () {
    return Object.values(NeonFlow.Layer.layers).map((el) => el.index).sort((cur, pre) => pre >= cur)[0];
  }

  /* Updates the pre-sorting layer register or a given array of layers */
  static updatePreSort (layers) {
    if (layers instanceof Array) {
      return layers.sort((cur, pre) => cur.index >= pre.index);
    } else {
      NeonFlow.Layer.sortedLayers = Object.values(NeonFlow.Layer.layers).sort((cur, pre) => cur.index >= pre.index);
    }
  }
};

NeonFlow.Layer.preSortLayers = true;
NeonFlow.Layer.sortedLayers = [];
NeonFlow.Layer.layers = {};
