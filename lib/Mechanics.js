var Events = require("./Events.js");
var Items = require("./Items.js");
var Accessibles = require("./Accessibles.js");
var Monsters = require("./Monsters.js");
var Environments = require("./Environments.js");

/** Environment Mechanics **/

module.exports.spawnChance = function(Character) {
    /** 2% item chance, 5% monster chance, 1% accessible chance, 92% environment **/
    var rollOne = Math.floor(Math.random()*100);
    if(rollOne >= 0 && rollOne < 2) {
        return Items.Random();
    } else if(rollOne >= 2 && rollOne < 7) {
        return Monsters.Random();
    } else if(rollOne >= 7 && rollOne < 8) {
        return Accessibles.Random();
    } else {
        return Environments.Random();
    }
};


/** Combat Mechanics **/

module.exports.startCombat = function(Attacker, Defender) {
    Attacker.target = Defender;
    Defender.target = Attacker;
    Attacker.attack();
};

/** Attacks **/

/** Str (+weapon dmgModifier) vs Con (+armorRating) **/
module.exports.physicalAttack = function(Attacker, Defender) {
    //console.log(Attacker.name+" launches an attack at "+Defender.name+"!");
    /** Attack * RN > Defense * RN2 --> Damage = **/
    var attack = Attacker.physicalDamage * Math.abs(Math.random());
    var defense = Defender.physicalResist * Math.abs(Math.random());

    /** Range Bonus **/
    if(Attacker.ranged) {
        attack += Math.floor(Math.random()*5);
    }

    if((attack > defense) || Defender.isStunned) {
        Defender.damage(Math.round(attack - defense));
    } else {
        //console.log(Defender.name+" resists the attack!");
    }

    Attacker.wait = true;
    Defender.wait = false;

};

/** Dex + Int avg vs. Dex + Int avg **/
module.exports.skillAttack = function(Attacker, Defender) {
    console.log(Attacker.name+" attempts to outmaneuver "+Defender.name+"!");
    if(Attacker.skillChance > Defender.skillChance + (Math.random() * 100)) {
        console.log(Defender.name+" is stunned!");
        Defender.stunCounter += 2;
    } else {
        console.log(Defender.name+" resists the maneuver!");
    }
};

/** Mag vs. Spr **/
module.exports.magicAttack = function(Attacker, Defender) {
    console.log(Attacker.name+" casts a spell at "+Defender.name+"!");
    if(Attacker.magicDamage > Defender.magicResist) {
        Defender.health -= (Attacker.magicDamage - (Defender.magicResist*0.5));
        console.log(Math.abs((Attacker.magicDamage - (Defender.magicResist*0.5)))+" magic damage is dealt!");
    } else {
        console.log(Defender.name+" resists the spell!");
    }
};

/** Based on Int vs. Int **/
module.exports.mentalAttack = function(Attacker, Defender) {
    console.log(Attacker.name+" attempts to outwit "+Defender.name+"!");
    if(Attacker.mentalChance > Defender.mentalChance) {
        console.log(Defender.name+" is stunned!");
        Defender.stunCounter += 2;
    } else {
        console.log(Defender.name+" resists the trick!");
    }
};

/** Dex vs Dex **/
module.exports.stealAttack = function(Attacker, Defender) {
    if(Attacker.stealChance * (Math.random() * 10) > Defender.skillChance()) {
        Attacker.inventory.push(Defender.inventory[0]);
    } else {
        console.log(Defender.name+" avoids the theft!");
    }
};

module.exports.stealGoldAttack = function(Attacker, Defender) {
    if(Attacker.stealChance * (Math.random() * 10) > Defender.skillChance()) {
        var amount = Attacker.stealChance - Defender.skillChance();
        Attacker.gold += amount;
        Defender.gold -= amount;
    } else {
        console.log(Defender.name+" avoids the theft!");
    }
};