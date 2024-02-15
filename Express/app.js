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
  console.log('route /light1/on called');
  console.log('light1 on');
  res.json({ message: 'light1 ON' });
})

app.get('/light1/off', function (req, res, next) {
    console.log('route /light1/off called');
    console.log('light1 off');
    res.json({ message: 'light1 OFF' });
})
  

app.get('/light2/on', function (req, res, next) {
    console.log('route /light2/on called');
    console.log('light1 on');
    res.json({ message: 'light2 ON' });
})
  
app.get('/light2/off', function (req, res, next) {
      console.log('route /light2/off called');
      console.log('light1 off');
      res.json({ message: 'light2 OFF' });
})

app.get('/light3/on', function (req, res, next) {
    console.log('route /light3/on called');
    console.log('light1 on');
    res.json({ message: 'light3 ON' });
})
  
app.get('/light3/off', function (req, res, next) {
      console.log('route /light3/off called');
      console.log('light1 off');
      res.json({ message: 'light3 OFF' });
})

app.get('/radiator1', function (req, res, next) {
    console.log('route /radiator1 called')
    const temp = req.query.temp;
    console.log('radiator1 '+temp);
    Controller.Radiator1.toggleRadiator(parseFloat(temp));
    res.json({ message: 'radiator1 set to'+temp});

})

app.get('/radiator2', function (req, res, next) {
    console.log('route /radiator2 called');
    const temp = req.query.temp;
    console.log('radiator2 '+temp);
    Controller.Radiator2.toggleRadiator(parseFloat(temp));
    res.json({ message: 'radiator2 set to '+temp});

})

app.get('/shutter1/open', function (req,res,next){
    console.log('route /shutter1/open called');
    console.log('shutter1 OPENED')
    Controller.Shutter1.toggleVolet(true);
    res.json({message:'shutter1 OPEN'})
})

app.get('/shutter1/close', function (req,res,next){
    console.log('route /shutter1/close called');
    console.log('shutter1 CLOSED')
    Controller.Shutter1.toggleVolet(false);
    res.json({message:'shutter1 CLOSED'})
})

app.get('/shutter2/open', function (req,res,next){
    console.log('route /shutter2/open called');
    console.log('shutter2 OPENED')
    Controller.Shutter2.toggleVolet(true);
    res.json({message:'shutter2 OPEN'})
})

app.get('/shutter2/close', function (req,res,next){
    console.log('route /shutter2/close called');
    console.log('shutter2 CLOSED')
    Controller.Shutter2.toggleVolet(false);
    res.json({message:'shutter2 CLOSED'})
})


app.get('/update', function (req, res, next) {
    console.log('route update called')

    let R1temp = Controller.Radiator1.getTempC()
    console.log('Temp Radiator 1 : '+ R1temp);
    let R1watter = Controller.Radiator1.getTempEau()
    console.log('Watter Radiator 1 : '+R1watter);

    let R2temp = Controller.Radiator2.getTempC()
    console.log('Temp Radiator 2 : '+ R2temp);
    let R2watter = Controller.Radiator2.getTempEau()
    console.log('Watter Radiator 2 : '+R2watter);

    let S1 = Controller.Shutter1.getVoletState()
    console.log('Shutter 1 : '+ S1);

    let S2 = Controller.Shutter2.getVoletState()
    console.log('Shutter 2 : '+ S2);

    res.json({ Radiator1: { Temp : R1temp, Watter : R1watter}, Radiator2: { Temp : R2temp, Watter : R2watter}, Shutter1 : S1, Shutter2 : S2 });

})

module.exports = app;