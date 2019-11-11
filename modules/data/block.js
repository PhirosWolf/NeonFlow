'use strict';

NeonFlow.Block = class Block {
  constructor (name, tileCodename, width, height) {
    this.name = name;
    this.width = width || 64;
    this.height = height || 64;
    this.tile = tileCodename;
    this.hitbox = null;
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

  setHitbox (hitbox) {
    NeonFlow.chkDep(['data/neoncd']);
    this.hitbox = hitbox || new NeonFlow.NeonCD.Hitbox(0, 0, this.width, this.height);
  }

  removeHitbox (hitbox) {
    this.hitbox = null;
  }
};

NeonFlow.Block.blocks = {};
