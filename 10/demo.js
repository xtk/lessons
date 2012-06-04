window.onload = function() {

  // create and initialize a 3D renderer
  var r = new X.renderer3D();
  r.init();
  
  // create a X.volume
  var volume = new X.volume();
  // .. and attach the single-file dicom in .NRRD format
  // this works with gzip/gz/raw encoded NRRD files but XTK also supports other
  // formats like MGH/MGZ
  volume.file = 'http://x.babymri.org/?f=avf.nrrd';
  
  // the segmentation is a X.mesh
  var mesh = new X.mesh();
  // .. and is loaded from a .VTK file
  mesh.file = 'http://x.babymri.org/?f=avf.vtk';
  // we set the color to a lighter red
  mesh.color = [0.7, 0, 0];
  // and also set the visibility to false, since we add a 'load-on-demand'
  // option for it
  mesh.visible = false;
  
  // only add the volume for now, the mesh gets loaded on request
  r.add(volume);
  
  // the onShowtime method gets executed after all files were fully loaded and
  // just before the first rendering attempt
  r.onShowtime = function() {

    //
    // The GUI panel
    //
    // (we need to create this during onShowtime(..) since we do not know the
    // volume dimensions before the loading was completed)
    
    // indicate if the mesh was loaded
    var meshWasLoaded = false;
    
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
    
    // now we configure the gui for interacting with the X.mesh
    var meshgui = gui.addFolder('Mesh');
    // the visible controller shows/hides the volume but also loads the file on
    // demand (only the first time)
    var meshVisibleController = meshgui.add(mesh, 'visible');
    // .. the mesh color
    var meshColorController = meshgui.addColor(mesh, 'color');
    meshgui.open();
    
    // volumegui callbacks
    vrController.onChange(function(value) {

      // this setting makes the volume rendering look good
      volume.opacity = 0.15;
      
      // we have to fire a modified event to switch between slicing and volume
      // rendering
      volume.modified();
      r.render();
      
    });
    opacityController.onChange(function(value) {

      r.render();
      
    });
    lowerThresholdController.onChange(function(value) {

      r.render();
      
    });
    upperThresholdController.onChange(function(value) {

      r.render();
      
    });
    sliceXController.onChange(function(value) {

      // we have to fire a modified event to show/hide the slices properly
      volume.modified();
      
      r.render();
      
    });
    sliceYController.onChange(function(value) {

      // we have to fire a modified event to show/hide the slices properly
      volume.modified();
      
      r.render();
      
    });
    sliceZController.onChange(function(value) {

      // we have to fire a modified event to show/hide the slices properly
      volume.modified();
      
      r.render();
      
    });
    
    // meshgui callbacks
    meshVisibleController.onChange(function(value) {

      if (!meshWasLoaded) {
        
        // this only gets executed the first time to load the mesh, after we
        // just toggle the visibility
        r.add(mesh);
        
        // we set the onShowtime function to a void since we don't want to
        // create the GUI again here
        r.onShowtime = function() {

        };
        
        // set the loaded flag
        meshWasLoaded = true;
        
      }
      
      r.render();
      
    });
    meshColorController.onChange(function(value) {

      r.render();
      
    });
    

  };
  
  // adjust the camera position a little bit, just for visualization purposes
  r.camera.position = [120, 80, 160];
  
  // showtime! this triggers the loading of the volume and executes
  // r.onShowtime() once done
  r.render();
  
};
