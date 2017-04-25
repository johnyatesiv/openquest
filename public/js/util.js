var activeAudio;

var consoleEl = "#console";
var inventoryEl = "#playerInventory";

$(document).ready(function() {
    //setInterval(function() {
    //    updateLocation();
    //}, 10000);
});

/** Actual Util Functions **/

function playAudio(songName) {
    //window.AudioContext = window.AudioContext||window.webkitAudioContext;
    //context = new AudioContext();
    if(Player && !Player.audioMuted && false) {
        if(activeAudio) {
            if(activeAudio.src.indexOf(songName) < 0) {
                activeAudio.pause();
                activeAudio = new Audio('/audio/'+songName+'.ogg');
                activeAudio.loop = true;
                activeAudio.play();
            }
        } else {
            activeAudio = new Audio('/audio/'+songName+'.ogg');
            activeAudio.loop = true;
            activeAudio.play();
        }
    }
}

function mute() {
    $("#unMuteBtn").removeClass("hide");
    $("#muteBtn").addClass("hide");
    activeAudio.pause();
    Player.audioMuted = true;
}

function unmute() {
    $("#muteBtn").removeClass("hide");
    $("#unMuteBtn").addClass("hide");
    activeAudio.play();
    Player.audioMuted = false;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/** Game Specific Util Functions **/

function arrayToSelect(selectId, options) {
    for(var i in options) {
        $(selectId).append("<option value='"+options[i]+"'>"+options[i]+"</option>");
    }
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}