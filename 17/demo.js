window.onload = function() {

  // create and initialize a 3D renderer
  var r = new X.renderer3D();
  r.bgColor = [.1, .1, .1];
  r.init();
  
  // create a X.volume
  var volume = new X.volume();
  // .. and attach a volume
  volume.file = 'http://x.babymri.org/?lesson17.nii.gz';

  // only add the volume for now, the mesh gets loaded on request
  r.add(volume);
  
  // the onShowtime method gets executed after all files were fully loaded and
  // just before the first rendering attempt
  r.onShowtime = function() {

     // Hide Y and Z slices
    volume.children[1]['visible'] = false;
    volume.children[2]['visible'] = false;
    
    // set X slice color
    volume.xColor = [.1, .1, 1];
    // set callback to change X slice normal
    setInterval(function(){var time = new Date().getTime() * 0.002; volume.xNormX = Math.cos(time);volume.xNormY = Math.cos(time/2);volume.xNormZ = Math.cos(time/3);volume.xColor = [Math.abs(volume.xNormX), Math.abs(volume.xNormY), Math.abs(volume.xNormZ)];volume.sliceInfoChanged(0);},100);

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


    //
    // The GUI panel
    //
    // (we need to create this during onShowtime(..) since we do not know the
    // volume dimensions before the loading was completed)
    
    var gui = new dat.GUI();
    
    // the following configures the gui for interacting with the X.volume
    var slicegui = gui.addFolder('Slice X Information');
    var sliceXNXController = slicegui.add(volume, 'xNormX', -1,1).listen();
    var sliceXNYController = slicegui.add(volume, 'xNormY', -1,1).listen();
    var sliceXNZController = slicegui.add(volume, 'xNormZ', -1,1).listen();
    var sliceXNCController = slicegui.addColor(volume, 'xColor').listen();
    slicegui.open();
  
  };
  
  // adjust the camera position a little bit, just for visualization purposes
  r.camera.position = [270, 250, 330];
  
  r.render();

};
