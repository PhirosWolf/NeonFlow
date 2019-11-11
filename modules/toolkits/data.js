'use strict';

/* DTK stands for Data ToolKit */
NeonFlow.DTK = {
  'crossProduct2D': (u, v) => u.x * v.y - u.y * v.x,
  'dotProduct2D': (u, v) => u.x * v.x + u.y * v.y
};
