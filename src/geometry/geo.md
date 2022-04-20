# Geometry  Considerations

## Data format

Having a format for geometry that is reasonable in size, and cheap to render is important

```ts
interface IBufferGeometry {
  vertexBuffer: Vec2[] // A point in 2D space
  indexBuffer: Vec3[] // The indexes of a set of points that form a triangle
}
```

## Goals of final marched geometry

- Reuse connected verts
- Reduce triangles to a reasonable minimum

## Inputs to geometry generation function:

```ts
resolution:number, // Output will be of res+1 on each axis
size:number, // The width/height the geometry represents in absolute units
px:number, // X Position of top corner
py:number, // Y Position of top corner
iso:number, // Isovalue Threshold 
```

## Steps to produce such geometry

1. Generate weight map
   1. Try not to repeatedly query the same location since noise is expensive (potential 4x speedup)
2. Using the weight map, create a geometry and insert positions into the vertex buffer based on these weights
3. Using weight map, determine the case of each cell.
4. Using the case, add to the index buffer.
   1. This results in a single geometry without needing to combine and duplicate memory
