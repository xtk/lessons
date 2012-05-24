window.onload = function() {// create and initialize a 3D renderer

  var r = new X.renderer3D();
  r.init();
  
  // create a cube
  cube = new X.cube();
  
  // setting the edge length can also be skipped since 20 is the default
  cube.lengthX = cube.lengthY = cube.lengthZ = 20;
  
  // can also be skipped since [0,0,0] is the default center
  cube.center = [0, 0, 0];
  
  // [1,1,1] (== white) is also the default so this can also be skipped
  cube.color = [1, 1, 1];
  
  r.add(cube); // add the cube to the renderer
  r.render(); // ..and render it
  
};
