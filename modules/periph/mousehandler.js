'use strict';

NeonFlow.MouseHandler = class MouseHandler {
  constructor (elem) {
    this.elemBoundaries = elem.getBoundingClientRect();
    this.lastClickEvent = null;
    this.lastContextMenuEvent = null;
    this.hitRegions = [];
    this.contextMenuActions = [];
    elem.addEventListener('mousedown', (ev) => {
      this.lastClickEvent = ev;
      this.hitRegions.forEach((hitRegion) => {
        let isCameraDefined = hitRegion.camera instanceof NeonFlow.Camera;
        let xOffset = isCameraDefined ? hitRegion.camera.x : 0;
        let yOffset = isCameraDefined ? hitRegion.camera.y : 0;
        let hrx = hitRegion.x + this.elemBoundaries.left - xOffset;
        let hry = hitRegion.y + this.elemBoundaries.top - yOffset;
        if (hitRegion.isActive) {
          if (
            hitRegion instanceof NeonFlow.RectHitRegion &&
            ev.clientX >= hrx &&
            ev.clientY >= hry &&
            ev.clientX <= hrx + hitRegion.width &&
            ev.clientY <= hry + hitRegion.height
          ) {
            hitRegion.action();
          } else if (
            hitRegion instanceof NeonFlow.CircHitRegion &&
            Math.pow(hrx - ev.clientX, 2) + Math.pow(hry - ev.clientY, 2) <= Math.pow(hitRegion.radius, 2)
          ) {
            hitRegion.action();
          } else if (
            hitRegion instanceof NeonFlow.EllipseHitRegion &&
            hitRegion.width * Math.pow(hrx - ev.clientX, 2) + hitRegion.height * Math.pow(hry - ev.clientY, 2) <= 1
          ) {
            hitRegion.action();
          }
        }
      });
    }, false);
    elem.addEventListener('contextmenu', (ev) => {
      this.lastContextMenuEvent = ev;
    }, false);
  }

  linkHitRegion (hitRegionName) {
    return this.hitRegions.push(NeonFlow.HitRegion.hitRegions[hitRegionName]) - 1;
  }

  unlinkHitRegions () {
    this.hitRegions = [];
  }

  addContextMenuAction (action) {
    return this.contextMenuActions.push(action) - 1;
  }

  removeContextMenuActions () {
    this.contextMenuActions = [];
  }
};
