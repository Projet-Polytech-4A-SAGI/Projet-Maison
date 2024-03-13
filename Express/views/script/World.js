import { createCamera } from './components/camera.js';
import { createCube } from './components/cube.js';
import { createRoof } from './components/roof.js';
import { createWindow } from './components/window.js';
import { createWindow2 } from './components/window2.js';
import { createDoor } from './components/door.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';

import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/resizer.js';

let scene;
let camera;
let renderer;

class World {
  constructor(container) {
    camera = createCamera();
    scene = createScene();
    renderer = createRenderer();
    container.append(renderer.domElement);

    const cube = createCube();
    const roof = createRoof();
    const door = createDoor();
    const window = createWindow();
    const window2 = createWindow2();
    const light = createLights();


    scene.add(cube, roof, door, window, window2, light);

    const resizer = new Resizer(container, camera, renderer);
    this.update();
  }

  update(){
    const api_url = "http://localhost:3000/update";
    fetch(api_url)
    .then(response => response.json())
    .then(data => {
        
        if(data.House.Inte>=20){
          door.material.color.setHex(0xee2b00);
        }else{
          door.material.color.setHex(0x20ee00);
        }

        if(data.Shutter1==True){
          window.material.color.setHex(0xffffff);
        }else{
          window.material.color.setHex(0x000000);
        }

        if(data.Shutter2==True){
          window2.material.color.setHex(0xffffff);
        }else{
          window2.material.color.setHex(0x000000);
        }
    })
    .catch(error => {
        console.error('Erreur lors de la requête :', error);
    });
    this.render();
    setTimeout(this.update,5000); //Refait la fonction toutes les 5s
  }

  render() {
    // draw a single frame
    renderer.render(scene, camera);
  }
}

export { World };
