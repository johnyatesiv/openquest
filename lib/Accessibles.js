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
    }
}

class Chest extends Accessible {
    constructor() {
        super();
        this.contents = [];
        for(var i = 0; i<(Math.random()*10); i++) {
            this.contents.push(Items.Random());
        }
    }
}

module.exports.Door = Door;
module.exports.Chest = Chest;
module.exports.Random = function() {
    return new Chest();
};