'use strict';

var db = require("./DB.js");

class Spell {
    constructor(data) {
        this.name = null;
        this.target = null;
        this.source = null;
        this.potency = null;
        this.manaCost = null;

        for(var d in data) {
            this[d] = data[d];
        }
    }

    effect(caster, target) {
        console.log(this.name +" deals "+caster[this.source]*this.potency+" damage");
        target[this.target](caster[this.source] * this.potency);
        caster.mana -= this.manaCost;
    }
}

module.exports.Spell = Spell;