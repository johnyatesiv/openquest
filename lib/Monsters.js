'use strict';

class Monster {
    constructor() {
        /** Combat Mechanical **/
        this.canAttack = true;
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
        this.name = "Warg";
        this.health = 30;
        this.physicalDamage = 4;
        this.expValue = 10;
        this.svg = "<rect x='0' y='0' fill='red' width='200' height='200'></rect>";
    }
}

class Zombie extends Monster {
    constructor() {
        super();

        this.name = "Zombie";
        this.health = 15;
        this.physicalDamage = 2;
        this.expValue = 2;
        this.svg = "<rect x='0' y='0' fill='blue' width='200' height='200'></rect>";
    }
}

module.exports.Warg = Warg;
module.exports.Random = function() {
    var keys = Object.keys(module.exports);
    keys.slice(keys.indexOf("Random"), 1);
    return new keys[Math.floor(Math.random() * keys.length)]();
};