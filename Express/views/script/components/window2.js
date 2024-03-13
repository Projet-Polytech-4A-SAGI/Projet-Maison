import * as THREE from 'three';

function createWindow2() {

  let geometry = new THREE.PlaneGeometry(2,2,2);
  let mesh = new THREE.MeshStandardMaterial({color: 'white'});
  let cube = new THREE.Mesh(geometry, mesh); //With mesh adding appearance of cube over it.
  cube.position.set(-3,1,9.1);

  return cube;
}

export { createWindow2 };
