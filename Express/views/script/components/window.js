import * as THREE from 'three';

function createWindow() {

  let geometry = new THREE.PlaneGeometry(2,2,2);
  let mesh = new THREE.MeshStandardMaterial({color: 'white'}); // Add color of cube for appearance of cube.
  let cube = new THREE.Mesh(geometry, mesh); //With mesh adding appearance of cube over it.
  cube.position.set(3,1,9.1);

  return cube;
}

export { createWindow };
