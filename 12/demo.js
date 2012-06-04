window.onload = function() {

  // create and initialize a 3D renderer
  var r = new X.renderer3D();
  r.init();
  
  // create a new X.mesh
  mesh = new X.mesh();
  // change the color to grey
  mesh.color = [0.5, 0.5, 0.5];
  // and attach a freesurfer mesh
  mesh.file = 'http://x.babymri.org/?f=lefthemisphere.smoothwm';
  
  // load curvature values from a .crv file
  // it would also be possible to create an X.scalars object and
  // configure an array using 'X.scalars.array = arr;' to be independent from a
  // file format
  // in this case we choose the 'C' curvature as the default
  mesh.scalars.file = 'http://x.babymri.org/?f=lh.smoothwm.C.crv';
  // we want to map the scalars linear between blue and white
  mesh.scalars.minColor = [0, 0, 1];
  mesh.scalars.maxColor = [1, 1, 1];
  
  // .. add the mesh
  r.add(mesh);
  
  // .. and start the loading/rendering
  r.render();
  


  //
  // The GUI
  //
  gui = null; // we need to re-load the gui after we change the curvature type
  
  // here are the available curvature types (looks a little cryptic but is just
  // text) and files
  curvatureTypes = ['C (mm&#x207b;&sup2;)', 'k&#x2081; (mm&#x207b;&sup1;)',
                    'H (mm&#x207b;&sup1;)'];
  curvatureFiles = ['lh.smoothwm.C.crv', 'lh.smoothwm.K1.crv',
                    'lh.smoothwm.H.crv'];
  
  // we need this Loader as a container to keep track of the current curvature
  var _loader = {
    
    // default type
    Type: 'C (mm&#x207b;&sup2;)'
  
  };
  
  // the onShowtime method gets executed after all files were fully loaded and
  // just before the first rendering attempt
  r.onShowtime = function() {

    if (gui) {
      
      // if we already have a gui, destroy it
      // .. it will be re-created immediately
      gui.destroy();
      gui = null;
      
    }
    
    //
    // create the GUI panel
    //
    gui = new dat.GUI();
    var meshgui = gui.addFolder('Mesh');
    var meshColorController = meshgui.addColor(mesh, 'color');
    meshgui.open();
    
    var curvgui = gui.addFolder('Curvature');
    // a combobox for the different curvature types
    var typeController = curvgui.add(_loader, 'Type', curvatureTypes);
    // the min and max color which define the linear gradient mapping
    var minColorController = curvgui.addColor(mesh.scalars, 'minColor');
    var maxColorController = curvgui.addColor(mesh.scalars, 'maxColor');
    // controllers to threshold the scalars
    var minThresholdController = curvgui.add(mesh.scalars, 'lowerThreshold',
        mesh.scalars.min, mesh.scalars.max);
    var maxThresholdController = curvgui.add(mesh.scalars, 'upperThreshold',
        mesh.scalars.min, mesh.scalars.max);
    curvgui.open();
    
    //
    // the controller callbacks
    //
    meshColorController.onChange(function(value) {

      r.render();
      
    });
    
    //
    // Change the curvature type callback
    //
    typeController.onChange(function(value) {

      var _index = curvatureTypes.indexOf(value);
      
      // we need to buffer the (maybe changed) colors
      // else wise we would start with the default red<->green mapping
      var oldMinColor = mesh.scalars.minColor;
      var oldMaxColor = mesh.scalars.maxColor;
      
      // now we (re-)load the selected curvature file
      mesh.scalars.file = 'http://x.babymri.org/?f=' +
          curvatureFiles[_index];
      mesh.modified();
      
      mesh.scalars.minColor = oldMinColor;
      mesh.scalars.maxColor = oldMaxColor;
      
      // this render call will trigger the onShowtime function again to
      // re-create the GUI
      r.render();
      
    });
    
    minColorController.onChange(function(value) {

      r.render();
      
    });
    
    maxColorController.onChange(function(value) {

      r.render();
      
    });
    
    minThresholdController.onChange(function(value) {

      r.render();
      
    });
    
    maxThresholdController.onChange(function(value) {

      r.render();
      
    });
    
  };
  
};
