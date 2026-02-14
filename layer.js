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

    add(handler, ...args)
    {
        this.#handlers.push({ handler, args });
        return this;
    }

    activate()
    {
        if (this.#active)
            return;
        this.#active = true;

        for (let e of this.#handlers)
        {
            e.handler.onActivate?.(...e.args);
        }
    }

    deactivate()
    {
        if (!this.#active)
            return;
        this.#active = false;

        for (let e of this.#handlers)
        {
            e.handler.onDeactivate?.(...e.args);
        }
    }
}
