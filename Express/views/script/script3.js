function toggleLight(lightId) {
    $.ajax({
        url: `http://localhost:3000/${lightId}/toggle`,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            Lights[lightId] = data.status;
            updateLamp(lightId);
        },
        error: function(xhr, status, error) {
            console.error('Erreur lors de la requête :', error);
        }
    });
}

function setTemperature(radiatorId) {
    var tempElement = $('#' + radiatorId + 'Temp');
    var tempDisplayElement = $('#' + radiatorId + 'TempDisplay');
    var temperature = tempElement.val();
    tempDisplayElement.text(temperature);
    $('#' + radiatorId).toggleClass('on');
    const api_url = "http://localhost:3000/" + radiatorId + "?temp=" + temperature;
    $.ajax({
        url: api_url,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            Radiators[radiatorId].Temp = data.Temp;
            Radiators[radiatorId].Watter = data.Watter.toFixed(2);
            updateRadiator(radiatorId);
        },
        error: function(xhr, status, error) {
            console.error('Erreur lors de la requête :', error);
        }
    });
}

function toggleShutter(shutterId, action) {
    const api_url = "http://localhost:3000/" + shutterId + "/" + action;
    $.ajax({
        url: api_url,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            Shutters[shutterId] = data.status;
            updateShutter(shutterId);
        },
        error: function(xhr, status, error) {
            console.error('Erreur lors de la requête :', error);
        }
    });
}

function loadstates() {
    const api_url = "http://localhost:3000/update";
    $.ajax({
        url: api_url,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            House.tempInte = data.House.Inte.toFixed(2);
            House.tempExte = data.House.Exte.toFixed(2);
            updateHouse();
            Lights.light1 = data.light1;
            Lights.light2 = data.light2;
            Lights.light3 = data.light3;
            updateLamp("light1");
            updateLamp("light2");
            updateLamp("light3");
            Radiators.radiator1.Temp = data.radiator1.Temp;
            Radiators.radiator1.Watter = data.radiator1.Watter.toFixed(2);
            Radiators.radiator2.Temp = data.radiator2.Temp;
            Radiators.radiator2.Watter = data.radiator2.Watter.toFixed(2);
            updateRadiator("radiator1");
            updateRadiator("radiator2");
            Shutters.shutter1 = data.Shutter1;
            Shutters.shutter2 = data.Shutter2;
            updateShutter("shutter1");
            updateShutter("shutter2");
        },
        error: function(xhr, status, error) {
            console.error('Erreur lors de la requête :', error);
        }
    });
}

function updateLamp(lightId) {
    const lampElement = $('#' + lightId);
    if (Lights[lightId]) {
        lampElement.prop('checked', true);
    } else {
        lampElement.prop('checked', false);
    }
}

function updateHouse() {
    $('#HouseTempExte').text(House.tempExte);
    $('#HouseTempInte').text(House.tempInte);
}

function updateRadiator(radiatorId) {
    $('#' + radiatorId + 'TempDisplay').text(Radiators[radiatorId].Temp);
    $('#' + radiatorId + 'WatterDisplay').text(Radiators[radiatorId].Watter);

    const RadiatorElement = $('#' + radiatorId +'img');
    if (Radiators[radiatorId].Temp === 0) {
        RadiatorElement.removeClass('temp1 temp2 temp3').addClass('tempoff');
    } else if (Radiators[radiatorId].Temp >= 10 && Radiators[radiatorId].Temp < 18) {
        RadiatorElement.removeClass('tempoff temp2 temp3').addClass('temp1');
    } else if (Radiators[radiatorId].Temp >= 18 && Radiators[radiatorId].Temp < 23) {
        RadiatorElement.removeClass('tempoff temp1 temp3').addClass('temp2');
    } else if (Radiators[radiatorId].Temp >= 23) {
        RadiatorElement.removeClass('tempoff temp1 temp2').addClass('temp3');
    }
}

function updateShutter(shutterId) {
    if (Shutters[shutterId]) {
        $('#' + shutterId + 'Status').text('OPENED');
    } else {
        $('#' + shutterId + 'Status').text('CLOSED');
    }
}

var House = {
    tempInte: 0,
    tempExte: 0
};

var Lights = {
    light1: false,
    light2: false,
    light3: false
};

var Radiators = {
    radiator1: {
        Temp: 0,
        Watter: 0
    },
    radiator2: {
        Temp: 0,
        Watter: 0
    }
};

var Shutters = {
    shutter1: false,
    shutter2: false
};

$('#light1').change(function() {
    toggleLight('light1');
});

$('#light2').change(function() {
    toggleLight('light2');
});

$('#light3').change(function() {
    toggleLight('light3');
});
