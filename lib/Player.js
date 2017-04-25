'use strict';
var db = require("./DB.js");
var Q = require("q");

var Bosses = require("./Bosses.js");
var Character = require("./Character.js");
var Classes = require("./Classes.js");
var Environments = require("./Environments.js");
var Events = require("./Events.js");
var Items = require("./Items.js");
var Mechanics = require("./Mechanics.js");
var Species = require("./Species.js");
var Spells = require("./Spells.js");
var Util = require("./Util.js");

const statBase = 10;
const elStatBase = 2;

module.exports = class Player extends Character {
    constructor(name, sex, playerSpecies, playerClass) {
        super();

        /** Hidden Data **/
        this._id = null;
        this.password = null;
        this.socket = null;

        /** Game Stuff **/
        this.isSentient = true;
        this.name = name;
        this.sex = sex;
        this.Species = new Species(playerSpecies);
        this.Class = new Classes(playerClass);
        this.level = 1;
        this.experience = 0;

        /** Environment Variables **/
        this.Target = {};

        /** Quest Tracker **/
        this.activeQuest = {};
        this.knownQuests = {};

        /** Stats **/
        this.maxHealth = this.health = 100 + this.Class.Health + this.Species.Health;
        this.maxMana = this.mana = 20 + this.Class.Mana + this.Species.Mana;
        this.strength = statBase + this.Class.Strength + this.Species.Strength;
        this.dexterity = statBase + this.Class.Dexterity + this.Species.Dexterity;
        this.constitution = statBase + this.Class.Constitution + this.Species.Constitution;
        this.intelligence = statBase + this.Class.Intelligence + this.Species.Intelligence;
        this.magic = statBase + this.Class.Magic + this.Species.Magic;
        this.spirit = statBase + this.Class.Spirit + this.Species.Spirit;
        this.luck = 1 + this.Class.Luck + this.Species.Luck;

        this.Spells = {};

        if(this.Class.Spells[1]) {
            this.Spells[this.Class.Spells[1].name] = new Spells.Spell(this.Class.Spells[1]);
        }

        /** Equipment **/
        this.equipped = {
            Head: {defense: 0},
            Neck: {},
            Body: {defense: 0},
            Belt: {defense: 0},
            RightHand: {attack: 0},
            LeftHand: {attack: 0},
            RightFinger: {},
            LeftFinger: {},
            Legs: {},
            Feet: {defense: 0}
        };

        /** Inventory **/
        this.inventory = {
            Slot1: {},
            Slot2: {},
            Slot3: {},
            Slot4: {},
            Slot5: {},
            Slot6: {},
            Slot7: {},
            Slot8: {},
            Slot9: {},
            Slot10: {},
            Slot11: {},
            Slot12: {},
            Slot13: {},
            Slot14: {},
            Slot15: {},
            Slot16: {}
        };

        /** Magic Stuff **/

        this.fire = elStatBase + this.Class.Fire + this.Species.Fire;
        this.ice = elStatBase + this.Class.Ice + this.Species.Ice;
        this.thunder = elStatBase + this.Class.Thunder + this.Species.Thunder;
        this.earth = elStatBase + this.Class.Earth + this.Species.Earth;
        this.water = elStatBase + this.Class.Water + this.Species.Water;
        this.wood = elStatBase+ this.Class.Wood + this.Species.Wood;
        this.metal = elStatBase + this.Class.Metal + this.Species.Metal;
        this.ether = elStatBase + this.Class.Ether + this.Species.Ether;
        this.toxin = elStatBase + this.Class.Toxin + this.Species.Toxin;
        this.holy = elStatBase + this.Class.Holy + this.Species.Holy;

        /** Gold **/
        this.gold = 50;

        /** Current Location **/
        this.location = {
            lat: null,
            lng: null
        };

        /** Timers **/
        //this.ManaRegen = function() {
        //    setInterval(function() {
        //
        //    }, 10000);
        //}

        /** Flags **/
    }

    /** General Actions **/

    save() {
        db.players.update({_id: this._id}, this.saveData, function(err, docs) {});
    }

    get saveData() {
        return {
            name: this.name,
            password: this.password,
            sex: this.sex,
            Species: this.Species,
            Class: this.Class,
            health: this.health,
            maxHealth: this.maxHealth,
            mana: this.mana,
            maxMana: this.maxMana,
            location: this.location,
            experience: this.experience,
            strength: this.strength,
            dexterity: this.dexterity,
            constitution: this.constitution,
            intelligence: this.intelligence,
            magic: this.magic,
            spirit: this.spirit,
            luck: this.luck,
            fire: this.fire,
            ice: this.ice,
            thunder: this.thunder,
            earth: this.earth,
            water: this.water,
            wood: this.wood,
            toxin: this.toxin,
            metal: this.metal,
            holy: this.holy,
            Effects: this.Effects,
            Spells: this.Spells,
            inventory: this.inventory,
            equipped: this.equipped

        }
    }

    get data() {
        return {
            _id: this._id,
            name: this.name,
            password: this.password,
            Sex: this.sex,
            Species: this.Species,
            class: this.Class,
            level: this.level,
            health: this.health,
            maxHealth: this.maxHealth,
            mana: this.mana,
            maxMana: this.maxMana,
            location: this.location,
            experience: this.experience,
            strength: this.Strength,
            dexterity: this.Dexterity,
            constitution: this.Constitution,
            intelligence: this.Intelligence,
            magic: this.Magic,
            spirit: this.Spirit,
            luck: this.Luck,
            fire: this.Fire,
            ice: this.Ice,
            thunder: this.Thunder,
            earth: this.Earth,
            water: this.Water,
            wood: this.Wood,
            metal: this.Metal,
            ether: this.Ether,
            toxin: this.Toxin,
            holy: this.Holy,
            Spells: this.Spells,
            Target: this.Target,
            Equipped: this.equipped,
            Inventory: this.inventory
        };
    };

    get Experience() {
        return this.experience;
    };

    set Experience(exp) {
        this.experience = this.experience + exp;
        if(this.experience >= this.level*1000) {
            this.levelUp();
        } else {
            this.emit("Player.Updated.Experience", this.experience);
        }

        this.save();
    };

    levelUp() {

        this.level++;
        this.health = this.maxHealth = this.maxHealth + 5;
        this.mana = this.maxMana = this.maxMana + 2;
        this.strength++;
        this.dexterity++;
        this.constitution++;
        this.intelligence++;
        this.magic++;
        this.spirit++;

        if((Math.random()*10) > 8) {
            this.luck++;
        }

        for(var i in this.Class.Bonus) {
            this[i.toLowerCase()] += this[i]*this.Class.Bonus[i];
        }

        if(this.Class.Spells[this.level]) {
            this.Spells[this.Class.Spells[this.level]] = new Spells.Spell(this.Class.Spells[this.level]);
        }

        this.emit("Player.Updated.Level", this.data);
    }

    updateLocation(lat, lng) {
        this.location.lat = lat;
        this.location.lng = lng;
        this.generateEnvironment();
        //Events.emit("Player.Location", {lat: lat, lng: lng});
    }

    searchLocation(lat, lng) {
        var player = this;

        Bosses.findNear(player.location).then(function(boss) {
            if(boss != null) {
                player.encounterBoss(boss);
            } else {
                Items.findNear(player.location).then(function(item) {
                    if(item != null) {
                        player.encounterTreasure(item);
                    } else {
                        player.emit("Player.Environment.Interacted", "There doesn't seem to be anything nearby.");
                    }
                }).catch(function(err) {
                    console.log(err);
                });
            }
        }).catch(function(err) {
            console.log(err);
        });
    }

    encounterBoss(boss) {
        this.emit("Player.Environment.Interacted", "You sense a strong presence nearby...");
    }

    encounterTreasure(item) {
        this.emit("Player.Environment.Interacted", "Something valuable is near!");
    }

    /** Overloaded from Parent **/

    /** Constitution + Armor Rating **/
    get physicalResist() {
        return this.Constitution + this.armorRating;
    }

    /** Spirit + Magic Armor **/
    get magicResist() {
        return this.Spirit + this.magicArmorRating;
    }


    /** Equipment Functions **/

    get Head() {
        return this.equipped.Head;
    }

    get Neck() {
        return this.equipped.Neck;
    }

    get LeftHand() {
        return this.equipped.LeftHand;
    }

    get RightHand() {
        return this.equipped.RightHand;
    }

    get Body() {
        return this.equipped.Body;
    }

    get Legs() {
        return this.equipped.Legs;
    }

    get Feet() {
        return this.equipped.Feet;
    }

    get equipmentDamage() {
        var damage = 0;

        if(this.LeftHand.attack) {
            damage += this.equipped.LeftHand.attack;
        }

        if(this.RightHand.attack) {
            damage += this.equipped.RightHand.attack;
        }

        return damage;
    }

    get armorRating() {
        return this.Body.defense + this.Head.defense + this.Feet.defense;
    }

    get magicArmorRating() {
        return this.Body.magicDefense + this.Head.magicDefense + this.Feet.magicDefense;
    }

    equip(itemSlot, equipSlot) {

        if(itemSlot != equipSlot) {
            if(this.inventory[itemSlot] != undefined && Object.keys(this.inventory[itemSlot]).length > 0) {
                if((this.inventory[itemSlot].Slots.indexOf(equipSlot) > -1)) {
                    if(this.canUse(this.inventory[itemSlot])) {
                        this.addToInventory(this.equipped[equipSlot]);
                        this.equipped[equipSlot] = this.inventory[itemSlot];
                        this.removeFromInventory(itemSlot);
                        this.emit("Player.Item.Equipped", this.equipped[equipSlot]);
                        this.refresh();
                        this.save();
                    } else {
                        this.emit("Player.Item.Interacted", "Insufficient stats to use this item.");
                        this.refresh();
                    }
                } else {
                    this.emit("Player.Item.Interacted", "Cannot equip that item in that slot.");
                    this.refresh();
                }
            } else if(this.equipped[itemSlot] != undefined && Object.keys(this.equipped[itemSlot]).length > 0) {
                if((this.equipped[itemSlot].Slots.indexOf(equipSlot) > -1)) {
                    if(this.canUse(this.equipped[itemSlot])) {
                        var item1 = this.equipped[itemSlot];
                        var item2 = this.equipped[equipSlot];

                        this.equipped[equipSlot] = item1;
                        this.equipped[itemSlot] = item2;

                        this.emit("Player.Item.Equipped", this.equipped[equipSlot]);
                        this.refresh();
                        this.save();
                    } else {
                        this.emit("Player.Item.Interacted", "Insufficient stats to use this item.");
                        this.refresh();
                    }
                } else {
                    this.emit("Player.Item.Interacted", "Cannot equip that item in that slot.");
                    this.refresh();
                }
            } else {
                this.emit("Item.Error", "Could not determine slot to swap.");
            }
        }
    };

    unequip(equipSlot) {
        if(Object.keys(this.equipped[equipSlot]).length > 1) {
            for(var slot in this.inventory) {
                if(Object.keys(this.inventory[slot]).length < 1) {
                    this.inventory[slot] = this.equipped[equipSlot];
                    this.equipped[equipSlot] = {};
                    this.emit("Player.Item.Interacted", "Unequipped "+this.inventory[slot].name+".");
                    this.refresh();
                    return true;
                }
            }

            this.emit("Player.Item.Interacted", "Cannot unequip without room in inventory.");
            this.refresh();
            return false;
        }
    }

    swapItem(slot1, slot2) {

    }

    refresh() {
        this.emit("Player.Updated", this.data);
    }

    canUse(Item) {
        for(var req in Item.requirements) {
            if(this[req] < Item.requirements[req]) {
                return false;
            }
        }

        return true;
    }

    /** Combat Calculators **/

    /** Str + Str * Weapon Damage Modifiers **/

    revive() {
        console.log("Reviving "+this.name+"...");
        this.health = this.maxHealth;
        this.sleeping = false;
        this.mend();
        this.experience = 0;
        this.generateEnvironment();

        this.emit("Player.Revived", this.data);
    }

    /** Environment Actions **/

    generateEnvironment() {
        var player = this;

        Environments.findNear(this.location).then(function(environments) {
            for(var e in environments) {
                player.emit("Player.Environment.Encountered", environments[e]);
            }
        }).catch(function(err) {
            console.log(err);
        });

        Mechanics.monsterSpawn(this).then(function(monster) {
            player.Target = monster;
            player.emit("Player.Monster.Encountered", player.Target);
        }).catch(function(err) {
            console.log(err);
        });

        Mechanics.itemSpawn(this).then(function(item) {
            player.emit("Item.Found", item);
        }).catch(function(err) {
            console.log(err);
        })
    }

    /** Interact with Environment **/

    /** pick up an Item **/
    pickUp() {
        if(this.addToInventory(this.Target)) {
            this.emit("Player.Environment.Interacted", "You picked up a "+this.Target.name+".");
            this.generateEnvironment();
            this.save();
        } else {
            this.emit("Player.Environment.Interacted", "You do not have room in your inventory.");
        }
    }

    /** Drop an Item **/
    drop(Slot) {
        var item = this.getFromInventory(Slot);
        this.removeFromInventory(Slot);
        this.emit("Player.Item.Interacted", "You dropped the "+item.name+".");
    }

    /** consume a Consumable Item **/
    consume(Consumable) {
        Consumable.effect(this);
    }

    /** use a Usable Item **/
    use(Usable) {
        Usable.effect(this.Target);
    }

    /** Inventory Helper Methods **/
    getFromInventory(Slot) {
        return this.inventory[Slot];
    }

    addToInventory(Item) {
        if(Object.keys(Item).length > 0) {
            for(var slot in this.inventory) {
                console.log(this.inventory[slot]);
                if(Object.keys(this.inventory[slot]).length == 0) {
                    this.inventory[slot] = Item;
                    this.refresh();
                    return true;
                }
            }
        }

        return false;
    }

    removeFromInventory(Slot) {
        this.inventory[Slot] = {};
    }

    /** access an Accessible Item **/
    access() {
        this.emit("Player.Environment.Interacted", "You opened the "+this.Target.name+".");
        this.Target = this.Target.Item;
        this.emit("Player.Environment.Updated", this.Target.Item);
    }

    load(json) {
        for(var p in json) {
            if(p != "Species" && p != "Class" && p != "Spells") {
                this[p] = json[p];
            } else if(p == "Spells") {
                console.log(json[p]);
                for(var s in json[p]) {
                    console.log(json[p][s]);
                    this[p][s] = new Spells.Spell(json[p][s]);
                    console.log(this[p][s]);
                }
            }
        }
    }
};