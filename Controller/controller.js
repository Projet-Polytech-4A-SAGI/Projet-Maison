require('dotenv').config()

var debug = require('debug')('controller.js');

  debug('Début ');

// On importe le fichier JavaScript (le fichier déclare une classe à l'intérieure)
const SimulationMaison = require("./SimulationMaison.obfs.js");

// On créé une instance de la classe SimulationMaison
var MaMaison1 = new SimulationMaison();
var MaMaison2 = new SimulationMaison();
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
    this.Maison.setVoletOuvert(newState);
    if(this.Maison.getVoletOuvert()==true){
      debug('Le changement de Volet a été envoyé à la simulation (Volet ouvert)');
    }else{
      debug('Le changement de Volet a été envoyé à la simulation (Volet fermé)');
    }
  }
  getVoletState() {
    return this.Maison.getVoletOuvert();
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
    this.tempC = 0;
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





const MyHouse = new House();
MyHouse.setMaison(MaMaison1);

const Radiator1 = new Radiator();
Radiator1.setMaison(MaMaison1);
const Radiator2 = new Radiator();
Radiator2.setMaison(MaMaison1);

const Shutter1 = new Volet();
Shutter1.setMaison(MaMaison1);
const Shutter2 = new Volet();
Shutter2.setMaison(MaMaison2);

const Light1 = new Light();
const Light2 = new Light();
const Light3 = new Light();

MaMaison1.setPasDeTempsEnMs(process.env.INTERVAL_DE_TEMPS_SIMULATION || 5000);
MaMaison1.startSimulation();

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