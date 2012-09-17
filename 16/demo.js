window.onload = function() {

  
  // create a bunch of X.volumes
  // each holds a data set
  _volumes = [];
  for ( var i = 24; i < 26; i++) {
    
    var _v = new X.volume();
    _v.file = 'http://x.babymri.org/?' + i + '.mgh';
    _volumes.push(_v);
    
    // activate volume rendering for each volume
    _v.lowerThreshold = 80;
    _v.windowLower = 115;
    _v.windowHigh = 360;
    _v.minColor = [0, 0.06666666666666667, 1];
    _v.maxColor = [0.5843137254901961, 1, 0];
    _v.opacity = 0.2;
    _v.volumeRendering = true;
    //v.modified();
    
    // and hide it by default
    //v.visible = false;
    _v.Ha = false;    
    
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
      

      
    }
    
  };
  
  var _currentVolume = 0;
  
  var count = 0;
  
  r.onRender = function() {

    if (count % 100) {
      
      if (_currentVolume >= 1) {
        
        //_volumes[_currentVolume - 1].visible = false;
        _volumes[_currentVolume - 1].Ha = false;
        
      }
      
      if (_currentVolume > _volumes.length - 1) {
        
        _currentVolume = 0;
        
      }
      
      //_volumes[_currentVolume].visible = true;
      _volumes[_currentVolume].Ha = true;
      
      _currentVolume++;
      
    }
    
    count++;
    
  };
  


};
