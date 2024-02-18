const express = require('express');

const app = express();
const Controller = require('../Controller/controller');

/*app.use(express.static('views/style'));
app.use(express.static('views/script'));
app.use(express.static('views/img'));*/
const path = require("path");
const controller = require('../Controller/controller');
app.use(express.static(path.join(__dirname, "views")));
app.use(express.static(path.join(__dirname, "public")));

app.get('/',(req, res) => {
    res.sendFile('views/front.html', {root: __dirname})
    console.log('interface appelée');
  });


app.get('/light1/toggle', function (req, res, next) {
    console.log('route /light1/toggle called');
    controller.Light1.toggleLight();
    let status = controller.Light1.getLightState();
    console.log('light1 '+status)
    res.json({ light: 'Light1', status : status });
})

app.get('/light2/toggle', function (req, res, next) {
    console.log('route /light2/toggle called');
    controller.Light2.toggleLight();
    let status = controller.Light2.getLightState();
    console.log('light2 '+status)
    res.json({ light: 'Light2', status : status });
})

app.get('/light3/toggle', function (req, res, next) {
    console.log('route /light3/toggle called');
    controller.Light3.toggleLight();
    let status = controller.Light3.getLightState();
    console.log('light3 '+status)
    res.json({ light: 'Light3', status : status });
})

app.get('/radiator1', function (req, res, next) {
    console.log('route /radiator1 called')
    const temp = req.query.temp;
    Controller.Radiator1.toggleRadiator(parseFloat(temp));
    let R1temp = Controller.Radiator1.getTempC()
    console.log('Temp Radiator 1 : '+ R1temp);
    let R1watter = Controller.Radiator1.getTempEau()
    console.log('Watter Radiator 1 : '+R1watter);
    res.json({  Temp : R1temp, Watter : R1watter });

})

app.get('/radiator2', function (req, res, next) {
    console.log('route /radiator2 called');
    const temp = req.query.temp;
    Controller.Radiator2.toggleRadiator(parseFloat(temp));
    let R2temp = Controller.Radiator2.getTempC()
    console.log('Temp Radiator 2 : '+ R2temp);
    let R2watter = Controller.Radiator2.getTempEau()
    console.log('Watter Radiator 2: '+R2watter);
    res.json({ Temp : R2temp, Watter : R2watter});

})

app.get('/shutter1/open', function (req,res,next){
    console.log('route /shutter1/open called');
    Controller.Shutter1.toggleVolet(true);
    let S1 = Controller.Shutter1.getVoletState();
    console.log('shutter1 '+ S1)
    res.json({status:S1})
})

app.get('/shutter1/close', function (req,res,next){
    console.log('route /shutter1/close called');
    Controller.Shutter1.toggleVolet(false);
    let S1 = Controller.Shutter1.getVoletState();
    console.log('shutter1 '+ S1)
    res.json({status:S1})
})

app.get('/shutter2/open', function (req,res,next){
    console.log('route /shutter2/open called');
    Controller.Shutter2.toggleVolet(true);
    let S2 = Controller.Shutter2.getVoletState();
    console.log('shutter2 '+ S2)
    res.json({status:S2})
})

app.get('/shutter2/close', function (req,res,next){
    console.log('route /shutter2/close called');
    Controller.Shutter2.toggleVolet(false);
    let S2 = Controller.Shutter2.getVoletState();
    console.log('shutter2 '+ S2)
    res.json({status:S2})
})


app.get('/update', function (req, res, next) {
    console.log('route update called')

    let tempExte= Controller.MyHouse.getTempExte();
    console.log('Temp Exte : '+ tempExte);
    let tempInte= Controller.MyHouse.getTempInte();
    console.log('Temp Inte : '+ tempInte);

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

    let L1 = Controller.Light1.getLightState()
    console.log('Light 1: '+ L1);

    let L2 = Controller.Light2.getLightState()
    console.log('Light 2: '+ L2);

    let L3 = Controller.Light3.getLightState()
    console.log('Light 3: '+ L3);

    res.json({ House:{Exte: tempExte, Inte: tempInte},radiator1: { Temp : R1temp, Watter : R1watter}, radiator2: { Temp : R2temp, Watter : R2watter}, Shutter1 : S1, Shutter2 : S2, light1 : L1, light2 : L2,light3 : L3});

})

module.exports = app;