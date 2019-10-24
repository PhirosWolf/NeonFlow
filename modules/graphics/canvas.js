'use strict';

NeonFlow.Canvas = class Canvas {
  constructor (width, height) {
    this.camera = null;
    this.layers = [];
    this.hitRegions = [];
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

  /* Draws a tile at the given coordinates with the given size */
  drawTile (tileCodename, x, y, width, height) {
    let parsedCodename = tileCodename.split('.');
    let tileset = NeonFlow.Tileset.tilesets[parsedCodename[0]];
    let tile = tileset.tiles[parsedCodename[1]];
    this.ctx.drawImage(tileset.tileset, ...tile, x || 0, y || 0, width || tile[2], height || tile[3]);
  }

  /* Draws a block */
  drawBlock (blockName, x, y, width, height) {
    let parsedBlockName = blockName.split(':');
    let blockState = parseInt(parsedBlockName[1] || 0);
    let block = NeonFlow.Block.blocks[parsedBlockName[0]];
    let tile = !blockState ? block.tile : block.states[Math.abs(blockState) - 1];
    // change the coordinate system and make this instruction handle the current camera
    this.drawTile(tile, x || block.x, y || block.y, width || block.width, height || block.height);
  }

  /* Draws a GUI */
  drawGUI (gui) {

  }

  /* Sets the current instance of camera that the canvas has to use */
  setCamera (cam) {

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
}
