'use strict';

class Race {
    constructor() {
        this.statMods = {
            str: 0,
            dex: 0,
            con: 0,
            int: 0,
            mag: 0,
            spr: 0,
            lck: 0
        };

        this.elemMods = {
            fire: 0,
            ice: 0,
            thunder: 0,
            earth: 0,
            water: 0,
            wood: 0,
            toxin: 0,
            holy: 0
        };
    }
}

class Human extends Race {
    constructor() {
        super();

        this.name = "Human";
        this.statMods.dex += 1;
        this.statMods.con += 1;
        this.statMods.spr -= 1;

        this.elemMods.water += 1;
        this.elemMods.thunder -= 1;
    }
}

class Elf extends Race {
    constructor() {
        super();

        this.name = "Elf";
        this.statMods.dex += 1;
        this.statMods.int += 1;
        this.statMods.con -= 1;

        this.elemMods.fire -= 1;
        this.elemMods.wood += 1;
    }
}

class Orc extends Race {
    constructor() {
        super();

        this.name = "Orc";
        this.statMods.str += 2;
        this.statMods.int -= 2;

        this.elemMods.fire += 1;
        this.elemMods.ice -= 1;
    }
}

class Dwarf extends Race {
    constructor() {
        super();

        this.name = "Dwarf";
        this.statMods.str += 1;
        this.statMods.con += 1;
        this.statMods.spr -= 1;

        this.elemMods.earth += 1;
        this.elemMods.water -= 1;
    }
}

module.exports.Human = Human;
module.exports.Elf = Elf;
module.exports.Orc = Orc;
module.exports.Dwarf = Dwarf;