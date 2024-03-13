import { createCamera } from './components/camera.js';
import { createCube } from './components/cube.js';
import { createRoof } from './components/roof.js';
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
    const light = createLights();

    scene.add(cube, roof, light);

    const resizer = new Resizer(container, camera, renderer);
  }

  render() {
    // draw a single frame
    renderer.render(scene, camera);
  }
}

export { World };
