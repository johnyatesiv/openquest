var mocha = require("mocha");
var assert = require("assert");

var Player = require("../../../lib/Player.js");
var Mechanics = require("../../../lib/Mechanics.js");
var Monster = require("../../lib/Monsters.js");

describe("Physical combat", function() {
    it("should result in a character losing HP when attacked", function(done) {
        var Attacker = new Player("Mr. Attacker", "M", "Human", "Warrior");
        var Defender = new Player("Ms. Defender", "F", "Orc", "Bard");
        var startHealth = Defender.Health;
        Mechanics.physicalAttack(Attacker, Defender);
        assert(Defender.Health <= startHealth);
        done();
    });

    it("should conclude when one character's HP reaches 0", function(done) {
        var Attacker = new Player("Mr. Attacker", "M", "Human", "Warrior");
        var Defender = new Player("Ms. Defender", "F", "Orc", "Bard");
        battle(Attacker, Defender, 0, function(Loser) {
            assert(Loser.Health == 0);
            assert(Loser.isDead);
            done();
        });
    });
});

describe("Magic combat", function() {
    it("should result in a character losing HP when targeted by a spell", function(done) {
        var MrWizard = new Player("Mr.Wizard", "M", "Human", "Wizard");
        var Enemy = new Monster.Warg(1);

        console.log(MrWizard.Mana);
        console.log(Enemy.Health);

        MrWizard.Spells.MagicPush.effect(MrWizard, Enemy);

        console.log(MrWizard.Mana);
        console.log(Enemy.Health);

        MrWizard.Spells.MagicPush.effect(MrWizard, Enemy);

        console.log(MrWizard.Mana);
        console.log(Enemy.Health);
        done();
    });
});


function battle(Player1, Player2, depth, cb) {
    while(!Player2.isDead && !Player1.isDead) {
        Mechanics.physicalAttack(Player1, Player2);
        Mechanics.physicalAttack(Player2, Player1);
        //console.log(Player2.name+" now has "+Player2.health+" health");
        //console.log(Player1.name+" now has "+Player1.health+" health");
    }

    if(Player1.isDead) {
        console.log(Player2.name+" level "+Player2.level+" "+Player2.Health+"/"+Player2.MaxHealth+" beat "+Player1.name+" level "+Player1.level+" "+Player1.health);
        Player1.levelUp();
    } else {
        console.log(Player1.name+" level "+Player1.level+" "+Player1.Health+"/"+Player1.MaxHealth+" beat "+Player2.name+" level "+Player2.level+" "+Player2.health);
        Player2.levelUp();
    }

    if(depth < 10) {
        Player1.revive();
        Player2.revive();
        depth = depth + 1;
        battle(Player1, Player2, depth, cb);
    } else {
        if(Player1.isDead) {
            cb(Player1);
        } else {
            cb(Player2);
        }
    }
}
