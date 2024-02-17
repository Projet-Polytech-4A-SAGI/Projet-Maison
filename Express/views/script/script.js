function toggleLight(lightId) {
    var statusElement = document.getElementById(lightId + 'Status');
    var currentStatus = statusElement.innerText;

    if (currentStatus === 'OFF') {
        statusElement.innerText = 'ON';
        const api_url = "http://localhost:3000/"+lightId+"/on";
        fetch(api_url);
    } else {
        statusElement.innerText = 'OFF';
        const api_url = "http://localhost:3000/"+lightId+"/off";
        fetch(api_url);
    }
}

function setTemperature(radiatorId) {
    var tempElement = document.getElementById(radiatorId + 'Temp');
    var tempDisplayElement = document.getElementById(radiatorId + 'TempDisplay');
    var temperature = tempElement.value;
    tempDisplayElement.innerText = temperature;
    const api_url = "http://localhost:3000/"+radiatorId+"?temp="+temperature
    fetch(api_url)
}

function toggleShutter(shutterId,action){


    var statusElement =document.getElementById(shutterId + 'Status');
    var currentStatus = statusElement.innerText;

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
        document.getElementById('radiator1'+'TempDisplay').innerHTML=data.Radiator1.Temp;
        document.getElementById('radiator1'+'WatterDisplay').innerHTML=data.Radiator1.Watter;

        document.getElementById('radiator2'+'TempDisplay').innerHTML=data.Radiator2.Temp;
        document.getElementById('radiator2'+'WatterDisplay').innerHTML=data.Radiator2.Watter;

        if (data.Shutter1 === true){document.getElementById('shutter1' + 'Status').innerHTML='OPENED';}
        else {document.getElementById('shutter1' + 'Status').innerHTML='CLOSED';}
        

        if (data.Shutter2=== true){document.getElementById('shutter2' + 'Status').innerHTML='OPENED';}
        else {document.getElementById('shutter2' + 'Status').innerHTML='CLOSED';}
        
    })
    .catch(error => {
        console.error('Erreur lors de la requête :', error);
    });

}