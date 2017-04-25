/** Deps **/
var EventEmitter = require("events");
var Emitter = new EventEmitter();
var Accessibles = require("./Accessibles.js");
var Character = require("./Character.js");
var Classes = require("./Classes.js");
var Species = require("./Species.js");

/** Globals **/
var serverCharacters = {};

/** Util Functions **/

var characterFunction = function(cId, functionName) {
    return "Character["+cId+"]."+functionName;
};

/** Gameplay Events **/

/** Character Management **/

Emitter.on("Character.Join", function() {

});

Emitter.on("Character.Leave", function(cId) {
    Emitter.emit(characterFunction(cId, "save"));
});

Emitter.on("Character.Movement", function(update) {
    characterFunction(update.cId, "updateLocation");
    Emitter.emit(characterFunction(update.cId, "updateLocation"), update.coords);
});

module.exports = Emitter;