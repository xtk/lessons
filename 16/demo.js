window.onload = function() {

  // initialize the renderer
  var r = new X.renderer3D();
  r.init();

  // .. and create the object
  var o = new X.object();
  r.add(o);

  var _config = {
    '3d' : false,
    'dim_x' : 30,
    'dim_y' : 20,
    'dim_z' : 20,
    'spacing' : 2,
    'type' : 'LINES',
    'size' : 3,
    'color' : 'SOLID',
    'refresh' : update
  };

  // showtime!
  r.camera.position = [ 0, 0, 30 ];
  r.render();

  function update() {

    // allocate the arrays
    var _dimensions = _config.dim_x * _config.dim_y * _config.dim_z;
    o.points = new X.triplets(6 * _dimensions);
    o.normals = new X.triplets(6 * _dimensions);
    if ( _config.color != 'SOLID' ) {
      o.colors = new X.triplets(6 * _dimensions);
    } else {
      o.colors = null;
    }

    // propagate the object configuration
    o.type = _config.type;
    var size = _config.size;
    o.linewidth = size;
    o.pointsize = size;
    var spacing = _config.spacing;

    // the possible point combinations as diagonals in a 3d cube
    var p = [ [ -1, 1, 1 ], [ -1, 1, -1 ], [ -1, -1, 1 ], [ -1, -1, -1 ] ];

    // create the pattern
    var h_x = _config.dim_x / 2;
    var h_y = _config.dim_y / 2;
    var h_z = _config.dim_z / 2;

    if ( !_config['3d'] ) {
      // stay only in 2d
      h_z = 0.5;
    }

    for ( var i = -h_x; i < h_x; ++i) {
      for ( var j = -h_y; j < h_y; ++j) {
        for ( var k = -h_z; k < h_z; ++k) {

          // grab a random point
          var _p = p[Math.floor(Math.random() * 4)];

          // calculate start and end points
          var x = _p[0] + i * spacing;
          var y = _p[1] + j * spacing;
          var z = _p[2] + k * spacing;
          var x2 = -_p[0] + i * spacing;
          var y2 = -_p[1] + j * spacing;
          var z2 = -_p[2] + k * spacing;

          if ( !_config['3d'] ) {
            z = z2 = 0;
          }

          o.points.add(x, y, z);
          o.points.add(x2, y2, z2);

          // dummy normals
          o.normals.add(0, 0, 0);
          o.normals.add(0, 0, 0);

          // and the color
          if ( _config.color == 'QUADRANT' ) {
            o.colors.add(x, y, z);
            o.colors.add(x2, y2, z2);
          } else if (_config.color == 'SEGMENT') {
            o.colors.add(_p[0], _p[1], _p[2]);
            o.colors.add(-_p[0], -_p[1], -_p[2]);            
          }

        }
      }
    }

    // fire a modified event
    o.modified();

  }

  function gui() {
    
    // create the GUI
    var gui = new dat.GUI();
    gui.add(_config, '3d');
    gui.add(_config, 'dim_x', 1, 100);
    gui.add(_config, 'dim_y', 1, 100);
    gui.add(_config, 'dim_z', 1, 100);
    gui.add(_config, 'spacing', 1, 10);
    gui.add(_config, 'size', 1, 10);
    gui.add(_config, 'color', ['SOLID', 'SEGMENT', 'QUADRANT']);
    gui.add(_config, 'type', [ 'LINES', 'POINTS', 'TRIANGLES' ]);
    gui.add(_config, 'refresh');

    // setup the callback
    for (c in gui.__controllers) {
      gui.__controllers[c].onFinishChange(update);
    }

  }

  // draw something
  update();

  // show the gui
  gui();

};
