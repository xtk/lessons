window.onload = function() {

  // create and initialize three 3D renderers
  var r1 = new X.renderer3D();
  // .. attach the renderer to a <div> container using its id
  r1.container = 'r1';
  r1.init();
  
  var r2 = new X.renderer3D();
  // .. attach the renderer to a <div> container using its id
  r2.container = 'r2';
  r2.init();
  // .. change the view of this renderer
  r2.camera.position = [100, 0, 0];
  
  var r3 = new X.renderer3D();
  r3.container = 'r3';
  r3.init();
  // .. and change the view for this one as well
  r3.camera.position = [0, 100, 0];
  

  // create a new X.mesh and attach a .VTK file
  var mesh = new X.mesh();
  mesh.file = 'http://x.babymri.org/?avf.vtk';
  
  // .. but add it to only to the first renderer
  r1.add(mesh);
  
  // the onShowtime function gets executed, once the renderer r1 completely
  // loaded the .VTK file
  r1.onShowtime = function() {

    // since the mesh was loaded, we add it now to the other renderers
    // this way, the .VTK file is loaded only once
    r2.add(mesh);
    r3.add(mesh);
    
    // trigger rendering
    r2.render();
    r3.render();
    
  };
  
  // start the loading of the .VTK file and display it on renderer r1.
  // once the file was fully loaded, the r1.onShowtime function is executed
  r1.render();
  
  /*
   * Thank you:
   * 
   * The rendered vessel is an arteriovenous fistula in an arm (a bypass created
   * by joining an artery and vein) acquired from a MR scanner. The data was
   * provided by Orobix S.R.L.
   * 
   * http://www.orobix.com
   */

};
