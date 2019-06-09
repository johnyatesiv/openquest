class Quest {
    constructor(data) {
        this.name = null;
        this.trigger = null;
        this.steps = null;
        this.prize = null;
        this.experience = 1;

        for(var d in data) {
            this[d] = data[d];
        }
    }

    complete(Player) {
        Player.Experience = this.experience;
    }
}

//{
//    name: "Slay the Demon",
//    location: {type: "Point", "coordinates": [32.9, -117.2]},
//    steps: {
//        1: {
//            location: {type: "Point", coordinates: [-117.22, 32.95]},
//            location: {type: "Point", coordinates: [-117.21, 32.96]},
//        }
//    }
//}

module.exports.findNear = function(coords) {
    var deferred = Q.defer();

    db.quests.find({location: {$near: {$geometry: {type: "Point", coordinates: [coords.lng, coords.lat]}}, $minDistance: 1, $maxDistance: 20}}, function(err, docs) {
        if(err) {
            deferred.reject(err);
        } else {
            deferred.resolve(docs[0]);
        }
    });

    return deferred.promise;
};