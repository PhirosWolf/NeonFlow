'use strict';

NeonFlow.GTK = {
  /* Loads an image using Fetch API */
  'loadImage': (path, callback) => {
    fetch(new Request(path)).then((res) => {
      if (res.ok) {
        return res.blob();
      }
    }).then((res) => {
      const img = new Image();
      img.src = URL.createObjectURL(res);
      img.addEventListener('load', () => {
        callback(img);
      }, false);
    }).catch((err) => {
      console.error(`Couldn't fetch resource at ${path}`);
    });
  }
};
