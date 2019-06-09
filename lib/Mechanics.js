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
    /** Attack * RN > Defense * RN2 --> Damage **/
    var atkRoll = Math.abs(Math.random())+.2;
    var defRoll = Math.abs(Math.random())+.2;

    var attack = Math.round(Attacker.physicalDamage*atkRoll + Attacker.Luck/100);
    var defense = Math.round(Defender.physicalResist*defRoll + Defender.Luck/100);

    console.log("atkRoll: "+atkRoll);
    console.log("defRoll: "+defRoll);

    if(!Attacker.stunned) {
        /** Range Bonus **/
        if(Attacker.ranged) {
            attack += Math.round(attack*(Attacker.dexterity/100));
        }

        if((attack > defense) || Defender.stunned) {
            console.log(Attacker.name+" attack: "+attack+" vs "+Defender.name+" defense: "+defense);
            Defender.takeDamage(Math.round((attack - defense)/2));
        } else {
            //console.log(Defender.name+" resists the attack!");
        }
    } else {
        Attacker.stunned = false;
    }
};

/** Spell Effect weighted by Mag and elemental Affinity **/

module.exports.magicCast = function(Player, spellSlot) {
    if(Player.spells[spellSlot].type == "attack") {
        if(Player.Target.canAttack) {
            Player.spells[spellSlot].effect(Player, Player.Target);
            Player.emit("Player.Spell.Finished", "You cast "+Player.spells[spellSlot].name+".");
            Player.emit("Target.Updated.Health", Player.Target.Health);
        } else {
            Player.emit("Player.Spell.Finished", Player.spells[spellSlot].name+" had no effect.");
        }
    } else {
        Player.spells[spellSlot].effect(Player, Player);
        Player.emit("Player.Spell.Finished", "You cast "+Player.spells[spellSlot].name+".");
        Player.refresh();
    }
};

module.exports.magicAttack = function(Spell, Attacker, Defender) {
    Attacker.spells[Spell].effect(Attacker, Defender);
};

/** Dex + Int avg vs. Dex + Int avg **/
module.exports.skillAttack = function(Player) {
    Player.emit(Player.name+" attempts to outmaneuver "+Player.Target.name+"!");
    var roll = Math.abs((Math.random() * 10));
    console.log(Player.skillChance+" vs "+Player.Target.skillChance+ " + "+roll);
    if(Player.skillChance > Player.skillChance + roll) {
        Player.emit("Player.Environment.Interacted", Player.Target.name+" is stunned!");
        Player.Target.isStunned = true;
    } else {
        Player.emit("Player.Environment.Interacted", Player.Target.name+" resists the manuever and counterattacks!");
        module.exports.physicalAttack(Player.Target, Player);
        Player.emit("Player.Updated.Health", Player.Health);
        Player.emit("Target.Updated.Health", Player.Target.Health);
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
module.exports.mentalAttack = function(Player) {
    console.log(Player.name+" attempts to outwit "+Player.Target.name+"!");
    var roll = (Math.random() * 10);
    if(Player.mentalChance > Player.Target.mentalChance + roll) {
        Player.emit("Player.Environment.Interacted", Player.Target.name+" is stunned!");
        Player.Target.isStunned = true;
    } else {
        Player.emit("Player.Environment.Interacted", Player.Target.name+" resists the trick and counterattacks!");
        module.exports.physicalAttack(Player.Target, Player);
        Player.emit("Player.Updated.Health", Player.Health);
        Player.emit("Target.Updated.Health", Player.Target.Health);
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
        Player.Experience = Player.Target.experience;
        Player.emit("Target.Defeated", Player.Target);
        Player.emit("Player.Updated.Experience", Player.experience);

        if(Player.Target.Item) {
            Player.addToInventory(Player.Target.Item)
        }

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

    if(Math.abs(Math.floor(Math.random()*100)) < 90) {
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