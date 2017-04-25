var Player = require("../../lib/Player.js");
var Classes = require("../../lib/Classes.js");
var Mechanics = require("../../lib/Mechanics.js");
var Species = require("../../lib/Species.js");
var Monsters = require("../../lib/Monsters.js");

var Walky = new Player("Walky McWalkyface", "M", "Human", "Bard");

for(var i = 0; i<10; i++) {
    Walky.updateLocation(Walky.location.lat+1, Walky.location.lon+1);
    for(var d in Walky.environment) {
        if(Walky.environment[d].canAttack) {
            Walky.attack(Walky.environment[d]);
        } else if(Walky.environment[d].canPickUp) {
            Walky.pickUp(Walky.environment[d]);
        } else if(Walky.environment[d].canAccess) {
            Walky.access(Walky.environment[d]);
        }
    }
}