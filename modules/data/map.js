'use strict';

NeonFlow.Map = class Map {
  constructor (name, width, height, arrayType) {
    this.name = name;
    this.register = [];
    this.totalBlocks = width * height;
    this.mapArrayType = arrayType || null;
    if (this.mapArrayType === null) {
      let log = Math.ceil(Math.log2(this.register.length));
      if (log <= 8) {
        this.mapArrayType = Uint8Array;
      } else if (log <= 16) {
        this.mapArrayType = Uint16Array;
      } else if (log <= 32) {
        this.mapArrayType = Uint32Array;
      } else {
        this.mapArrayType = Array;
      }
    }
    this.map = new Array(width);
    for (let slice of this.map) {
      slice = new this.mapArrayType(height);
    }
    NeonFlow.Map.maps[name] = this;
  }

  setIdAt (id, x, y) {
    this.map[x][y] = id;
  }

  setBlockAt (blockName, x, y) {
    this.map[x][y] = getIdByBlockName(block);
  }

  getIdAt (x, y) {
    return this.map[x][y];
  }

  getBlockAt (x, y) {
    return getBlockNameById(this.map[x][y]);
  }

  register (blockName, id) {
    this.register[id] = blockName;
  }

  setRegister (register) {
    this.register = register;
  }

  getIdByBlockName (blockName) {
    return Object.values(this.register).findIndex((el) => el === blockName);
  }

  getBlockNameById (id) {
    return this.register[id];
  }
};

NeonFlow.Map.maps = {};
