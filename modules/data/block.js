'use strict';

NeonFlow.Block = class Block {
  constructor (name, tileCodename) {
    this.x = 0;
    this.y = 0;
    this.width = 64;
    this.height = 64;
    this.tile = tileCodename;
    this.states = [];
    NeonFlow.Block.blocks[name] = this;
  }

  setCoordinates (x, y) {
    this.x = x;
    this.y = y;
  }

  setSize (width, height) {
    this.width = width;
    this.height = height;
  }

  addState (tileCodename) {
    this.states.push(tileCodename);
  }

  removeStates () {
    this.states = [];
  }

  setStates (...tilesCodenames) {
    this.states = tilesCodenames;
  }

  setState (n, tileCodename) {
    this.states[n] = tileCodename;
  }
}

NeonFlow.Block.blocks = {};
