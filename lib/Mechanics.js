/** core **/
var Q = require("q");

/** Game **/
var Events = require("./Events.js");
var Items = require("./Items.js");
var Accessibles = require("./Accessibles.js");
var Monsters = require("./Monsters.js");
var Environments = require("./Environments.js");

/** Environment Mechanics **/

module.exports.seed = function(Class) {
    // good distribution function
};

/** Combat Mechanics **/

/** Attacks **/

/** Str (+weapon dmgModifier) vs Con (+armorRating) **/
module.exports.physicalAttack = function(Attacker, Defender) {
    //console.log(Attacker.name+" launches an attack at "+Defender.name+"!");
    /** Attack * RN > Defense * RN2 --> Damage = **/
    var attack = Math.abs(Math.round(Attacker.physicalDamage + Math.round(Math.random())));
    var defense = Math.abs(Math.round(Defender.physicalResist + Math.round(Math.random())));

    if(!Attacker.stunned) {
        /** Range Bonus **/
        if(Attacker.ranged) {
            attack += Math.round(attack*0.2);
        }

        if((attack > defense) || Defender.isStunned) {
            console.log(attack+" vs "+defense);
            Defender.takeDamage(Math.round(attack - defense));
        } else {
            //console.log(Defender.name+" resists the attack!");
        }
    } else {
        Attacker.stunned = false;
    }
};

/** Spell Effect weighted by Mag and elemental Affinity **/

module.exports.magicCast = function(Player, spellSlot) {
    if(Player.Spells[spellSlot].type == "attack") {
        if(Player.Target.canAttack) {
            Player.Spells[spellSlot].effect(Player, Player.Target);
            Player.emit("Player.Spell.Finished", "You cast "+Player.Spells[spellSlot].name+".");
            Player.emit("Target.Updated.Health", Player.Target.Health);
        } else {
            Player.emit("Player.Spell.Finished", Player.Spells[spellSlot].name+" had no effect.");
        }
    } else {
        Player.Spells[spellSlot].effect(Player, Player);
        Player.emit("Player.Spell.Finished", "You cast "+Player.Spells[spellSlot].name+".");
        Player.refresh();
    }
};

module.exports.magicAttack = function(Spell, Attacker, Defender) {
    Attacker.Spells[Spell].effect(Attacker, Defender);
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

/** NPC vs P **/
module.exports.NPCCombat = function(Player) {
    module.exports.physicalAttack(Player, Player.Target);
    module.exports.physicalAttack(Player.Target, Player);

    if(Player.Target.isDead) {
        Player.Experience += Player.Target.experience;
        Player.emit("Target.Defeated", Player.Target);
    } else {
        Player.emit("Player.Updated.Health", Player.Health);
        Player.emit("Target.Updated.Health", Player.Target.Health);
    }
};

/** PVP **/

module.exports.PlayerCombat = function(Attacker, Defender) {

};

/** Spawns **/

module.exports.itemSpawn = function(Player) {
    var deferred = Q.defer();

    if(Math.abs(Math.floor(Math.random()*100)) < 5) {
        Items.Random(Player.level).then(function(env) {
            deferred.resolve(env);
        }).catch(function(err) {
            deferred.reject(err);
        });
    } else {
        deferred.reject("No spawn.");
    }

    return deferred.promise;
};

module.exports.monsterSpawn = function(Player) {
    var deferred = Q.defer();

    if(Math.abs(Math.floor(Math.random()*100)) < 1) {
        Monsters.Random(Player.level).then(function(env) {
            deferred.resolve(env);
        }).catch(function(err) {
            deferred.reject(err);
        });
    } else {
        deferred.reject("No spawn.");
    }

    return deferred.promise;
};