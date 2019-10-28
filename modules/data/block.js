'use strict';

NeonFlow.Block = class Block {
  constructor (name, tileCodename, width, height) {
    this.name = name;
    this.width = width || 64;
    this.height = height || 64;
    this.tile = tileCodename;
    this.states = [];
    NeonFlow.Block.blocks[name] = this;
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
};

NeonFlow.Block.blocks = {};
