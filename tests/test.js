'use strict';

let c;
let t;
let b;
let cam;
let mh;
let hrrect;
let hrcirc;
let hrellipse;
let gui;

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
  drawTileset();
  /*b = new NeonFlow.Block('center', 'test.center');
  b.setCoordinates(Math.floor(c.canvas.width / 2) - 50, Math.floor(c.canvas.height / 2) + 50);
  b.setSize(100, 100);
  b.addState('test.center-right');
  b.addState('test.center-left');*/
  cam = new NeonFlow.Camera('cam');
  cam.moveTo(0, 0);
  c.setCamera('cam');

  mh = new NeonFlow.MouseHandler(c.canvas);
  gui = new NeonFlow.GUI('gui', 'test.center', 700, 350);
  hrrect = new NeonFlow.RectHitRegion('hrrect', 10, 10, 70, 70, () => {
    console.log('rect');
  });
  hrrect.setCamera('cam');
  // mh.linkHitRegion('hrrect');
  c.ctx.strokeRect(10, 10, 70, 70);
  hrcirc = new NeonFlow.CircHitRegion('hrcirc', 200, 50, 30, () => {
    console.log('circ');
  });
  hrcirc.setCamera('cam');
  // mh.linkHitRegion('hrcirc');
  c.ctx.beginPath();
  c.ctx.ellipse(200, 50, 30, 30, 2 * Math.PI, 0, 2 * Math.PI);
  c.ctx.stroke();
  c.ctx.closePath();
  hrellipse = new NeonFlow.EllipseHitRegion('hrellipse', 400, 50, 70, 20, () => {
    console.log('ellipse');
  });
  hrellipse.setCamera('cam');
  // mh.linkHitRegion('hrellipse');
  c.ctx.beginPath();
  c.ctx.ellipse(400, 50, 70, 20, 2 * Math.PI, 0, 2 * Math.PI);
  c.ctx.stroke();
  c.ctx.closePath();
}

function drawTileset () {
  t.includeIncompleteTiles = true;
  t.registerTile('center', 25, 25, 50, 50);
  /*t.setOffset(20, 0);
  t.registerTile('center-right', 25, 25, 50, 50);
  t.setOffset(-20, 0);
  t.registerTile('center-left', 25, 25, 50, 50);
  t.setOffset(10, 10);
  t.registerTiles('$i');
  c.drawTileRelative('test.0', 10, 10);
  c.drawTileRelative('test.1', 70, 10);
  c.drawTileRelative('test.2', 130, 10);
  c.drawTileRelative('test.3', 10, 70);
  c.drawTileRelative('test.4', 70, 70);
  c.drawTileRelative('test.5', 130, 70);
  c.drawTileRelative('test.6', 10, 130);
  c.drawTileRelative('test.7', 70, 130);
  c.drawTileRelative('test.8', 130, 130);
  let i = 0;
  setInterval(() => {
    c.clear();
    c.drawBlock(`center:${i}`);
    ++i;
    i %= 3;
    cam.moveBy(10, 3);
  }, 50);*/
}

load();
