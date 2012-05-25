goog.require('X.renderer');
goog.require('X.renderer3D');
goog.require('X.object');
goog.require('X.mesh');
window.onload = function() {

  

  // create and initialize a 3D renderer
  var r = new X.renderer3D();
  r.init();
  ren = r
  // 
  var p = new X.mesh();
  p.file = 'http://lessons.goXTK.com/data/pits.vtk';
  
  // add the points
  r.add(p);
  

  // the onShowtime function gets called automatically, just before the first
  // rendering happens
  r.onShowtime = function() {

    p.visible = false; // hide the points
    
    var numberOfPoints = 10;// p.points.count; // in this example 411
    
    // for convenience, a container which holds all spheres
    spheres = new X.object();
    
    var firstPoint = p.points.get(0);
    console.log(firstPoint);
    // create a new sphere as a template for all other ones
    // this is an expensive operation due to CSG's mesh generation
    var newSphere = new X.sphere();
    newSphere.center = [firstPoint[0], firstPoint[1], firstPoint[2]];
    newSphere.radius = 0.7;
    newSphere.magicmode = true; // it's magic..
    
    // .. add the newSphere to our container
    spheres.children.push(newSphere);
    console.log(newSphere.points);
    // loop through the points and copy the created sphere to a new X.object
    for ( var i = 1; i < numberOfPoints; i++) {
      
      var point = p.points.get(i);
      
      // copy the tempate sphere over to avoid generating new ones
      var copySphere = new X.object(newSphere);
      // .. and move it to the correct position
      copySphere.transform.translateX(point[0] - firstPoint[0]);
      copySphere.transform.translateY(point[1] - firstPoint[1]);
      copySphere.transform.translateZ(point[2] - firstPoint[2]);
      
      // .. add the copySphere to our container
      // spheres.children.push(copySphere);
      console.log(copySphere.points);
    }
    
    // add the sphere container to the renderer
    r.add(spheres);
    
    // animate!
    setInterval(function() {

      // rotate the camera in X-direction (which triggers re-rendering)
      // r.camera.rotate([1, 0]);
      
    }, 15);
    

  };
  
  // .. and render it
  r.render();
  


};
