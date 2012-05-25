window.onload = function() {

  // create and initialize a 3D renderer
  var r = new X.renderer3D();
  r.init();
  
  // create some CSG primitives.. this is by the way an official example
  // of CSG by Evan Wallace (http://evanw.github.com/csg.js/)
  var cube = new X.cube();
  // the cube is red
  cube.color = [1, 0, 0];
  // captions appear on mouse over
  cube.caption = 'a cube';
  
  var sphere = new X.sphere();
  sphere.radius = 13;
  // the sphere is green
  sphere.color = [0, 1, 0];
  sphere.caption = 'a sphere';
  
  var cylinder1 = new X.cylinder();
  // start and end points in world space
  cylinder1.start = [-10, 0, 0];
  cylinder1.end = [10, 0, 0];
  cylinder1.radius = 7;
  // the cylinder is blue
  cylinder1.color = [0, 0, 1];
  cylinder1.caption = 'cylinder 1';
  
  var cylinder2 = new X.cylinder();
  cylinder2.start = [0, 10, 0];
  cylinder2.end = [0, -10, 0];
  cylinder2.radius = 7;
  cylinder2.color = [0, 0, 1];
  cylinder2.caption = 'cylinder 2';
  
  var cylinder3 = new X.cylinder();
  cylinder3.start = [0, 0, -10];
  cylinder3.end = [0, 0, 10];
  cylinder3.radius = 7;
  cylinder3.color = [0, 0, 1];
  cylinder3.caption = 'cylinder 3';
  
  // move some stuff around to display it all
  // we want the original shapes to be in one row
  cube.transform.translateY(30);
  cube.transform.translateX(-30);
  sphere.transform.translateY(30);
  cylinder1.transform.translateX(30);
  cylinder1.transform.translateY(30);
  cylinder2.transform.translateX(30);
  cylinder2.transform.translateY(30);
  cylinder3.transform.translateX(30);
  cylinder3.transform.translateY(30);
  
  // add'em all
  r.add(cube);
  r.add(sphere);
  r.add(cylinder1);
  r.add(cylinder2);
  r.add(cylinder3);
  
  //
  // NOW THE FUN PART!
  //
  // .. CSG is sooooo cool!
  var funstuff = cube.intersect(sphere).subtract(
      cylinder1.union(cylinder2).union(cylinder3));
  funstuff.caption = "the three from above bool'ed together!";
  
  // add the result (funstuff)
  r.add(funstuff);
  
  // .. and action!
  r.render();
  
};
