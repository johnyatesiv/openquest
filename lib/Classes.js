'use strict';
var Items = require("./Items.js");

class Class {
    constructor() {
        this.statMods = {};
    }
}

/** Warrior Classes **/
class Warrior extends Class {
    constructor() {
        super(); this.name = this.constructor;
        
        this.statMods = {
            str: 3,
            dex: 0,
            con: 3,
            int: -3,
            mag: -3,
            spr: 0,
            lck: 0
        };

        this.statBonus = {
            str: 2,
            dex: 1,
            con: 2,
            int: 1,
            mag: 1,
            spr: 1,
            lck: 0
        };
    }
};

class Knight extends Warrior {
    constructor() {
        super(); this.name = this.constructor;
        
        this.statMods.con += 1;
        this.statMods.int -= 1;

        this.statBonus.con += 1;
    }
};

class MartialArtist extends Warrior {
    constructor() {
        super(); this.name = this.constructor;
        
        this.name = this.constructor;
        this.statMods.dex += 1;
        this.statMods.con -= 1;

        this.statBonus.dex += 1;


    }
};

/** Ranger Classes **/
class Ranger extends Class {
    constructor() {
        super(); this.name = this.constructor;
        this.statMods = {
            str: 0,
            dex: 3,
            con: 3,
            int: 0,
            mag: -3,
            spr: -3,
            lck: 0
        };

        this.statBonus = {
            str: 1,
            dex: 2,
            con: 1,
            int: 1,
            mag: 1,
            spr: 1,
            lck: 0
        };
    }
};

class Tracker extends Ranger {
    constructor() {
        super(); this.name = this.constructor;
        this.statMods.lck += 1;
        this.statMods.str -= 1;

        this.statBonus.con += 1;
    }
};

class Marksman extends Ranger {
    constructor() {
        super(); this.name = this.constructor;
        this.statMods.dex += 1;
        this.statMods.str -= 1;

        this.statBonus.dex += 1;
    }
};

/** Wizard Classes **/
class Wizard extends Class {
    constructor() {
        super(); this.name = this.constructor;
        this.statMods = {
            str: -3,
            dex: 0,
            con: -3,
            int: 0,
            mag: 3,
            spr: 3,
            lck: 0
        };

        this.statBonus = {
            str: 1,
            dex: 1,
            con: 1,
            int: 1,
            mag: 2,
            spr: 2,
            lck: 0
        };
    }
};

class Spellcaster extends Wizard {
    constructor() {
        super(); this.name = this.constructor;
        this.statMods.mag += 1;
        this.statMods.con -= 1;

        this.statBonus.mag += 1;
    }
};

class Enchanter extends Wizard {
    constructor() {
        super(); this.name = this.constructor;
        this.statMods.spr += 1;
        this.statMods.dex -= 1;

        this.statBonus.spr += 1;
    }
};

/** Rogue Classes **/
class Rogue extends Class {
    constructor() {
        super(); this.name = this.constructor;
        this.statMods = {
            str: 0,
            dex: 3,
            con: 0,
            int: 3,
            mag: -3,
            spr: -3,
            lck: 1
        };

        this.statBonus = {
            str: 1,
            dex: 2,
            con: 1,
            int: 2,
            mag: 1,
            spr: 1,
            lck: 0
        };
    }
};

class Thief extends Rogue {
    constructor() {
        super(); this.name = this.constructor;
        this.statMods.dex += 1;
        this.statMods.str -= 1;

        this.statBonus.dex += 1;
    }
};

class Bandit extends Rogue {
    constructor() {
        super(); this.name = this.constructor;
        this.statMods.str += 1;
        this.statMods.dex -= 1;

        this.statBonus.str += 1;
    }
};

/** Alchemist Classes **/
class Alchemist extends Class {
    constructor() {
        super(); this.name = this.constructor;
        this.statMods =  {
            str: -3,
            dex: 0,
            con: -3,
            int: 3,
            mag: 3,
            spr: 0,
            lck: 1
        };

        this.statBonus = {
            str: 1,
            dex: 1,
            con: 1,
            int: 2,
            mag: 2,
            spr: 2,
            lck: 0
        };
    }
};

class Medic extends Alchemist {
    constructor() {
        super(); this.name = this.constructor;
        this.statMods.con += 1;
        this.statMods.str -= 1;

        this.statBonus.con += 1;
    }
};

class Poisoner extends Alchemist {
    constructor() {
        super(); this.name = this.constructor;
        this.statMods.int += 1;
        this.statMods.con -= 1;

        this.statBonus.int += 1;
    }
};

/** Bard Classes **/
class Bard extends Class {
    constructor() {
        super(); this.name = this.constructor;
        this.statMods = {
            str: -3,
            dex: 3,
            con: -3,
            int: 3,
            mag: 0,
            spr: 0,
            lck: 1
        };

        this.statBonus = {
            str: 1,
            dex: 1,
            con: 1,
            int: 1,
            mag: 1,
            spr: 1,
            lck: 0
        };
    }
}

class Musician extends Bard {
    constructor() {
        super(); this.name = this.constructor;
        this.statMods.dex += 1;
        this.statBonus.dex += 1;
    }
};

class Poet extends Bard {
    constructor() {
        super(); this.name = this.constructor;
        this.statMods.int += 1;
        this.statBonus.int += 1;
    }
};

module.exports.Warrior = Warrior;
module.exports.Knight = Knight;
module.exports.MartialArtist = MartialArtist;
module.exports.Ranger = Ranger;
module.exports.Tracker = Tracker;
module.exports.Marksman = Marksman;
module.exports.Wizard = Wizard;
module.exports.Spellcaster = Spellcaster;
module.exports.Enchanter = Enchanter;
module.exports.Rogue = Rogue;
module.exports.Thief = Thief;
module.exports.Bandit = Bandit;
module.exports.Alchemist = Alchemist;
module.exports.Medic = Medic;
module.exports.Poisoner = Poisoner;
module.exports.Bard = Bard;
module.exports.Musician = Musician;
module.exports.Poet = Poet;