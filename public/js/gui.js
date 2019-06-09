var map, infoWindow;

/** General **/
function updateLocation() {
    if(Player) {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                $("#playerLat").empty().append(position.coords.latitude.toFixed(4));
                $("#playerLon").empty().append(position.coords.longitude.toFixed(4));
                currentCoords.lat = position.coords.latitude;
                currentCoords.lng = position.coords.longitude;
                console.log(currentCoords);
                //updateMap();
                socket.emit("Player.Location.Update", getCurrentCoords());
            });
        } else {
            alert("Geolocation not supported.");
        }
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

    $("#player_health").empty().text(Player.health+"/"+Player.maxHealth);
    $("#player_mana").empty().text(Player.mana+"/"+Player.maxMana);
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
    loadInventory();
    loadEquipped();
}

function loadPlayerMagic() {
    var keys = Object.keys(Player.spells);
    for(var key in keys) {
        var spell = $(makeSpellThumb(Player.spells[keys[key]])).on("dblclick", function() {
            castSpell(keys[key])
        });

        $("#spellSlot"+key).empty().append(spell)
    }
}

function loadInventory() {
    $(".invSlot").empty();

    for(var slot in Player.inventory) {
        if(Player.inventory[slot]) {
            $("#inv"+slot).append(makeItemThumb(Player.inventory[slot], slot));
        }
    }
}

function loadEquipped() {
    $(".equipSlot").empty();

    for(var slot in Player.equipped) {
        if(Player.equipped[slot]) {
            $("#player"+slot).empty().append(makeItemThumb(Player.equipped[slot], slot));
        }
    }
}

/** Items **/

function defaultDragAndDrop() {
    $(".dropSlot").droppable({
        accept: ".itemThumb",
        snap: true,
        snapTolerance: 30
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
        snapTolerance: 30,
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

function makeItemThumb(item, slot) {
    var el;

    if(item.attack || item.defense) {
        el = $("<img id='"+item._id+"' class='equipThumb itemThumb' data-slot='"+slot+"' src='"+item.thumb+"'>");
    } else {
        el = $("<img id='"+item._id+"' class='usableThumb itemThumb' data-slot='"+slot+"' src='"+item.thumb+"'>");
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