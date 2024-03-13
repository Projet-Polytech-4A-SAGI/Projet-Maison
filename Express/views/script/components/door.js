import * as THREE from 'three';

function createDoor() {

    let geometry = new THREE.PlaneGeometry(2,3,2);
    let doorMaterial = new THREE.MeshStandardMaterial({color: 0x20ee00});
    let door = new THREE.Mesh(geometry, doorMaterial);
    door.position.set(0,-1.25,9.1);

  return door;
}

export { createDoor };
