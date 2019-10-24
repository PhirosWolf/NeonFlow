'use strict';

let c;
let t;
let b;

function load () {
  document.body.style.margin = 0;
  document.body.style.padding = 0;
  document.body.style.overflow = 'hidden';
  NeonFlow.modulesDir = './../modules/';
  NeonFlow.import('*', main);
}

function main () {
  c = new NeonFlow.Canvas();
  c.addAfterElement();
  t = new NeonFlow.Tileset('test', './../../tileset-test.png', drawTileset);
  t.setTileSize(50, 50);
  b = new NeonFlow.Block('center', 'test.center');
  b.setCoordinates(Math.floor(c.canvas.width / 2) - 50, Math.floor(c.canvas.height / 2) - 50);
  b.setSize(100, 100);
  b.addState('test.center-right');
  b.addState('test.center-left');
}

function drawTileset () {
  t.includeIncompleteTiles = true;
  t.registerTile('center', 25, 25, 50, 50);
  t.setOffset(20, 0);
  t.registerTile('center-right', 25, 25, 50, 50);
  t.setOffset(-20, 0);
  t.registerTile('center-left', 25, 25, 50, 50);
  t.setOffset(10, 10);
  t.registerTiles('$i');
  c.drawTile('test.0', 10, 10);
  c.drawTile('test.1', 70, 10);
  c.drawTile('test.2', 130, 10);
  c.drawTile('test.3', 10, 70);
  c.drawTile('test.4', 70, 70);
  c.drawTile('test.5', 130, 70);
  c.drawTile('test.6', 10, 130);
  c.drawTile('test.7', 70, 130);
  c.drawTile('test.8', 130, 130);
  let i = 0;
  setInterval(() => {
    c.drawBlock(`center:${i % 3}`);
    ++i;
  }, 1000);
}

load();
