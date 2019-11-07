'use strict';

NeonFlow.HitRegion = class HitRegion {
  constructor (name, action) {
    this.isActive = true;
    this.action = action;
    this.camera = null;
    NeonFlow.HitRegion.hitRegions[name] = this;
  }

  /* Activates the hit region */
  activate () {
    this.isActive = true;
  }

  /* Deactivates the hit region */
  deactivate () {
    this.isActive = false;
  }

  /* Toggles the hit region's activation status */
  toggle () {
    this.isActive = !this.isActive;
  }

  /* Sets a camera */
  setCamera (cameraName) {
    NeonFlow.chkDep(['data/camera']);
    this.camera = NeonFlow.Camera.cameras[cameraName];
  }

  /* Resets camera instance */
  resetCamera () {
    this.camera = null;
  }
};

NeonFlow.HitRegion.hitRegions = {};

NeonFlow.RectHitRegion = class RectHitRegion extends NeonFlow.HitRegion {
  constructor (name, x, y, width, height, action) {
    super(name, action);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
};

NeonFlow.CircHitRegion = class CircHitRegion extends NeonFlow.HitRegion {
  constructor (name, x, y, radius, action) {
    super(name, action);
    this.x = x;
    this.y = y;
    this.radius = radius;
  }
};

NeonFlow.EllipseHitRegion = class EllipseHitRegion extends NeonFlow.HitRegion {
  constructor (name, x, y, width, height, action) {
    super(name, action);
    this.x = x;
    this.y = y;
    this.width = Math.pow(width, -2);
    this.height = Math.pow(height, -2);
  }
};
