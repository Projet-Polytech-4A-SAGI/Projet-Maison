function toggleLight(lightId) {
    fetch(`http://localhost:3000/${lightId}/toggle`)
    .then(response => response.json())
    .then(data => { 
        Lights[lightId]=data.status
        updateLamp(lightId)})
    .catch(error => {
        console.error('Erreur lors de la requête :', error);
    });
}

function setTemperature(radiatorId) {
    var tempElement = document.getElementById(radiatorId + 'Temp');
    var tempDisplayElement = document.getElementById(radiatorId + 'TempDisplay');
    var temperature = tempElement.value;
    tempDisplayElement.innerText = temperature;
    document.getElementById(radiatorId).classList.toggle('on');
    const api_url = "http://localhost:3000/"+radiatorId+"?temp="+temperature
    fetch(api_url)
    .then(response => response.json())
    .then(data => { 
        Radiators[radiatorId].Temp = data.Temp
        Radiators[radiatorId].Watter = data.Watter
        updateRadiator(radiatorId)})
    .catch(error => {
        console.error('Erreur lors de la requête :', error);
        });
    }
    

function toggleShutter(shutterId,action){

    var statusElement =document.getElementById(shutterId + 'Status');

    if (action === 'CLOSE'){
        statusElement.innerText='CLOSED';
        const api_url="http://localhost:3000/"+shutterId+"/close";
        fetch(api_url);
    }
    else{
        statusElement.innerHTML="OPENED";
        const api_url="http://localhost:3000/"+shutterId+"/open";
        fetch(api_url);
    }

}

function loadstates(){
    const api_url = "http://localhost:3000/update";
    fetch(api_url)
    .then(response => response.json())
    .then(data => {

        House.tempInte=data.House.Inte;
        House.tempInte=data.House.Exte;

        updateHouse();

        Lights.light1=data.light1;
        Lights.light2=data.light2;
        Lights.light3=data.light3;
        
        updateLamp("light1");
        updateLamp("light2");
        updateLamp("light3");

        Radiators.radiator1.Temp=data.radiator1.Temp;
        Radiators.radiator1.Watter==data.radiator1.Watter;
        Radiators.radiator2.Temp=data.radiator2.Temp;
        Radiators.radiator2.Watter==data.radiator2.Watter;

        updateRadiator("radiator1");
        updateRadiator("radiator2");

        Shutters.Shutter1=data.Shutter1;
        Shutters.Shutter2=data.Shutter2;

        updateShutter("shutter1");
        updateShutter("shutter2");
        
    })
    .catch(error => {
        console.error('Erreur lors de la requête :', error);
    });

}

function updateLamp(lightId) {
    const lampElement = document.getElementById(lightId);
    if (Lights[lightId]) {
        lampElement.classList.add('on');
    } else {
        lampElement.classList.remove('on');
    }
}


function updateHouse(){
    document.getElementById('HouseTempExte').innerHTML=House.tempExte;
    document.getElementById('HouseTempInte').innerHTML=House.tempInte;
}

function updateRadiator(radiatorId){
    console.log("update radiator")
    document.getElementById(radiatorId+'TempDisplay').innerHTML=Radiators[radiatorId].Temp
    document.getElementById(radiatorId+'WatterDisplay').innerHTML=Radiators[radiatorId].Watter;

        const RadiatorElement = document.getElementById(radiatorId);
        if (Radiators[radiatorId].Temp === 0) {
            RadiatorElement.classList.remove('on1');
            RadiatorElement.classList.remove('on2');
            RadiatorElement.classList.remove('on3');
            RadiatorElement.classList.add('off');
        } 
        if (Radiators[radiatorId].Temp >=10 && Radiators[radiatorId].Temp <18 ){
            RadiatorElement.classList.remove('off');
            RadiatorElement.classList.remove('on2');
            RadiatorElement.classList.remove('on3')
            RadiatorElement.classList.add('on1');
        }
        if (Radiators[radiatorId].Temp >=18 && Radiators[radiatorId].Temp <23 ){
            RadiatorElement.classList.remove('off');
            RadiatorElement.classList.remove('on1');
            RadiatorElement.classList.remove('on3')
            RadiatorElement.classList.add('on2');
            
        }
        if (Radiators[radiatorId].Temp >=23 ){
            RadiatorElement.classList.remove('off');
            RadiatorElement.classList.remove('on1');
            RadiatorElement.classList.remove('on2')
            RadiatorElement.classList.add('on3');
        }
}



function updateShutter(){
    if (Shutters.Shutter1 === true){document.getElementById('shutter1' + 'Status').innerHTML='OPENED';}
        else {document.getElementById('shutter1' + 'Status').innerHTML='CLOSED';}

    if (Shutters.Shutter2=== true){document.getElementById('shutter2' + 'Status').innerHTML='OPENED';}
        else {document.getElementById('shutter2' + 'Status').innerHTML='CLOSED';}
}

var House ={
    tempInte: 0,
    tempExte:0
};

var Lights = {
    light1: false,
    light2: false,
    light3: false
  };

var Radiators = {
    radiator1 : {
        Temp : 0,
        Watter : 0
    },
    radiator2 : {
        Temp : 0,
        Watter : 0
    }
}

var Shutters = {
    Shutter1 : false,
    Shutter2 : false
}

var _Radiator1Temp=0;
var _Radiator1Watter=0;
var _Radiator2Temp=0;
var _Radiator2Watter=0;

var _Shutter1Status=false;
var _Shutter2Status=false; 
  
document.getElementById('light1').addEventListener('click', function() {
toggleLight('light1');
});
  
document.getElementById('light2').addEventListener('click', function() {
toggleLight('light2');
});
  
document.getElementById('light3').addEventListener('click', function() {
toggleLight('light3');
});

