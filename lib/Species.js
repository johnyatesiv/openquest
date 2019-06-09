'use strict';
/** Core **/

module.exports = class Species {
    constructor(data) {
        this.strength = 0;
        this.dexterity = 0;
        this.constitution = 0;
        this.intelligence = 0;
        this.magic = 0;
        this.spirit = 0;
        this.luck = 0;

        this.fire = 0;
        this.ice = 0;
        this.thunder = 0;
        this.earth = 0;
        this.water = 0;
        this.wood = 0;
        this.metal = 0;
        this.ether = 0;
        this.toxin = 0;
        this.holy = 0;

        this.spells = {};

        for(var d in data) {
            this[d] = data[d];
        }
    }
};