'use strict';

class Monster {
    constructor() {
        /** Combat Mechanical **/
        this.attackable = true;
        this.health = 20;
        this.physicalDamage = 2;
        this.physicalResist = 2;
        this.skillChance = 2;
        this.mentalChance = 2;
        this.isKnockedOut = false;

        /** Other Mechanical **/
        this.expValue = 1;
    }

    damage(quantity) {
        console.log(this.constructor.name+" takes "+quantity+" damage!");
        if(!this.isKnockedOut) {
            if(this.health - quantity <= 0) {
                delete this;
            } else {
                this.health -= quantity;
            }
        }
    }
}

class Warg extends Monster {
    constructor() {
        super();
        this.health = 30;
        this.physicalDamage = 4;
        this.expValue = 10;
    }
}

module.exports.Warg = Warg;
module.exports.Random = function() {
    return new Warg();
};