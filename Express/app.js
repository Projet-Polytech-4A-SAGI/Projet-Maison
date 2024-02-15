const express = require('express');

const app = express();
const Controller = require('../Controller/controller');

app.use(express.static('views/style'));
app.use(express.static('views/script'));

app.get('/',(req, res) => {
    res.sendFile('views/front.html', {root: __dirname})
    console.log('interface appelée');
  });

app.get('/light1/on', function (req, res, next) {
  console.log('la route /light1/on a été appelée');
  console.log('light1 on');
  res.json({ message: 'La lampe 1 a été allumée' });
})

app.get('/light1/off', function (req, res, next) {
    console.log('la route /light1/off a été appelée');
    console.log('light1 off');
    res.json({ message: 'La lampe 1 a été éteinte' });
})
  

app.get('/light2/on', function (req, res, next) {
    console.log('la route /light2/on a été appelée');
    console.log('light1 on');
    res.json({ message: 'La lampe 2 a été allumée' });
})
  
app.get('/light2/off', function (req, res, next) {
      console.log('la route /light2/off a été appelée');
      console.log('light1 off');
      res.json({ message: 'La lampe 2 a été éteinte' });
})

app.get('/light3/on', function (req, res, next) {
    console.log('la route /light3/on a été appelée');
    console.log('light1 on');
    res.json({ message: 'La lampe 3 a été allumée' });
})
  
app.get('/light3/off', function (req, res, next) {
      console.log('la route /light3/off a été appelée');
      console.log('light1 off');
      res.json({ message: 'La lampe 3 a été éteinte' });
})

app.get('/heater1', function (req, res, next) {
    console.log('la route /heater1 a été appelée')
    const temp = req.query.temp;
    console.log('heater1 '+temp);
    Controller.Radiator.toggleRadiator(parseFloat(temp));
    res.json({ message: 'Le radiateur 1 a été réglé sur '+temp+' degrés'});

})

app.get('/heater2', function (req, res, next) {
    console.log('la route /heater2 a été appelée')
    const temp = req.query.temp;
    console.log('heater1 '+temp);
    res.json({ message: 'Le radiateur 2 a été réglé sur '+temp+' degrés'});

})

app.get('/update', function (req, res, next) {
    console.log('la route update a été appelée')
    let temp = Controller.Radiator.getTempC()
    console.log('temp '+temp);
    res.json({ title: 'heater1', message: temp});
    let temp_eau = Controller.Radiator.getTempEau()
    console.log('temp eau '+temp_eau);
    res.json({ message: 'L eau du radiateur est réglé sur '+temp_eau+' degrés'});
    let volet_state = Controller.Volet.getVoletState()
    console.log('etat du volet '+ volet_state);
    res.json({ message: 'Le volet est sur l etat '+ volet});

})

module.exports = app;