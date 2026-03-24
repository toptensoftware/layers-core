export class Layer
{
    constructor(name, options = {})
    {
        this.#name = name;
        this.#options = options;
    }

    #active = false;
    #name;
    #options;
    #handlers = [];

    get name()
    {
        return this.#name;
    }

    add(...handlers)
    {
        // Add to list
        this.#handlers.push(...handlers);

        // Activate 
        if (this.#active)
        {
            for (let e of handlers)
            {
                e.onActivate?.();
            }
        }

        return this;
    }

    remove(...handlers)
    {
        for (let h of handlers)
        {
            // Find it
            let index = this.#handlers.indexOf(h);
            if (index >= 0)
            {
                // Deactivate 
                if (this.#active)
                    h.onDeactivate?.();

                // Remove
                this.#handlers.splice(index, 1);
            }
        }
    }

    activate()
    {
        if (!this.#active)
            this.onActivate();
    }

    onActivate()
    {
        this.#active = true;
        for (let e of this.#handlers)
        {
            e.onActivate?.();
        }
    }

    deactivate()
    {
        if (this.#active)
            this.onDeactivate();
    }

    onDeactivate()
    {
        this.#active = false;
        for (let e of this.#handlers)
        {
            e.onDeactivate?.();
        }
    }
}
