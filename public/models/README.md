# Custom 3D Assets Directory

Drop your 3D models and video assets here when ready:

- `watch.glb` or `watch.gltf`: Your custom photorealistic 3D timepiece model.
- If you drop `watch.glb` into this folder, `WatchCanvas.tsx` can load it via Three.js `GLTFLoader`.
- By default, `src/components/three/createWatchScene.ts` generates a procedural high-precision mechanical watch with physical sapphire crystal, 12 hour indices, chronograph subdials, oscillating escapement wheel, rotating gear trains, ruby bearings, and an exhibition caseback rotor.
