window.onload = function() {

  //
  // try to create the 3D renderer
  //
  _webGLFriendly = true;
  try {
    // try to create and initialize a 3D renderer
    threeD = new X.renderer3D();
    threeD.container = '3d';
    threeD.init();
  } catch (Exception) {
    
    // no webgl on this machine
    _webGLFriendly = false;
    
  }
  
  //
  // create the 2D renderers
  // .. for the X orientation
  sliceX = new X.renderer2D();
  sliceX.container = 'sliceX';
  sliceX.orientation = 'X';
  sliceX.init();
  // .. for Y
  var sliceY = new X.renderer2D();
  sliceY.container = 'sliceY';
  sliceY.orientation = 'Y';
  sliceY.init();
  // .. and for Z
  var sliceZ = new X.renderer2D('sliceZ', 'Z');
  sliceZ.container = 'sliceZ';
  sliceZ.orientation = 'Z';
  sliceZ.init();
  

  //
  // THE VOLUME DATA
  //
  // create a X.volume
  var volume = new X.volume();
  // .. and attach the single-file dicom in .NRRD format
  // this works with gzip/gz/raw encoded NRRD files but XTK also supports other
  // formats like MGH/MGZ
  volume.file = 'http://x.babymri.org/?vol.nrrd';
  // we also attach a label map to show segmentations on a slice-by-slice base
  volume.labelmap.file = 'http://x.babymri.org/?seg.nrrd';
  // .. and use a color table to map the label map values to colors
  volume.labelmap.colortable.file = 'http://x.babymri.org/?genericanatomy.txt';
  
  // add the volume in the main renderer
  // we choose the sliceX here, since this should work also on
  // non-webGL-friendly devices like Safari on iOS
  sliceX.add(volume);
  
  // start the loading/rendering
  sliceX.render();
  

  //
  // LINK THE RENDERERS
  //
  // link the 2d renderers to the 3d one by setting the onScroll
  // method. this means, once you scroll in 2d, it upates 3d as well
  var _updateThreeD = function() {

    if (_webGLFriendly) {
      // only if we support webgl, update the 3d renderer
      volume.modified();
      threeD.render();
    }
    
  };
  sliceX.onScroll = _updateThreeD;
  sliceY.onScroll = _updateThreeD;
  sliceZ.onScroll = _updateThreeD;
  

  //
  // THE GUI
  //
  // the onShowtime method gets executed after all files were fully loaded and
  // just before the first rendering attempt
  sliceX.onShowtime = function() {

    // clear the showtime function
    sliceX.onShowtime = function() {

      // do nothing next time
    };
    
    //
    // add the volume to the other 3 renderers
    //
    sliceY.add(volume);
    sliceY.render();
    sliceZ.add(volume);
    sliceZ.render();
    threeD.add(volume);
    threeD.render();
    

    // now the real GUI
    var gui = new dat.GUI();
    
    // the following configures the gui for interacting with the X.volume
    var volumegui = gui.addFolder('Volume');
    // now we can configure controllers which..
    // .. switch between slicing and volume rendering
    var vrController = volumegui.add(volume, 'volumeRendering');
    // .. configure the volume rendering opacity
    var opacityController = volumegui.add(volume, 'opacity', 0, 1).listen();
    // .. and the threshold in the min..max range
    var lowerThresholdController = volumegui.add(volume, 'lowerThreshold',
        volume.min, volume.max);
    var upperThresholdController = volumegui.add(volume, 'upperThreshold',
        volume.min, volume.max);
    // the indexX,Y,Z are the currently displayed slice indices in the range
    // 0..dimensions-1
    var sliceXController = volumegui.add(volume, 'indexX', 0,
        volume.dimensions[0] - 1);
    var sliceYController = volumegui.add(volume, 'indexY', 0,
        volume.dimensions[1] - 1);
    var sliceZController = volumegui.add(volume, 'indexZ', 0,
        volume.dimensions[2] - 1);
    volumegui.open();
    
    // and this configures the gui for interacting with the label map overlay
    var labelmapgui = gui.addFolder('Label Map');
    var labelMapVisibleController = labelmapgui.add(volume.labelmap, 'visible');
    var labelMapOpacityController = labelmapgui.add(volume.labelmap, 'opacity',
        0, 1);
    labelmapgui.open();
    

    // volumegui callbacks
    vrController.onChange(function(value) {

      // this setting makes the volume rendering look good
      volume.opacity = 0.15;
      
      // we have to fire a modified event to switch between slicing and volume
      // rendering
      _updateThreeD();
      
    });
    opacityController.onChange(function(value) {

      // the opacity of a volume is only valid in 3D
      _updateThreeD();
      
    });
    lowerThresholdController.onChange(function(value) {

      // update 3D
      _updateThreeD();
      // .. and 2D
      sliceX.render();
      sliceY.render();
      sliceZ.render();
      
    });
    upperThresholdController.onChange(function(value) {

      // update 3D
      _updateThreeD();
      // .. and 2D
      sliceX.render();
      sliceY.render();
      sliceZ.render();
      
    });
    sliceXController.onChange(function(value) {

      // update 3D
      _updateThreeD();
      // .. and 2D
      sliceX.render();
      sliceY.render();
      sliceZ.render();
      
    });
    sliceYController.onChange(function(value) {

      // update 3D
      _updateThreeD();
      // .. and 2D
      sliceX.render();
      sliceY.render();
      sliceZ.render();
      
    });
    sliceZController.onChange(function(value) {

      // update 3D
      _updateThreeD();
      // .. and 2D
      sliceX.render();
      sliceY.render();
      sliceZ.render();
      
    });
    

    // labelmapgui callbacks
    labelMapVisibleController.onChange(function(value) {

      // update 3D
      _updateThreeD();
      // .. and 2D
      sliceX.render();
      sliceY.render();
      sliceZ.render();
      
    });
    labelMapOpacityController.onChange(function(value) {

      // update 3D
      _updateThreeD();
      // .. and 2D
      sliceX.render();
      sliceY.render();
      sliceZ.render();
      
    });
    

  };
  
};
