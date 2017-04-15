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

        this.baseStrength =  statBase;
        this.baseDexterity =  statBase;
        this.baseConstitution =  statBase;
        this.baseMagic =  statBase;
        this.baseIntelligence =  statBase;
        this.baseSpirit =  statBase;
        this.baseLuck = 0;

        /** Elemental Affinities **/
        this.baseFire = 2;
        this.baseIce = 2;
        this.baseThunder = 2;
        this.baseEarth = 2;
        this.baseWater = 2;
        this.baseWood = 2;
        this.baseToxin = 2;
        this.baseHoly = 0;

        /** Equipment **/
        this.equipped = {
            head: null,
            neck: null,
            body: null,
            belt: null,
            rightHand: null,
            leftHand: null,
            finger1: null,
            finger2: null,
            feet: null
        };

        /** Accumulated Stats + Modifiers **/
        this.damageModifier = 0;
        this.magicModifier = 0;
        this.armorRating = 0;
        this.magicArmorRating = 0;

        /** Inventory **/
        this.inventory = [];

        /** Gold **/
        this.gold = 50;

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
            Race: this.Race,
            Class: this.Class,
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
        this.baseStrength++;
        this.baseDexterity++;
        this.baseConstitution++;
        this.baseIntelligence++;
        this.baseMagic++;
        this.baseSpirit++;

        if((Math.random()*10) > 8) {
            this.baseLuck++;
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
    }



    /** Equipment Functions **/
    reCalculateStats() {
        this.calculateDamageModifier();
        this.calculateMagicModifier();
        this.calculateArmorRating();
        this.calculateMagicArmorRating();
    };

    /** Stat Calculations **/

    get strength() {
        return this.baseStrength + this.Class.statMods.str + this.Race.statMods.str;
    }

    get dexterity() {
        return this.baseDexterity + this.Class.statMods.dex + this.Race.statMods.dex;
    }

    get constitution() {
        return this.baseConstitution + this.Class.statMods.con + this.Race.statMods.con;
    }

    get intelligence() {
        return this.baseIntelligence + this.Class.statMods.int + this.Race.statMods.int;
    }

    get magic() {
        return this.baseMagic + this.Class.statMods.mag + this.Race.statMods.mag;
    }

    get spirit() {
        return this.baseSpirit + this.Class.statMods.spr + this.Race.statMods.spr;
    }

    get luck() {
        return this.baseLuck + this.Class.statMods.lck + this.Race.statMods.lck;
    }

    get fire() {
        return this.baseFire + this.Race.elemMods.fire;
    }

    get ice() {
        return this.baseIce + this.Race.elemMods.ice;
    }

    get thunder() {
        return this.baseThunder + this.Race.elemMods.thunder;
    }

    get earth() {
        return this.baseEarth + this.Race.elemMods.earth;
    }

    get water() {
        return this.baseWater + this.Race.elemMods.water;
    }

    get wood() {
        return this.baseWood + this.Race.elemMods.wood;
    }

    get toxin() {
        return this.baseToxin + this.Race.elemMods.toxin;
    }

    get holy() {
        return this.baseHoly + this.Race.elemMods.holy;
    }

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

    loadFromJSON(json, Race, Class) {
        for(var p in json) {
            this[p] = json[p];
        }
    }
};