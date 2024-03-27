import * as THREE from 'three';

function createRoof() {

    let geometry = new THREE.ConeGeometry(7.5,4,4); 
    let roofMaterial = new THREE.MeshStandardMaterial({color: 0x6a6a6a});
    let roof = new THREE.Mesh(geometry, roofMaterial);
    roof.position.set(0, 5, 4); // il est 1 plus haut ? 
    roof.rotation.set(0,0.785,0);//en radian

  return roof;
}

export { createRoof };
