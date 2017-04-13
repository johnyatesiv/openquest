var Character = require("../../lib/Character.js");
var Classes = require("../../lib/Classes.js");
var Mechanics = require("../../lib/Mechanics.js");
var Races = require("../../lib/Races.js");
var Monsters = require("../../lib/Monsters.js");

var Walky = new Character("Walky McWalkyface", "M", new Races.Human(), new Classes.Bard());

for(var i = 0; i<10; i++) {
    Walky.updateLocation(Walky.location.lat+1, Walky.location.lon+1);
    for(var d in Walky.environment) {
        if(Walky.environment[d].attackable) {
            Walky.attack(Walky.environment[d]);
        } else if(Walky.environment[d].gettable) {
            Walky.pickUp(Walky.environment[d]);
        } else if(Walky.environment[d].accessible) {
            Walky.access(Walky.environment[d]);
        }
    }
}