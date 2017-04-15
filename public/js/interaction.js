var currentCoords = {lat: null, lon: null};
var localEnvironment = {};
var focused;

var attackBtn = "#attack";
var interactBtn = "#interact";
var pickUpBtn = "#pickUp";

$(document).ready(function() {
    $(".envPanel").on("click", function(e) {
        focus(localEnvironment[$(this).attr("id").replace("dir_", "")]);
    });

    $(interactBtn).on("click", function(e) {
        writeToConsole(focused.message);
    });

    $(attackBtn).on("click", function(e) {
        attack(focused);
    });

    $(pickUpBtn).on("click", function(e) {
        console.log("Picking up Item.");
        pickUp(focused);
    });
});

function focus(target) {
    console.log("Focusing on "+target)
    focused = target;
    $(attackBtn).attr("disabled", true);
    $(interactBtn).attr("disabled", true);
    $(pickUpBtn).attr("disabled", true);

    if(target.canAttack) {
        $(attackBtn).attr("disabled", false)
    } else if(target.canInteract) {
        $(interactBtn).attr("disabled", false)
    } else if(target.canPickUp) {
        $(pickUpBtn).attr("disabled", false)
    }
}

function attack(target) {
    writeToConsole("Launching an attack at "+target.name+"!");
};

function pickUp(target) {
    Character.inventory.push(target);
}

function equip(target, slot) {
    Character.inventory.push(Character.equipped[slot]);
    Character.equipped[slot] = target;
}