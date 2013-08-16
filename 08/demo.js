window.onload = function() {

  // create and initialize a 3D renderer
  var r = new X.renderer3D();
  r.init();
  
  // create new X.fibers
  var f = new X.fibers();
  // .. and attach a file
  f.file = 'http://x.babymri.org/?streamline.trk';
  
  // create the left hemisphere mesh
  var lh = new X.mesh();
  // .. attach a Freesurfer .smoothwm mesh
  lh.file = 'http://x.babymri.org/?lh.smoothwm';
  // change the color to a smooth red
  lh.color = [0.7, 0.2, 0.2];
  // add some transparency
  lh.opacity = 0.6;
  
  // ... and for the right hemisphere
  var rh = new X.mesh();
  rh.file = 'http://x.babymri.org/?rh.smoothwm';
  // a smooth green color for this one
  rh.color = [0, 0.7, 0];
  // add some transparency
  rh.opacity = 0.6;
  
  // add the three objects
  r.add(f);
  r.add(lh);
  r.add(rh);
  
  // the fibers are not in the same space as the left and right hemisphere, so
  // we configure some transforms in the onShowtime method which gets executed
  // after all files were fully loaded and just before the first rendering
  // attempt
  r.onShowtime = function() {

    // we reset the bounding box so track and mesh are in the same space
    r.resetBoundingBox();
    
  };
  
  // .. and start the loading and rendering!
  r.camera.position = [0, 0, 200];
  r.render();
  


  //
  // THE GUI PANEL
  //
  // The user interface is realized using DAT.GUI (tutorial here:
  // http://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage) which
  // clicks right into XTK.
  //
  
  // fiber tracks
  var gui = new dat.GUI();
  var trackgui = gui.addFolder('Fiber Tracks');
  trackVisibleController = trackgui.add(f, 'visible');
  trackgui.open();
  
  // left hemisphere
  var lhgui = gui.addFolder('Left Hemisphere');
  lhgui.add(lh, 'visible');
  lhgui.add(lh, 'opacity', 0, 1);
  lhgui.addColor(lh, 'color');
  lhgui.open();
  
  // right hemisphere
  var rhgui = gui.addFolder('Right Hemisphere');
  rhgui.add(rh, 'visible');
  rhgui.add(rh, 'opacity', 0, 1);
  rhgui.addColor(rh, 'color');
  rhgui.open();
  
};
