'use strict';
/** core **/
var db = require("./DB.js");
var Q = require("q");

/** Game **/
var Enchantments = require("./Enchantments.js");

class Item {
    constructor(data) {
        this._id = null;
        this.name = "Unknown";
        this.thumb = "/thumb/unknown.png";
        this.canPickUp = true;
        this.canEquip = null;
        this.requirements = {};
        this.attack = null;
        this.magicAttack = null;
        this.defense = null;
        this.magicDefense = null;

        /** Enchant Calculations **/
        this.enchanted = null;
        this.enchantRate = null;

        /** Potion Properties **/
        this.onUse = null;

        for(var d in data) {
            this[d] = data;
        }

        if(Math.floor(Math.abs(Math.random()*100)) < this.enchantRate) {
            this.enchanted = true;
            this.enchant(new Enchantments.Random(level));
        }
    }

    get coreData() {
       return {
            name: this.name,
            thumb: this.thumb,
            canPickUp: this.canPickUp,
            canEquip: this.canEquip,
            requirements: this.requirements,
            attack: this.attack,
            magicAttack: this.magicAttack,
            defense: this.defense,
            magicDefense: this.magicDefense,
            enchanted: this.enchanted,
            enchantRate: this.enchantRate,
            onUse: this.onUse
        }
    }

    message() {
        return "It appears to be a "+this.name+".";
    }

    enchant(Enchantment) {
        this.name = this.name + " of " + Enchantment.name;
        for(var e in Enchantment.effects) {
            this[e] = Enchantment.effects[e];
        }
    }

    effect(Character) {
        if(this.onUse) {
            for(var e in this.onUse) {
                Character[e] += this.onUse[e];
            }
        } else {
            return null;
        }
    }
}

module.exports.Item = Item;

/** Util Functions **/

module.exports.Random = function(level) {
    var deferred = Q.defer();

    db.items.aggregate([{$sample: {size: 1}}], function(err, docs) {
        deferred.resolve(new Item(docs[0]));
    });

    return deferred.promise;
};

module.exports.findNear = function(coords) {
    var deferred = Q.defer();

    console.log(coords);
    db.bosses.find({location: {$near: [coords.lng, coords.lat], $minDistance: 1, $maxDistance: 40}}, function(err, docs) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(docs[0]);
        }
    });

    return deferred.promise;
};