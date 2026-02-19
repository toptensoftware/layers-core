# layers-core

"Layers" is a simple NodeJS library for building layer-based control surfaces.

* layers on a macro-pad
* layers (aka pages) on a StreamDeck
* layers on a MIDI control surface

## Installation

```
npm install --save toptensoftware/layers-core
```

## Usage

### Layers

A layer is a simple object that maintains a set of control bindings:

```js
import { Layer } from "@toptensoftware/layers-core";
import { key } from "@toptensoftware/layers-keyboard";

// Create layer and add handlers
let myLayer = new Layer();
    .add(key({
        key: "F13"
        press: () => console.log("F13 pressed")
    }))
    .add(key({
        key: "F14"
        press: () => console.log("F14 pressed")
    }))

// Activate the layer
myLayer.activate();
```

The bindings added to a layer can be any object that implements the methods `onActivate()` and
`onDeactivate`.

When activated a binding object  should connect itself to the underlying hardware system
and when deactivated it should disconnect itself. For example, the key bindings in the above example 
install a hook when activated and remove the hook when deactivated.

This core library doesn't provide any binding objects, see these associated projects:

* [`layers-keyboard`](https://github.com/toptensoftware/layers-keyboard) - Windows key bindings
* [`layers-rmp`](https://github.com/toptensoftware/layers-rmp) - Raw macropad support
* [`layers-streamdeck`](https://github.com/toptensoftware/layers-streamdeck) - StreamDeck support
* `layers-midi` - coming soon

By default a layer is deactivated and must be explicitly activated for it's contained bindings
work.

A layer can be configured to run code when it is activated by adding an object with the appropriate
methods.  This can be used to update associated display panels, led colors etc...

```js
let myLayer = new Layer();
    .add(/* binding 1 */)
    .add(/* binding 2 */)
    .add({
        onActivate()
        {
            // This layer has been activated
        },
        onDeactivate()
        {
            // This layer has been deactivated
        }
    })
```

### Groups

A group is a set of layers, of which only one can be active at a time.

eg: suppose you had two layers:

```js
let transportLayer = new Layer("transport").add(...);
let setListLayer = new Layer("setlist").add(...);

transportLayer.activate();
```

you could manually switch between them:

```js
transportLayer.deactivate();
setListLayer.activate();
```

Or, you could use a group to manage the activation:

```js
import { Group } from "@toptensoftware/layers-core";

// Create a layer group
let group = new Group();
group.add(transportLayer);
group.add(setListLayer);

// Switch by passing the layer object directly
group.active = transportLayer;

// Switch by name
group.active = "transport";         // Uses the name passed to `new Layer()` above

// Switch by navigation
group.next();
group.previous();
group.first();
group.last();

// Get the currently active layer
console.log("Active group:", group.active.name);
```

Groups can be added to a parent layer:

```js
let rootLayer = new Layer();
rootLayer.add(group);
```

A group in a layer will recursively activate/deactivate its currently active child layer when the
group's parent layer is activated/deactivated.



## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
