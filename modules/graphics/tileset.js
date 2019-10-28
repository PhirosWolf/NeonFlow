'use strict';

NeonFlow.Tileset = class Tileset {
  constructor (name, path, callback) {
    this.tileset = null;
    this.tileWidth = 64;
    this.tileHeight = 64;
    this.xOffset = 0;
    this.yOffset = 0;
    this.includeIncompleteTiles = false;
    this.tiles = {};
    NeonFlow.GTK.loadImage(path || './default-tileset.png', (img) => {
      this.tileset = img;
      (callback || (() => {}))();
    });
    NeonFlow.Tileset.tilesets[name || 'default'] = this;
  }

  /* Sets the default size of a tile */
  setTileSize (width, height) {
    this.tileWidth = width;
    this.tileHeight = height;
  }

  /* Sets the tileset's offset */
  setOffset (x, y) {
    this.xOffset = x;
    this.yOffset = y;
  }

  /* Registers a tile at the given coordinates with the given size */
  registerTile (name, x, y, width, height) {
    this.tiles[name] = [x + this.xOffset, y + this.yOffset, width || this.tileWidth, height || this.tileHeight];
  }

  /* Registers all tiles of the tileset */
  registerTiles (namesOrPattern, width, height, xOffset, yOffset, includeIncompleteTiles) {
    width = width || this.tileWidth;
    height = height || this.tileHeight;
    xOffset = xOffset || this.xOffset;
    yOffset = yOffset || this.yOffset;
    includeIncompleteTiles = includeIncompleteTiles == null ? this.includeIncompleteTiles : includeIncompleteTiles;

    let horizontalTiles = Math.floor((this.tileset.width - xOffset) / width);
    let verticalTiles = Math.floor((this.tileset.height - yOffset) / height);

    /* Registers all the "full" tiles */
    for (let i = 0; i < verticalTiles; ++i) {
      for (let j = 0; j < horizontalTiles; ++j) {
        let name;
        let index = i * (horizontalTiles + !!includeIncompleteTiles) + j;
        if (namesOrPattern instanceof Array) {
          name = namesOrPattern[index];
        } else {
          name = namesOrPattern.replace(/\$i/g, index);
        }
        this.tiles[name] = [j * width + xOffset, i * height + yOffset, width, height];
      }
    }

    /* If includeIncompleteTiles is true, then it registers all "incomplete" tiles */
    if (includeIncompleteTiles) {
      for (let i = 0; i < verticalTiles; ++i) {
        let name;
        let index = (i + 1) * horizontalTiles + i;
        if (namesOrPattern instanceof Array) {
          name = namesOrPattern[index];
        } else {
          name = namesOrPattern.replace(/\$i/g, index);
        }
        this.tiles[name] = [horizontalTiles * width + xOffset, i * height + yOffset, this.tileset.width - xOffset - horizontalTiles * width, height];
      }
      for (let i = 0; i < horizontalTiles; ++i) {
        let name;
        let index = verticalTiles * (horizontalTiles + 1) + i;
        if (namesOrPattern instanceof Array) {
          name = namesOrPattern[index];
        } else {
          name = namesOrPattern.replace(/\$i/g, index);
        }
        this.tiles[name] = [i * width + xOffset, verticalTiles * height + yOffset, width, this.tileset.height - yOffset - verticalTiles * height];
      }
      let name;
      if (namesOrPattern instanceof Array) {
        name = namesOrPattern[(verticalTiles + 1) * (horizontalTiles + 1) - 1];
      } else {
        name = namesOrPattern.replace(/\$i/g, (verticalTiles + 1) * (horizontalTiles + 1) - 1);
      }
      this.tiles[name] = [horizontalTiles * width + xOffset, verticalTiles * height + yOffset, this.tileset.width - xOffset - horizontalTiles * width, this.tileset.height - yOffset - verticalTiles * height];
    }
  }
};

NeonFlow.Tileset.tilesets = {};
