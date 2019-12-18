'use strict';

/**
* TODO :
* - Links / pointers between nodes
* - QuadTree's support of linked/pointed nodes
* - Hitboxes support /!\ Might produce floating-points numbers /!\
**/

/* NeonCD stands for NeonFlow Collision Detector */
NeonFlow.NeonCD = class NeonCD {
  constructor (x, y, width, height, quadTreeCapacity, predictCollisions, ...hitboxes) {
    this.x = x || 0;
    this.y = y || 0;
    this.width = width === undefined ? 256 : width;
    this.height = height === undefined ? 256 : height;
    this.hitboxes = hitboxes;
    this.quadTree = new NeonFlow.NeonCD.QuadTree(this.x, this.y, this.width, this.height, quadTreeCapacity);
    this.predictCollisions = predictCollisions === undefined ? true : predictCollisions;
  }

  fromMap (mapName) {
    NeonFlow.chkDep(['data/map']);
    let map = NeonFlow.Map.maps[mapName];
    for (let i = 0; i < map.map.length; ++i) {
      for (let j = 0; j < map.map[0].length; ++j) {
        let hb = map.getBlockAt(i, j).hitbox;
        if (hb !== null) {
          this.quadTree.addNodes(...hb.nodes);
        }
      }
    }
  }
};

NeonFlow.NeonCD.Node = class Node {
  constructor (x, y, pointers) {
    this.x = x || 0;
    this.y = y || 0;
    this.pointers = pointers || [];
  }

  /* Sets coordinates of the node */
  setCoordinates (x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  /* Adds a pointer to the node */
  addPointer (pointedNode) {
    let availablePos = this.pointers.findIndex((el) => el === null);
    if (availablePos === -1) {
      return this.pointers.push(pointedNode) - 1;
    } else {
      this.pointers[availablePos] = pointedNode;
      return pointedNode;
    }
  }

  /* Adds multiple pointers */
  addPointers (...pointedNodes) {
    let positions = [];
    pointedNodes.forEach((node) => {
      positions.push(this.addPointer(node));
    });
    return positions;
  }

  /* Removes a pointer */
  removePointer (index) {
    this.pointers[index] = null;
  }

  /* Removes all pointers */
  removePointers () {
    this.pointers = [];
  }

  /* Returns all pointed nodes given a relation degree */
  getPointedNodes (relationDegree) {
    relationDegree = relationDegree === undefined ? 1 : relationDegree;
    if (relationDegree < 1) {
      return [];
    }
    let result = [...this.pointers];
    if (relationDegree != 1) {
      this.pointers.forEach((pointedNode) => {
        result.push(...pointedNode.getPointedNodes(relationDegree - 1));
      });
    }
    return result;
  }
};

NeonFlow.NeonCD.Hitbox = class Hitbox {
  constructor (sourceX, sourceY, ...nodes) {
    /* Coordinates are relative to the top left corner of the tileset */
    this.nodes = [sourceX || 0, sourceY || 0, ...nodes];
    this.refPoint = []; // NOTE: this point is used to know where the "inside" part of the hitbox is
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

  setRefPoint (x, y) {
    this.refPoint = [x || 0, y || 0];
  }

  autoSetRefPoint () {
    // TODO
  }

  contains (x, y) {
    /*for (let i = 0; i < this.nodes.length; ++i) {

    }*/

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

  /* Checks if the QuadTree must be divided */
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

  /* Checks if the QuadTree contains the given coordinates */
  contains (x, y) {
    x = x || 0;
    y = y || 0;
    return x >= this.x && x < this.x + this.width && y >= this.y && y < this.y + this.height;
  }

  /* Adds a node */
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

  /* Adds multiple nodes */
  addNodes (...nodes) {
    nodes.forEach((node) => {
      this.addNode(node);
    });
  }

  /* Query a given part of the QuadTree */
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

  /* Query a given part of the QuadTree including pointed nodes given a relation degree */
  queryWithPointers (x, y, width, height, relationDegree) {
    let query = this.query(x, y, width, height);
    let result = [...query];
    query.forEach((node) => {
      result.push(...node.getPointedNodes(relationDegree));
    });
    return result;
  }

  /* Same as queryWithPointers but with a limit square */
  queryWithLimitPointers (x, y, width, height, limitX, limitY, limitWidth, limitHeight, relationDegree) {
    let query = this.query(x, y, width, height);
    let result = [...query];
    query.forEach((node) => {
      result.push(...node.getPointedNodes(relationDegree).filter((pointee) => pointee.x >= limitX && pointee.x <= limitX + limitWidth && pointee.y >= limitY && pointee.y <= limitY + limitHeight));
    });
    return result;
  }
};
