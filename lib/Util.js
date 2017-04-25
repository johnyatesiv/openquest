var crypto = require("crypto");

module.exports.hash = function(hashable) {
    return crypto.createHash('md5').update(hashable).digest("hex");
};