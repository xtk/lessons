goog.require('X.renderer3D');
goog.require('X.animation');
goog.require('X.volume');

window.onload = function() {

  // create an X.animation
  animation = new X.animation();
  // animate every 20 frames
  animation.speed = 20;
  
  // attach a bunch of X.volumes
  for ( var i = 24; i < 28; i++) {
    
    var _v = new X.volume();
    _v.file = 'http://x.babymri.org/?' + i + '.mgh';
    
    // and configure each of them
    _v.lowerThreshold = 80;
    _v.windowLower = 115;
    _v.windowHigh = 360;
    _v.minColor = [0, 0.06666666666666667, 1];
    _v.maxColor = [0.5843137254901961, 1, 0];
    _v.opacity = 0.2;
    _v.volumeRendering = true;
    _v.caption = i + ' weeks';
    
    // finally add it to the animation
    animation.add(_v);
    
  }
  
  // create a new renderer
  var r = new X.renderer3D();
  r.init();
  
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
      'opacity': 0.2
    };
    
    var gui = new dat.GUI();
    var speedController = gui.add(animation, 'speed', 1, 30);
    var opacityController = gui.add(preferences, 'opacity', 0, 1);
    gui.open();
    
    opacityController.onChange(function(value) {

      for (v in animation.children) {
        
        animation.children[v].opacity = value;
        
      }
      
    });
    
  };
  
};
