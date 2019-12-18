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

  /* Sets the block's size */
  setSize (width, height) {
    this.width = width;
    this.height = height;
  }

  /* Adds a state */
  addState (tileCodename) {
    this.states.push(tileCodename);
  }

  /* Remove every states */
  removeStates () {
    this.states = [];
  }

  /* Sets the block's states */
  setStates (...tilesCodenames) {
    this.states = tilesCodenames;
  }

  /* Sets the block's state for a given index */
  setState (n, tileCodename) {
    this.states[n] = tileCodename;
  }

  /* Sets the block's hitbox */
  setHitbox (hitbox) {
    NeonFlow.chkDep(['data/neoncd']);
    this.hitbox = hitbox || new NeonFlow.NeonCD.Hitbox(0, 0, this.width, this.height);
  }

  /* Removes the block's hitbox */
  removeHitbox (hitbox) {
    this.hitbox = null;
  }
};

NeonFlow.Block.blocks = {};
