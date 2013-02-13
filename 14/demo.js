window.onload = function() {

  // create a new test_renderer
  var r = new X.renderer3D();
  r.init();
  
  // create a new X.object
  obj = new X.object();
  
  // add the points, normals and colors
  //
  // this means 648000 / 3 == 216000 vertices
  // on my work machine I could set 24000000 / 3 == 8 mio vertices
  obj.points = new X.triplets(648000);
  obj.normals = new X.triplets(648000);
  obj.colors = new X.triplets(648000);
  
  // and set the type to POINTS
  obj.type = 'POINTS';
  
  // create the points, normals and colors
  for ( var x = 0; x < 60; x++) {
    for ( var y = 0; y < 60; y++) {
      for ( var z = 0; z < 60; z++) {
        
        obj.points.add(x, y, z);
        obj.normals.add(1, 1, 1);
        obj.colors.add(x, y, z);
        
      }
    }
  }
  
  // add the object
  r.add(obj);
  
  // setup the camera
  r.camera.position = [-400, -400, -500];
  
  // .. and render it
  r.render();
  
};
