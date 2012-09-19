goog.require('X.renderer3D');
goog.require('X.animation');
goog.require('X.mesh');

window.onload = function() {

  // create an X.animation
  animation = new X.animation();
  // animate every 20 frames
  animation.speed = 20;
  
  // attach a bunch of X.volumes
  for ( var i = 24; i < 38; i++) {
    
    var _o = new X.object();
    
    var _cortex = new X.mesh();
    _cortex.file = 'http://x.babymri.org/?' + i + '/cortex.vtk';
    _cortex.color = [128/255,174/255,128/255];
    
    var _ventricles = new X.mesh();
    _ventricles.file = 'http://x.babymri.org/?' + i + '/ventricles.vtk';    
    _ventricles.color = [88/255,106/255,215/255];
    
    var _hemispheres = new X.mesh();
    _hemispheres.file = 'http://x.babymri.org/?' + i + '/hemispheres.vtk';    
    _hemispheres.color = [250/255,250/255,225/255];
    
    var _csf = new X.mesh();
    _csf.file = 'http://x.babymri.org/?' + i + '/csf.vtk';        
    _csf.color = [85/255,188/255,1];
    
    _o.children.push(_cortex);
    _o.children.push(_csf);
    _o.children.push(_hemispheres);
    _o.children.push(_ventricles);
    
    
    // and configure each of them
//    _v.lowerThreshold = 80;
//    _v.windowLower = 115;
//    _v.windowHigh = 360;
//    _v.minColor = [0, 0.06666666666666667, 1];
//    _v.maxColor = [0.5843137254901961, 1, 0];
//    _v.opacity = 0.2;
//    _v.volumeRendering = true;
    _o.caption = i + ' weeks';
    
    // finally add it to the animation
    animation.add(_o);
    
  }
  
  // create a new renderer
  var r = new X.renderer3D();
  r.config.INTERMEDIATE_RENDERING = true;
  r.init();
  
  ren3d = r;
  
  // add the animation
  r.add(animation);
  
  // adjust the camera
  r.camera.position = [0, 0, 250];
  
  // .. and render the animation
  r.render();
  
  r.onRender = function() {

    // grab the currently shown object's caption
    if (animation.currentObject) {
      document.getElementById('label').innerHTML = animation.currentObject.caption;
    }
    
  };
  
  r.onShowtime = function() {

    var preferences = {
      'cortex': true,
      'csf': true,
      'hemispheres': true,
      'ventricle': true,
    };
    
    var gui = new dat.GUI();
    var speedController = gui.add(animation, 'speed', 1, 30);
    var cortex = gui.add(preferences, 'cortex');
    var csf = gui.add(preferences, 'csf');
    var hemispheres = gui.add(preferences, 'hemispheres');
    var ventricle = gui.add(preferences, 'ventricle');
    gui.open();
    
    cortex.onChange(function() {

      for (v in animation.children) {
        
        animation.children[v].children[0].visible = preferences.cortex;
        
      }
      
    });
    csf.onChange(function() {

      for (v in animation.children) {
        
        animation.children[v].children[1].visible = preferences.csf;
        
      }
      
    });
    hemispheres.onChange(function() {

      for (v in animation.children) {
        
        animation.children[v].children[2].visible = preferences.hemispheres;
        
      }
      
    });
    ventricle.onChange(function() {

      for (v in animation.children) {
        
        animation.children[v].children[3].visible = preferences.ventricle;
        
      }
      
    });    
    
  };
  
};
