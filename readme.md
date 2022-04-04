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

| Entity     | type          | desc                 |
| ---------- | ------------- | -------------------- |
| entityID   | `number`      | Globally unique      |
| components | `set<number>` | Set of component IDs |

| Component   | type     | desc                                                                                           |
| ----------- | -------- | ---------------------------------------------------------------------------------------------- |
| entityID    | `number` | The id of the entity associated                                                                |
| componentID | `number` | The the unique ID associated with the component (Shared among all components of the same type) |
