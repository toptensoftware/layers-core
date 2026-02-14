import { EventEmitter } from 'events';

class Value extends EventEmitter
{
    constructor(options)
    {
        super();
        this.options = options || {};
    }

    fireChange()
    {
        // Fire event
        this.emit("change", this.value);
        this.options.onChange?.(this.value);  
    }

    onActivate(callback)
    {
        callback(this.value);
        this.on('change', callback);
    }

    onDeactivate(callback)
    {           
        this.off('change', callback);
        callback(null);
    }
}

export class NumericValue extends Value
{
    constructor(options)
    {
        super(options);

        if (this.options.initial !== undefined)
            this.#value = this.options.initial;
    }
    
    #value = 0;

    get value()
    {
        return this.#value;
    }

    set value(v)
    {
        // Check range
        if (this.options.min !== undefined && v < this.options.min)
            v = this.options.min;
        if (this.options.max !== undefined && v > this.options.max)
            v = this.options.max;  

        // Check redundant
        if (this.#value == v)
            return;

        // Store value
        this.#value = v;

        // Fire change notification
        this.fireChange();
    }

    adjust(delta) { this.value = this.#value + delta; }
}


export class BooleanValue extends Value
{
    constructor(options)
    {
        super(options);

        if (this.options.initial !== undefined)
            this.#value = this.options.initial;
    }
    
    #value = false;

    get value()
    {
        return this.#value;
    }

    set value(v)
    {
        // Check redundant
        if (this.#value == v)
            return;

        // Store value
        this.#value = v;

        // Fire change notification
        this.fireChange();
    }

    toggle() { this.value = !this.#value; }
}


export class EnumeratedValue extends Value
{
    constructor(members, options)
    {
        super(options);

        this.members = members;

        if (this.options.initial !== undefined)
            this.value = this.options.initial;
    }
    
    #index = 0;

    get value()
    {
        if (this.#index === -1)
            return null;    
        return this.members[this.#index];
    }

    set value(v)
    {
        // Look up index
        this.index = this.members.indexOf(v);
    }

    get index()
    {
        return this.#index;
    }

    set index(value)
    {
        if (this.#index == value)
            return;
        this.#index = value;
        this.fireChange();
    }

    get normalizedValue()
    {
        if (this.#index === -1)
            return 0;
        return this.#index / (this.members.length - 1);
    }
    set normalizedValue(v)
    {
        let index = Math.round(v * (this.members.length - 1));
        this.index = index;
    }   

    adjust(delta)
    {
        let index = this.#index;
        if (index === -1)
            index = 0;

        let newIndex = index + delta;
        if (newIndex < 0)
        {
            if (this.options.wrap === false)     
                return;
            newIndex = this.members.length - 1;
        }
        else if (newIndex >= this.members.length)
        {
            if (this.options.wrap === false)
                return;
            newIndex = 0;
        }   

        this.index = newIndex;
    }

    next() { this.adjust(1); }

    prev() { this.adjust(-1); }

    first() { this.index = 0; } 

    last() { this.index = this.members.length - 1; }
}

export class GainValue extends Value
{
    constructor(options)
    {
        super(options);         
        if (this.options.initial !== undefined)
            this.#scalar = GainValue.dBToGain(this.options.initial);
        this.minScalar = GainValue.dBToGain(this.options.min ?? -60);
        this.maxScalar = GainValue.dBToGain(this.options.max ?? 12);
    }
    
    #scalar = 1.0;

    get value()
    {
        return GainValue.gainToDb(this.#scalar);
    }

    set value(v)
    {
        this.scalar = GainValue.dBToGain(v);
    }

    get scalar()
    {
        return this.#scalar;
    }   

    set scalar(v)
    {
        if (v > this.maxScalar)
            v = this.maxScalar
        if (v < this.minScalar)
            v = 0;

        if (this.#scalar == v)
            return;

        this.#scalar = v;
        this.fireChange();
    }   

    get displayValue()
    {
        if (this.#scalar < this.minScalar)
            return "-∞";
        return GainValue.gainToDb(this.#scalar).toFixed(2) + " dB";
    }

    adjust(delta)
    {
        if (this.#scalar < this.minScalar && delta > 0)
        {
            this.scalar = this.minScalar;
            return;
        }

        this.value += delta * (this.options.stepSize ?? 1);
    }

    static dBToGain(db)
    {
        return Math.pow(10, db / 20);
    }
    static gainToDb(gain)
    {
        return 20 * Math.log10(gain);
    }

}   
