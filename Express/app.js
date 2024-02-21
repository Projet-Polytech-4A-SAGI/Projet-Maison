var debug = require('debug')('http')
  , http = require('http')
  , name = 'Express:app.js';

const express = require('express');

const app = express();
const Controller = require('../Controller/controller');

app.use(express.static('views/style'));
app.use(express.static('views/script'));

app.get('/',(req, res) => {
    res.sendFile('views/front.html', {root: __dirname})
    debug('%o interface appelée', name);
  });

app.get('/light1/on', function (req, res, next) {
  debug('%o route /light1/on called', name);
  debug('%o light1 on', name);
  res.json({ message: 'light1 ON' });
})

app.get('/light1/off', function (req, res, next) {
    debug('%o route /light1/off called', name);
    debug('%o light1 off', name);
    res.json({ message: 'light1 OFF' });
})
  

app.get('/light2/on', function (req, res, next) {
    debug('%o route /light2/on called', name);
    debug('%o light1 on', name);
    res.json({ message: 'light2 ON' });
})
  
app.get('/light2/off', function (req, res, next) {
      debug('%o route /light2/off called', name);
      debug('%o light1 off', name);
      res.json({ message: 'light2 OFF' });
})

app.get('/light3/on', function (req, res, next) {
    debug('%o route /light3/on called', name);
    debug('%o light1 on', name);
    res.json({ message: 'light3 ON' });
})
  
app.get('/light3/off', function (req, res, next) {
      debug('%o route /light3/off called', name);
      debug('%o light1 off', name);
      res.json({ message: 'light3 OFF' });
})

app.get('/radiator1', function (req, res, next) {
    debug('%o route /radiator1 called', name)
    const temp = req.query.temp;
    debug('%o radiator1 '+temp, name);
    Controller.Radiator1.toggleRadiator(parseFloat(temp));
    res.json({ message: 'radiator1 set to'+temp});

})

app.get('/radiator2', function (req, res, next) {
    debug('%o route /radiator2 called', name);
    const temp = req.query.temp;
    debug('%o radiator2 '+temp, name);
    Controller.Radiator2.toggleRadiator(parseFloat(temp));
    res.json({ message: 'radiator2 set to '+temp});

})

app.get('/shutter1/open', function (req,res,next){
    debug('%o route /shutter1/open called', name);
    debug('%o shutter1 OPENED', name)
    Controller.Shutter1.toggleVolet(true);
    res.json({message:'shutter1 OPEN'})
})

app.get('/shutter1/close', function (req,res,next){
    debug('%o route /shutter1/close called', name);
    debug('%o shutter1 CLOSED', name)
    Controller.Shutter1.toggleVolet(false);
    res.json({message:'shutter1 CLOSED'})
})

app.get('/shutter2/open', function (req,res,next){
    debug('%o route /shutter2/open called');
    debug('%o shutter2 OPENED')
    Controller.Shutter2.toggleVolet(true);
    res.json({message:'shutter2 OPEN'})
})

app.get('/shutter2/close', function (req,res,next){
    debug('%o route /shutter2/close called');
    debug('%o shutter2 CLOSED')
    Controller.Shutter2.toggleVolet(false);
    res.json({message:'shutter2 CLOSED'})
})


app.get('/update', function (req, res, next) {
    debug('%o route update called', name)

    let R1temp = Controller.Radiator1.getTempC()
    debug('%o Temp Radiator 1 : '+ R1temp, name);
    let R1watter = Controller.Radiator1.getTempEau()
    debug('%o Watter Radiator 1 : '+R1watter, name);

    let R2temp = Controller.Radiator2.getTempC()
    debug('%o Temp Radiator 2 : '+ R2temp, name);
    let R2watter = Controller.Radiator2.getTempEau()
    debug('%o Watter Radiator 2 : '+R2watter, name);

    let S1 = Controller.Shutter1.getVoletState()
    debug('%o Shutter 1 : '+ S1, name);

    let S2 = Controller.Shutter2.getVoletState()
    debug('%o Shutter 2 : '+ S2, name);

    res.json({ Radiator1: { Temp : R1temp, Watter : R1watter}, Radiator2: { Temp : R2temp, Watter : R2watter}, Shutter1 : S1, Shutter2 : S2 });

})

module.exports = app;