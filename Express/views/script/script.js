function toggleLight(lightId) {
    var statusElement = document.getElementById(lightId + 'Status');
    var currentStatus = statusElement.innerText;

    if (currentStatus === 'Off') {
        statusElement.innerText = 'On';
        const api_url = "http://localhost:3000/"+lightId+"/on"
        fetch(api_url)
    } else {
        statusElement.innerText = 'Off';
        const api_url = "http://localhost:3000/"+lightId+"/off"
        fetch(api_url)
    }
}

function setTemperature(heaterId) {
    var tempElement = document.getElementById(heaterId + 'Temp');
    var tempDisplayElement = document.getElementById(heaterId + 'TempDisplay');
    var temperature = tempElement.value;
    tempDisplayElement.innerText = temperature;
    const api_url = "http://localhost:3000/"+heaterId+"?temp="+temperature
    fetch(api_url)
}

function loadstates(){

    const api_url = "http://localhost:3000/update"
    fetch(api_url)
}