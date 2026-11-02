---
title: Scenes and lifecycle
description: The Scene contract, game registration, deferred transitions, and state cleanup.
order: 7
category: Engine core
---

<span id="el-contrato-de-una-escena" aria-hidden="true"></span>

## The scene contract

A scene receives `EngineContext` by reference and defines how it starts, updates, and draws. This contract exists in the reference revision:

```cpp
class Scene {
protected:
  EngineContext &ctx;

public:
  Scene(EngineContext &context) : ctx(context) {}
  virtual ~Scene() = default;

  virtual void Start() = 0;
  virtual void Update() = 0;
  virtual void Render() const = 0;

  virtual void OnEvent(const sf::Event &) {};
  virtual void OnPause(bool /* pausa */) {};
  virtual void OnCleanup() {};
};
```

`Start`, `Update`, and `Render` are required. The other callbacks have empty implementations and are specialized when the game needs them.

<span id="responsabilidades-por-etapa" aria-hidden="true"></span>

## Responsibilities by stage

| Stage | When it happens | Use within the game |
| --- | --- | --- |
| Constructor | When creating the initial scene registry. | Prepare the instance's objects and resources. |
| `Start` | When activating or restarting the scene. | Reset the game and register its controls. |
| `OnEvent` | When receiving events while the overlay is hidden. | Handle discrete game events. |
| `Update` | Every frame, with focus and no visible overlay. | Advance logic, movement, and state. |
| `Render` | When drawing the active scene's frame. | Submit objects to `ctx.renderer`. |
| `OnPause` | When the pause state changes. | Pause or resume the elements controlled by the scene. |
| `OnCleanup` | Before leaving or restarting the scene. | Stop audio and clean up state that must not carry over. |

The constructor and `Start` are not equivalent. Instances remain in the registry and may receive `Start` multiple times.

<span id="registro-de-juegos" aria-hidden="true"></span>

## Game registration

`SceneFactory::Scenes` is an `unordered_map` that associates names with `unique_ptr<Scene>`. The factory registers seven instances:

```cpp
scenes.emplace("Bounce", std::make_unique<Bounce::Game>(context));
scenes.emplace("Clicker", std::make_unique<Clicker::Game>(context));
scenes.emplace("MemoryCard", std::make_unique<MemoryCard::Game>(context));
scenes.emplace("TicTacToe", std::make_unique<TicTacToe::Game>(context));
scenes.emplace("MineSweeper", std::make_unique<MineSweeper::Game>(context));
scenes.emplace("Runner", std::make_unique<Runner::Game>(context));
scenes.emplace("Tetris", std::make_unique<Tetris::Game>(context));
```

The documented revision requests Tetris in the Engine constructor. Names are exact registry keys; no recovery path is implemented for an unknown scene.

<span id="transición-diferida" aria-hidden="true"></span>

## Deferred transitions

`SceneManager::ChangeScene` stores the requested name if no other change is pending. Engine consumes that request at the start of the next event-processing pass.

```text
ChangeScene(name)
     ↓
Pending request
     ↓
Next ProcessEvent
     ↓
OnCleanup of the previous scene
     ↓
Clear particles and input bindings
     ↓
Switch the active pointer
     ↓
Start of the requested scene
     ↓
Synchronize pause state
```

`RestartCurrentScene` uses the same mechanism with the current name. It does not destroy and reconstruct the object, which is why repeated calls to `Start` must leave the game in a valid state.

<span id="explorar-una-implementación-real" aria-hidden="true"></span>

## Explore a real implementation

[Bounce](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Games/Source/Bounce.cpp) shows how a game class receives the context, prepares its paddle and statistics, requests sound and music, and uses scene callbacks.

To add a scene in your own copy, follow the existing separation: declaration in `Games/Include`, implementation in `Games/Source`, and explicit registration in `SceneFactory.cpp`. CMake discovers `.cpp` files in these folders with `GLOB_RECURSE CONFIGURE_DEPENDS`; there is no scene plugin loaded at runtime.

<span id="limitación-del-acceso-al-menú" aria-hidden="true"></span>

## Menu access limitation

The overlay includes a **Menu** button, and the **M** shortcut uses the same flow. Engine requests a scene named `Menu`, but this revision's factory does not register it. Avoid this action while exploring this version: it may trigger an assertion or a missing-key exception.

This documentation explicitly preserves that limitation; it does not present the menu as an available game selector.

<span id="fuentes" aria-hidden="true"></span>

## Sources

- [Scene contract](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Include/Scene/Scene.h).
- [SceneFactory registry](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Scene/SceneFactory.cpp).
- [SceneManager requests](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/SceneManager.cpp).
- [Engine transitions](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Core/Engine.cpp).
