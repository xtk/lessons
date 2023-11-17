sizeContent = function() {
  var totalSummariesHeight = document.body.clientHeight;
  
  // on air
  //http://stackoverflow.com/questions/10787782/full-height-of-a-html-element-div-including-border-padding-and-margin
  var livereslice = document.getElementById("livereslice");
  totalSummariesHeight -= parseInt(document.defaultView.getComputedStyle(livereslice, '').getPropertyValue('height'));
  totalSummariesHeight -= parseInt(document.defaultView.getComputedStyle(livereslice, '').getPropertyValue('margin-top')) + parseInt(document.defaultView.getComputedStyle(livereslice, '').getPropertyValue('margin-bottom'));
  totalSummariesHeight -= livereslice.offsetTop;

  // summaries
  // get elements by tag name
  var summaries = document.getElementsByTagName("summary");
  for(var i = 0; i < summaries.length; i++){
   //do something to each div like
   totalSummariesHeight -= 2+summaries[i].offsetHeight;
  }

  // jsfiddle
  var jsfiddle = document.getElementById("jsfiddle");
  totalSummariesHeight -= jsfiddle.offsetHeight;
  totalSummariesHeight -= 10;

  //new content max height
  var maxHeight = document.body.clientHeight - totalSummariesHeight
  var contents = document.getElementsByClassName("content");
  for(var i = 0; i < contents.length; i++){
   //do something to each div like
   contents[i].style.maxHeight = totalSummariesHeight+"px";
  }
}

//http://stackoverflow.com/questions/16751345/html5-automatically-close-all-the-other-details-tags-after-opening-a-specifi
indexContent = function(elm){
  var nodes = elm.parentNode.childNodes, node;
  var i = 0, count = i;
  while( (node=nodes.item(i++)) && node!=elm )
    if( node.nodeType==1 ) count++;
  return count;
}

closeContent = function(index) {
  var len = document.getElementsByTagName("details").length;
  for(var i=0; i<len; i++){
    if(i != index){
      document.getElementsByTagName("details")[i].removeAttribute("open");
    }
  }
}


window.onresize = function(event) {
  sizeContent();
}

xslicegui = function(targetRenderer, targetVolume, bbox){
  this.renderer = targetRenderer;
  this.renderer.interactor.xsliceguiref = this;
  this.volume = targetVolume;
  this.box = bbox;

  // more
  this.sceneOrientation = 0;
  this.coloring = true;
  this.color = [1, 1, 1];
  this.mode = 0;
  this.bbox = true;

  // animation 
  this.demoIntervalID = -1;

  // leap motion (lm)
  this.lmIntervalID = -1;
  this.lmController = null;

  // gui stuffs
  this.gui = null;
  // mode panel
  this.modegui = null;
  this.sliceMode = null;
  this.bboxMode = null;
  // slice panel
  this.slicegui = null;
  this.sliceXNXController = null;
  this.sliceXNYController = null;
  this.sliceXNZController = null;
  this.sliceXNCController
  // nav panel
  this.navgui = null;
  this.sliceXController = null;
  // scene panel
  this.scenegui = null;
  this.sceneOrientationController = null;
}

xslicegui.prototype.create = function(){
  // set colors and normals
  this.volume.xNormX = 1.0;
  this.volume.xNormY = 1.0;
  this.volume.xNormZ = 1.0;
  this.volume.xColor = this.color;

  //
  // The GUI panel
  //

  this.gui = new dat.GUI();
  this.setupmodegui();
  this.setupslicegui();
  this.setupnavgui();
  this.setupscenegui();

  // start to animate!
  var _this = this;
  this.demoIntervalID = setInterval(function(){
    _this.reslice();
    _this.volume.sliceInfoChanged(0);
    _this.sliceXController.__max = _this.volume.range[0] - 1;},5);
}

xslicegui.prototype.setupslicegui = function(){
  this.slicegui = this.gui.addFolder('Slice Orientation');
  this.sliceXNXController = this.slicegui.add(this.volume, 'xNormX', -1,1).name('Normal X Dir.').listen();
  this.sliceXNYController = this.slicegui.add(this.volume, 'xNormY', -1,1).name('Normal Y Dir.').listen();
  this.sliceXNZController = this.slicegui.add(this.volume, 'xNormZ', -1,1).name('Normal Z Dir.').listen();
  this.sliceXNCController = this.slicegui.addColor(this, 'color').name('Color').listen();
  this.slicegui.open();

  // callbacks
  var _this = this;

  normalChange = function(value){
    _this.color = [Math.abs(_this.volume.xNormZ), Math.abs(_this.volume.xNormY), Math.abs(_this.volume.xNormX)];
    if(_this.coloring){
      _this.volume.xColor = _this.color;
      _this.volume.maxColor = _this.volume.xColor;
    }
    _this.volume.sliceInfoChanged(0);
    _this.sliceXController.__max = _this.volume.range[0] - 1;
  }

  this.sliceXNXController.onChange(normalChange);
  this.sliceXNYController.onChange(normalChange);
  this.sliceXNZController.onChange(normalChange);

  this.sliceXNCController.onChange(function(value){
    if(_this.coloring){
      _this.volume.xColor = _this.color;
      _this.volume.maxColor = _this.volume.xColor;
      _this.volume.sliceInfoChanged(0);
    }
  });
}

xslicegui.prototype.setupnavgui = function(){
  this.navgui = this.gui.addFolder('Slice Selection');
  this.sliceXController = this.navgui.add(this.volume, 'indexX', 0,this.volume.range[0] - 1).name('Slice Index').listen();
  this.navgui.open();

  var _this = this;
  this.sliceXController.onChange(function(value){
    // Hide Y and Z slices
    _this.volume.children[1]['visible'] = false;
    _this.volume.children[2]['visible'] = false;
  });
}

xslicegui.prototype.setupscenegui = function(){
  // UI
  this.scenegui = this.gui.addFolder('Scene Orientation');
  this.sceneOrientationController = this.scenegui.add(this, 'sceneOrientation', { 'Free':0, 'Sagittal':1, 'Coronal':2, 'Axial':3 } ).name('View');
  this.scenegui.open();

  // callbacks
  this.renderer.interactor.addEventListener(X.event.events.ROTATE, this.updateSceneView);

  var _this = this;
  this.sceneOrientationController.onChange(function(value){
    if(value == 1){
      // move camera
      _this.renderer.camera.position = [-400, 0, 0];
      _this.renderer.camera.up = [0, 0, 1];

      // update normals
      _this.volume.xNormX = 1; 
      _this.volume.xNormY = 0; 
      _this.volume.xNormZ = 0; 

    }
    else if(value == 2){
      // move camera
      _this.renderer.camera.position = [0, 400, 0];
      _this.renderer.camera.up = [0, 0, 1];

      // update normals
      _this.volume.xNormX = 0; 
      _this.volume.xNormY = 1; 
      _this.volume.xNormZ = 0; 
    }
    else if(value == 3){
      // move camera
      _this.renderer.camera.position = [0, 0, -400];
      _this.renderer.camera.up = [0, 1, 0];

      // update normals
      _this.volume.xNormX = 0; 
      _this.volume.xNormY = 0; 
      _this.volume.xNormZ = 1; 
    }

    // update color
    _this.color = [Math.abs(_this.volume.xNormZ), Math.abs(_this.volume.xNormY), Math.abs(_this.volume.xNormX)];
    if(_this.coloring){
      _this.volume.xColor = [Math.abs(_this.volume.xNormZ), Math.abs(_this.volume.xNormY), Math.abs(_this.volume.xNormX)];
      _this.volume.maxColor = [Math.abs(_this.volume.xNormZ), Math.abs(_this.volume.xNormY), Math.abs(_this.volume.xNormX)];
    }

    // update slice and gui
    _this.volume.sliceInfoChanged(0);
    _this.sliceXController.__max = _this.volume.range[0] - 1;
  });
}

xslicegui.prototype.updateSceneView = function(){
  var _this = this;
  if (typeof this.xsliceguiref != 'undefined'){
    _this = this.xsliceguiref
  }

  // get mode
  if(_this.sliceMode.getValue() == 1 || _this.sliceMode.getValue() == 4){
    var _x = _this.renderer.camera.view[2];
    var _y = _this.renderer.camera.view[6];
    var _z = _this.renderer.camera.view[10];
    // normalize 
    var length = Math.sqrt(_x*_x + _y*_y+_z*_z);

    _this.volume.xNormX = _x/length;
    _this.volume.xNormY = _y/length;
    _this.volume.xNormZ = _z/length;
    _this.color = [Math.abs(_this.volume.xNormZ), Math.abs(_this.volume.xNormY), Math.abs(_this.volume.xNormX)];

    if(_this.coloring){
      _this.volume.xColor = [Math.abs(_this.volume.xNormZ), Math.abs(_this.volume.xNormY), Math.abs(_this.volume.xNormX)];
      _this.volume.maxColor = [Math.abs(_this.volume.xNormZ), Math.abs(_this.volume.xNormY), Math.abs(_this.volume.xNormX)];
    }
    _this.volume.sliceInfoChanged(0);
    _this.sliceXController.__max = _this.volume.range[0] - 1;
  }

  // update navigation controller
  if(_this.sceneOrientationController.getValue() != 0){
    _this.sceneOrientationController.setValue(0);
   }
}

xslicegui.prototype.setupmodegui = function(){
  // UI
  this.modegui = this.gui.addFolder('General');
  this.sliceMode = this.modegui.add(this, 'mode', { 'Demo':0, 'Rotate Cam':1, 'Rotate Box':2, 'LeapM Palm':3, 'LeapM Point':4} ).name('Interaction Mode');
  this.bboxMode = this.modegui.add(this, 'bbox').name('Show BBox');
  this.coloringMode = this.modegui.add(this, 'coloring').name('Slice Coloring');
  this.modegui.open();

  // callbacks
  var _this = this;
  this.sliceMode.onChange(function(value) {
    if (value == 0) {
      // cleanup lm interval
      clearInterval(_this.lmIntervalID);
      if(_this.lmController != null){
        _this.lmController.disconnect();
       }
      // setup demo
      var _this2 = _this;
      _this.demoIntervalID = setInterval(function(){
        _this2.reslice();
        _this2.volume.sliceInfoChanged(0);
        _this2.sliceXController.__max = _this2.volume.range[0] - 1;},5); 
    }
    else if (value == 1){
      // cleanup demo
      clearInterval(_this.demoIntervalID);
      // cleanup lm interval
      clearInterval(_this.lmIntervalID);
      if(_this.lmController != null){
        _this.lmController.disconnect();
       }

      _this.updateSceneView();
    }
    else if (value == 2){
      // cleanup demo
      clearInterval(_this.demoIntervalID);
      // cleanup lm interval
      clearInterval(_this.lmIntervalID);
      if(_this.lmController != null){
        _this.lmController.disconnect();
       }
    }
    else if(value == 3){
      // cleanup demo
      clearInterval(_this.demoIntervalID);
      // cleanup lm controller
      clearInterval(_this.lmIntervalID);
      if(_this.lmController != null){
        _this.lmController.disconnect();
       }

      var controllerOptions = {enableGestures: true};
      _this.lmController = new Leap.Controller(controllerOptions);

      _this.lmController.on('connect', function(){
        _this.lmIntervalID = setInterval(function(){
          var frame = _this.lmController.frame();
          var handString = "";
          if (frame.hands.length > 0) {
            var hand = frame.hands[0];
            _this.volume.xNormX = -hand.palmNormal[0];
            _this.volume.xNormY = hand.palmNormal[2];
            _this.volume.xNormZ = hand.palmNormal[1];
            _this.color = [Math.abs(_this.volume.xNormZ), Math.abs(_this.volume.xNormY), Math.abs(_this.volume.xNormX)];
            if(_this.coloring){
              _this.volume.xColor = [Math.abs(_this.volume.xNormZ), Math.abs(_this.volume.xNormY), Math.abs(_this.volume.xNormX)];
              _this.volume.maxColor = [Math.abs(_this.volume.xNormZ), Math.abs(_this.volume.xNormY), Math.abs(_this.volume.xNormX)];
             }
           _this.volume.sliceInfoChanged(0);
           _this.sliceXController.__max = _this.volume.range[0] - 1; 
           _this.renderer.camera.position = [-500*_this.volume.xNormX, -500*_this.volume.xNormY, -500*_this.volume.xNormZ]; 
         }
       }, 15);
     });

    _this.lmController.connect();
    // disconnect then
    }else if(value == 4){
      // cleanup demo
      clearInterval(_this.demoIntervalID);
      // cleanup lm interval
      clearInterval(_this.lmIntervalID);
      if(_this.lmController != null){
        _this.lmController.disconnect();
       }

      var controllerOptions = {enableGestures: true};
      var speedfactor = 15;
      var heightMax = 400;
      _this.lmController = new Leap.Controller(controllerOptions);

      _this.lmController.on('connect', function(){
        _this.lmIntervalID = setInterval(function(){
          var frame = _this.lmController.frame();
          if (frame.pointables.length > 0) {
            var finger = frame.pointables[0];

            //4 fingers scroll
            if(frame.pointables.length == 4){
              scroller(finger.tipPosition[0]/speedfactor, (heightMax/2 - finger.tipPosition[1])/speedfactor);
            }
            //2 fingers rotate
            else if(frame.pointables.length == 2){
              slider(finger.tipPosition[0]/speedfactor, (heightMax/2 - finger.tipPosition[1])/speedfactor);
            }

          }
        }, 10);
      });

      var slider = function(xDir, yDir) {
        var frame = _this.lmController.frame();
        _this.renderer.camera.rotate([-xDir, -yDir]);
        _this.updateSceneView();
      };
  
      var scroller = function(xDir, yDir) {
        _this.volume.indexX += yDir;
        _this.volume.children[1]['visible'] = false;
        _this.volume.children[2]['visible'] = false;
      };

    _this.lmController.connect();
    }
  });
  
  this.bboxMode.onChange(function(value) {
    _this.box.visible = value;
  });

  this.coloringMode.onChange(function(value) {
    if(value){
      _this.volume.xColor = _this.color;
      _this.volume.maxColor = _this.volume.xColor;
    }
    else{
      _this.volume.xColor = [1, 1, 1];
      _this.volume.maxColor = [1, 1, 1];
    }
    _this.volume.sliceInfoChanged(0);
  });
}

xslicegui.prototype.reslice = function(){
  var time = new Date().getTime() * 0.001;
  this.volume.xNormX = Math.cos(time);
  this.volume.xNormY = Math.cos(time*1.2);
  this.volume.xNormZ = Math.cos(time*1.5);
  this.color = [Math.abs(this.volume.xNormZ), Math.abs(this.volume.xNormY), Math.abs(this.volume.xNormX)];
  if(this.coloring){
    this.volume.xColor = [Math.abs(this.volume.xNormZ), Math.abs(this.volume.xNormY), Math.abs(this.volume.xNormX)];
    this.volume.maxColor = [Math.abs(this.volume.xNormZ), Math.abs(this.volume.xNormY), Math.abs(this.volume.xNormX)];
  }
}

window.onload = function() {
  // size contents
  sizeContent();

  // create and initialize a 3D renderer
  var r = new X.renderer3D();
  r.bgColor = [.1, .1, .1];
  r.init();
  
  // create a X.volume
  volume = new X.volume();
  // .. and attach a volume
  // volume.file = 'http://x.babymri.org/?lesson17.nii.gz';
  volume.file = 'daniel.nii';

  // only add the volume for now, the mesh gets loaded on request
  r.add(volume);

  // attach event!
  // the onShowtime method gets executed after all files were fully loaded and
  // just before the first rendering attempt
  r.onShowtime = function() {
     // Hide Y and Z slices
    volume.children[1]['visible'] = false;
    volume.children[2]['visible'] = false;
    
    // CREATE Bounding Box
    var res = [volume.bbox[0],volume.bbox[2],volume.bbox[4]];
    var res2 = [volume.bbox[1],volume.bbox[3],volume.bbox[5]];

    box = new X.object();
    box.points = new X.triplets(72);
    box.normals = new X.triplets(72);
    box.type = 'LINES';
    box.points.add(res2[0], res[1], res2[2]);
    box.points.add(res[0], res[1], res2[2]);
    box.points.add(res2[0], res2[1], res2[2]);
    box.points.add(res[0], res2[1], res2[2]);
    box.points.add(res2[0], res[1], res[2]);
    box.points.add(res[0], res[1], res[2]);
    box.points.add(res2[0], res2[1], res[2]);
    box.points.add(res[0], res2[1], res[2]);
    box.points.add(res2[0], res[1], res2[2]);
    box.points.add(res2[0], res[1], res[2]);
    box.points.add(res[0], res[1], res2[2]);
    box.points.add(res[0], res[1], res[2]);
    box.points.add(res2[0], res2[1], res2[2]);
    box.points.add(res2[0], res2[1], res[2]);
    box.points.add(res[0], res2[1], res2[2]);
    box.points.add(res[0], res2[1], res[2]);
    box.points.add(res2[0], res2[1], res2[2]);
    box.points.add(res2[0], res[1], res2[2]);
    box.points.add(res[0], res2[1], res2[2]);
    box.points.add(res[0], res[1], res2[2]);
    box.points.add(res[0], res2[1], res[2]);
    box.points.add(res[0], res[1], res[2]);
    box.points.add(res2[0], res2[1], res[2]);
    box.points.add(res2[0], res[1], res[2]);
    for ( var i = 0; i < 24; ++i) {
      box.normals.add(0, 0, 0);
    }
    r.add(box);

    var center = [volume.bbox[0] + (volume.bbox[1]-volume.bbox[0]),
              volume.bbox[2] + (volume.bbox[3]-volume.bbox[2]),
              volume.bbox[4] + (volume.bbox[5]-volume.bbox[4])
              ]

    // time to create the GUI!
    gui = new xslicegui(r, volume, box);
    gui.create();
  };

  // hide waiting screen after first render!
  r.onRender = function(){

    var loadingDiv = document.getElementById('loading');
    loadingDiv.style.display = 'none';
  }
  
  // adjust the camera position a little bit, just for visualization purposes
  r.camera.position = [270, 250, 330];
  
  r.render();


};
