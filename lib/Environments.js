'use strict';
/** Core **/
var db = require("./DB.js");
var Q = require("q");

/** Game **/
var Items = require("./Items.js");

class Environment {
    constructor(data) {
        this.message = null;
        this.thumb = null;
        this.hiddenItemChance = 0;
        this.hasEffect = false;
        this.effects = {};

        for(var d in data) {
            this[d] = data[d];
        }
    }

    get Item() {
        var roll = Math.floor(Math.random()*100);
        if((100 - this.hiddenItemChance) < roll) {
            return new Items.Random(this.level);
        }
    }

    hasEffects() {
        return Object.keys(this.effects).length;
    }

    effect(Player) {
        for(var e in this.effects) {
            console.log(Player);
            Player.Effects[e] += this.effects[e];
        }
    }
}

module.exports.Random = function() {
    var deferred = Q.defer();

    db.environments.aggregate([{$sample: {size: 1}}], function(err, docs) {
        deferred.resolve(new Environment(docs[0]));
    });

    return deferred.promise;
};

module.exports.findNear = function(coords) {
    var deferred = Q.defer();

    db.environments.find({location: {$near: [coords.lng, coords.lat], $minDistance: 1, $maxDistance: 40}}, function(err, docs) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(docs[0]);
        }
    });

    return deferred.promise;
};