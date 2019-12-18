'use strict';

/*
* Note to other devloppers :
* This is just a really messy code to test things of NeonFlow
* Please don't use it as a reference x)
*/

let tileset = null;
let tilesetCube = null;
let c = null;
let camera = null;
let map = null;
let ready = 0;
let qtree;
let nodes;

function load () {
  document.body.style.overflow = 'hidden';
  document.body.style.margin = '0px';
  // Loads all modules
  NeonFlow.modulesDir = './../modules/';
  NeonFlow.import('*', main);
}

function main () {
  c = new NeonFlow.Canvas();
  c.setFullscreenSize();
  c.addAfterElement();
  tileset = new NeonFlow.Tileset('test', './../../tileset-test.png', registerTiles);
  tilesetCube = new NeonFlow.Tileset('test2', './../../test.png', registerTiles2);
  tileset.setTileSize(50, 50);
  tileset.setOffset(10, 10);
  tilesetCube.setTileSize(50, 50);
}

function registerTiles () {
  tileset.registerTiles('part-$i');
  tileset.registerTile('center', 25, 25, 50, 50);
  ++ready;
  ready === 2 ? then() : {};
}

function registerTiles2 () {
  tilesetCube.registerTiles('$i');
  tilesetCube.registerTile('center', 25, 25, 50, 50);
  ++ready === 2 ? then() : {};
}

function then () {
  camera = new NeonFlow.Camera('cam1');
  c.setCamera('cam1');
  let firstBlock = new NeonFlow.Block('first', 'test.part-0', 50, 50);
  firstBlock.addState('test.part-1');
  firstBlock.addState('test2.0');
  let scndBlock = new NeonFlow.Block('scnd', 'test.part-2', 50, 50);
  scndBlock.addState('test.part-3');
  let air = new NeonFlow.Block('void', 'test.center', 50, 50);
  map = new NeonFlow.Map('main', 100, 50);
  map.setReferenceBlockSize(50, 50);
  map.register('void', 0);
  map.register('first:1', 1);
  map.register('first:2', 2);
  map.register('scnd', 3);
  map.register('scnd:1', 4);
  map.setIdAt(2, 0, 0);
  map.setIdAt(2, 10, 10);
  map.setIdAt(2, 20, 20);
  map.setIdAt(2, 30, 30);
  map.setIdAt(3, 10, 0);
  map.setIdAt(3, 99, 0);
  map.setRegion(2, 2, map.getRegion(10, 0, 10, 10));

  qtree = new NeonFlow.NeonCD.QuadTree(0, 0, 123, 123, 4);
  nodes = [
    new NeonFlow.NeonCD.Node(10, 10),
    new NeonFlow.NeonCD.Node(20, 20),
    new NeonFlow.NeonCD.Node(30, 30),
    new NeonFlow.NeonCD.Node(61, 61)
  ];
  nodes[0].addPointer(nodes[1]);
  nodes[0].addPointer(nodes[2]);
  nodes[1].addPointer(nodes[3]);
  /*new NeonFlow.NeonCD.Link('first', nodes[0], nodes[1]);
  new NeonFlow.NeonCD.Link('scnd', nodes[1], nodes[2]);
  new NeonFlow.NeonCD.Link('third', nodes[2], nodes[3]);*/
  qtree.addNodes(...nodes);
  qtree.addNode(new NeonFlow.NeonCD.Node(70, 10));

  // let rot = 0;
  // setInterval(() => {
    c.clear();
    // camera.moveBy(49, -49);
    // console.log(4, map.getViewedRegion('cam1', c.canvas.width, c.canvas.height).length, map.getViewedRegion('cam1', c.canvas.width, c.canvas.height)[0].length);
    // console.log(map.getViewedRegion('cam1'));
    // ++rot;
    // c.setTileRotation(90 * Math.sin(rot / 100), 'deg');
    // c.setTileRotation(90 * Math.sin(rot / 10), 'deg');
    c.drawMap('main');
  // }, 10);
}

load();

/*let c = null;
let ready = 0;
let darkBgLayer = null;
let blocksLayer = null;
let guiLayer = null;
let guiBtnLayer = null;
let tileset = null;
let isGuiActive = false;

function load () {
  document.body.style.overflow = 'hidden';
  document.body.style.margin = '0px';
  // Loads all modules
  NeonFlow.modulesDir = './../modules/';
  NeonFlow.import('*', main);
}

function main () {
  // debugger;
  c = new NeonFlow.Canvas();
  c.setFullscreenSize();
  c.addAfterElement();
  tileset = new NeonFlow.Tileset('test', './../../tileset-test.png', registerTiles);
  tileset.setTileSize(50, 50);
  tileset.setOffset(10, 10);
  let camera = new NeonFlow.Camera('cam1');
  c.setCamera('cam1');
  let gui = new NeonFlow.GUI('smth', 'test.center', c.canvas.width - 100, c.canvas.height - 50);
  gui.addHitRegion('exit-gui-btn');
  let exitGuiButton = new NeonFlow.RectHitRegion('exit-gui-btn', gui.width - 25, gui.height - 25, 70, 70, () => {
    isGuiActive = false;
    c.exitGUIs();
  });
  let blocks = [
    new NeonFlow.Block('first', 'test.part-0', 50, 50),
    new NeonFlow.Block('scnd', 'test.part-1', 50, 50),
    new NeonFlow.Block('third', 'test.part-2', 50, 50),
    new NeonFlow.Block('fourth', 'test.part-3', 50, 50)
  ];
  blocksLayer = new NeonFlow.Layer('blocks', 0, () => {
    c.drawBlock('first', 0, 50);
    c.drawBlock('first', 150, 73);
    c.drawBlock('scnd', 190, 120);
    c.drawBlock('third', 460, 50);
    c.drawBlock('third', 800, 100);
    c.drawBlock('fourth', 1500, 50);
    c.drawBlock('fourth', 2500, 70);
  });
  darkBgLayer = new NeonFlow.Layer('dark-bg', 1, () => {
    if (isGuiActive) {
      c.ctx.globalAlpha = 0.5;
      c.ctx.fillRect(0, 0, c.canvas.width, c.canvas.height);
      c.ctx.globalAlpha = 1;
    }
  });
  guiLayer = new NeonFlow.Layer('gui', 9, () => {
    if (isGuiActive) {
      c.drawGUI('smth', Math.floor((c.canvas.width - gui.width) / 2), Math.floor((c.canvas.height - gui.height) / 2));
    }
  });
  guiBtnLayer = new NeonFlow.Layer('gui-btn', NeonFlow.Layer.getForegroundLayerIndex() + 1, () => {
    if (isGuiActive) {
      c.drawTile('test.center', c.canvas.width - Math.floor((c.canvas.width - gui.width) / 2) - 10, c.canvas.height - Math.floor((c.canvas.height - gui.height) / 2) - 10);
    }
  });
  c.addLayer('blocks');
  c.addLayer('dark-bg');
  c.addLayer('gui');
  c.addLayer('gui-btn');

  ++ready;
  if (ready === 2) {
    runtime();
  }
}

function registerTiles () {
  tileset.registerTiles('part-$i');
  tileset.registerTile('center', 25, 25, 50, 50);
  ++ready;
  if (ready === 2) {
    runtime();
  }
}

function runtime () {
  setInterval(() => {
    // debugger;
    c.clear();
    c.execLayers();
  }, 33); // ~30fps
}

load();*/

/*'use strict';

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
  t = new NeonFlow.Tileset('test', './../../tileset-test.png', then);
  t.setTileSize(50, 50);
  b = new NeonFlow.Block('center', 'test.center');
  b.setCoordinates(Math.floor(c.canvas.width / 2) - 50, Math.floor(c.canvas.height / 2) + 50);
  b.setSize(100, 100);
  b.addState('test.center-right');
  b.addState('test.center-left');
  cam = new NeonFlow.Camera('cam');
  cam.moveTo(0, 0);
  c.setCamera('cam');


}

function then () {
  t.includeIncompleteTiles = true;
  t.registerTile('center', 25, 25, 50, 50);
  mh = new NeonFlow.MouseHandler(c.canvas);
  gui = new NeonFlow.GUI('gui', 'test.center', 700, 350);
  gui.addHitRegion('hrrect');
  gui.addHitRegion('hrcirc');
  gui.addHitRegion('hrellipse');
  hrrect = new NeonFlow.RectHitRegion('hrrect', 10, 10, 70, 70, () => {
    console.log('rect');
  });
  hrrect.setCamera('cam');
  // mh.linkHitRegion('hrrect');
  hrcirc = new NeonFlow.CircHitRegion('hrcirc', 200, 50, 30, () => {
    console.log('circ');
  });
  hrcirc.setCamera('cam');
  // mh.linkHitRegion('hrcirc');
  hrellipse = new NeonFlow.EllipseHitRegion('hrellipse', 400, 50, 70, 20, () => {
    console.log('ellipse');
  });
  hrellipse.setCamera('cam');
  // mh.linkHitRegion('hrellipse');
  let guiID = c.drawGUI('gui', 50, 10);
  c.ctx.strokeRect(60, 20, 70, 70);
  c.ctx.beginPath();
  c.ctx.ellipse(250, 60, 30, 30, 2 * Math.PI, 0, 2 * Math.PI);
  c.ctx.stroke();
  c.ctx.closePath();
  c.ctx.beginPath();
  c.ctx.ellipse(450, 60, 70, 20, 2 * Math.PI, 0, 2 * Math.PI);
  c.ctx.stroke();
  c.ctx.closePath();
  setTimeout(() => {
    c.exitGUIs();
  }, 5000);
  t.setOffset(20, 0);
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
  }, 50);
}

load();
*/
