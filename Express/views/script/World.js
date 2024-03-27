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
    this.door = createDoor();
    this.window = createWindow();
    this.window2 = createWindow2();
    const light = createLights();

    scene.add(cube, roof, this.door, this.window, this.window2, light);

    const resizer = new Resizer(container, camera, renderer);
  }

  update(world){
    const api_url = "http://localhost:3000/update";
    fetch(api_url)
    .then(response => response.json())
    .then(data => {
        world.door.material.color.setHex(this.getColorBasedOnIntensity(data));
        
        if(data.Shutter1==true){
          world.window.material.color.setHex(0xffffff);
        }else{
          world.window.material.color.setHex(0x000000);
        }

        if(data.Shutter2==true){
          world.window2.material.color.setHex(0xffffff);
        }else{
          world.window2.material.color.setHex(0x000000);
        }
        this.render();
    })
    .catch(error => {
        console.error('Erreur lors de la requête :', error);
    });
    
  }

getColorBasedOnIntensity(data) {
      let intensity = data.House.Inte;
      let color;
      
      if (intensity <= 5) {
        color = 0x0000ff;
    } else if (intensity <= 10) {
        color = 0x0077ff;
    } else if (intensity <= 15) {
        color = 0x00ffff;
    } else if (intensity <= 18) {
        color = 0x00ff77;
    } else if (intensity <= 21) {
        color = 0x00ff00;
    } else if (intensity <= 25) {
        color = 0xffff00;
    } else if (intensity <= 30) {
        color = 0xff7700;
    } else {
        color = 0xff0000;
    }
      
      return color;
}

  render() {
    // draw a single frame
    renderer.render(scene, camera);
  }
}

export { World};
