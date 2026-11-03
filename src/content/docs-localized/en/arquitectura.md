---
title: Engine architecture
description: Follow the main loop, EngineContext, object ownership, and the relationships between systems.
order: 4
category: Engine core
---

<span id="de-la-entrada-al-frame" aria-hidden="true"></span>

## From input to frame

`main()` constructs an `Engine` and repeats three operations while the window remains open. This excerpt comes from the reference code:

```cpp
while (engine.IsRunning()) {
  engine.ProcessEvent();
  engine.Update();

  if (!engine.HasFocus()) {
    sf::sleep(sf::milliseconds(10));
    continue;
  }

  engine.Render();
}
```

Without focus, the loop continues processing events and updating the clock; it skips rendering and sleeps for 10 ms. `Engine::Update` also checks focus before advancing the scene.

<span id="responsabilidades-de-engine" aria-hidden="true"></span>

## Engine responsibilities

`Engine` owns the window, an `EngineContext`, the scene registry, the reference to the active scene, and a pause overlay. Its role is to coordinate these elements.

```text
Engine
├── sf::RenderWindow
├── EngineContext
│   ├── renderer · resources · particles
│   ├── animations · collisions
│   ├── input · cursor · gui
│   ├── audio · time · random
│   └── scenes · save · screenshot · clipboard
├── SceneFactory::Scenes
│   └── name → unique_ptr<Scene>
├── currentScene → active Scene
└── Overlay → TGUI widgets
```

The context is passed by reference to each scene. A game can therefore access `ctx.renderer`, `ctx.input`, or `ctx.resources` without constructing duplicate services.

<span id="procesamiento-de-eventos" aria-hidden="true"></span>

## Event processing

At the start of `ProcessEvent`, the engine consumes any pending scene change. It then retrieves events from `sf::RenderWindow` and distributes them:

1. `EngineVisitor` handles closing, focus, resizing, controllers, and global shortcuts.
2. `GuiManager` sends the event to TGUI.
3. The scene receives `OnEvent` when the overlay is hidden.
4. The engine processes any overlay selection and synchronizes the pause state.

The GUI and scene participate in the same processing flow; there is no separate documented event bus.

<span id="actualización-y-tiempo" aria-hidden="true"></span>

## Updates and time

`TimeManager` calculates the time elapsed since the previous frame and caps it at `gConfig.maximumDeltaTime`. The cursor is then updated, and `Scene::Update` is called if the overlay is hidden.

The system does not implement a fixed-step accumulator. Games decide how to use delta time and their own timers.

`TimeManager` separates real and game time. Engine pauses the game clock with the scene; a bound `Cooldown` uses that clock by default. A standalone cooldown keeps its real-time clock.

A bound cooldown uses game time by default:

```cpp
auto cooldown = ctx.time.CreateCooldown(1.f, TimeDomain::Game);
```

<span id="renderizado-y-capas" aria-hidden="true"></span>

## Rendering and layers

The scene draws onto an `sf::RenderTexture`. RenderManager applies the effect chain and returns the final texture. Engine presents it in the window, then draws the GUI and cursor on top.

```text
Scene::Render
     ↓
RenderManager / RenderTexture
     ↓
Bloom → Monitor
     ↓
Window → GUI → Cursor → display
```

Effects are only added when `sf::Shader::isAvailable()` returns true. The GUI and cursor are drawn after post-processing. See [Rendering](/en/docs/renderizado/) to follow the Bloom passes.

<span id="propiedad-y-memoria" aria-hidden="true"></span>

## Ownership and memory

- Scenes are stored in an `unordered_map` of `unique_ptr<Scene>`.
- Effects are stored in a vector of `unique_ptr<Effect>`.
- The active scene is a non-owning pointer; its object still belongs to the registry.
- Managers are members of `EngineContext` by value.
- ResourceManager stores textures and fonts by value and shares sound buffers using `shared_ptr`.

The project uses RAII and standard containers. There is no custom memory manager or generic ECS. All registered scenes are constructed in `CreateScenes`; changing scenes does not construct a new instance on every transition.

<span id="organización-del-código" aria-hidden="true"></span>

## Code organization

| Directory | Contents |
| --- | --- |
| `Engine/Include` | Core contracts and types, managers, scenes, effects, and utilities. |
| `Engine/Source` | Implementations and entry point. |
| `Games/Include` | Game classes, types, and configuration constants. |
| `Games/Source` | Game logic and rendering. |
| `Content` | Graphics and audio assets, fonts, shaders, theme, and JSON. |

<span id="fuentes" aria-hidden="true"></span>

## Sources

- [Main loop](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Main.cpp).
- [Engine coordination](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Core/Engine.cpp).
- [EngineContext definition](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Include/Core/EngineContext.h).
- [Scene ownership](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Include/Scene/SceneFactory.h).
