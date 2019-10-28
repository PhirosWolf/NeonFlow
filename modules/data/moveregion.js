'use strict';

NeonFlow.MoveRegion = class MoveRegion {
  constructor (name, action, xOffset, yOffset) {
    this.isActive = true;
    this.action = action;
    this.camera = null;
    this.xOffset = xOffset || 0;
    this.yOffset = yOffset || 0;
    NeonFlow.MoveRegion.moveRegions[name] = this;
  }

  /* Activates the move region */
  activate () {
    this.isActive = true;
  }

  /* Deactivates the move region */
  deactivate () {
    this.isActive = false;
  }

  /* Toggles the move region's activation status */
  toggle () {
    this.isActive = !this.isActive;
  }

  /* Sets a camera */
  setCamera (cameraName) {
    this.camera = NeonFlow.Camera.cameras[cameraName];
  }

  /* Resets camera instance */
  resetCamera () {
    this.camera = null;
  }

  setOffset (x, y) {
    this.xOffset = x;
    this.yOffset = y;
  }
};

NeonFlow.MoveRegion.moveRegions = {};

NeonFlow.RectMoveRegion = class RectMoveRegion extends NeonFlow.MoveRegion {
  constructor (name, x, y, width, height, action) {
    super(name, action);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
};

NeonFlow.CircMoveRegion = class CircMoveRegion extends NeonFlow.MoveRegion {
  constructor (name, x, y, radius, action) {
    super(name, action);
    this.x = x;
    this.y = y;
    this.radius = radius;
  }
}

NeonFlow.EllipseMoveRegion = class EllipseMoveRegion extends NeonFlow.MoveRegion {
  constructor (name, x, y, width, height, action) {
    super(name, action);
    this.x = x;
    this.y = y;
    this.width = Math.pow(width, -2);
    this.height = Math.pow(height, -2);
  }
}
