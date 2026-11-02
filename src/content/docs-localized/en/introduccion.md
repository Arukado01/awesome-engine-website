---
title: Introduction
description: What Awesome Engine includes, what you can learn from its code, and how to interpret the status of each system.
order: 1
category: Getting started
---

<span id="un-motor-2d-que-puedes-recorrer-por-dentro" aria-hidden="true"></span>

## A 2D engine you can explore from the inside

Awesome Engine is a game engine written in **C++20**, built on SFML. Its core connects scenes to rendering, resource, input, audio, interface, and persistence services. The games in the repository show how to use these services from C++ code.

This documentation uses [commit `5a6dfac`](https://github.com/Arukado01/AwesomeEngine/tree/5a6dfacd86414c4cdfaa7157b533330f173a3126) as its reference. It describes the contents of that revision; changes observed only in the local working tree are marked as **in development**.

<span id="lo-que-encontrarás" aria-hidden="true"></span>

## What you will find

- **Seven game scenes:** Bounce, Clicker, MemoryCard, TicTacToe, MineSweeper, Runner, and Tetris.
- **2D rendering:** SFML drawable objects, intermediate textures, and Bloom and Monitor post-processing.
- **Action-based input:** keyboard, mouse, and controllers, with multiple bindings for the same action.
- **Shared services:** resources, time, audio, particles, JSON saves, and PNG screenshots.
- **TGUI interface:** widgets and a pause overlay integrated with window events.

These systems connect through `EngineContext`. Each game implements the `Scene` interface and maintains its own objects and rules. The documented revision has no ECS architecture or visual editor.

<span id="el-recorrido-recomendado" aria-hidden="true"></span>

## Recommended reading order

1. [Install and build the project](/en/docs/instalacion/).
2. [Review the runtime configuration](/en/docs/configuracion/).
3. [Follow the engine loop and its dependencies](/en/docs/arquitectura/).
4. [Read the scene contract](/en/docs/escenas/).
5. Explore [rendering](/en/docs/renderizado/), [resources](/en/docs/recursos/), and [input and audio](/en/docs/entrada-audio/).

<span id="cómo-interpretar-los-estados" aria-hidden="true"></span>

## How to interpret status labels

| Status | Meaning on this site |
| --- | --- |
| Implemented | Concrete code exists in the reference revision. This does not certify every platform or scenario. |
| In development | Implementation or changes exist in the local working tree but are not yet part of the reference commit. |
| Experimental | The code exists, but its integration is disabled or is not part of the normal flow described here. |
| Planned | Requires a documented intention from the project. Features are not assigned this status without that evidence. |

`AudioGroup`, `SpriteAnimator`, `SweptAabb`, and the shared cooldown clock were observed as local work. Do not expect those APIs when cloning the reference revision.

<span id="alcance-de-la-plataforma" aria-hidden="true"></span>

## Platform scope

The repository includes a working configuration for **Windows with MinGW, Ninja, and GDB**. The audit does not establish successful builds or execution on Linux, macOS, mobile devices, or browsers. The libraries used are not enough on their own to claim full engine compatibility.

The engine code is under the [MIT license](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/LICENSE.md). History entry names correspond to real commits, not invented release versions.

<span id="fuentes" aria-hidden="true"></span>

## Sources

- [Dependencies and build options](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/CMakeLists.txt).
- [Scene registration](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Scene/SceneFactory.cpp).
- [EngineContext services](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Include/Core/EngineContext.h).
