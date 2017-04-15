var consoleEl = "#console";

$(document).ready(function() {

});

function writeToConsole(message) {
    console.log("should write to console");
    var time = new Date().toTimeString();
    $(consoleEl).text($(consoleEl).text()+"\n > "+time+" "+message);
}

function populateClassesList() {
    $.ajax({
        url: "/classes"
    }).done(function(data) {
        if(data.ok) {
            arrayToSelect("#class", data.body);
        } else {
            alert("Error loading Class list.");
        }
    });
}

function populateRacesList() {
    $.ajax({
        url: "/races"
    }).done(function(data) {
        if(data.ok) {
            arrayToSelect("#race", data.body);
        } else {
            alert("Error loading Race list.");
        }
    });
}

function arrayToSelect(selectId, options) {
    for(var i in options) {
        $(selectId).append("<option value='"+options[i]+"'>"+options[i]+"</option>");
    }
}

function loadCharacter(Character) {
    for(var a in Character) {
        if(typeof Character[a] == "object") {
            $("#character"+a).text(Character[a].name);
        } else {
            $("#character"+a).text(Character[a]);
        }
    }

    if(Character.Location.lat) {
        $("#characterLat").text(Character.Location.lat);
    } else {
        $("#characterLat").text(0);
    }

    if(Character.Location.lon) {
        $("#characterLat").text(Character.Location.lon);
    } else {
        $("#characterLat").text(0);
    }
}

function updateLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            if(hasMoved(currentCoords, position.coords)) {
                $("#characterLat").empty().append(position.coords.latitude);
                $("#characterLon").empty().append(position.coords.longitude);
                currentCoords.lat = position.coords.latitude;
                currentCoords.lon = position.coords.longitude;
                socket.emit("Character.Location.Change", currentCoords);
            } else {
                console.log("Haven't moved, no update.");
            }
        });
    } else {
        alert("Geolocation not supported.");
    }
}

function hasMoved(current, newpos) {
    return (Math.abs(current.lat - newpos.latitude) > 0.5 || Math.abs(current.lon - newpos.longitude));
}

function loadEnvironment(environment) {
    for(var d in environment) {
        $("#dir_"+d).empty().html(environment[d].svg);
        localEnvironment[d] = environment[d];
    }

    console.log(localEnvironment);
}