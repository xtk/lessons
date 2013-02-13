window.onload = function() {

  // create and initialize a 3D renderer
  var r = new X.renderer3D();
  r.init();
  
  // create a cube
  cube = new X.cube();
  // skin it..
  cube.texture.file = 'http://x.babymri.org/?xtk.png';
  
  r.add(cube); // add the cube to the renderer
  r.render(); // ..and render it
  
  // add some animation
  r.onRender = function() {

    // rotation by 1 degree in X and Y directions
    cube.transform.rotateX(1);
    cube.transform.rotateY(1);
    
  };
  
};
