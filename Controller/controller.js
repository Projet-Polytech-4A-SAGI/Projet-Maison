require('dotenv').config()
const path = require('path');

var debug = require('debug')('controller.js');

  debug('Début ');

// On importe le fichier JavaScript (le fichier déclare une classe à l'intérieure)
const SimulationMaison = require("./SimulationMaison.obfs.js");

// On créé une instance de la classe SimulationMaison
var MaMaison = new SimulationMaison();
let io;

class Light{
  constructor() {
    this.isOn=false;
  }
  toggleLight(){
    if (this.isOn==false){
      this.isOn=true;
    }
    else {
      this.isOn=false;
    }
  }
  getLightState(){
    return this.isOn;
  }
}

class Volet {
  constructor() {
    this.isOpen = false;
    this.Maison = new SimulationMaison;
  }

  setMaison(Simu){
    this.Maison=Simu;
  }

  toggleVolet(newState) {
    this.isOpen = newState;
    if(this.isOpen==true){
      debug('Le changement de Volet a été envoyé à la simulation (Volet ouvert)');
    }else{
      debug('Le changement de Volet a été envoyé à la simulation (Volet fermé)');
    }
  }
  getVoletState() {
    return this.isOpen;
  }
}

class House{
  constructor(){
    this.tempExte=0;
    this.tempInte=0;
    this.Maison=new SimulationMaison;
  }
  setMaison(Simu){
    this.Maison=Simu;
  }
  getTempInte(){
    return this.Maison.temperatureInterieure;
  }
  getTempExte(){
    return this.Maison.temperatureExterieure;
  }
  setTempInte(value){
    this.Maison.temperatureInterieure =value;
  }
  setTempExte(value){
    this.Maison.temperatureExterieure =value;
  }
  
}

class Radiator {
  constructor() {
    this.tempC = 20;
    this.tempR = 0;
    this.tempInt = 0;
    this.tempExt = 0;
    this.tempLim = 0;
    this.isRunning = false;
    this.shouldNotStop = false;
    this.loopID = 0;
    this.Maison = new SimulationMaison;
  }

  setMaison(Simu){
    this.Maison=Simu;
  }
  getTempC() {
    return this.tempC;
  }
  getTempEau() {
    return this.Maison.getTemperatureEauChauffage();
  }
  toggleRadiator(temp) {
    // Vérifier si la boucle est déjà en cours d'exécution
    if (this.isRunning) {
      debug('Nouvelle consigne bien reçue');
      this.loopID += 1;
      this.shouldNotStop = this.loopID;
    }

    this.tempC = temp;
    this.isRunning = true; // Marquer la boucle comme en cours d'exécution

    const runLoop = (currentloopID) => {
      if (currentloopID != this.shouldNotStop) {
        return;
      }
      this.tempR = this.Maison.getTemperatureEauChauffage();
      this.tempInt = this.Maison.getTemperatureInterieure();
      this.tempExt = this.Maison.getTemperatureExterieure();
      this.tempLim =
        this.tempC +
        (this.tempC - this.tempInt) *1.5 +
        (this.tempInt - this.tempExt) *0.5 ; //Calcul à ajuster

      debug('tempInt=%f tempR=%f tempLim=%f', this.tempInt, this.tempR, this.tempLim);

      if (this.tempInt < this.tempC) {
        if (this.tempR < this.tempLim) {
          if (this.Maison.getChaufferEau() == false) {
            this.Maison.setChaufferEau(true);
            debug(
              "controller.js : Le changement de radiator a été envoyé à la simulation (ON)",
            );
          } else {
            debug('Pas de changement (radiator déja ON)');
          }
        }else{
          if (this.Maison.getChaufferEau() == true){
            this.Maison.setChaufferEau(false);
            debug(
              "controller.js : Le changement de radiator a été envoyé à la simulation (OFF), car tempLim atteinte");
          }else{
            debug('Pas de changement (radiator au max déjà OFF)');
          }
          
        }
      } else {
        if (this.Maison.getChaufferEau() == true) {
          this.Maison.setChaufferEau(false);
          debug(
            "controller.js : Le changement de radiator a été envoyé à la simulation (OFF), car consigne atteinte",
          );
        } else {
          debug('Pas de changement (radiator déja OFF, consigne atteinte)'); 
        }
      }
      setTimeout(() => runLoop(currentloopID), 5000); // Boucle
    };
    runLoop(this.loopID); // Démarrer la boucle initialement
  }
}

function SocketUpdate(socketIoInstance) {
  io = socketIoInstance;

  // Emits data every update
  setInterval(() => {
      io.emit('dataUpdated', '');
  }, process.env.INTERVAL_DE_TEMPS_SIMULATION || 5000);
}

const fs = require('fs');

setInterval(() => {
  meteo()
},3600 * 1000)

async function meteo()
{
    const  response = await fetch('https://api.meteo-concept.com/api/forecast/nextHours?token='+process.env.token_meteo+"&insee="+process.env.insee)
    const data = await response.json();
    MaMaison.setTemperatureExterieure(data.forecast[0].temp2m);

  };

function historysave() {
  const filePath = path.join(__dirname, '..', 'Express', 'history', 'history.csv');
  const maxLines = 120;

  setInterval(() => {
    const temp_inte=MyHouse.getTempInte().toFixed(2);
    const temp_exte=MyHouse.getTempExte().toFixed(2);
    const temp_chauffage=((Radiator1.getTempC()+Radiator2.getTempC())/2).toFixed(1);

    const csvLine = `${temp_inte},${temp_exte},${temp_chauffage}\n`;

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
          console.error('Erreur lors de la lecture du fichier CSV :', err);
          return;
      }

      const lines = data.trim().split('\n');
      if (lines.length >= maxLines) {
          const newLines = lines.slice(lines.length - maxLines + 1).join('\n') + '\n';
          fs.writeFile(filePath, newLines, (err) => {
              if (err) {
                  console.error('Erreur lors de l\'écriture dans le fichier CSV :', err);
              }
          });
      }

      fs.appendFile(filePath, csvLine, (err) => {
          if (err) {
              console.error('Erreur lors de l\'écriture dans le fichier CSV :', err);
          }
      });
    }) 
  }, process.env.INTERVAL_DE_TEMPS_SIMULATION || 30000);
}

// MyHouse.getTempExte
//       MyHouse.getTempInte
//       Radiator1.getTempC



const MyHouse = new House();
MyHouse.setMaison(MaMaison);

const Radiator1 = new Radiator();
Radiator1.setMaison(MaMaison);
const Radiator2 = new Radiator();
Radiator2.setMaison(MaMaison);
Radiator1.toggleRadiator(Radiator1.getTempC()); //On leur donne une consigne de base pour ne pas qu'ils chauffent à l'infini au démarage
Radiator2.toggleRadiator(Radiator2.getTempC());

const Shutter1 = new Volet();
Shutter1.setMaison(MaMaison);
const Shutter2 = new Volet();
Shutter2.setMaison(MaMaison); 

const Light1 = new Light();
const Light2 = new Light();
const Light3 = new Light();

MaMaison.setPasDeTempsEnMs(process.env.INTERVAL_DE_TEMPS_SIMULATION || 5000);
MaMaison.startSimulation();

historysave();

module.exports = {

 MyHouse : MyHouse,
 Radiator1 : Radiator1,
 Radiator2 : Radiator2,
 Shutter1 : Shutter1,
 Shutter2 : Shutter2,
 Light1 : Light1,
 Light2 : Light2,
 Light3 : Light3,
 SocketUpdate
 }

 debug('Fin ');