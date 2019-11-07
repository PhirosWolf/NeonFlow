'use strict';

NeonFlow.Canvas = class Canvas {
  constructor (width, height) {
    this.camera = null;
    this.layers = [];
    this.sortedLayers = [];
    this.preSortLayers = true;
    this.hitRegions = [];
    this.guiMouseHandlers = [];
    this.dontDrawOffsetElements = true;
    this.canvas = document.createElement('canvas');
    this.canvas.width = width || window.innerWidth;
    this.canvas.height = height || window.innerHeight;
    this.canvas.setAttribute('class', 'neonflow-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.tileRotation = 0;
    this.tileRotationUnit = 'deg';
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

  /* Sets the tile rotation */
  setTileRotation (angle, unit) {
    angle = angle || 0;
    this.tileRotationUnit = unit === 'deg' ? 'deg' : 'rad';
    if (this.tileRotationUnit === 'deg') {
      this.tileRotation = angle % 360;
    } else {
      this.tileRotation = angle % (2 * Math.PI);
    }
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
    NeonFlow.chkDep(['graphics/tileset', 'data/camera']);
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
      let translatedX = x + Math.round(width / 2);
      let translatedY = y + Math.round(height / 2);
      if (this.tileRotation !== 0) {
        this.ctx.translate(translatedX, translatedY);
        if (this.tileRotationUnit === 'rad') {
          this.ctx.rotate(this.tileRotation);
        } else {
          this.ctx.rotate(this.tileRotation * Math.PI / 180);
        }
        this.ctx.drawImage(tileset.tileset, ...tile, x - translatedX, y - translatedY, width * xScale, height * yScale);
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      } else {
        this.ctx.drawImage(tileset.tileset, ...tile, x, y, width * xScale, height * yScale);
      }
    }
  }

  /* Draws a tile at the given relative coordinates with the given size */
  drawTileRelative (tileCodename, x, y, width, height) {
    NeonFlow.chkDep(['data/camera']);
    let isCameraDefined = this.camera instanceof NeonFlow.Camera;
    let xOffset = isCameraDefined ? this.camera.x : 0;
    let yOffset = isCameraDefined ? this.camera.y : 0;
    let xScale = isCameraDefined ? this.camera.scaleX : 1;
    let yScale = isCameraDefined ? this.camera.scaleY : 1;
    this.drawTile(tileCodename, (x || 0) - xOffset, (y || 0) - yOffset, width * xScale, height * yScale);
  }

  /* Draws a block */
  drawBlock (blockName, x, y, width, height) {
    NeonFlow.chkDep(['data/block']);
    let parsedBlockName = blockName.split(':');
    let blockState = parseInt(parsedBlockName[1] || 0);
    let block = NeonFlow.Block.blocks[parsedBlockName[0]];
    width = width || block.width;
    height = height || block.width;
    let tile = !blockState ? block.tile : block.states[Math.abs(blockState) - 1];
    this.drawTileRelative(tile, x, y, width, height);
  }

  /* Draws a block with coordinates relative to the block's size */
  drawBlockRelative (blockName, x, y, width, height) {
    NeonFlow.chkDep(['data/block']);
    let parsedBlockName = blockName.split(':');
    let blockState = parseInt(parsedBlockName[1] || 0);
    let block = NeonFlow.Block.blocks[parsedBlockName[0]];
    x = x * width;
    y = this.canvas.height - (y + 1) * height;
    width = width || block.width;
    height = height || block.width;
    let tile = !blockState ? block.tile : block.states[Math.abs(blockState) - 1];
    this.drawTileRelative(tile, x, y, width, height);
  }

  /* Draws a GUI */
  drawGUI (guiName, x, y, cameraRelative) {
    NeonFlow.chkDep(['graphics/gui', 'periph/mousehandler', 'data/hitregion']);
    cameraRelative = !!cameraRelative;
    let gui = NeonFlow.GUI.GUIs[guiName];
    let firstAvailableSpace = this.guiMouseHandlers.findIndex((el) => el === null);
    let mhTmp = new NeonFlow.MouseHandler(this.canvas, x || 0, y || 0);
    let mhIndex = 0;

    if (firstAvailableSpace === -1) {
      mhIndex = this.guiMouseHandlers.push(mhTmp) - 1;
    } else {
      this.guiMouseHandlers[firstAvailableSpace] = mhTmp;
      mhIndex = firstAvailableSpace;
    }
    if (cameraRelative) {
      this.drawTileRelative(gui.tileCodename, x || 0, y || 0, gui.width || undefined, gui.height || undefined);
      for (let hitRegion of gui.hitRegions) {
        if (this.camera !== null) {
          NeonFlow.HitRegion.hitRegions[hitRegion].setCamera(this.camera.name);
        }
        mhTmp.linkHitRegion(hitRegion);
      }
    } else {
      this.drawTile(gui.tileCodename, x || 0, y || 0, gui.width || undefined, gui.height || undefined);
      for (let hitRegion of gui.hitRegions) {
        mhTmp.linkHitRegion(hitRegion);
      }
    }

    return mhIndex;
  }

  /* Properly exits a GUI */
  exitGUI (index) {
    this.guiMouseHandlers[index].unlinkHitRegions();
    this.guiMouseHandlers[index] = null;
  }

  /* Properly exits all GUIs */
  exitGUIs () {
    this.guiMouseHandlers.forEach((mh) => {
      mh.unlinkHitRegions();
    });
    this.guiMouseHandlers = [];
  }

  /* Sets the current instance of camera that the canvas has to use */
  setCamera (cameraName) {
    NeonFlow.chkDep(['data/camera']);
    this.camera = NeonFlow.Camera.cameras[cameraName];
  }

  /* Resets camera instance */
  resetCamera () {
    this.camera = null;
  }

  /* Adds a layer */
  addLayer (layerName) {
    NeonFlow.chkDep(['data/layer']);
    this.layers.push(NeonFlow.Layer.layers[layerName]);
    if (this.preSortLayers) {
      this.sortedLayers = NeonFlow.Layer.updatePreSort(this.layers);
    }
  }

  /* Executes layers actions in order of their layer index */
  execLayers () {
    NeonFlow.chkDep(['data/layer']);
    if (this.preSortLayers) {
      this.sortedLayers.forEach((layer) => {
        layer.action();
      });
    } else {
      NeonFlow.Layer.updatePreSort(this.layers).forEach((layer) => {
        layer.action();
      });
    }
  }

  /* Removes all layers */
  removeLayers () {
    this.layers = [];
    this.sortedLayers = [];
  }

  /* Draws a map */
  drawMap (mapName) {
    NeonFlow.chkDep(['data/camera', 'data/map']);
    let isCameraDefined  = this.camera instanceof NeonFlow.Camera;
    let cameraX = isCameraDefined ? 0 : this.camera.x;
    let cameraY = isCameraDefined ? 0 : this.camera.y;
    let map = NeonFlow.Map.maps[mapName];

    /* O(n^2) */
    for (let i = 0; i < map.width; ++i) {
      for (let j = 0; j < map.height; ++j) {
        this.drawBlockRelative(map.getBlockAt(i, j), i, j, map.blockWidth, map.blockHeight);
      }
    }
  }
};
