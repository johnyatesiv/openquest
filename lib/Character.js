'use strict';
var Events = require("./Events.js");
var Mechanics = require("./Mechanics.js");

const statBase = 10;

module.exports = class Character {
    constructor(name, password, sex, Race, Class) {
        /** Data **/
        this.name = name;
        this.sex = sex;
        this.Race = Race;
        this.Class = Class;
        this.level = 1;
        this.exp = 0;
        this.password = password;

        /** Environment Variables **/
        this.target = null;

        this.environment = {
            nw: null,
            n: null,
            ne: null,
            e: null,
            se: null,
            s: null,
            sw: null,
            w: null
        };

        this.wait = false;

        /** Stats **/
        this.maxHealth = 100 + this.level*10;
        this.health = 100;

        this.strength =  statBase+ this.Class.statMods.str + this.Race.statMods.str;
        this.dexterity =  statBase+ this.Class.statMods.dex + this.Race.statMods.dex;
        this.constitution =  statBase+ this.Class.statMods.con + this.Race.statMods.con;
        this.magic =  statBase+ this.Class.statMods.mag + this.Race.statMods.mag;
        this.intelligence =  statBase+ this.Class.statMods.int + this.Race.statMods.int;
        this.spirit =  statBase+ this.Class.statMods.spr + this.Race.statMods.spr;
        this.luck = this.Class.statMods.lck + this.Race.statMods.lck;

        /** Elemental Affinities **/
        this.fire = 2 + this.Race.elemMods.fire;
        this.ice = 2 + this.Race.elemMods.ice;
        this.thunder = 2 + this.Race.elemMods.thunder;
        this.earth = 2 + this.Race.elemMods.earth;
        this.water = 2 + this.Race.elemMods.water;
        this.wood = 2 + this.Race.elemMods.wood;
        this.toxin = 2 + this.Race.elemMods.toxin;
        this.holy = 0 + this.Race.elemMods.holy;

        /** Equipment **/
        this.equipped = {
            head: this.Class.startItems.head,
            neck: this.Class.startItems.neck,
            body: this.Class.startItems.body,
            belt: this.Class.startItems.belt,
            rightHand: this.Class.startItems.rightHand,
            leftHand: this.Class.startItems.leftHand,
            finger1: this.Class.startItems.finger1,
            finger2: this.Class.startItems.finger2,
            feet: this.Class.startItems.feet
        };

        /** Accumulated Stats + Modifiers **/
        this.ranged = this.equipped.leftHand.ranged || this.equipped.rightHand.ranged;
        this.damageModifier = 0;
        this.magicModifier = 0;
        this.armorRating = 0;
        this.magicArmorRating = 0;

        /** Inventory **/
        this.inventory = this.Class.startItems.inventory;

        /** Gold **/
        this.gold = this.Class.startItems.gold;

        /** Status Counters **/
        this.stunCounter = 0;
        this.poisonCounter = 0;
        this.sleepCounter = 0;
        this.enthrallCounter = 0;
        this.koCounter = 0;

        /** Current Location **/
        this.location = {
            lat: null,
            lon: null
        };

        /** Flags **/
        this.isInCombat = false;
    }

    /** General Actions **/

    save() {
        Events.emit("Character.Save", this);
    }

    get data() {
        return {
            Name: this.name,
            Sex: this.sex,
            Race: this.Race.constructor.name,
            Class: this.Class.constructor.name,
            Level: this.level,
            Location: this.location,
            Experience: this.exp,
            Strength: this.strength,
            Dexterity: this.dexterity,
            Constitution: this.constitution,
            Intelligence: this.intelligence,
            Magic: this.magic,
            Spirit: this.spirit,
            Luck: this.luck,
            Fire: this.fire,
            Ice: this.ice,
            Thunder: this.thunder,
            Earth: this.earth,
            Water: this.water,
            Wood: this.wood,
            Toxin: this.toxin,
            Holy: this.holy,
            Equipped: this.equipped,
            Inventory: this.inventory
        };
    }

    set experience(exp) {
        var totalExp = this.exp + exp;

        if(totalExp >= this.level*1000) {
            this.exp = totalExp - this.level*1000;
            this.levelUp();
        } else {
            this.exp = totalExp;
        }
    }

    levelUp() {
        this.level++;
        this.strength++;
        this.dexterity++;
        this.constitution++;
        this.intelligence++;
        this.magic++;
        this.spirit++;

        if((Math.random()*10) > 8) {
            this.luck++;
        }

        for(var i in this.Class.statBonus) {
            this[i] += this[i]*this.Class.statBonus[i];
        }
    }

    updateLocation(lat, lon) {
        this.location.lat = lat;
        this.location.lon = lon;

        this.runCounters();
        this.generateEnvironment();
        Events.emit("Character.Moved", this.id);
    }



    /** Equipment Functions **/
    reCalculateStats() {
        this.calculateDamageModifier();
        this.calculateMagicModifier();
        this.calculateArmorRating();
        this.calculateMagicArmorRating();
    };

    /** Combat Modifiers **/

    calculateDamageModifier() {
        this.damageModifier = this.equipped.leftHand.damageModifier + this.equipped.rightHand.damageModifier;
    }

    calculateMagicModifier() {
        this.magicModifier = this.equipped.leftHand.magicModifier + this.equipped.rightHand.magicModifier;
    }

    calculateArmorRating() {
        this.armorRating = this.equipped.body.AR + this.equipped.head.AR + this.equipped.feet.AR;
    }

    calculateMagicArmorRating() {
        this.magicArmorRating = this.equipped.body.MAR + this.equipped.head.MAR + this.equipped.feet.MAR;
    }

    equip(Item, Slot) {
        if(this.equipped[Slot] instanceof Item) {
            if(Item.canEquip(Slot)) {
                if(Item.canUse(this)) {
                    this.inventory.push(this.equipped[Slot]);
                    this.equipped[Slot] = Item;
                    this.reCalculateStats();
                } else {
                    throw new Error("Insufficient stats to use this item.");
                }
            } else {
                throw new Error("Cannot equip that item in that slot.");
            }
        }

        return false;
    };

    /** Combat Calculators **/

    damage(quantity) {
        //console.log(this.name+" takes "+quantity+" damage!");
        if(!this.isKnockedOut) {
            if(this.health - quantity <= 0) {
                this.health = 0;
                this.koCounter = 100;
            } else {
                this.health -= quantity;
            }
        }
    }

    /** Str + Str * Weapon Damage Modifiers **/
    get physicalDamage() {
        return this.strength + (this.strength * this.damageModifier/100);
    };

    /** Average of Dex and Int + Luck weight **/
    get skillChance() {
        return (this.dexterity + this.intelligence + this.luck)/2;
    };

    /** Magic + 5% Int **/
    get magicDamage() {
        return (this.magic + (this.intelligence * this.magicModifier/100));
    };

    /** Int + Lck **/
    get mentalChance() {
        return (this.intelligence + this.luck);
    }

    /** Average of Dex and Int + Luck Weight **/
    get stealChance() {
        return (this.dexterity + this.intelligence + this.luck)/2
    }

    /** Constitution + Armor Rating **/
    get physicalResist() {
        return this.constitution + this.armorRating;
    }

    /** Spirit + Magic Armor **/
    get magicResist() {
        return this.spirit + this.magicArmorRating;
    }

    /** Other Actions **/
    get persuadeChance() {
        return (this.intelligence+this.luck)/5;
    }

    /** Also for picking locks **/
    get breakTrapChance() {
        return (this.dexterity + this.intelligence)/3;
    }

    /** Status Effects and Counters **/
    runCounters() {
        this.stunCounter -= 1;
        this.sleepCounter -= 1;
        this.poisonCounter -= 1;
        this.enthrallCounter -= 1;
        this.koCounterer -= 1;
    }

    get isStunned() {
        return this.stunCounter > 0;
    }

    get isPoisoned() {
        return this.poisonCounter > 0;
    }

    get isAsleep() {
        return this.sleepCounter > 0;
    }

    get isEnthralled() {
        return this.enthrallCounter > 0;
    }

    get isKnockedOut() {
        return this.koCounter > 0;
    }

    get isAlert() {
        return !this.isKnockedOut && !this.isAsleep;
    }

    revive() {
        this.health = this.maxHealth;
        this.koCounter = 0;
        this.sleepCounter = 0;
    }

    mend() {
        this.sleepCounter = 0;
        this.poisonCounter = 0;
        this.stunCounter = 0;
        this.enthrallCounter = 0;
    }

    /** Environment Actions **/

    generateEnvironment() {
        for(var direction in this.environment) {
            this.environment[direction] = Mechanics.spawnChance(this);
        }
    }

    /** Attack an NPC or Player **/
    attack(Character) {
        Mechanics.physicalAttack(this, Character);
        console.log("Launched an attack.");
    }

    /** pick up an Item **/
    pickUp(Item) {
        this.inventory.push(Item);
        console.log("Picked up an item.");
    }

    /** access an Accessable Item **/
    access(Accessible) {
        Accessible.open = true;
        console.log("Opened an object.");
    }

    /** consume a Consumable Item **/
    consume(Consumable) {
        for(var e in Consumable.effects) {
            this[e] += Consumable.effects[e];
        }

        console.log("Consumed an item.");
    }

    /** use a Usable Item **/
    use(Usable) {

    }
};