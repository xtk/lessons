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

    // the following matrices were created by Dan Ginsburg
    // see http://surfer.nmr.mgh.harvard.edu/fswiki/FreeSurferTrackVisTransforms
    
    // transform the tracks
    var tracks_transform = new Float32Array([ -2, 0, 0, 0, 0, 0, -2, 0, 0, 2,
        0, 0, 110, -71, 110, 1 ]);
    
    // we need to swap the rows to convert from left-handed to right-handed here
    X.matrix.swapRows(tracks_transform, 1, 2);
    
    // apply the transformation to the fibers
    f.transform.matrix = tracks_transform;
    
    // transform the surfaces
    var brain_transform = new Float32Array([9.992089867591858e-01,-2.943054959177971e-02,-2.671264298260212e-02,0,
                                            2.652833424508572e-02,-6.642243359237909e-03,9.996254444122314e-01,0,
                                            2.959738858044147e-02,9.995449185371399e-01,5.856084171682596e-03,0,
                                            -1.404523849487305e+00,-9.628264427185059e+00,-2.631434440612793e+00,1]); 

    // we need to swap the rows to convert from left-handed to right-handed here
    X.matrix.swapRows(brain_transform, 1, 2);
    
    // apply the transformation to the right and left hemispheres
    rh.transform.matrix = brain_transform;
    lh.transform.matrix = brain_transform;
    
    // we reset the bounding box and set the world center to 0,0,0
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
