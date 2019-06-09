'use strict';

var statBase = 1;
var modBase = 100;

module.exports = class Character {
    constructor() {
        this.canAttack = true;

        /** Core Stats **/
        this.health = statBase;
        this.maxHealth = statBase;
        this.mana = statBase;
        this.maxMana = statBase;
        this.strength =  statBase;
        this.dexterity =  statBase;
        this.constitution =  statBase;
        this.magic =  statBase;
        this.intelligence =  statBase;
        this.spirit =  statBase;
        this.luck = statBase;

        /** Magic Affinities **/
        this.fire = statBase;
        this.ice = statBase;
        this.thunder = statBase;
        this.earth = statBase;
        this.water = statBase;
        this.wood = statBase;
        this.metal = statBase;
        this.ether = statBase;
        this.toxin = statBase;
        this.holy = statBase;

        /** Persistent States **/
        this.stunned = false;
        this.poisoned = false;
        this.sleeping = false;
        this.enthralled = false;

        /** Stat Modifiers **/
        this.effects = {
            strength: modBase,
            dexterity: modBase,
            constitution: modBase,
            intelligence: modBase,
            magic: modBase,
            spirit: modBase,
            luck : modBase,
            fire: modBase,
            ice: modBase,
            thunder: modBase,
            earth: modBase,
            water: modBase,
            wood: modBase,
            metal: modBase,
            ether: modBase,
            toxin: modBase,
            holy: modBase
        };
    }

    /** Stat Getters and Setters **/

    get Health() {
        return this.health;
    }

    set Health(quantity) {
        if(this.health + quantity < 0) {
            this.health = 0;
        } else if(this.health + quantity > this.MaxHealth){
            this.health = this.MaxHealth;
        } else {
            this.health += quantity;
        }
    }

    get MaxHealth() {
        return this.maxHealth;
    }

    get Mana() {
        return this.mana;
    }

    set Mana(quantity) {
        if(this.mana + quantity < 0) {
            this.mana = 0;
        } else if(this.mana + quantity > this.MaxMana){
            this.mana = this.MaxMana;
        } else {
            this.mana = this.mana + quantity;
        }
    }

    get MaxMana() {
        return this.maxMana;
    }

    /** Mechanics Getters **/

    get physicalDamage() {
        console.log(this.Strength);
        console.log(this.equipmentDamage);
        return Math.round((this.Strength + this.equipmentDamage));
    };

    get equipmentDamage() {
        return 0;
    }

    get magicDamage() {
        return (Math.round(this.Intelligence/5)+this.Magic);
    }

    get fireDamage() {
        return Math.round(this.magicDamage*(this.Fire/modBase));
    }

    get iceDamage() {
        return Math.round(this.magicDamage*(this.Ice/modBase));
    }

    get thunderDamage() {
        return Math.round(this.magicDamage*(this.Thunder/modBase));
    }

    get earthDamage() {
        return Math.round(this.magicDamage*(this.Earth/modBase));
    }

    get waterDamage() {
        return Math.round(this.magicDamage*(this.Water/modBase));
    }

    get woodDamage() {
        return Math.round(this.magicDamage*(this.Wood/modBase));
    }

    get metalDamage() {
        return Math.round(this.magicDamage*(this.Metal/modBase));
    }

    get etherDamage() {
        return Math.round(this.magicDamage*(this.Ether/modBase));
    }

    get toxinDamage() {
        return Math.round(this.magicDamage*(this.Toxin/modBase));
    }

    get holyDamage() {
        return Math.round(this.magicDamage*(this.Holy/modBase));
    }

    get Strength() {
        console.log(this.name+" "+this.strength +" vs "+(this.strength * (this.effects.strength/modBase)));
        return Math.round(this.strength * (this.effects.strength/modBase));
    }

    get Dexterity() {
        return Math.round(this.dexterity * this.effects.dexterity/modBase);
    }

    get Constitution() {
        return Math.round(this.constitution * this.effects.constitution/modBase);
    }

    get Intelligence() {
        return Math.round(this.intelligence * this.effects.intelligence/modBase);
    }

    get Magic() {
        return Math.round(this.magic * this.effects.magic/modBase);
    }

    get Spirit() {
        return Math.round(this.spirit * this.effects.spirit/modBase);
    }

    get Luck() {
        return Math.round(this.luck * this.effects.luck/modBase);
    }

    /** Elemental Affinity Getters w/Buff/Debuff Mechanics **/
    get Fire() {
        return Math.round((this.fire) * this.effects.fire/modBase);
    }

    set Fire(value) {
        this.setEffect("fire", value);
    }

    get Ice() {
        return Math.round((this.ice) * this.effects.ice/modBase);
    }

    set Ice(value) {
        this.setEffect("ice", value);
    }

    get Thunder() {
        return Math.round((this.thunder) * this.effects.thunder/modBase);
    }

    set Thunder(value) {
        this.setEffect("thunder", value);
    }

    get Earth() {
        return Math.round((this.earth) * this.effects.earth/modBase);
    }

    set Earth(value) {
        this.setEffect("earth", value);
    }

    get Water() {
        return Math.round((this.water) * this.effects.water/modBase);
    }

    set Water(value) {
        this.setEffect("water", value);
    }

    get Wood() {
        return Math.round((this.wood) * this.effects.wood/modBase);
    }

    set Wood(value) {
        this.setEffect("wood", value);
    }

    get Metal() {
        return Math.round((this.metal) * this.effects.metal/modBase);
    }

    set Metal(value) {
        this.setEffect("metal", value);
    }

    get Ether() {
        return Math.round((this.ether) * this.effects.ether/modBase);
    }

    set Ether(value) {
        this.setEffect("ether", value);
    }

    get Toxin() {
        return Math.round((this.toxin) * this.effects.toxin/modBase);
    }

    set Toxin(value) {
        this.setEffect("toxin", value);
    }

    get Holy() {
        return Math.round((this.holy) * this.effects.holy/modBase);
    }

    set Holy(value) {
        this.effects.holy += value;
    }

    setEffect(slot, value) {
        if(this.effects[slot] + value > 200) {
            this.effects[slot] = 200;;
        } else if(this.effects[slot] + value < 0) {
            this.effects[slot] = 0;
        } else {
            this.effects[slot] += value;
        }
    }

    /** Combat Setters **/

    takeDamage(quantity) {
        //console.log(this.name+" takes "+quantity+" damage!");
        if(!this.isDead) {
            if((this.Health - quantity) <= 0) {
                this.Health = -this.Health;
            } else {
                this.Health = -quantity;
            }
        } else {
            console.log("Don't defile the dead...");
        }

        this.sleeping = false;
    }

    takeMagicDamage(quantity) {
        this.takeDamage(quantity - Math.round(quantity * this.magicResist/modBase));
    }

    takeFireDamage(quantity) {
        this.takeMagicDamage(quantity - Math.round(quantity * this.Fire/modBase));
    }

    takeIceDamage(quantity) {
        this.takeMagicDamage(quantity - Math.round(quantity * this.Ice/modBase));
    }

    takeThunderDamage(quantity) {
        this.takeMagicDamage(quantity - Math.round(quantity * this.Thunder/modBase));
    }

    takeEarthDamage(quantity) {
        this.takeMagicDamage(quantity - Math.round(quantity * this.Earth/modBase));
    }

    takeWaterDamage(quantity) {
        this.takeMagicDamage(quantity - Math.round(quantity * this.Water/modBase));
    }

    takeWoodDamage(quantity) {
        this.takeMagicDamage(quantity - Math.round(quantity * this.Wood/modBase));
    }

    takeMetalDamage(quantity) {
        this.takeMagicDamage(quantity - Math.round(quantity * this.Metal/modBase));
    }

    takeEtherDamage(quantity) {
        this.takeMagicDamage(quantity - Math.round(quantity * this.Ether/modBase));
    }

    takeToxinDamage(quantity) {
        this.takeMagicDamage(quantity - Math.round(quantity * this.Toxin/modBase));
    }

    takeHolyDamage(quantity) {
        this.takeMagicDamage(quantity - Math.round(quantity * this.Holy/modBase));
    }

    getModifier(stat) {
        return Math.round(this.effects[stat]/modBase);
    }

    strengthModifier(adjust) {
        this.setModifier("strength", adjust);
    }

    dexterityModifier(adjust) {
        this.setModifier("dexterity", adjust);
    }

    constitutionModifier(adjust) {
        this.setModifier("constitution", adjust);
    }

    intelligenceModifier(adjust) {
        this.setModifier("intelligence", adjust);
    }

    magicModifier(adjust) {
        this.setModifier("magic", adjust);
    }

    spiritModifier(adjust) {
        this.setModifier("spirit", adjust);
    }

    luckModifier(adjust) {
        this.setModifier("luck", adjust);
    }

    setModifier(stat, adjust) {
        if(this.effects[stat] + adjust < 0) {
            this.effects[stat] = 0;
        } else if(this.effects[stat] + adjust > 200) {
            this.effects[stat] = 200;
        } else {
            this.effects[stat] += adjust;
        }

        this.emit("Player.Update.Effects", this.effects);
    }

    /** State Getters **/
    get isDead() {
        return this.Health <= 0;
    }

    get isAlert() {
        return (!this.isDead && !this.sleeping);
    }

    get isSleeping() {
        return this.sleeping;
    }

    get isStunned() {
        return this.stunned;
    }

    set isStunned(value) {
        this.stunned = true;
    }

    /** Restorative Methods **/

    heal(quantity) {
        this.Health = Math.abs(quantity);
        if(this.isSentient) {
            this.emit("Player.Health.Healed", this.Health);
        }
    }

    fullHeal() {
        this.heal(this.MaxHealth);
    }

    healMana(quantity) {
        this.Mana = Math.abs(quantity);
        emit("Player.Updated.Mana", this.Mana);
    }

    fullHealMana() {
        this.healMana(this.MaxMana);
    }

    mend() {
        this.sleeping = false;
        this.poisoned = false;
        this.stunned = false;
        this.enthralled = false
    }

    dispel() {
        for(var e in this.effects) {
            this.effects[e] = 100;
        }
    }

    /** Gambits **/
    /** Average of Dex and Int + Luck weight **/
    get skillChance() {
        return (this.Dexterity + this.Intelligence + this.Luck)/2;
    };

    /** Int + Lck **/
    get mentalChance() {
        return (this.Intelligence + this.Luck);
    }

    /** Average of Dex and Int + Luck Weight **/
    get stealChance() {
        return (this.Dexterity + this.Intelligence + this.Luck)/2
    }

    /** Constitution + Armor Rating **/
    get physicalResist() {
        return this.Constitution;
    }

    /** Spirit + Magic Armor **/
    get magicResist() {
        return this.Spirit;
    }

    /** Utility Methods **/

    emit(event, value) {
        if(this.isSentient) {
            this.socket.emit(event, value);
        }
    }
};