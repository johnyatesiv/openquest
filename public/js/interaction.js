var currentCoords = {lat: null, lng: null};
var refreshLocation = true;
var Env = {};
var Item = {};

var combatBtns = "#combatBtns";

var travelBtns = "#travelBtns";

$(document).ready(function() {
    /** Big Game Mechanics **/
    $("#saveBtn").on("click", save);
    $("#reviveBtn").on("click", revive);
    $("#muteBtn").on("click", mute);
    $("#unMuteBtn").on("click", unmute);

    setInterval(function() {
        if(refreshLocation) {
            updateLocation();
        }
    }, 5000);

    /** Environment Bindings **/

    /** Travel UI **/
    //$("#moveBtn").on("click", spawnEnvironment);
    $("#searchBtn").on("click", searchEnvironment);
    $("#interactBtn").on("click", interact);

    /** Combat UI **/
    $("#physicalAttackBtn").on("click", attack);
    $("#attackSpellBtn").on("click", magicAttack);
    $("#skillAttackBtn").on("click", skillAttack);
    $("#mentalAttackBtn").on("click", mentalAttack);
    $("#runBtn").on("click", run);

    /** Fully Reload Player **/
    socket.on("Player.Updated", loadPlayer);
    socket.on("Player.Saved", loadPlayer);

    socket.on("Player.Environment.Interacted", interactedEnvironment);
    socket.on("Player.Environment.Updated", updateEnvironment);
    socket.on("Player.Monster.Encountered", encounterMonster);

    /** Inventory and Equipment **/
    $(".itemThumb").on("click", function(e) {
        itemOptions($(this).attr("id"));
    });

    $("#itemUse").on("click", function() {
        console.log($(this));
    });

    $("#itemDiscard").on("click", function() {
        discardItem(Item);
    });

    $(".usableThumb").dblclick(function(e) {
        alert("Double Clicked");
    });

    defaultDragAndDrop();

    socket.on("Player.Inventory.Updated", loadInventory);
    socket.on("Player.Equipment.Updated", loadEquipped);

    socket.on("Player.Item.Equipped", itemEquipped);
    socket.on("Player.Item.Interacted", interactedEnvironment);
    socket.on("Item.Revert", deEquipItem);

    /** Combat Bindings **/
    socket.on("Player.Updated.Health", updateHealth);
    socket.on("Player.Health.Helped", healHealth);
    socket.on("Target.Updated.Health", updateEnvHealth);
    socket.on("Target.Defeated", defeatEnemy);
    socket.on("Player.Revived", revived);

    /** Spell Bindings **/
    socket.on("Player.Spell.Finished", interactedEnvironment);

    /** Exp Bindings **/
    socket.on("Player.Updated.Experience", updateExperience);
    socket.on("Player.Updated.Level", loadPlayer);

    /** Environment Bindings **/
    socket.on("Player.Environment.Encountered", addEnvironmentTag);
    socket.on("Item.Encountered", addItemTag);
    socket.on("Boss.Encountered", addBossTag);
});

/** General/Travel **/

function interact() {
    socket.emit("Player.Environment.Interact", Player._id);
}

function interacted(message) {
    writeToConsole(message);
}

function castSpell(slot) {
    socket.emit("Player.Spell.Cast", {_id: Player._id, slot: slot});
}

/** Combat **/

function attack() {
    socket.emit("Player.Attack", Player._id);
}

function magicAttack() {

}

function skillAttack() {

}

function mentalAttack() {

}

function run() {
    socket.emit("Player.Location.Update", getCurrentCoords());
}

function pickUp() {
    socket.emit("Player.Environment.PickUp", Player._id);
}

function equip(target, equipSlot) {
    socket.emit("Player.Item.Equip", {_id: Player._id, itemSlot: target._id, equipSlot: equipSlot});
}

function revive() {
    socket.emit("Player.Revive", Player._id);
}

function revived() {
    $("#ripModal").modal("hide");
    loadPlayer();
}

/** Spells **/

/** Items **/

function itemOptions(itemId) {
    Item = Player.Inventory[itemId];
    itemModal();
}

function useItem(Item, Target) {

}

function dropItem(Item) {

}

function searchEnvironment() {
    socket.emit("Player.Location.Search", getCurrentCoords());
}

function updateEnvironment(update) {
    Env = update;
}

function encounterMonster(monster) {
    Env = monster;
    refreshLocation = false;
    combatUI();
}

function interactedEnvironment(message) {
    writeToConsole(message);
}

function addEnvironmentTag(environment) {
    console.log(environment);
}

function addItemTag(item) {
    console.log(item);
}

function addBossTag(boss) {
    console.log(boss);
}

function addPlayerTag(player) {
    console.log(player);
}

function itemEquipped(Item) {
    writeToConsole("You equipped "+Item.name+".");
}

function updateHealth(update) {
    console.log(update);
    if(update > 0) {
        writeToConsole("You take "+(Player.health - update)+" damage!");
        Player.Health = update;
        $("#playerHealth").empty().text(Player.Health+"/"+Player.MaxHealth);
    } else {
        knockedOut();
    }
}

function healHealth(update) {
    writeToConsole("You recover "+(update - Player.health)+" damage!");
    Player.health = update;
    $("#playerHealth").empty().text(Player.health+"/"+Player.maxHealth);
}

function updateEnvHealth(update) {
    if(update > 0) {
        writeToConsole(Env.name+" takes "+(Env.health - update)+" damage!");
        Env.health = update;
        $("#monsterHealth").empty().text(Env.health+" HP");
    } else {
        defeatEnemy()
    }
}

function defeatEnemy() {
    playAudio("victoriousChampion");
    writeToConsole("You defeated "+Env.name+" and earned "+Env.experience+" experience!");
    $("#monsterHealth").empty().text("Defeated");
    refreshLocation = true;
    updateLocation();
    travelUI();
}

function knockedOut() {
    $("#ripModal").modal("show");
}

/** Experience and Level **/

function updateExperience(exp) {
    console.log(exp);
    Player.experience = exp;
    $("#playerExperience").empty().text(Player.experience);
}