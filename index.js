/** Deps **/
var express = require("express");
var mongojs = require('mongojs');
var bodyParser = require("body-parser");

/** Globals **/
var libPath = "./lib/";
var app = express();
var db = require(libPath+"DB.js");
var serverPlayers = {};

/** Game Deps **/
var Events = require(libPath+"Events.js");
var Environments = require(libPath+"Environments.js");
var Player = require(libPath+"Player.js");
var Classes = require(libPath+"Classes.js");
var Item = require(libPath+"Items.js");
var Mechanics = require(libPath+"Mechanics.js");
var Monsters = require(libPath+"Monsters.js");
var Species = require(libPath+"Species.js");
var Util = require(libPath+"Util.js");

/** Server Config **/
var server = require('http').createServer();
server.listen(3000);

app.use(bodyParser.urlencoded({extended: true}));
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/public/views'); //Set views path to that same html folder
app.set('view engine', 'html'); //Instead of .ejs, look for .html extension

app.use('/favicon.ico', express.static('./favicon.ico'));
app.use('/audio', express.static('./public/audio'));
app.use('/css', express.static('./public/css'));
app.use('/fonts', express.static('./public/fonts'));
app.use('/img', express.static('./public/img'));
app.use('/js', express.static('./public/js'));

app.listen(8000, function () {
    console.log('App listening on port 8000');
});

/** Routes **/

app.get('/', function(req,res) {
    res.render('index', {});
});

app.get("/classes", function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    db.classes.find({}, function(err, docs) {
        res.json({ok: true, body: docs});
    });
});

app.get("/species", function(req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    db.species.find({}, function(err, docs) {
        res.json({ok: true, body: docs});
    });

});

//app.post("/player", function(req, res) {
//    res.header('Access-Control-Allow-Origin', '*');
//    var newPlayer = new Player(req.body.name, req.body.sex, req.body.species, req.body.class);
//    newPlayer.password = crypto.createHash('md5').update(req.body.password).digest("hex");
//    db.players.insert(newPlayer, function(err, docs) {
//        console.log(docs);
//    });
//});
//
//app.get("/player", function(req, res) {
//    res.header('Access-Control-Allow-Origin', '*');
//    db.find({name: req.body.name, password: crypto.createHash('md5').update(req.body.password).digest("hex")})
//});

/** Socket Communication **/
var io = require('socket.io')(server);
io.on('connection', function(client) {
    console.log("Client Connected");

    client.on('disconnect', function() {
        console.log("Client Disconnected.");
    });

    client.on('Player.Create', function(data) {
        db.classes.findOne({name: data.class}, function(err, classDoc) {
            if(err || classDoc == null) {
                client.emit("Player.Create.Error", err);
            } else {
                db.species.findOne({name: data.species}, function(err, speciesDoc) {
                    if(err || speciesDoc == null) {
                        client.emit("Player.Create.Error", err);
                    } else {
                        var player = new Player(data.name, data.sex, new Species(speciesDoc), new Classes(classDoc));
                        player.password = Util.hash(data.password);
                        db.players.insert(player, function(err, docs) {
                            serverPlayers[docs._id] = player;
                            client.emit("Player.Loaded", player.data);
                        });
                    }
                });
            }
        });
    });

    client.on("Player.Load", function(data) {
        console.log("Loading from login...");
        loadFromDB(client, data.name, Util.hash(data.password));
    });

    client.on("Player.Load.FromCache", function(data) {
        console.log("Loading from cached data...");
        loadFromDB(client, data.name, data.password);
    });

    client.on("Player.Save", function(_id) {
        getPlayer(_id, client, function(err, player) {
            console.log("Saving Player...");
            db.players.update({_id: mongojs.ObjectId(_id)}, player);
        });
    });

    client.on("Player.Revive", function(_id) {
        getPlayer(_id, client, function(err, player) {
            player.revive();
        });
    });

    client.on("Player.Location.Update", function(coordinates) {
        getPlayer(coordinates._id, client, function(err, player) {
            player.updateLocation(coordinates.lat, coordinates.lng);
        });
    });

    client.on("Player.Location.Search", function(coordinates) {
        getPlayer(coordinates._id, client, function(err, player) {
            player.searchLocation(coordinates.lat, coordinates.lng);
        });
    });

    client.on("Player.Environment.Update", function(_id) {
        getPlayer(_id, client, function(err, player) {
            player.generateEnvironment();
        });
    });

    client.on("Player.Environment.Interact", function(_id) {
         getPlayer(_id, client, function(err, player) {
             player.interact();
         });
    });

    /** Attacks **/

    client.on("Player.Attack", function(_id) {
        getPlayer(_id, client, function(err, player) {
            Mechanics.NPCCombat(player);
        });
    });

    /** Spell Methods **/

    client.on("Player.Spell.Cast", function(spell) {
        getPlayer(spell._id, client, function(err, player) {
            Mechanics.magicCast(Player, spell.slot);
        });
    });

    client.on("Player.Enchant.Cast", function(spell) {
        getPlayer(spell._id, client, function(err, player) {
            player.Spells[spell.name].effect(player, player.Inventory[spell.itemName]);
            client.emit("Item.Updated", player.Inventory[spell.itemName]);
        });
    });

    /** Item Methods **/

    client.on("Player.Item.Equip", function(data) {
        getPlayer(data._id, client, function(err, player) {
            player.equip(data.itemSlot, data.equipSlot);
        });
    });

    client.on("Player.Item.Unequip", function(data) {
        getPlayer(data._id, client, function(err, player) {
            player.unequip(data.equipSlot);
        });
    });

    client.on("Player.Item.Move", function(data) {
        getPlayer(data._id, client, function(err, player) {
            player.addToInventory()
        });
    });

    client.on("Player.Item.Use", function(item) {

    });

    client.on("Player.Item.Throw", function(item) {

    });

    client.on("Player.Update.Experience", function(update) {
        getPlayer(update._id, client, function(err, player) {
            player.Experience = update.experience;
        });
    });
});

/** Util Functions **/

function loadFromDB(client, name, password) {
    db.players.findOne({name: name, password: password}, function(err, player) {
        if(err) {
            client.emit("Player.Error", err);
        } else {
            if(!player) {
                client.emit("Player.Error", "Could not load Player.");
            } else {
                serverPlayers[Player._id] = loadPlayerFromJSON(player);
                client.emit("Player.Loaded", serverPlayers[Player._id].data);
            }
        }
    });
}

var loadPlayerFromJSON = function(player) {
    var instance = new Player(player.name, player.sex, player.Species, player.Class);
    instance.load(player);
    return instance;
};

var getPlayer = function(_id, socket, cb) {
    if(serverPlayers[_id]) {
        serverPlayers[_id].socket = socket;
        cb(null, serverPlayers[_id]);
    } else {
        db.players.findOne({_id: mongojs.ObjectId(_id)}, function(err, player) {
            if(err) {
                cb(err, null);
            } else if(!player) {
                cb("Could not find player.", null);
            } else {
                serverPlayers[_id] = loadPlayerFromJSON(player);
                serverPlayers[_id].socket = socket;
                cb(null, serverPlayers[_id]);
            }
        });
    }
};