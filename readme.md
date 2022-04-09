# Data

## Types

- Component
  - Some data associated with an entity
  
- Entity
  - An ID representing a set of components
  
- System
  - Handles the logic of components and entities
  
- Registry
  - Handles all isntances of entities and components
  
- Utility
  - A global object that all systems can use singleton pattern

## Creating a component

A component is quite simmple, at it's core it's just data.

```ts
const Example = new Component ( 
// The name of the new component 
"Example",

// The instantiation function
(arg:string) => { 
  return { 
    data : arg 
  };
});
```

## Creating a system

Systems are a bit more complex, they handle the updating of components.

A system defines as it's first argument, the required components of all entities it will affect.

In this case, our movement system will act on all entities that have both a `Velocity` and a `Position`

A system's logic consists of three functions

| Name   | Arguments                           | Description                                                                                                        |
| ------ | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| update | `(delta:number, entities:Object[])` | Called each frame, for this reason it's very performance critical                                                  |
| bind   | `entity:Object`                     | Called when an entity becomes part of the system used to initalize any persistant state associated with the entity |
| unbind | `entity:Object`                     | Called when an entity leaves the system, used to clean up any remaining state associated with the entity           |

```ts
const Movement = new System({Velocity, Position},  
  (delta:number, entities:Entity[]) => {
    // Iterate over entities
  }
)
```

## Creating a Registry

The registry handles all systems, entities, components, and utilities

A registry instance should be treated as a singleton

Since everything is compositional, the registry constructor takes no arguments

```ts
let registry = new Registry();
```

The registry on it's own does nothing, to add functionality we must add Systems, Components, and Entities to it.

```ts

let registry = new Registry();

registry.registerComponent(Position);
registry.registerSystem(Movement);
```

