'use strict';

class Environments {
    constructor() {

    }
}

class Dirt extends Environments {
    constructor() {
        super();
        this.svg = {
            fill: "#DF8F00"
        };
    }
}

module.exports.Dirt = Dirt;
module.exports.Random = function() {
    return new Dirt();
};