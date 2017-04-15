'use strict';
var Items = require("./Items.js");

class Accessible {
    constructor() {
        this.accessible = true;
        this.open = false;
    }
}

class Door extends Accessible {
    constructor() {
        super();
        this.svg = "<rect x='0' y='0' fill='brown' style='border:8px black;' width='200' height='200'></rect>";
    }
}

class Chest extends Accessible {
    constructor() {
        super();
        this.contents = [];
        for(var i = 0; i<(Math.random()*10); i++) {
            this.contents.push(Items.Random());
        }

        this.svg = "<rect x='0' y='0' fill='brown' style='border:2px black;' width='200' height='200'></rect>";
    }
}

module.exports.Door = Door;
module.exports.Chest = Chest;
module.exports.Random = function() {
    var keys = Object.keys(module.exports);
    keys.slice(keys.indexOf("Random"), 1);
    return new keys[Math.floor(Math.random() * keys.length)]();
};