'use strict';
/** Core **/
var db = require("./DB.js");
var Q = require("q");

/** Game **/
var Items = require("./Items.js");

class Accessible {
    constructor(level) {
        this.name = null;
        this.canAccess = true;
        this.thumb = null;
        this.contents = false;

        if(this.contents) {
            Items.Random(1).then(function(item) {
                this.contents = item;
            });
        }
    }
}

module.exports.Random = function() {
    var deferred = Q.defer();

    db.accessibles.aggregate([{$sample: {size: 1}}], function(err, docs) {
        deferred.resolve(new Accessible(docs[0]));
    });

    return deferred.promise;
};