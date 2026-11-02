---
title: Input, audio, and interface
description: Action bindings, controllers, global shortcuts, audio playback, and TGUI widgets.
order: 8
category: Systems
---

<span id="una-acción-varias-entradas" aria-hidden="true"></span>

## One action, multiple inputs

InputManager uses integer action identifiers and an `unordered_multimap` of bindings. An action can be associated with more than one input. `Pressed(action)` returns true when any of its bindings is pressed.

The binding types in the reference revision are:

```cpp
struct Keyboard {
  sf::Keyboard::Scan key;
};
struct Mouse {
  sf::Mouse::Button button;
};
struct Gamepad {
  GamepadButton button;
  int id = 0;
};
struct Axis {
  sf::Joystick::Axis axis;
  float threshold = 0.5f;
  int id = 0;
};

using Binding = std::variant<Keyboard, Mouse, Gamepad, Axis>;
```

These types belong to the `Input` namespace. This queries the current state, rather than automatically detecting the instant a button was pressed. Scenes also have `OnEvent` for discrete events.

Axes are normalized by dividing their value by 100, then compared with the configured positive or negative threshold. Engine clears bindings when changing scenes; each game must set up its own again when starting.

<span id="mandos-y-cursor" aria-hidden="true"></span>

## Controllers and cursor

The code contains logical button tables for Xbox and PlayStation. It selects the Xbox table when it identifies Microsoft's vendor ID, and uses the PlayStation table in all other cases. This heuristic does not guarantee the same mapping for every controller.

The L2/R2 triggers have no button in the Xbox table: their input is listed as unavailable in that button mapping. Axes are a separate binding type.

CursorManager can move the cursor with the stick while respecting `joystickDeadzone`. It also converts the mouse position into a view's coordinates. GuiManager turns the logical South button into click events for widgets.

<span id="atajos-globales" aria-hidden="true"></span>

## Global shortcuts

| Input | Action |
| --- | --- |
| F12 | Save a PNG screenshot. |
| R | Restart the active scene. |
| Escape / controller Start | Toggle the pause overlay. |
| M / controller Select | Request `Menu`; this scene is not registered in the documented revision. |

Shortcuts are processed in `EngineVisitor`. Losing focus pauses the scene. On regaining focus, it resumes only if the overlay is no longer open.

<span id="audio-de-la-revisión-de-referencia" aria-hidden="true"></span>

## Audio in the reference revision

AudioManager exposes global volume and listener position/direction through SFML. ResourceManager supplies sound buffers and music objects; the scene owns the sources and controls playback.

```cpp
void AudioManager::SetGlobalVolume(float volume) {
  sf::Listener::setGlobalVolume(volume);
}
```

In this revision, games coordinate their own audio during `OnPause` and `OnCleanup`. There is no documented configurable bus mixer or audio editor.

<span id="trabajo-local-en-desarrollo" aria-hidden="true"></span>

### Local work in development

The audit found `AudioGroup.h` and `AudioGroup.cpp` as files not yet included in the reference commit. They group sources by scene, distinguish Music/Effect channels, and remember which sources were playing before a pause.

There are also local changes for a shared cooldown clock. These are observed implementations, but are not part of this guide's public examples. Do not use those APIs expecting to find them in the linked commit.

<span id="interfaz-tgui" aria-hidden="true"></span>

## TGUI interface

GuiManager connects TGUI to the SFML window. It loads `Content/Themes/Dark.txt`, applies the `Relidux.otf` font, enables Tab navigation, and provides methods for adding or removing widgets.

The overlay creates buttons from `OverlaySelection` using `magic_enum`. Each selection is consumed once, and Engine executes the corresponding action. The GUI is drawn after scene post-processing.

<span id="fuentes" aria-hidden="true"></span>

## Sources

- [Input types](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Include/utils/InputBindings.h).
- [Binding queries](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/InputManager.cpp).
- [Controller mapping](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Utils/InputBindings.cpp).
- [AudioManager](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/AudioManager.cpp).
- [GuiManager](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/GuiManager.cpp).
