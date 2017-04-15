/** Deps **/
var EventEmitter = require("events");
var Emitter = new EventEmitter();
var Accessibles = require("./Accessibles.js");
var Character = require("./Character.js");
var Classes = require("./Classes.js");
var Races = require("./Races.js");

/** Globals **/
var serverCharacters = {};

/** Util Functions **/

var characterFunction = function(cId, functionName) {
    return "Character["+cId+"]."+functionName;
};

/** Gameplay Events **/

/** Character Management **/
Emitter.on("Character.Create", function(spec) {
    console.log("Creating new Character...");
    serverCharacters[spec.socketId] = new Character(spec.name, spec.sex, new Races[spec.Race](), new Classes[spec.Class]());
    console.log(serverCharacters[spec.socketId]);
});

Emitter.on("Character.Join", function() {

});

Emitter.on("Character.Leave", function(cId) {
    Emitter.emit(characterFunction(cId, "save"));
});

Emitter.on("Character.Movement", function(update) {
    characterFunction(update.cId, "updateLocation");
    Emitter.emit(characterFunction(update.cId, "updateLocation"), update.coords);
});

/** Combat **/
Emitter.on("Combat.Start", function(characters) {

});

Emitter.on("Combat.End", function(characters) {

});

module.exports = Emitter;