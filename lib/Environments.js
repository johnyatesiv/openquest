'use strict';

class Environments {
    constructor() {
        this.canInteract = true;
    }
}

class Dirt extends Environments {
    constructor() {
        super();
        this.svg = '<rect x="0" y="0" fill="yellow" width="200" height="200"></rect>';
        this.message = "It's just dirt.";
    }
}

module.exports.Dirt = Dirt;
module.exports.Random = function() {
    return new Dirt();
};