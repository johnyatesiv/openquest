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
        this.Effects = {
            Strength: modBase,
            Dexterity: modBase,
            Constitution: modBase,
            Intelligence: modBase,
            Magic: modBase,
            Spirit: modBase,
            Luck : modBase,
            Fire: modBase,
            Ice: modBase,
            Thunder: modBase,
            Earth: modBase,
            Water: modBase,
            Wood: modBase,
            Metal: modBase,
            Ether: modBase,
            Toxin: modBase,
            Holy: modBase
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
            this.health = this.health + quantity;
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
        return Math.round(this.strength * (this.Effects.Strength/modBase));
    }

    get Dexterity() {
        return Math.round(this.dexterity * this.Effects.Dexterity/modBase);
    }

    get Constitution() {
        return Math.round(this.constitution * this.Effects.Constitution/modBase);
    }

    get Intelligence() {
        return Math.round(this.intelligence * this.Effects.Intelligence/modBase);
    }

    get Magic() {
        return Math.round(this.magic * this.Effects.Magic/modBase);
    }

    get Spirit() {
        return Math.round(this.spirit * this.Effects.Spirit/modBase);
    }

    get Luck() {
        return Math.round(this.luck * this.Effects.Luck/modBase);
    }

    /** Elemental Affinity Getters w/Buff/Debuff Mechanics **/
    get Fire() {
        return Math.round((this.fire) * this.Effects.Fire/modBase);
    }

    get Ice() {
        return Math.round((this.ice) * this.Effects.Ice/modBase);
    }

    get Thunder() {
        return Math.round((this.thunder) * this.Effects.Thunder/modBase);
    }

    get Earth() {
        return Math.round((this.earth) * this.Effects.Earth/modBase);
    }

    get Water() {
        return Math.round((this.water) * this.Effects.Water/modBase);
    }

    get Wood() {
        return Math.round((this.wood) * this.Effects.Wood/modBase);
    }

    get Metal() {
        return Math.round((this.metal) * this.Effects.Metal/modBase);
    }

    get Ether() {
        return Math.round((this.ether) * this.Effects.Ether/modBase);
    }

    get Toxin() {
        return Math.round((this.toxin) * this.Effects.Toxin/modBase);
    }

    get Holy() {
        return Math.round((this.holy) * this.Effects.Holy/modBase);
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
        return Math.round(this.Effects[stat]/modBase);
    }

    set StrengthModifier(adjust) {
        this.setModifier("Strength", adjust);
    }

    set MagicModifier(adjust) {
        this.setModifier("Magic", adjust);
    }

    set ConstitutionModifier(adjust) {
        this.setModifier("Constitution", adjust);
    }

    setModifier(stat, adjust) {
        if(this.Effects[stat] + adjust < 0) {
            this.Effects[stat] = 0;
        } else {
            this.Effects[stat] += adjust;
        }

        emit("Player.Update."+stat, this[stat])
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
        for(var e in this.Effects) {
            this.Effects[e] = 100;
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