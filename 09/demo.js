window.onload = function() {

  // create and initialize a 3D renderer
  var r = new X.renderer3D();
  r.init();
  
  // create a mesh and associate it to the VTK Point Data
  var p = new X.mesh();
  p.file = 'http://x.babymri.org/?pits.vtk';
  
  // add the points
  r.add(p);
  

  // the onShowtime function gets called automatically, just before the first
  // rendering happens
  r.onShowtime = function() {

    p.visible = false; // hide the mesh since we just want to use the
    // coordinates
    
    var numberOfPoints = p.points.count; // in this example 411
    
    // for convenience, a container which holds all spheres
    spheres = new X.object();
    
    // grab the first coordinate triplet
    var firstPoint = p.points.get(0);
    
    // create a new sphere as a template for all other ones
    // this is an expensive operation due to CSG's mesh generation
    var newSphere = new X.sphere();
    newSphere.center = [firstPoint[0], firstPoint[1], firstPoint[2]];
    newSphere.radius = 0.7;
    newSphere.magicmode = true; // it's magic..
    newSphere.modified(); // since we don't directly add the sphere, we have to
    // call the CSG creator manually
    
    // .. add the newSphere to our container
    spheres.children.push(newSphere);
    
    // loop through the points and copy the created sphere to a new X.object
    for ( var i = 1; i < numberOfPoints; i++) {
      
      var point = p.points.get(i);
      
      // copy the template sphere over to avoid generating new ones
      var copySphere = new X.object(newSphere);
      // .. and move it to the correct position
      copySphere.transform.translateX(point[0] - firstPoint[0]);
      copySphere.transform.translateY(point[1] - firstPoint[1]);
      copySphere.transform.translateZ(point[2] - firstPoint[2]);
      
      // .. add the copySphere to our container
      spheres.children.push(copySphere);
      
    }
    
    // add the sphere container to the renderer
    r.add(spheres);
    
    // animate!
    setInterval(function() {

      // rotate the camera in X-direction (which triggers re-rendering)
      r.camera.rotate([1, 0]);
      
    }, 15);
    

  };
  
  // .. and render it
  r.render();
  
};
