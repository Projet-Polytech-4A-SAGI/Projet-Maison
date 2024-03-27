class Resizer {
  constructor(container, camera, renderer) {
    // Set the camera's aspect ratio
    camera.aspect = container.clientWidth / 500;

    // update the camera's frustum
    camera.updateProjectionMatrix();

    // update the size of the renderer AND the canvas
    renderer.setSize(container.clientWidth, 500);

    // set the pixel ratio (for mobile devices)
    renderer.setPixelRatio(window.devicePixelRatio);
  }
}

export { Resizer };
