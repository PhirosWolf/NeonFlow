'use strict';

NeonFlow.GUI = class GUI {
  constructor (name, tileCodename, width, height) {
    this.hitRegions = [];
    this.tileCodename = tileCodename;
    this.width = width || 0;
    this.height = height || 0;
    NeonFlow.GUI.GUIs[name] = this;
  }

  /* Adds a hit region */
  addHitRegion (hitRegionName) {
    let firstAvailableSpace = this.hitRegions.findIndex((el) => el === null);
    if (firstAvailableSpace === -1) {
      return this.hitRegions.push(hitRegionName) - 1;
    } else {
      this.hitRegions[firstAvailableSpace] = hitRegionName;
      return firstAvailableSpace;
    }
  }

  /* Removes one hit region */
  removeHitRegion (index) {
    this.hitRegion[index] = null;
  }

  /* Removes all hit regions */
  removeHitRegions () {
    this.hitRegions = [];
  }
};

NeonFLow.GUI.GUIs = {};
