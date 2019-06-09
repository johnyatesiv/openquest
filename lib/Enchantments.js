'use strict';
/** core **/
var db = require("./DB.js");
var Q = require("q");


class Enchantment {
    constructor() {
        this.name = null;
        this.effects = null;
    }

    effect(Item) {
        Item.name = Item.name + this.name;

        for(var e in this.effects) {
            Item[e] += this.effects[e];
        }
    }
}

/** Buff Enchantments **/

class MinorChannelFire extends Enchantment {
    constructor() {
        super();
        this.name = "of minor Flame";
    }

    effect(Weapon) {
        Weapon.Fire += 10;
    }
}

class MajorChannelFire extends Enchantment {
    constructor() {
        super();
        this.name = "of major Flame";
    }

    effect(Weapon) {
        Weapon.Fire += 50;
    }
}

module.exports.Random = function() {
    var deferred = Q.defer();

    db.enchantments.aggregate([{$sample: {size: 1}}], function(err, docs) {
        deferred.resolve(new Enchantment(docs[0]));
    });

    return deferred.promise;
};