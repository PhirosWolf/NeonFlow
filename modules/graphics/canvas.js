'use strict';

NeonFlow.Canvas = class Canvas {
  constructor (width, height) {
    this.camera = null;
    this.layers = [];
    this.hitRegions = [];
    this.dontDrawOffsetElements = true;
    this.canvas = document.createElement('canvas');
    this.canvas.width = width || window.innerWidth;
    this.canvas.height = height || window.innerHeight;
    this.canvas.setAttribute('class', 'neonflow-canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  /* Sets the canvas' size */
  setSize (width, height) {
    this.canvas.width = width || window.innerWidth;
    this.canvas.height = height || window.innerHeight;
  }

  /* Sets the canvas' size to have the size of the inner browser's window */
  setFullscreenSize () {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  /* Adds the canvas ater a given element (or after the last child of <body>) */
  addAfterElement (elem) {
    if (elem) {
      elem.insertAdjacentElement('afterend', this.canvas);
    } else {
      document.body.appendChild(this.canvas);
    }
  }

  /* Clears the canvas */
  clear () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /* Draws a tile at the given absolute coordinates with the given size */
  drawTile (tileCodename, x, y, width, height) {
    x = x || 0;
    y = y || 0;
    let parsedCodename = tileCodename.split('.');
    let tileset = NeonFlow.Tileset.tilesets[parsedCodename[0]];
    let tile = tileset.tiles[parsedCodename[1]];
    width = width || tile[2];
    height = height || tile[3];
    if (
      this.dontDrawOffsetElements && !(
        x + width <= 0 ||
        y + height <= 0 ||
        x >= this.canvas.width ||
        y >= this.canvas.height
      )
    ) {
      let isCameraDefined = this.camera instanceof NeonFlow.Camera;
      let xScale = isCameraDefined ? this.camera.scaleX : 1;
      let yScale = isCameraDefined ? this.camera.scaleY : 1;
      this.ctx.drawImage(tileset.tileset, ...tile, x, y, width * xScale, height * yScale);
    }
  }

  /* Draws a tile at the given relative coordinates with the given size */
  drawTileRelative (tileCodename, x, y, width, height) {
    let isCameraDefined = this.camera instanceof NeonFlow.Camera;
    let xOffset = isCameraDefined ? this.camera.x : 0;
    let yOffset = isCameraDefined ? this.camera.y : 0;
    let xScale = isCameraDefined ? this.camera.scaleX : 1;
    let yScale = isCameraDefined ? this.camera.scaleY : 1;
    this.drawTile(tileCodename, (x || 0) - xOffset, (y || 0) - yOffset, width * xScale, height * yScale);
  }

  /* Draws a block */
  drawBlock (blockName, x, y, width, height) {
    let parsedBlockName = blockName.split(':');
    let blockState = parseInt(parsedBlockName[1] || 0);
    let block = NeonFlow.Block.blocks[parsedBlockName[0]];
    let isCameraDefined = this.camera instanceof NeonFlow.Camera;
    let xOffset = isCameraDefined ? this.camera.x : 0;
    let yOffset = isCameraDefined ? this.camera.y : 0;
    let xScale = isCameraDefined ? this.camera.scaleX : 1;
    let yScale = isCameraDefined ? this.camera.scaleY : 1;
    x = (x || block.x) - xOffset;
    y = this.canvas.height - (y || block.y) + yOffset;
    width = width || block.width;
    height = height || block.width;
    let tile = !blockState ? block.tile : block.states[Math.abs(blockState) - 1];
    this.drawTile(tile, x, y, width * xScale, height * yScale);
  }

  /* Draws a GUI */
  drawGUI (guiName) {

  }

  /* Sets the current instance of camera that the canvas has to use */
  setCamera (cameraName) {
    this.camera = NeonFlow.Camera.cameras[cameraName];
  }

  /* Resets camera instance */
  resetCamera () {
    this.camera = null;
  }

  /* Adds a layer */
  addLayer (layer) {

  }

  /* Removes all layers */
  removeLayers () {
    this.layers = [];
  }

  /* Adds a hit region */
  addHitRegion (hitregion) {

  }

  /* Removes all hit regions */
  removeHitRegions () {
    this.hitRegions = [];
  }
};
