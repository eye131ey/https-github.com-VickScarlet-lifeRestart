import { clone } from './functions/util.js';

class Property {
    constructor(initialData={}) {
        this.initial(initialData);
    }

    TYPES = {
        AGE: "AGE",
        CHR: "CHR",
        INT: "INT",
        STR: "STR",
        MNY: "MNY",
        SPR: "SPR",
        LIF: "LIF",
        TLT: "TLT",
        EVT: "EVT",
    };

    initial({age}) {

        this.#ageData = age;
        for(const age in a)
            a[age].event = a[age].event?.map(v=>{
                const value = v.split('*').map(n=>Number(n));
                if(value.length==1) value.push(1);
                return value;
            });
    }

    restart(data) {
        this.#data = {
            [this.TYPES.AGE]: -1,
            [this.TYPES.CHR]: 0,
            [this.TYPES.INT]: 0,
            [this.TYPES.STR]: 0,
            [this.TYPES.MNY]: 0,
            [this.TYPES.SPR]: 0,
            [this.TYPES.LIF]: 1,
            [this.TYPES.TLT]: [],
            [this.TYPES.EVT]: [],
        };
        for(const key in data)
            this.change(key, value);
    }

    get(prop) {
        switch(prop) {
            case this.TYPES.AGE:
            case this.TYPES.CHR:
            case this.TYPES.INT:
            case this.TYPES.STR:
            case this.TYPES.MNY:
            case this.TYPES.SPR:
            case this.TYPES.LIF:
            case this.TYPES.TLT:
            case this.TYPES.EVT:
                return clone(this.#data[prop]);
            default: return 0;
        }
    }

    set(prop, value) {
        switch(prop) {
            case this.TYPES.AGE:
            case this.TYPES.CHR:
            case this.TYPES.INT:
            case this.TYPES.STR:
            case this.TYPES.MNY:
            case this.TYPES.SPR:
            case this.TYPES.LIF:
            case this.TYPES.TLT:
            case this.TYPES.EVT:
                this.#data[prop] = clone(value);
                break;
            default: return 0;
        }
    }

    change(prop, value) {
        if(Array.isArray(value)) {
            for(const v of value)
                this.change(prop, v);
            return;
        }
        switch(prop) {
            case this.TYPES.AGE:
            case this.TYPES.CHR:
            case this.TYPES.INT:
            case this.TYPES.STR:
            case this.TYPES.MNY:
            case this.TYPES.SPR:
            case this.TYPES.LIF:
                this.#data[prop] += Number(value);
                break;
            case this.TYPES.TLT:
            case this.TYPES.EVT:
                const v = this.#data[prop];
                if(value<0) {
                    const index = v.indexOf(value);
                    if(index!=-1) v.splice(index,1);
                }
                if(!v.includes(value)) v.push(value);
                break;
            default: return;
        }
    }

    effect(effects) {
        for(const prop in effects)
            this.change(prop, Number(effects[prop]));
    }

    isEnd() {
        return !this.get(this.TYPES.LIF);
    }

    ageNext() {
        this.change(this.TYPES.AGE, 1);
        const age = this.get(this.TYPES.AGE);
        const {event, talent} = this.getAge(age);
        return {age, event, talent};
    }

    getAgeData(age) {
        return clone(this.#ageData[age]);
    }

}

export default Property;