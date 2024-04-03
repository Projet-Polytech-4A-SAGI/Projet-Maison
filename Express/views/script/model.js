import { World } from './World.js';

function main() {
  const socket = io(); //io socket accessible from html
  // Get a reference to the container element
  const container = document.querySelector('#scene-container');

  // create a new world
  const world = new World(container);

  // draw the scene
  world.render();
  world.update(world);
  rightCmd();
  //runUpdate(world); //Used if no socket
  //runUpdate2(); //Used if no socket

  
  //sockets
  socket.on('dataUpdated', (data) => {
      rightCmd();
      world.update(world);
  });
  socket.on('commands', (data) => {
      leftCmd(data);
  });
}


function runUpdate(world) {
  setInterval(() => world.update(world), 5000);
}

function runUpdate2() {
  setInterval(() => rightCmd(), 5000);
}

function leftCmd(message) {
  const cmdElement = document.querySelector("left-cmd");
  cmdElement.textContent += message + '\n';
}

function rightCmd() {
  //Connect to get current values
  const api_url = "http://localhost:3000/update";
    fetch(api_url)
    .then(response => response.json())
    .then(data => {
      var elements = document.querySelectorAll('.TempIn, .TempOut, .LivWin, .BedWin, .LivLight, .BedLight, .BathLight');
      elements.forEach(function(element) {
        
        element.innerHTML = ''; // Clear existing content
        // Create a new element if not
        var additionalElement = document.createElement('span');
        if(element.classList.contains('TempIn')){
          additionalElement.textContent = data.House.Inte.toFixed(2) + "°C";
        }
        if(element.classList.contains('TempOut')){
          additionalElement.textContent = data.House.Exte.toFixed(2) + "°C";
        }
        if(element.classList.contains('LivWin')){
          if(data.Shutter1 == true){
            additionalElement.textContent = "Opened";
          }else{
            additionalElement.textContent = "Closed";
          }    
        }
        if(element.classList.contains('BedWin')){
          if(data.Shutter2 == true){
            additionalElement.textContent = "Opened";
          }else{
            additionalElement.textContent = "Closed";
          }    
        }
        if(element.classList.contains('LivLight')){
          if(data.light1 == true){
            additionalElement.textContent = "ON";
          }else{
            additionalElement.textContent = "OFF";
          }                
        }
        if(element.classList.contains('BedLight')){
          if(data.light2 == true){
            additionalElement.textContent = "ON";
          }else{
            additionalElement.textContent = "OFF";
          }    
        }
        if(element.classList.contains('BathLight')){
          if(data.light3 == true){
            additionalElement.textContent = "ON";
          }else{
            additionalElement.textContent = "OFF";
          }    
        }
        
        
        // Replace existing content with the new element if yes
        element.appendChild(additionalElement);
        
        element.classList.add('appended'); // Add a class to mark that additional content has been added
      });
    })
    .catch(error => {
        console.error('Erreur lors de la requête :', error);
    });
};

main();
