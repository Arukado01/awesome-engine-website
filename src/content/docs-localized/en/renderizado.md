---
title: Rendering and effects
description: How a 2D scene is drawn, Bloom and Monitor are applied, and views and particles are controlled.
order: 5
category: Systems
---

<span id="una-escena-una-textura-intermedia" aria-hidden="true"></span>

## One scene, one intermediate texture

`RenderManager` draws the scene’s SFML objects to `target_` via `Draw(const sf::Drawable&)`. The texture follows the window size.

At the start of a frame, `BeginDrawing` clears the target and draws the background. `FinishDrawing` publishes the texture, applies effects, and returns the texture that Engine presents in the window. Scenes do not need to manage the window directly.

<span id="cadena-de-posprocesado" aria-hidden="true"></span>

## Post-processing chain

This is the effect selection in the reference code:

```cpp
// Post Process Effects
 effects_.emplace_back(std::make_unique<EffectBloom>());
 effects_.emplace_back(std::make_unique<EffectMonitor>());
 // effects_.emplace_back(std::make_unique<EffectGlitch>());
```

Bloom and Monitor are only added if shaders are available. To apply multiple effects, `FinishDrawing` alternates between two targets: the output of one pass becomes the input of the next.

| Effect | Status | Purpose |
| --- | --- | --- |
| Bloom | Implemented and active | Blurs the image at half resolution and adds the result to the original image. |
| Monitor | Implemented and active | Applies the monitor shader, with resolution and time as parameters. |
| Glitch | Experimental; disabled | Its class and shader exist, but its addition to the pipeline is commented out. |
| Inversion | Experimental; not connected | Its class and shader exist; RenderManager does not add it to the chain. |

The experimental label describes the current integration. It does not imply a planned activation date.

<span id="las-cuatro-etapas-de-bloom" aria-hidden="true"></span>

## The four stages of Bloom

```text
Scene image
       ↓
1. Downsample → texture A, half width and height
       ↓
2. Blur (vertical) → texture B
       ↓
3. Blur (horizontal) → texture A
       ↓
4. Additive composition: original + texture A
```

`EffectBloom` loads `Default.vert`, `Downsample.frag`, `Blur.frag`, and `Additive.frag` from `Content/Shaders`. Intermediate textures are sized when the effect is constructed.

This organization lets us describe the existing passes; there are no published measurements that support a percentage performance improvement.

<span id="vistas-y-coordenadas" aria-hidden="true"></span>

## Views and coordinates

The manager exposes two simple operations:

```cpp
void RenderManager::SetView(const sf::View &view) {
  target_.setView(view);
}

void RenderManager::ResetView() {
  SetView(target_.getDefaultView());
}
```

These provide access to SFML 2D views. There is no `CameraManager`, 3D camera, or automatic tracking system. `CursorManager` can return the cursor position converted to an `sf::View`.

`RenderManager::Resize` fits the main scene and post-processing textures to the actual window size. `GetFitView` centers the game area without stretching it. The background fills the remaining space, and the interface and cursor use the same content view.

<span id="partículas" aria-hidden="true"></span>

## Particles

`ParticleManager` maintains particles with position, velocity, acceleration, lifetime, size, and color. `Update` advances their movement and removes expired particles; `Render` draws squares that fade over time.

The default limit is **128 particles**. The vector reserves that capacity, and `Emit` discards new particles when there is no space or the lifetime is invalid. This limit is an implementation setting, not a measurement of the engine's maximum capacity.

The scene decides when to update and render particles. Engine clears them when changing scenes. Runner uses this system for movement dust.

`EmitBurst` creates particles using `ParticleEmitterConfig` and `RandomManager`. It validates ranges and limits creation to available capacity.

<span id="animación-y-colisiones" aria-hidden="true"></span>

## Animation and collisions

`SpriteAnimator` advances looping or one-shot clips, reports crossed frames, and calculates sprite-sheet rectangles. `AnimationManager` manages handles, groups, and pauses; Runner obtains an animator and advances its running clip directly.

`CollisionManager` exposes `Intersect` and `Sweep` for axis-aligned boxes. Sweeps return contact time, normal, and whether overlap existed initially; Runner and Bounce use them for selected collisions. This is not a general physics engine.

Create and configure the animator once; retain the group and advance it on each update:

```cpp
const AnimationGroup group = 1;
const AnimationHandle handle = ctx.animations.Create(group);
ctx.animations.Configure(handle, {0, 6, 12.f}, SpritePlaybackMode::Loop);
ctx.animations.AdvanceGroup(group, ctx.time.GetDeltaTime());
```

<span id="fuentes" aria-hidden="true"></span>

## Sources

- [RenderManager pipeline](https://github.com/Arukado01/AwesomeEngine/blob/61a3244690f7763d41a8f0ba6f0f2ac3deb53ee2/Engine/Source/Managers/RenderManager.cpp).
- [Bloom implementation](https://github.com/Arukado01/AwesomeEngine/blob/61a3244690f7763d41a8f0ba6f0f2ac3deb53ee2/Engine/Source/Graphics/Effects/EfflectBloom.cpp).
- [Monitor shader](https://github.com/Arukado01/AwesomeEngine/blob/61a3244690f7763d41a8f0ba6f0f2ac3deb53ee2/Content/Shaders/Monitor.frag).
- [Particles](https://github.com/Arukado01/AwesomeEngine/blob/61a3244690f7763d41a8f0ba6f0f2ac3deb53ee2/Engine/Source/Managers/ParticleManager.cpp).

- [AnimationManager](https://github.com/Arukado01/AwesomeEngine/blob/61a3244690f7763d41a8f0ba6f0f2ac3deb53ee2/Engine/Include/Managers/AnimationManager.h).
- [SpriteAnimator](https://github.com/Arukado01/AwesomeEngine/blob/61a3244690f7763d41a8f0ba6f0f2ac3deb53ee2/Engine/Include/Graphics/SpriteAnimator/SpriteAnimator.h).
- [CollisionManager](https://github.com/Arukado01/AwesomeEngine/blob/61a3244690f7763d41a8f0ba6f0f2ac3deb53ee2/Engine/Include/Managers/CollisionManager.h).
