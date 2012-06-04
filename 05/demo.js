window.onload = function() {

  // create and initialize a 3D renderer
  var r = new X.renderer3D();
  r.init();
  
  // create a new X.mesh
  var skull = new X.mesh();
  // .. and associate the .vtk file to it
  skull.file = 'http://x.babymri.org/?f=skull.vtk';
  // .. make it transparent
  skull.opacity = 0.7;
  
  // .. add the mesh
  r.add(skull);
  
  // re-position the camera to face the skull
  r.camera.position = [0, 400, 0];
  
  // animate..
  setInterval(function() {

    // rotate the skull around the Z axis
    // since we moved the camera, it is Z not X
    skull.transform.rotateZ(1);
    
    // we could also rotate the camera instead which is better in case
    // we have a lot of objects and want to rotate them all:
    //
    // r.camera.rotate([1,0]);
    
    // .. and render it
    r.render();
    
  }, 16.7); // best value if requestAnimationFrame is not used
  
};
