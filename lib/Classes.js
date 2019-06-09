'use strict';
var Items = require("./Items.js");
var Spells = require("./Spells.js");

module.exports = class Class {
    constructor(data) {
        this.health = 0;
        this.mana = 0;

        this.strength = 0;
        this.dexterity = 0;
        this.constitution = 0;
        this.intelligence = 0;
        this.magic = 0;
        this.spirit = 0;
        this.luck = 0;

        this.spells = {};

        this.bonus = {
            Strength: 0,
            Dexterity: 0,
            Constitution: 0,
            Intelligence: 0,
            Magic: 0,
            Spirit: 0,
            Luck: 0
        };

        for(var d in data) {
            this[d] = data[d];
        }
    }
};