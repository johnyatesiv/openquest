var mongojs = require("mongojs");
var db = mongojs("openquest", ["players", "classes", "monsters", "bosses", "items", "environments", "accessibles", "species", "spells"]);
module.exports = db;