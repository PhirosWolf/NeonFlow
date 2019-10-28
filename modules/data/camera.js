'use strict';

NeonFlow.Camera = class Camera {
  constructor (name) {
    this.name = name;
    this.x = 0;
    this.y = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    NeonFlow.Camera.cameras[name] = this;
  }

  /* Relative movement */
  moveBy (x, y) {
    this.x += x;
    this.y += y;
  }

  /* Absolute movement */
  moveTo (x, y) {
    this.x = x;
    this.y = y;
  }
};

NeonFlow.Camera.cameras = {};
