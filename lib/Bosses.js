'use strict';

/** Core **/
var db = require("./DB.js");
var Q = require("q");
/** Game **/
var Character = require("./Character.js");

class Boss extends Character {
    constructor(data) {
        super();

        for(var d in data) {
            this[d] = data[d];
        }
    }
}

module.exports.Random = function() {
    db.bosses.aggregate([{$sample: {size: 1}}], function(err, docs) {
        console.log(docs[0]);
    });
};

module.exports.findNear = function(coords) {
    var deferred = Q.defer();

    db.bosses.find({location: {$near: [coords.lng, coords.lat], $minDistance: 1, $maxDistance: 40}}, function(err, docs) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(docs[0]);
        }
    });

    return deferred.promise;
};