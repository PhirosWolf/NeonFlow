'use strict';

/* NeonCD stands for NeonFlow Collision Detector */
NeonFlow.NeonCD = class NeonCD {
  constructor (...hitboxes) {
    this.hitboxes = hitboxes;
  }

  fromMap (mapName) {
    NeonFlow.chkDep(['data/map']);
    let map = NeonFlow.Map.maps[mapName];
    for (let i = 0; i < map.map.length; ++i) {
      for (let j = 0; j < map.map[0].length; ++j) {

      }
    }
  }
};

NeonFlow.NeonCD.Node = class Node {
  constructor (x, y, links) {
    this.x = x || 0;
    this.y = y || 0;
    this.links = links || [];
  }

  /* Sets coordinates of the node */
  setCoordinates (x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  /* Sets the links of the node */
  setLinks (links) {
    this.links = links || [];
  }

  /* Adds a link */
  addLink (link) {
    let availableSpace = this.links.findIndex((el) => el === null);
    if (availableSpace === -1) {
      return this.links.push(link) - 1;
    } else {
      this.links[availableSpace] = link;
      return availableSpace;
    }
  }

  /* Removes a link */
  removeLink (index) {
    this.links[index] = null;
  }

  /* Removes a link by looking at its name */
  removeLinkByName (name) {
    this.removeLink(this.links.findIndex((link) => link.name === name));
  }

  /* Removes all links */
  removeLinks () {
    this.links = [];
  }
};

NeonFlow.NeonCD.Link = class Link {
  constructor (name, nodeA, nodeB, autoAdd) {
    this.autoAdd = autoAdd === undefined ? true : autoAdd;
    this.name = name;
    this.nodeA = nodeA;
    this.nodeB = nodeB;
    if (this.autoAdd) {
      this.nodeA.addLink(this.name);
      this.nodeB.addLink(this.name);
    }
    NeonFlow.NeonCD.Link.links[name] = this;
  }

  /* Sets the first node of the link */
  setNodeA (point) {
    if (this.autoAdd) {
      this.nodeA.removeLinkByName(this.name);
    }
    this.nodeA = point;
    if (this.autoAdd) {
      this.nodeA.addLink(this.name);
    }
  }

  /* Sets the second node of the link */
  setNodeB (point) {
    if (this.autoAdd) {
      this.nodeB.removeLinkByName(this.name);
    }
    this.nodeB = point;
    if (this.autoAdd) {
      this.nodeB.addLink(this.name);
    }
  }

  /* Sets both nodes */
  setNodes (nodeA, nodeB) {
    if (this.autoAdd) {
      this.nodeA.removeLinkByName(this.name);
    }
    this.nodeA = point;
    if (this.autoAdd) {
      this.nodeA.addLink(this.name);
      this.nodeB.removeLinkByName(this.name);
    }
    this.nodeB = point;
    if (this.autoAdd) {
      this.nodeB.addLink(this.name);
    }
  }
};

NeonFlow.NeonCD.Link.links = {};

NeonFlow.NeonCD.Hitbox = class Hitbox {
  constructor (sourceX, sourceY, ...nodes) {
    /* Coordinates are relative to the top left corner of the tileset */
    this.nodes = [sourceX || 0, sourceY || 0, ...nodes];
  }

  /* Sets hitbox first node's coordinates */
  setSource (sourceX, sourceY) {
    this.nodes[0] = sourceX;
    this.nodes[1] = sourceY;
  }

  /* Adds a node */
  addNode (x, y) {
    this.nodes.push(x || 0, y || 0);
  }

  /* Sets the node at a specific index */
  setNode (x, y, index) {
    this.nodes[index] = x;
    this.nodes[index + 1] = y;
  }

  /* Adds multiple nodes */
  addNodes (...nodes) {
    this.nodes.push(...nodes);
  }

  /* Sets all nodes */
  setNodes (...nodes) {
    this.nodes = [this.nodes[0], this.nodes[1], ...nodes];
  }
};

NeonFlow.NeonCD.QuadTree = class QuadTree {
  constructor (x, y, width, height, capacity) {
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 256;
    this.halfWidth = Math.floor(this.width / 2);
    this.height = height || 256;
    this.halfHeight = Math.floor(this.height / 2);
    this.isDivided = false;
    this.capacity = capacity || 4;
    this.nodes = [];
    /* 0: NW, 1: NE, 2: SW, 3: SE */
    this.zones = [];
  }

  checkForDivision () {
    if (!this.isDivided && this.nodes.length > this.capacity && this.halfWidth > 0 && this.halfHeight > 0) {
      if (this.halfWidth === 1 && this.halfHeight === 1) {
        console.warn("Capacity Overflow : The nodes were added but they exceed the QuadTree's capacity.\nAdvice : Try to prevent creating nodes with the same coordinates.");
      }
      this.isDivided = true;
      for (let i = 0; i < 2; ++i) {
        for (let j = 0; j < 2; ++j) {
          this.zones[i * 2 + j] = new NeonFlow.NeonCD.QuadTree(this.x + j * this.halfWidth, this.y + i * this.halfHeight, this.halfWidth, this.halfHeight, this.capacity);
        }
      }
      for (let node of this.nodes) {
        if (node.x < this.x + this.halfWidth) {
          if (node.y < this.y + this.halfHeight) {
            this.zones[0].addNode(node);
          } else {
            this.zone[2].addNode(node);
          }
        } else {
          if (node.y < this.y + this.halfHeight) {
            this.zones[1].addNode(node);
          } else {
            this.zones[3].addNode(node);
          }
        }
      }
      this.nodes = [];
    }
  }

  contains (x, y) {
    x = x || 0;
    y = y || 0;
    return x >= this.x && x < this.x + this.width && y >= this.y && y < this.y + this.height;
  }

  addNode (node) {
    if (this.contains(node.x, node.y)) {
      if (this.isDivided) {
        this.zones.forEach((zone) => {
          zone.addNode(node);
        });
      } else {
        this.nodes.push(node);
        this.checkForDivision();
      }
    }
  }

  query (x, y, width, height) {
    x = x || 0;
    y = y || 0;
    width = width === undefined ? this.width : width;
    height = height === undefined ? this.height : height;
    let result = [];
    if (
      x + width >= this.x &&
      y + height >= this.y &&
      x <= this.x + this.width &&
      y <= this.y + this.height
    ) {
      if (this.isDivided) {
        this.zones.forEach((zone) => {
          result.push(...zone.query(x, y, width, height));
        });
      } else {
        this.nodes.forEach((node) => {
          if (
            node.x >= x &&
            node.y >= y &&
            node.x <= x + width &&
            node.y <= y + height
          ) {
            result.push(node);
          }
        });
      }
    }
    return result;
  }

  // TODO
  queryWithLinks (x, y, width, height, degreeOfRelation) {
    /*x = x || 0;
    y = y || 0;
    width = width === undefined ? this.width : width;
    height = height === undefined ? this.height : height;
    let result = [];
    if (
      x + width >= this.x &&
      y + height >= this.y &&
      x <= this.x + this.width &&
      y <= this.y + this.height
    ) {
      if (this.isDivided) {
        this.zones.forEach((zone) => {
          result.push(...zone.query(x, y, width, height));
        });
      } else {
        this.nodes.forEach((node) => {
          if (
            node.x >= x &&
            node.y >= y &&
            node.x <= x + width &&
            node.y <= y + height
          ) {
            result.push(node);
          }
        });
      }
    }
    return result;*/
  }
};
