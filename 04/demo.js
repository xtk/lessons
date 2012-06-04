window.onload = function() {

  // create and initialize a 3D renderer
  var r = new X.renderer3D();
  r.init();
  
  // create a new X.mesh
  var porsche = new X.mesh();
  // .. and associate the .stl to it
  porsche.file = 'http://x.babymri.org/?porsche.stl';
  // activate the magic mode which results in a colorful rendering since the
  // point colors are based on the point position
  porsche.magicmode = true;
  // set a caption which appears on mouseover
  porsche.caption = 'The magic Porsche!';
  
  // .. add the porsche
  r.add(porsche);
  
  // .. and start the loading/rendering
  r.render();
  
};
