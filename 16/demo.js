window.onload = function() {

  
  // create a bunch of X.volumes
  // each holds a data set
  _volumes = [];
  for ( var i = 24; i < 38; i++) {
    
    var _v = new X.volume();
    _v.file = 'http://x.babymri.org/?' + i + '.mgh';
    _volumes.push(_v);
    
  }
  
  // create a new renderer
  var r = new X.renderer3D();
  r.init();
  
  for (v in _volumes) {
    
    _volumes[v].borders = false;
    r.add(_volumes[v]);
    
  }
  
  // .. and render it
  r.render();
  
  r.onShowtime = function() {

    for (v in _volumes) {
      
      v = _volumes[v];
      
      // activate volume rendering for each volume
      v.lowerThreshold = 80;
      v.windowLower = 115;
      v.windowHigh = 360;
      v.minColor = [0, 0.06666666666666667, 1];
      v.maxColor = [0.5843137254901961, 1, 0];
      v.opacity = 0.2;
      v.volumeRendering = true;
      v.modified();
      
      // and hide it by default
      v.visible = false;
      
    }
    
  };
  
  var _currentVolume = 0;
  
  var count = 0;
  
  r.onRender = function() {

    if (count % 10) {
      
      if (_currentVolume >= 1) {
        
        _volumes[_currentVolume - 1].visible = false;
        
      }
      
      if (_currentVolume > _volumes.length - 1) {
        
        _currentVolume = 0;
        
      }
      
      _volumes[_currentVolume].visible = true;
      
      _currentVolume++;
      
    }
    
    count++;
    
  };
  


};
