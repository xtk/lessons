window.onload = function() {

  // create and initialize a 3D renderer
  var r = new X.renderer3D();
  r.init();
  
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
  
  // add the volume
  r.add(volume);
  
  // the onShowtime method gets executed after all files were fully loaded and
  // just before the first rendering attempt
  r.onShowtime = function() {

    //
    // The GUI panel
    //
    // (we need to create this during onShowtime(..) since we do not know the
    // volume dimensions before the loading was completed)
    
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
    
  };
  
  // adjust the camera position a little bit, just for visualization purposes
  r.camera.position = [120, 80, 160];
  
  // showtime! this triggers the loading of the volume and executes
  // r.onShowtime() once done
  r.render();
  
};
