var Character = require("../../lib/Character.js");
var Classes = require("../../lib/Classes.js");
var Mechanics = require("../../lib/Mechanics.js");
var Races = require("../../lib/Races.js");

var Character1 = new Character("Mr. Attacker", "M", new Races.Human(), new Classes.Warrior());
var Character2 = new Character("Ms. Defender", "F", new Races.Orc(), new Classes.Bard());

function battle(Character1, Character2, depth) {
    while(!Character2.isKnockedOut && !Character1.isKnockedOut) {
        Mechanics.physicalAttack(Character1, Character2);
        Mechanics.physicalAttack(Character2, Character1);
        //console.log(Character2.name+" now has "+Character2.health+" health");
        //console.log(Character1.name+" now has "+Character1.health+" health");
    }

    if(Character1.isKnockedOut) {
        console.log(Character2.name+" level "+Character2.level+" "+Character2.health+" beat "+Character1.name+" level "+Character1.level+" "+Character1.health);
        Character1.levelUp();
    } else {
        console.log(Character1.name+" level "+Character1.level+" "+Character1.health+" beat "+Character2.name+" level "+Character2.level+" "+Character2.health);
        Character2.levelUp();
    }

    if(depth < 10) {
        Character1.revive();
        Character2.revive();
        depth = depth + 1;
        battle(Character1, Character2, depth);
    }
}

battle(Character1, Character2, 0);

var Character3 = new Character("Lady Attackatron", "F", new Races.Elf(), new Classes.Ranger());
var Character4 = new Character("Sir Defendador", "M", new Races.Dwarf(), new Classes.Wizard());

battle(Character3, Character4, 0);
