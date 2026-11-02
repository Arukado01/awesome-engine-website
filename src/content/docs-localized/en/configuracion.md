---
title: Configuration
description: Window, time, audio, and cursor settings, and the limits of the current JSON configuration.
order: 3
category: Getting started
---

<span id="el-archivo-de-configuración" aria-hidden="true"></span>

## The configuration file

The engine reads `Content/Config.json` when constructing the global `gConfig` object. These are the contents of the reference revision:

```json
{
  "windowTitle": "Awesome Engine",
  "windowSize": [800, 800],
  "frameRateLimit": 120,
  "disableSfmlLogs": true,
  "maximumDeltaTime": 0.03,
  "globalVolume": 100,
  "backgroundColor": [100, 100, 100],
  "cursorRadius": 5,
  "cursorSpeed": 800,
  "cursorColor": [255, 100, 0],
  "joystickDeadzone": 0.1
}
```

<span id="qué-controla-cada-valor" aria-hidden="true"></span>

## What each value controls

| Key | Effect |
| --- | --- |
| `windowTitle` | Title of the SFML window. |
| `windowSize` | Initial size and reference for render targets and several game calculations. |
| `frameRateLimit` | Frame limit requested from the window; defaults to 120 if the key is absent. |
| `disableSfmlLogs` | Silences the SFML error stream when set to `true`. |
| `maximumDeltaTime` | Maximum simulation delta, in seconds, delivered by TimeManager per frame. |
| `globalVolume` | Global volume applied to the SFML listener. |
| `backgroundColor` | RGB tint of the background used by RenderManager. |
| `cursorRadius` | Radius of the custom circular cursor. |
| `cursorSpeed` | Cursor speed when moved with a controller. |
| `cursorColor` | RGB cursor color. |
| `joystickDeadzone` | Threshold for ignoring small stick movements when moving the cursor. |

The 120-frame limit is a setting, **not a performance measurement**. It does not imply a fixed simulation timestep either: time varies per frame and is capped by `maximumDeltaTime`.

<span id="cambiar-la-configuración" aria-hidden="true"></span>

## Change the configuration

Edit the JSON while the application is closed, then run it again from the repository root. Configuration is loaded at startup; there is no automatic file reload or preferences panel that writes these values.

Keep the keys and types shown in the example. The parser does not implement a validation schema or fallback values for every field. A missing file, invalid JSON, or an incorrect required key may prevent startup.

Changing `windowSize` also affects game code that uses `gConfig.windowSize`. It does not provide a complete dynamic resolution system. The resize event does not automatically rebuild post-processing textures.

<span id="configuración-de-cada-juego" aria-hidden="true"></span>

## Per-game configuration

Game-specific parameters live in `Games/Include/Config`: `BounceConfig.h`, `ClickerConfig.h`, `MemoryCardConfig.h`, `TicTacToeConfig.h`, `MineSweeperConfig.h`, `RunnerConfig.h`, and `TetrisConfig.h`.

These are C++ constants; changes require rebuilding. The starting scene is not chosen through `Config.json` either: it is set by `ChangeScene("Tetris")` in the `Engine` constructor.

<span id="preferencias-del-sitio-y-del-motor" aria-hidden="true"></span>

## Website and engine preferences

This site's light, dark, or system selector changes only its web interface. The engine configures TGUI with `Content/Themes/Dark.txt`; this documentation does not assume that the web selector exists inside the executable.

<span id="fuentes" aria-hidden="true"></span>

## Sources

- [Original Config.json values](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Content/Config.json).
- [EngineConfig loading](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Core/EngineConfig.cpp).
- [Delta time calculation](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/TimeManager.cpp).
