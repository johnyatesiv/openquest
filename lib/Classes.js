'use strict';
var Items = require("./Items.js");
var Spells = require("./Spells.js");

module.exports = class Class {
    constructor(data) {
        this.Health = 0;
        this.Mana = 0;

        this.Strength = 0;
        this.Dexterity = 0;
        this.Constitution = 0;
        this.Intelligence = 0;
        this.Magic = 0;
        this.Spirit = 0;
        this.Luck = 0;

        this.Spells = {};

        this.Bonus = {
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