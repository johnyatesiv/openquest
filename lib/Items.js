'use strict';
var Enchantments = require("./Enchantments.js");

class Item {
    constructor() {
        this.useRequirements = null;
        this.gettable = true;
    }

    canUse(Character) {
        for(var req in this.requirements) {
            if(Character.stats[req] < this.requirements[req]) {
                return false;
            }
        }

        return true;
    }

    destroy() {
        delete this;
    }
}

/** Item Categories **/

class Equippable extends Item {
    constructor() {
        super();
        this.equipOn = null;
    }

    canEquip(Slot) {
        return this.equippable.indexOf(Slot) > -1;
    }
}

class Consumable extends Item {
    constructor() {
        super();
        this.effects = {};
    }
}

class Usable extends Item {
    constructor() {
        super();
        this.effects = {};
    }
}

/** Weapons **/

class Weapon extends Equippable {
    constructor() {
        super();
        this.ranged = false;
        this.dropRate = 0;
        this.enchantRate = 0;

        if(Math.floor(Math.random()*100) < this.enchantRate) {
            this.enchanted = true;
            this.Enchantment = Enchantments.Random();
        }
    }
}

/** Swords **/
class Dagger extends Weapon {
    constructor() {
        super();
        this.enchantRate = 5;
    }
}

class ShortSword extends Weapon {
    constructor() {
        super();
        this.enchantRate = 5;
    }
}

class LongSword extends Weapon {
    constructor() {
        super();
        this.enchantRate = 5;
    }
}

class BastardSword extends Weapon {
    constructor() {
        super();
        this.enchantRate = 5;
    }
}

class Claymore extends Weapon {
    constructor() {
        super();
        this.enchantRate = 5;
    }
}

class Katana extends Weapon {
    constructor() {
        super();
        this.enchantRate = 5;
    }
}

/** Bows **/

class ShortBow extends Weapon {
    constructor() {
        super();
        this.ranged = true;
    }
}

class LongBow extends Weapon {
    constructor() {
        super();
        this.ranged = true;
    }
}

class CompoundBow extends Weapon {
    constructor() {
        super();
        this.ranged = true;
    }
}

/** Axes **/
class BattleAxe extends Weapon {
    constructor() {
        super();
    }
}

class GreatAxe extends Weapon {
    constructor() {
        super();
    }
}

/** Hammers **/
class WarHammer extends Weapon {
    constructor() {
        super();
    }
}

/** Wands **/
class Wand extends Weapon {
    constructor() {
        super();
    }
}

/** Staffs **/
class Staff extends Weapon {
    constructor() {
        super();
    }
}

class GrandStaff extends Weapon {
    constructor() {
        super();
    }
}

/** Armor **/

class Armor extends Equippable {
    constructor() {
        super();
        this.AR = 0;
    }
}

class Tunic extends Armor {
    constructor() {
        super();
        this.AR = 1;
        this.MAR = 3;
    }
}

class Robe extends Armor {
    constructor() {
        super();
        this.MAR = 5;
    }
}

class LeatherArmor extends Armor {
    constructor() {
        super();
        this.AR = 5;
        this.MAR = -5;
    }
}

class ChainMail extends Armor {
    constructor() {
        super();
        this.AR = 15;
        this.MAR = -5;
    }
}

class FullMail extends Armor {
    constructor() {
        super();
        this.AR = 20;
        this.MAR = -5;
    }
}

/** Jewelry **/
class Jewelry extends Equippable {
    constructor() {
        super();
    }
}

class Ring extends Jewelry {
    constructor() {
        super();
    }
}

class Pendant extends Jewelry {
    constructor() {
        super();
    }
}

/** Consumables **/

class Potion extends Consumable {
    constructor() {
        super();
    }
}

class HealthPotion extends Potion {
    constructor() {
        super();
    }
}

/** Poisons **/

class Poison extends Usable {
    constructor() {
        super();
    }
}

/** Gadgets **/

class Trap extends Usable {
    constructor() {
        super();
    }
}

/** Weapon Exports **/
module.exports.Weapon = {
    Swords: {
        ShortSword: ShortSword,
        LongSword: LongSword,
        BastardSword: BastardSword,
        Claymore: Claymore,
        Katana: Katana
    },
    Bows: {
        ShortBow: ShortBow,
        LongBow: LongBow
    },
    Axes: {
        BattleAxe: BattleAxe,
        GreatAxe: GreatAxe
    },
    Hammers: {
        WarHammer: WarHammer
    },
    Wands: {
        Wand: Wand
    },
    Staffs: {
        Staff: Staff,
        GrandStaff: GrandStaff
    }
};

/** Armor Exports **/
module.exports.Armor = {
    Light: {
        Tunic: Tunic,
        Robe: Robe
    },
    Heavy: {
        LeatherArmor: LeatherArmor
    },
    Full: {
        ChainMail: ChainMail,
        FullMail: FullMail
    }
};


/** Jewelry Exports **/
module.exports.Jewelry = {
    Ring: Ring,
    Pendant: Pendant
};

/** Consumable Exports **/
module.exports.Consumable = {
    Potion: Potion,
    HealthPotion: HealthPotion
};

/** Usable Exports **/
module.exports.Usables = {
    Poison: Poison
};

/** Util Functions **/

module.exports.Random = function() {
    return new Dagger();
};