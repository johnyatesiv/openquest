'use strict';
/** Core **/

module.exports = class Species {
    constructor(data) {
        this.Strength = 0;
        this.Dexterity = 0;
        this.Constitution = 0;
        this.Intelligence = 0;
        this.Magic = 0;
        this.Spirit = 0;
        this.Luck = 0;

        this.Fire = 0;
        this.Ice = 0;
        this.Thunder = 0;
        this.Earth = 0;
        this.Water = 0;
        this.Wood = 0;
        this.Metal = 0;
        this.Ether = 0;
        this.Toxin = 0;
        this.Holy = 0;

        this.Spells = {};

        for(var d in data) {
            this[d] = data[d];
        }
    }
};