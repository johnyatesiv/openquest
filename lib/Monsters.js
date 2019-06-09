'use strict';
/** Core **/
var Q = require("q");
var db = require("./DB.js");

/** Game **/
var Character = require("./Character.js");
var Mechanics = require("./Mechanics.js");
var Items = require("./Items.js");


/** global **/
var modBase = 100;


class Monster extends Character {
    constructor(data, level) {
        super();
        this.isSentient = false;
        this.Item = null;
        this.itemChance = null;
        this.level = level;

        for(var d in data) {
            this[d] = data[d];
        }

        this.experience = this.experience + 2*this.level;
        this.strength = this.strength + 2*this.level;
        this.constitution = this.constitution + 2*this.level;

        console.log("Strength: "+this.strength);

        this.seedItem();
    }

    get coreData() {
        return {
            name: this.name,
            thumb: this.thumb,
            health: this.health,
            maxHealth: this.maxHealth,
            mana: this.mana,
            maxMana : this.maxMana,
            experience: this.experience,
            strength: this.strength,
            dexterity: this.dexterity,
            constitution: this.constitution,
            intelligence: this.intelligence,
            magic: this.magic,
            spirit: this.spirit,
            luck: this.luck,
            fire: this.fire,
            ice: this.ice,
            thunder: this.thunder,
            earth: this.earth,
            water: this.water,
            wood: this.wood,
            toxin: this.toxin,
            metal: this.metal,
            holy: this.holy,
            effects: this.effects
        };
    }

    seedItem() {
        var roll = (Math.abs(Math.random()*100));
        if(roll < this.itemChance) {
            var self = this;
            Items.Random(this.level).then(function(item) {
                console.log(item);
                self.Item = item;
            }).catch(function(err) {
                console.log(err);
            });
        }
    }
};

module.exports.Monster = Monster;

module.exports.Random = function(level) {
    var deferred = Q.defer();

    db.monsters.aggregate([{$sample: {size: 1}}], function(err, docs) {
        deferred.resolve(new Monster(docs[0], level));
    });

    return deferred.promise;
};