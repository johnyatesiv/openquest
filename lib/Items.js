'use strict';
/** core **/
var db = require("./DB.js");
var Q = require("q");

/** Game **/
var Enchantments = require("./Enchantments.js");

class Item {
    constructor(data) {
        this._id = null;
        this.name = null;
        this.thumb = null;
        this.canPickUp = true;
        this.canEquip = null;
        this.requirements = {};

        this.attack = 0;
        this.magicAttack = 0;
        this.defense = 0;
        this.magicDefense = 0;

        /** Magic Conditions **/
        this.fire = 0;
        this.ice = 0;
        this.thunder = 0;
        this.earth = 0;
        this.water = 0;
        this.wood = 0;
        this.metal = 0;
        this.ether = 0;
        this.toxin = 0;
        this.holy = 0;

        /** Enchant Calculations **/
        this.enchanted = false;
        this.enchantRate = null;

        /** Potion Properties **/
        this.onUse = null;

        /** Throw Properties **/
        this.onThrow = null;

        for(var d in data) {
            this[d] = data[d];
        }

        if(Math.abs(Math.random()*100) < this.enchantRate) {
            this.enchanted = true;
            //this.enchant(new Enchantments.Random());
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

            return true;

        } else {
            return null;
        }
    }

    throwAt(Character) {
        if(this.onThrow) {
            for(var e in this.onThrow) {
                Character[e] += this.onThrow;
            }
        } else {
            Character.Health = -(this.attack + this.defense);
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
    db.items.find({location: {$near: [coords.lng, coords.lat], $minDistance: 1, $maxDistance: 40}}, function(err, docs) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(docs[0]);
        }
    });

    return deferred.promise;
};