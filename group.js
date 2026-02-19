export class Group
{
    constructor(name, options = {})
    {
        this.#name = name;
        this.#options = options;
    }

    get name()
    {
        return this.#name;
    }

    get active()
    {
        return this.#activeLayer;
    }

    get layers()
    {
        return [...this.#layers];
    }

    set active(layer)
    {
        if (typeof layer === 'string')
        {
            layer = this.#layers.find(l => l.name === layer);
        }

        if (this.#activeLayer == layer)
            return;

        if (this.#isActive)
            this.#activeLayer?.deactivate();

        this.#activeLayer = layer;

        if (this.#isActive)
            this.#activeLayer?.activate();  
    }

    add(layer)
    {
        this.#layers.push(layer);
        return this;
    }

    onActivate()
    {
        if (!this.#activeLayer && this.#layers.length > 0)
            this.#activeLayer = this.#layers[0];

        this.#isActive = true;
        this.#activeLayer?.activate();
    }

    onDeactivate()
    {
        this.#activeLayer?.deactivate();
        this.#isActive = false;
    }

    nextOrPrev(delta, wrap = true)
    {
        if (this.#layers.length === 0)
            return;

        let index = this.#layers.indexOf(this.#activeLayer);
        if (index === -1)
        {
            this.active = this.#layers[0];
            return;
        }

        let newIndex = index + delta;
        if (newIndex < 0)
        {
            if (wrap === false)     
                return;
            newIndex = this.#layers.length - 1;
        }
        else if (newIndex >= this.#layers.length)
        {
            if (wrap === false)
                return;
            newIndex = 0;
        }   

        this.active = this.#layers[newIndex];
    }

    next(wrap)
    { 
        this.nextOrPrev(1, wrap); 
    }

    previous(wrap)
    { 
        this.nextOrPrev(-1, wrap); 
    }

    first()
    {
        if (this.#layers.length === 0)
            return;
        this.active = this.#layers[0];
    }

    last()
    {
        if (this.#layers.length === 0)   
            return;
        this.active = this.#layers[this.#layers.length - 1];    
    }

    #name;
    #options;
    #layers = [];
    #activeLayer = null;
    #isActive = false;
}
