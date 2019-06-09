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
        this.activeQuest = null;
        this.knownQuests = {};

        /** Stats **/
        this.maxHealth = this.health = 100 + this.Class.health + this.Species.health;
        this.maxMana = this.mana = 20 + this.Class.mana + this.Species.mana;
        this.strength = statBase + this.Class.strength + this.Species.strength;
        this.dexterity = statBase + this.Class.dexterity + this.Species.dexterity;
        this.constitution = statBase + this.Class.constitution + this.Species.constitution;
        this.intelligence = statBase + this.Class.intelligence + this.Species.intelligence;
        this.magic = statBase + this.Class.magic + this.Species.magic;
        this.spirit = statBase + this.Class.spirit + this.Species.spirit;
        this.luck = 1 + this.Class.luck + this.Species.luck;

        this.spells = {};

        if(this.Class.spells[1]) {
            var player = this;
            db.spells.findOne({_id: this.Class.spells[1]}, function(err, spell) {
                player.spells[spell.name] = new Spells.Spell(spell);
            });
        }

        /** Equipment **/
        this.equipped = {
            Head: null,
            Neck: null,
            Body: null,
            Belt: null,
            RightHand: null,
            LeftHand: null,
            RightFinger: null,
            LeftFinger: null,
            Legs: null,
            Feet: null
        };

        /** Inventory **/
        this.inventory = {
            Slot0: null,
            Slot1: null,
            Slot2: null,
            Slot3: null,
            Slot4: null,
            Slot5: null,
            Slot6: null,
            Slot7: null,
            Slot8: null,
            Slot9: null,
            Slot10: null,
            Slot11: null,
            Slot12: null,
            Slot13: null,
            Slot14: null,
            Slot15: null
        };

        /** Magic Stuff **/

        this.fire = elStatBase + this.Class.fire + this.Species.fire;
        this.ice = elStatBase + this.Class.ice + this.Species.ice;
        this.thunder = elStatBase + this.Class.thunder + this.Species.thunder;
        this.earth = elStatBase + this.Class.earth + this.Species.earth;
        this.water = elStatBase + this.Class.water + this.Species.water;
        this.wood = elStatBase+ this.Class.wood + this.Species.wood;
        this.metal = elStatBase + this.Class.metal + this.Species.metal;
        this.ether = elStatBase + this.Class.ether + this.Species.ether;
        this.toxin = elStatBase + this.Class.toxin + this.Species.toxin;
        this.holy = elStatBase + this.Class.holy + this.Species.holy;

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
            effects: this.effects,
            spells: JSON.stringify(this.spells),
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
            spells: this.spells,
            Target: this.Target,
            equipped: this.equipped,
            inventory: this.inventory
        };
    };

    get Experience() {
        return this.experience;
    };

    set Experience(exp) {
        this.experience = this.experience + exp;
        console.log("setting "+this.experience);
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

        for(var i in this.Class.bonus) {
            this[i.toLowerCase()] += this.Class.bonus[i];
        }

        if(this.Class.spells[this.level]) {
            db.spells.findOne({_id: this.Class.spells[this.level]}, function(err, spell) {
                this.spells[spell.name] = new Spells.Spell(spell);
            });
        }

        this.emit("Player.Updated.Level", this.data);
    }

    updateLocation(lat, lng) {
        this.location.lat = lat;
        this.location.lng = lng;
        this.decayEffects();
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
        return this.Constitution + this.armorRating + Math.round(this.Dexterity/10) + Math.round(this.Luck/10);
    }

    /** Spirit + Magic Armor **/
    get magicResist() {
        return this.Spirit + this.magicArmorRating + Math.round(this.Dexterity/10) + Math.round(this.Luck/10);
    }


    /** Equipment Functions **/

    get Head() {
        return this.equipSlot("Head");
    }

    get Neck() {
        return this.equipSlot("Neck");
    }

    get LeftHand() {
        return this.equipSlot("LeftHand");
    }

    get RightHand() {
        return this.equipSlot("RightHand");
    }

    get Body() {
        return this.equipSlot("Body");
    }

    get Legs() {
        return this.equipSlot("Legs");
    }

    get Feet() {
        return this.equipSlot("Feet");
    }

    equipSlot(slot) {
        if(this.equipped[slot]) {
            return this.equipped[slot];
        } else {
            return {
                attack: 0,
                defense: 0,
                magicAttack: 0,
                magicDefense: 0
            }
        }
    }

    get equipmentDamage() {
        return this.LeftHand.attack + this.RightHand.attack;
    }

    get magicAttack() {
        return this.LeftHand.magicAttack + this.RightHand.magicAttack;
    }

    get armorRating() {
        return this.Body.defense + this.Head.defense + this.Feet.defense;
    }

    get magicArmorRating() {
        return this.Body.magicDefense + this.Head.magicDefense + this.Feet.magicDefense;
    }

    equip(itemSlot, equipSlot) {
        if(itemSlot != equipSlot) {
            if(this.inventory[itemSlot]) {
                if((this.inventory[itemSlot].slots.indexOf(equipSlot) > -1)) {
                    if(this.canUse(this.inventory[itemSlot])) {
                        this.addToInventory(this.equipped[equipSlot]);
                        this.equipped[equipSlot] = this.inventory[itemSlot];
                        this.removeFromInventory(itemSlot);
                        this.emit("Player.Item.Equipped", this.equipped[equipSlot]);
                        this.save();
                        this.refresh();
                    } else {
                        this.emit("Player.Environment.Interacted", "Insufficient stats to use this item.");
                        this.refresh();
                    }
                } else {
                    this.emit("Player.Environment.Interacted", "Cannot equip that item in that slot.");
                    this.refresh();
                }
            } else if(this.equipped[itemSlot]) {
                if((this.equipped[itemSlot].slots.indexOf(equipSlot) > -1)) {
                    if(this.canUse(this.equipped[itemSlot])) {
                        var item1 = this.equipped[itemSlot];
                        var item2 = this.equipped[equipSlot];

                        this.equipped[equipSlot] = item1;
                        this.equipped[itemSlot] = item2;

                        this.emit("Player.Item.Equipped", this.equipped[equipSlot]);
                        this.refresh();
                        this.save();
                    } else {
                        this.emit("Player.Environment.Interacted", "Insufficient stats to use this item.");
                        this.refresh();
                    }
                } else {
                    this.emit("Player.Environment.Interacted", "Cannot equip that item in that slot.");
                    this.refresh();
                }
            } else {
                this.emit("Item.Error", "Could not determine slot to swap.");
            }
        }
    };

    unequip(equipSlot) {
        if(this.equipped[equipSlot]) {
            var name = this.equipped[equipSlot].name;
            if(this.addToInventory(this.equipped[equipSlot])) {
                this.equipped[equipSlot] = null;
                this.emit("Player.Environment.Interacted", "Unequipped "+name+".");
                this.refresh();
            } else {
                this.emit("Player.Environment.Interacted", "Cannot unequip without room in inventory.");
                this.refresh();
                return false;
            }
        }
    }

    swapItem(slot1, slot2) {

    }

    refresh() {
        this.emit("Player.Updated", this.data);
    }

    refreshInventory() {
        this.emit("Player.Inventory.Updated", this.inventory);
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
        this.save();
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
            this.emit("Player.Items.DropPrompt", this.Target);
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

    addToInventory(item) {
        if(item) {
            for(var slot in this.inventory) {
                if(this.inventory[slot] == null) {
                    console.log("got slot");
                    this.inventory[slot] = item;
                    this.emit("Player.Environment.Interacted", "You picked up a "+item.name+".");
                    this.refresh();
                    this.save();
                    return true;
                }
            }
        }

        console.log("but still complains");
        this.emit("Player.Environment.Interacted", "You do not have room in your inventory.");
        return false;
    }

    removeFromInventory(Slot) {
        this.inventory[Slot] = null;
    }

    decayEffects() {
        for(var e in this.effects) {
            if(this.effects[e] - 1 < 100) {
                this.effects[e] = 100;
            } else {
                this.effects[e] -= 1;
            }
        }
    }

    /** Quest Methods **/

    get ActiveQuest() {
        return this.activeQuest;
    }

    set ActiveQuest(quest) {
        this.activeQuest = quest;
    }

    get KnownQuests() {
        return this.knownQuests;
    }

    set KnownQuests(quest) {
        this.knownQuests[quest.name] = quest;
    }

    triggerQuest() {
        for(var step in this.activeQuest.steps) {

        }
    }

    load(json) {
        for(var p in json) {
            if(p == "Species") {
                this.Species = new Species(json[p]);
            } else if(p == "Class") {
                this.Species = new Classes(json[p]);
            } else if(p == "spells") {
                for(var spell in this.spells) {
                    this.spells[spell] = new Spells.Spell(this.spells[spell]);
                }
            } else if(p == "inventory" || p == "equipped") {
                for(var slot in this[p]) {
                    if(json[p][slot]) {
                        this[p][slot] = new Items.Item(json[p][slot]);
                    }
                }
            } else {
                this[p] = json[p];
            }
        }
    }
};