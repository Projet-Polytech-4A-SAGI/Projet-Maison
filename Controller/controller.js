require('dotenv').config()

var debug = require('debug')('http')
  , http = require('http')
  , name = 'controller.js';

  debug('Début %o', name);


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
      debug('%o Le changement de Volet a été envoyé à la simulation (Volet ouvert)', name);
    }else{
      debug('%o Le changement de Volet a été envoyé à la simulation (Volet fermé)', name);
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
      debug('%o Nouvelle consigne bien reçue', name);
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

      debug('%o tempInt=%f tempR=%f tempLim=%f', name, this.tempInt, this.tempR, this.tempLim);

      if (this.tempInt < this.tempC) {
        if (this.tempR < this.tempLim) {
          if (MaMaison.getChaufferEau() == false) {
            MaMaison.setChaufferEau(true);
            debug('%o Le changement de radiator a été envoyé à la simulation (ON)', name);
          } else {
            debug('%o Pas de changement (radiator déja ON)', name);
          }
        }else{
          if (MaMaison.getChaufferEau() == true){
            MaMaison.setChaufferEau(false);
            debug('%o Le changement de radiator a été envoyé à la simulation (OFF), car tempLim atteinte', name);
          }else{
            debug('%o Pas de changement (radiator au max déjà OFF)', name);
          }
          
        }
      } else {
        if (MaMaison.getChaufferEau() == true) {
          MaMaison.setChaufferEau(false);
          debug('%o Le changement de radiator a été envoyé à la simulation (OFF), car consigne atteinte', name);         
        } else {
          debug('%o Pas de changement (radiator déja OFF, consigne atteinte)', name); 
        }
      }
      setTimeout(() => runLoop(currentloopID), 5000); // Boucle
    };
    runLoop(this.loopID); // Démarrer la boucle initialement
  }
}




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

 debug('Fin %o', name);