/** Deps **/
var express = require("express");
var mongojs = require('mongojs');
var bodyParser = require("body-parser");
var crypto = require("crypto");

/** Globals **/
var app = express();
var db = mongojs("openquest", ["characters"]);
var libPath = "./lib/";
var serverCharacters = {};

/** Game Deps **/
var Events = require(libPath+"Events.js");
var Character = require(libPath+"Character.js");
var Classes = require(libPath+"Classes.js");
var Item = require(libPath+"Items.js");
var Mechanics = require(libPath+"Mechanics.js");
var Races = require(libPath+"Races.js");

/** Server Config **/
var server = require('http').createServer();
server.listen(3000);

app.use(bodyParser.urlencoded({extended: true}));
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/public/views'); //Set views path to that same html folder
app.set('view engine', 'html'); //Instead of .ejs, look for .html extension

app.use('/fonts', express.static('./public/fonts'));
app.use('/css', express.static('./public/css'));
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
    var response = {ok: true, body: []};

    for(var c in Classes) {
        response.body.push(c);
    }

    res.json(response);
});

app.get("/races", function(req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    var response = {ok: true, body: []};

    for(var r in Races) {
        response.body.push(r);
    }

    res.json(response);
});

app.post("/character", function(req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    var character = req.body;
    var hash = crypto.createHash('md5').update(req.body.password).digest("hex");
    var newCharacter = new Character(character.name, hash, character.sex, new Races[character.race](), new Classes[character.class]());
    db.characters.insert(newCharacter, function(err, docs) {
        console.log(docs);
    });
});

app.get("/character", function(req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    db.find({name: req.body.name, password: crypto.createHash('md5').update(req.body.password).digest("hex")})
});

/** Socket Communication **/
var io = require('socket.io')(server);
io.on('connection', function(client){
    console.log("Client Connected");

    client.on('Character.Create', function(character) {
        character.socketId = client.id;
        character.password = hashPassword(character.password);
        console.log(character);
        var newCharacter = new Character(character.name, character.sex, new Races[character.race](), new Classes[character.class]());
        console.log(newCharacter);

        db.characters.insert(character, function(err, docs) {
            serverCharacters[docs[0].id] = docs[0];
            client.emit("Character.Loaded", newCharacter.data);
        });
    });

    client.on("Character.Load", function(data) {
        console.log("Loading Character");
        db.characters.find({name: data.name, password: hashPassword(data.password)}, function(err, character) {
           if(err) {
               client.emit("Character.Error", err);
           } else {
               if(!character) {
                   client.emit("Character.Error", "Could not load Character.");
               } else {
                   serverCharacters[client.id] = loadCharacterFromJSON(character[0]);
                   console.log(serverCharacters[client.id].data);
                   client.emit("Character.Loaded", serverCharacters[client.id].data);
               }
           }
        });
    });

    client.on("Character.Save", function(charId) {
        db.characters.update({_id: charId}, serverCharacters[charId]);
    });

    client.on("Character.Location.Change", function(coordinates) {
        console.log(coordinates);
        serverCharacters[client.id].updateLocation(coordinates.lat, coordinates.lon);
        client.emit("Character.Environment.Update", serverCharacters[client.id].environment);
    });

    client.on('disconnect', function() {
        console.log("Client Disconnected.");
    });
});

/** Util Functions **/

var hashPassword = function(password) {
    return crypto.createHash('md5').update(password).digest("hex");
};

var loadCharacterFromJSON = function(character) {
    var loadedCharacter = new Character(character.name, character.sex, character.Race, character.Class);
    console.log(loadedCharacter);
    loadedCharacter.loadFromJSON(character);
    return loadedCharacter;
};