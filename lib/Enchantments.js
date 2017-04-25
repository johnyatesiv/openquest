'use strict';

class Enchantment {
    constructor() {

    }
}

/** Buff Enchantments **/

class Buff extends Enchantment {
    constructor() {
        super();
    }

    effect(Item) {

    }
}

class MinorChannelFire extends Buff {
    constructor() {
        super();
        this.name = "of minor Flame";
    }

    effect(Weapon) {
        Weapon.Fire += 10;
    }
}

class MajorChannelFire extends Buff {
    constructor() {
        super();
        this.name = "of major Flame";
    }

    effect(Weapon) {
        Weapon.Fire += 50;
    }
}

module.exports.Random = function() {
    return new Enchantment();
};