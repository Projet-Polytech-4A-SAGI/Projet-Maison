console.log("controller.js : Début");


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
    MaMaison.setVoletOuvert(newState);
    if(MaMaison.getVoletOuvert()==true){
       console.log("controller.js : Le changement de Volet a été envoyé à la simulation (Volet ouvert)");
    }else{
      console.log("controller.js : Le changement de Volet a été envoyé à la simulation (Volet fermé)");
    }
  }
  getVoletState() {
    return MaMaison.getVoletOuvert();
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
      console.log(
        "controller.js : Nouvelle consigne bien reçue",
      );
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

      console.log(this.tempInt, this.tempR, this.tempLim, this.tempExt);

      if (this.tempInt < this.tempC) {
        if (this.tempR < this.tempLim) {
          if (MaMaison.getChaufferEau() == false) {
            MaMaison.setChaufferEau(true);
            console.log(
              "controller.js : Le changement de radiator a été envoyé à la simulation (ON)",
            );
          } else {
            console.log("controller.js : Pas de changement (radiator déja ON)");
          }
        }else{
          if (MaMaison.getChaufferEau() == true){
            MaMaison.setChaufferEau(false);
            console.log(
              "controller.js : Le changement de radiator a été envoyé à la simulation (OFF), car tempLim atteinte");
          }else{
            console.log("controller.js : Pas de changement (radiator au max déjà OFF)");
          }
          
        }
      } else {
        if (MaMaison.getChaufferEau() == true) {
          MaMaison.setChaufferEau(false);
          console.log(
            "controller.js : Le changement de radiator a été envoyé à la simulation (OFF), car consigne atteinte",
          );
        } else {
          console.log("controller.js : Pas de changement (radiator déja OFF, consigne atteinte)");
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


console.log("controller.js : Fin");

const MonRadiateur = new Radiator();
const MonVolet = new Volet();

module.exports = {
 /*toggleRadiator : Radiator.prototype.toggleRadiator,
 getTempC: Radiator.prototype.getTempC,*/
 Radiator : MonRadiateur,
 Volet : MonVolet
 }
