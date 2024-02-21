require('dotenv').config()

var debug = require('debug')('controller.js');

  debug('Début ');

// On importe le fichier JavaScript (le fichier déclare une classe à l'intérieure)
const SimulationMaison = require("./SimulationMaison.obfs.js");

// On créé une instance de la classe SimulationMaison
var MaMaison = new SimulationMaison();

class Volet {
  constructor() {
    this.isOpen = false;
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
  }
  getTempC() {
    return this.tempC;
  }
  getTempEau() {
    return MaMaison.getTemperatureEauChauffage();
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
      this.tempR = MaMaison.getTemperatureEauChauffage();
      this.tempInt = MaMaison.getTemperatureInterieure();
      this.tempExt = MaMaison.getTemperatureExterieure();
      this.tempLim =
        this.tempC +
        (this.tempC - this.tempInt) *1.5 +
        (this.tempInt - this.tempExt) *0.5 ; //Calcul à ajuster

      debug('tempInt=%f tempR=%f tempLim=%f', this.tempInt, this.tempR, this.tempLim);

      if (this.tempInt < this.tempC) {
        if (this.tempR < this.tempLim) {
          if (MaMaison.getChaufferEau() == false) {
            MaMaison.setChaufferEau(true);
            debug('Le changement de radiator a été envoyé à la simulation (ON)');
          } else {
            debug('Pas de changement (radiator déja ON)');
          }
        }else{
          if (MaMaison.getChaufferEau() == true){
            MaMaison.setChaufferEau(false);
            debug('Le changement de radiator a été envoyé à la simulation (OFF), car tempLim atteinte');
          }else{
            debug('Pas de changement (radiator au max déjà OFF)');
          }
          
        }
      } else {
        if (MaMaison.getChaufferEau() == true) {
          MaMaison.setChaufferEau(false);
          debug('Le changement de radiator a été envoyé à la simulation (OFF), car consigne atteinte');         
        } else {
          debug('Pas de changement (radiator déja OFF, consigne atteinte)'); 
        }
      }
      setTimeout(() => runLoop(currentloopID), 5000); // Boucle
    };
    runLoop(this.loopID); // Démarrer la boucle initialement
  }
}



/* Mes tests
MaMaison.setPasDeTempsEnMs(1000);
MaMaison.startSimulation();

var MonRad = new Radiator();
var MonVolet = new Volet();

MonVolet.toggleVolet(true);
MonVolet.toggleVolet(false);
setTimeout(() => {
  MonRad.toggleRadiator(20);
}, 60000);
MonRad.toggleRadiator(25);*/


const Radiator1 = new Radiator();
const Radiator2 = new Radiator();

const Shutter1 = new Volet();
const Shutter2 = new Volet();
const Shutter3 = new Volet();

MaMaison.setPasDeTempsEnMs(process.env.INTERVAL_DE_TEMPS_SIMULATION || 5000);
MaMaison.startSimulation();

module.exports = {
 Radiator1 : Radiator1,
 Radiator2 : Radiator2,
 Shutter1 : Shutter1,
 Shutter2 : Shutter2,
 Shutter3 : Shutter3,
 }

 debug('Fin ');