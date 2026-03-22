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
        this.#handlers.push(...handlers);
        return this;
    }

    activate()
    {
        if (this.#active)
            return;
        this.#active = true;

        for (let e of this.#handlers)
        {
            e.onActivate?.();
        }
    }

    deactivate()
    {
        if (!this.#active)
            return;
        this.#active = false;

        for (let e of this.#handlers)
        {
            e.onDeactivate?.();
        }
    }
}
