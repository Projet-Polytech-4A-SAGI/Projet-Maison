var debug = require('debug')('Express:app.js');
const express = require('express');

const app = express();
const Controller = require('../Controller/controller');

let io;
function SetIo(socket){
    io=socket;
}

const fs = require('fs');
const path = require("path");
const controller = require('../Controller/controller');
app.use(express.static(path.join(__dirname, "views")));
app.use(express.static(path.join(__dirname, "public")));

app.get('/',(req, res) => {
    res.sendFile('views/front2.html', {root: __dirname})
    debug('interface appelée');
  });

app.get('/chart',(req, res) => {
res.sendFile('views/chart.html', {root: __dirname})
debug('chart appelée');
});

app.get('/chart_data',(req, res) => {
    debug('chart data appelée');
    const filePath = path.join(__dirname, 'history', 'history.csv');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture du fichier CSV :', err);
            res.status(500).send('Erreur lors de la lecture du fichier CSV');
            return;
        }

        const lines = data.trim().split('\n');
        const labels = [];
        const tempExtData = [];
        const tempIntData = [];
        const tempConsData = [];

        lines.forEach((line) => {
            const [tempInte, tempExte, tempConsigne] = line.split(',');
            labels.push('');
            tempExtData.push(parseFloat(tempExte));
            tempIntData.push(parseFloat(tempInte));
            tempConsData.push(parseFloat(tempConsigne));
        });

        res.json({ labels, tempExtData, tempIntData, tempConsData });
    });



    });

app.get('/model',(req, res) => {
res.sendFile('views/model.html', {root: __dirname})
debug('interface appelée');
});


app.get('/light1/toggle', function (req, res, next) {
    debug('route /light1/toggle called');
    controller.Light1.toggleLight();
    let status = controller.Light1.getLightState();
    debug('light1 '+status)
    res.json({ light: 'Light1', status : status });
    io.emit('dataUpdated', '');
})

app.get('/light2/toggle', function (req, res, next) {
    debug('route /light2/toggle called');
    controller.Light2.toggleLight();
    let status = controller.Light2.getLightState();
    debug('light2 '+status)
    res.json({ light: 'Light2', status : status });
    io.emit('dataUpdated', '');
})

app.get('/light3/toggle', function (req, res, next) {
    debug('route /light3/toggle called');
    controller.Light3.toggleLight();
    let status = controller.Light3.getLightState();
    debug('light3 '+status)
    res.json({ light: 'Light3', status : status });
    io.emit('dataUpdated', '');
})

app.get('/radiator1', function (req, res, next) {
    debug('route /radiator1 called')
    const temp = req.query.temp;
    debug('radiator1 '+temp);
    Controller.Radiator1.toggleRadiator(parseFloat(temp));
    let R1temp = Controller.Radiator1.getTempC()
    debug('Temp Radiator 1 : '+ R1temp);
    let R1watter = Controller.Radiator1.getTempEau()
    debug('Watter Radiator 1 : '+R1watter);
    res.json({  Temp : R1temp, Watter : R1watter });
    io.emit('dataUpdated', '');

})

app.get('/radiator2', function (req, res, next) {
    debug('route /radiator2 called');
    const temp = req.query.temp;
    Controller.Radiator2.toggleRadiator(parseFloat(temp));
    let R2temp = Controller.Radiator2.getTempC()
    debug('Temp Radiator 2 : '+ R2temp);
    let R2watter = Controller.Radiator2.getTempEau()
    debug('Watter Radiator 2: '+R2watter);
    res.json({ Temp : R2temp, Watter : R2watter});
    io.emit('dataUpdated', '');

})

app.get('/shutter1/open', function (req,res,next){
    debug('route /shutter1/open called');
    debug('shutter1 OPENED')
    Controller.Shutter1.toggleVolet(true);
    let S1 = Controller.Shutter1.getVoletState();
    debug('shutter1 '+ S1)
    res.json({status:S1})
    io.emit('dataUpdated', '');
})

app.get('/shutter1/close', function (req,res,next){
    debug('route /shutter1/close called');
    debug('shutter1 CLOSED')
    Controller.Shutter1.toggleVolet(false);
    let S1 = Controller.Shutter1.getVoletState();
    debug('shutter1 '+ S1)
    res.json({status:S1})
    io.emit('dataUpdated', '');
})

app.get('/shutter2/open', function (req,res,next){
    debug('route /shutter2/open called');
    debug('shutter2 OPENED')
    Controller.Shutter2.toggleVolet(true);
    let S2 = Controller.Shutter2.getVoletState();
    debug('shutter2 '+ S2)
    res.json({status:S2})
    io.emit('dataUpdated', '');
})

app.get('/shutter2/close', function (req,res,next){
    debug('route /shutter2/close called');
    debug('shutter2 CLOSED')
    Controller.Shutter2.toggleVolet(false);
    let S2 = Controller.Shutter2.getVoletState();
    debug('shutter2 '+ S2)
    res.json({status:S2})
    io.emit('dataUpdated', '');
})


app.get('/update', function (req, res, next) {
    debug('route update called')

    let tempExte= Controller.MyHouse.getTempExte();
    debug('Temp Exte : '+ tempExte);
    let tempInte= Controller.MyHouse.getTempInte();
    debug('Temp Inte : '+ tempInte);

    let R1temp = Controller.Radiator1.getTempC()
    debug('Temp Radiator 1 : '+ R1temp);
    let R1watter = Controller.Radiator1.getTempEau()
    debug('Watter Radiator 1 : '+R1watter);

    let R2temp = Controller.Radiator2.getTempC()
    debug('Temp Radiator 2 : '+ R2temp);
    let R2watter = Controller.Radiator2.getTempEau()
    debug('Watter Radiator 2 : '+R2watter);

    let S1 = Controller.Shutter1.getVoletState()
    debug('Shutter 1 : '+ S1);

    let S2 = Controller.Shutter2.getVoletState()
    debug('Shutter 2 : '+ S2);

    let L1 = Controller.Light1.getLightState()
    debug('Light 1: '+ L1);

    let L2 = Controller.Light2.getLightState()
    debug('Light 2: '+ L2);

    let L3 = Controller.Light3.getLightState()
    debug('Light 3: '+ L3);

    res.json({ House:{Exte: tempExte, Inte: tempInte},radiator1: { Temp : R1temp, Watter : R1watter}, radiator2: { Temp : R2temp, Watter : R2watter}, Shutter1 : S1, Shutter2 : S2, light1 : L1, light2 : L2,light3 : L3});

})

module.exports = {
    app,
    SetIo
};