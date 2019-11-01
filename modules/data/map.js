'use strict';

NeonFlow.Map = class Map {
  constructor (name, width, height, blockWidth, blockHeight, arrayType) {
    this.name = name;
    this.blockRegister = ['default.void'];
    this.totalBlocks = width * height;
    this.blockWidth = blockWidth || 64;
    this.blockHeight = blockHeight || 64;
    this.mapArrayType = arrayType || null;
    this.width = width;
    this.height = height;
    if (this.mapArrayType === null) {
      /*  Uses the most efficient array type to store map data */
      let log = Math.ceil(Math.log2(this.blockRegister.length));
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
    for (let i = 0; i < width; ++i) {
      this.map[i] = new this.mapArrayType(height);
    }
    for (let i = 0; i < this.map.width; ++i) {
      for (let j = 0; j < this.map.height; ++j) {
        this.map[i][j] = 0;
      }
    }
    NeonFlow.Map.maps[name] = this;
  }

  /* Sets the map to a given 2D array */
  setMap (array2d) {
    this.map = array2d;
  }

  /* Sets a region of the map to a given 2D array */
  setRegion (x, y, array2d, replaceAll) {
    y = this.height - y - 1;
    replaceAll = replaceAll === undefined ? true : replaceAll;
    for (let i = 0; i < array2d.length; ++i) {
      for (let j = 0; j < array2d[i].length; ++j) {
        if (!replaceAll && this.map[i + x][y - j] === 0) {
          this.map[i + x][y - j] = array2d[i][j];
        } else if (replaceAll) {
          this.map[i + x][y - j] = array2d[i][j];
        }
      }
    }
  }

  /* Returns a region of the map (!!! with the reversed y coordinates !!!) */
  getRegion (x, y, width, height) {
    return this.map.slice(x, x + width).map((slice) => slice.slice(this.height - y - height, this.height - y).reverse());
  }

  setReferenceBlockSize (width, height) {
    this.blockWidth = width || 64;
    this.blockHeight = height || 64;
  }

  /* Sets an id at a given position in the map */
  setIdAt (id, x, y) {
    this.map[x][this.height - y - 1] = id;
  }

  /* Sets a block (by searching its id in the register) at a given position in the map */
  setBlockAt (blockName, x, y) {
    this.map[x][this.height - y - 1] = getIdByBlockName(block);
  }

  /* Returns the id at a given position in the map */
  getIdAt (x, y) {
    return this.map[x][this.height - y - 1];
  }

  /* Returns the id of a given block */
  getIdByBlockName (blockName) {
    return Object.values(this.blockRegister).findIndex((el) => el === blockName);
  }

  /* Returns the block name by searching the given id into the register */
  getBlockNameById (id) {
    return this.blockRegister[id];
  }

  /* Returns the block name for a given position in the map by searching its name using the register */
  getBlockAt (x, y) {
    return this.getBlockNameById(this.map[x][this.height - y - 1]);
  }

  /* Registers a block with a given id */
  register (blockName, id) {
    this.blockRegister[id] = blockName;
  }

  /* Sets the register */
  setRegister (blockRegister) {
    this.blockRegister = blockRegister;
  }
};

NeonFlow.Map.maps = {};
