'use strict';

/* DTK stands for Data ToolKit */
NeonFlow.DTK = {
  /**
  * This is not exactly the 2D cross product, it's more likely to be the
  * determinant of a matrix which have u as first column and v as second column
  **/
  'crossProduct2D': (u, v) => u.x * v.y - u.y * v.x,
  'dotProduct2D': (u, v) => u.x * v.x + u.y * v.y
};
