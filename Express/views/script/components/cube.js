import * as THREE from 'three';

function createCube() {

  let geometry = new THREE.BoxGeometry(10,6,10); // To draw cube shape geometry.
  let mesh = new THREE.MeshStandardMaterial({color: 0xffe2b9}); // Add color of cube for appearance of cube.
  let cube = new THREE.Mesh(geometry, mesh); //With mesh adding appearance of cube over it.
  let edgeLine = new THREE.BoxGeometry( 10, 6, 7.5 ); 
  let edges = new THREE.EdgesGeometry( edgeLine ); // To have border of cube.
  let line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) ); // Adding border around bricks
  cube.position.set(0,0,4);
  line.position.copy(cube.position);

  return cube;
}

export { createCube };
