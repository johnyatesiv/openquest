var map, infoWindow;

/** General **/
function updateLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            $("#playerLat").empty().append(position.coords.latitude.toFixed(4));
            $("#playerLon").empty().append(position.coords.longitude.toFixed(4));
            currentCoords.lat = position.coords.latitude;
            currentCoords.lng = position.coords.longitude;
            updateMap();
            socket.emit("Player.Location.Update", getCurrentCoords());
        });
    } else {
        alert("Geolocation not supported.");
    }
}

function hasMoved(current, newpos) {
    return (Math.abs(current.lat - newpos.latitude) > 0.000001 || Math.abs(current.lng - newpos.longitude));
}

function getCurrentCoords() {
    return {lng: currentCoords.lng, lat: currentCoords.lat, _id: Player._id};
}

function initMap() {
    console.log("Initializing Map.");

    map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng({lat: -34.397, lng: 150.644}),
        zoom: 1
    });

    infoWindow = new google.maps.InfoWindow;
}

function updateMap() {
    map.setCenter(new google.maps.LatLng(currentCoords));
    map.setZoom(17);
}

function discover(update) {
    infoWindow.setPosition(update.location);
    infoWindow.setContent(update.name);
    infoWindow.open(map);
}

function writeToConsole(message) {
    $(consoleEl)
        .text($(consoleEl).text()+"\n > "+new Date().toLocaleTimeString()+" "+message)
        .scrollTop($(consoleEl)[0].scrollHeight - $(consoleEl).height());
}

/** Player **/

function loadPlayer(player) {
    Player = player;
    loadPlayerStats();
    loadLocation();
    loadPlayerItems();
    loadPlayerMagic();
}

function loadPlayerStats() {
    for(var a in Player) {
        if(a == "Class" || a == "Species") {
            $("#player_"+a).text(Player[a].name);
        } else {
            $("#player_"+a).text(Player[a]);
        }
    }

    $("#playerHealth").empty().text(Player.health+"/"+Player.maxHealth);
    $("#playerMana").empty().text(Player.mana+"/"+Player.maxMana);
}

function loadLocation() {
    currentCoords.lng = Player.location.lng;
    currentCoords.lat = Player.location.lat;

    if(Player.location.lat) {
        $("#playerLat").text(Player.location.lat);
    } else {
        $("#playerLat").text("?");
    }

    if(Player.location.lng) {
        $("#playerLat").text(Player.location.lng);
    } else {
        $("#playerLat").text("?");
    }
}

function loadPlayerItems() {
    loadInventory(Player.Inventory);
    loadEquipped(Player.Equipped);
}

function loadPlayerMagic() {
    var keys = Object.keys(Player.Spells);
    for(var key in keys) {
        var spell = $(makeSpellThumb(Player.Spells[keys[key]])).on("dblclick", function() {
            castSpell(keys[key])
        });

        $("#spellSlot"+key).empty().append(spell)
    }
}

function loadInventory(Inventory) {
    Player.Inventory = Inventory;

    $(".invSlot").empty();

    for(var slot in Inventory) {
        if(Inventory[slot].name) {
            $("#inv"+slot).append(makeItemThumb(Inventory[slot], slot));
        }
    }
}

function loadEquipped(Equipped) {
    Player.Equipped = Equipped;

    $(".equipSlot").empty();

    for(var slot in Equipped) {
        if(Equipped[slot].name && Equipped[slot].thumb) {
            $("#player"+slot).empty().append(makeItemThumb(Equipped[slot], slot));
        }
    }
}

/** Items **/

function defaultDragAndDrop() {
    $(".dropSlot").droppable({
        accept: ".itemThumb",
        snap: true,
        snapTolerance: 20
    }).on("drop", function(event, itemEl) {

    });

    $( ".equipSlot" ).droppable({
        accept: ".equipThumb",
        snap: true,
        snapTolerance: 20,
        out: function(event, ui) {
            socket.emit("Player.Item.Unequip", {_id: Player._id, equipSlot: $(this)[0].dataset.slot})
        }
    }).on("drop", function(event, itemEl) {
        socket.emit("Player.Item.Equip", {_id: Player._id, itemSlot: itemEl.draggable[0].dataset.slot, equipSlot: $(this)[0].dataset.slot});
    });
}

function makeDraggable(el) {
    el.draggable({
        snap: true,
        snapMode: "inner",
        snapTolerance: 5,
        revert: "invalid"
    });

    return el;
}

function makeDroppable(el, accept, callback) {
    el.droppable({
        accept: accept
    }).on("drop", callback);

    return el;
}

function makeItemThumb(Item, Slot) {
    var el;

    if(Item.attack || Item.defense) {
        el = $("<img id='"+Item._id+"' class='equipThumb itemThumb' data-slot='"+Slot+"' src='"+Item.thumb+"'>");
    } else {
        el = $("<img id='"+Item._id+"' class='useableThumb itemThumb' data-slot='"+Slot+"' src='"+Item.thumb+"'>");
    }

    return makeDraggable(el);
}

function makeSpellThumb(Spell) {
    return "<img class='spellThumb' data-name='"+Spell.name+"' src='"+Spell.thumb+"'>";
}

function deEquipItem(itemSlot, equipSlot) {
    $("#inv"+itemSlot).append($(".equipSlot[data-slot=''"+equipSlot+"']").detach());
}

/** UI Shortcut Methods **/
function combatUI() {
    playAudio("aloneInTheWilderness");
    $(".travelUI").addClass("hide");
    $(".combatUI").removeClass("hide");
    $("#map").addClass("hide");
    $("#monsterImage").empty().append("<img class='monsterThumb' src='"+Env.thumb+"' height='300' width='600'>");
    $("#monsterName").empty().text(Env.name);
    $("#monsterHealth").empty().text(Env.health+" HP");
    $("#monster").removeClass("hide");
}

function travelUI() {
    playAudio("travelTheme");
    $(".combatUI").addClass("hide");
    $(".travelUI").removeClass("hide");
    $("#map").removeClass("hide");
    showTerrainData();
}

function showTerrainData() {
    $("#map").removeClass("hide");
    $("#monster").addClass("hide");
    $("#envAccessible").addClass("hide");
    $("#envPickUp").addClass("hide");
}