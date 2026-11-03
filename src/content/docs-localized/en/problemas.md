---
title: Troubleshooting
description: Practical diagnostics for building, resources, controls, saving, and limitations of the audited revision.
order: 9
category: Reference
---

<span id="cmake-no-configura-el-proyecto" aria-hidden="true"></span>

## CMake cannot configure the project

Check that you are at the correct root and that `cmake --version` reports 3.28 or later. If you chose `-G Ninja`, verify that Ninja and the compiler are available in your terminal.

CMake uses FetchContent to download dependencies. A connection, proxy, or Git error may stop that phase before the engine is compiled. Keep the original message to distinguish a failed download from a C++ error.

If you need to change the generator or compiler, configure in a new directory; do not reuse a cache generated with different tools.

<span id="el-compilador-no-encuentra-funciones-de-c20" aria-hidden="true"></span>

## The compiler cannot find C++20 features

The project requests C++20 and uses standard library features such as `std::format`. Selecting the standard does not add features missing from an older compiler library. Check both the compiler version and its standard library.

The paths in `.vscode` belong to the author's computer. An invalid path in those settings does not mean you must install the tools in that same location.

<span id="el-ejecutable-no-encuentra-configjson-o-los-recursos" aria-hidden="true"></span>

## The executable cannot find Config.json or resources

Run from the root, next to `Content`:

```powershell
.\Build\AwesomeEngine.exe
```

Do not switch to the `Build` directory first. Configuration, shaders, textures, fonts, and sounds use relative paths. Also check that names exactly match the files in your copy.

Invalid JSON or a missing required key may stop startup. Compare with the [reference file](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Content/Config.json) and preserve the expected types.

<span id="fallos-en-sistemas-sensibles-a-mayúsculas" aria-hidden="true"></span>

## Failures on case-sensitive systems

The audited revision contains differences between Git paths and paths used by the code. For example, the tree contains `Engine/Include/utils`, while several includes use `Utils`.

Windows may tolerate these differences in its usual configuration. Other systems may reject them. The documentation does not establish Linux/macOS compatibility or present their builds as verified.

<span id="menu-o-la-tecla-m-detienen-la-aplicación" aria-hidden="true"></span>

## Menu or the M key stops the application

Engine requests a scene named `Menu`, but SceneFactory does not register that name. In Debug, this may trigger an assertion; in other configurations, the map lookup may also fail.

Avoid the Menu button, M, and controller Select in this revision. Use Escape to continue, R to restart, or Quit to close. There is no working scene selector that this documentation can recommend.

<span id="el-juego-se-pausa-al-cambiar-de-ventana" aria-hidden="true"></span>

## The game pauses when switching windows

This is defined behavior: Engine responds to focus loss by pausing the scene. The loop stops rendering while unfocused and keeps the clock updated. If the overlay is still visible when you return, use Resume or Escape.

The game clock and linked cooldowns stop during a pause; the real clock keeps running. A standalone `Cooldown` uses real time.

<span id="no-aparecen-los-efectos-o-cambia-su-aspecto-al-redimensionar" aria-hidden="true"></span>

## Effects are missing or change appearance after resizing

The chain is configured only if `sf::Shader::isAvailable()` is true. When created, Bloom and Monitor are active; Glitch and inversion are not connected to the normal flow.

Render textures are constructed at the configured size. The resize callback does not rebuild them, so a complete dynamic resolution system should not be expected.

<span id="un-mando-responde-de-forma-inesperada" aria-hidden="true"></span>

## A controller responds unexpectedly

Button mapping distinguishes Microsoft's vendor ID and uses an alternative table for other controllers. Check `InputBindings.cpp` and the identification provided by SFML. No universal controller database or persistent remapping interface was found.

<span id="el-guardado-no-se-borra-al-llamar-clear" aria-hidden="true"></span>

## Calling Clear does not delete saved data

SaveManager empties the data in memory, but writes on destruction only if it retains values. Therefore, `Clear` does not necessarily remove the previous file. Before testing changes, keep a copy of `Content/Save.json` and check its contents while the application is closed.

There is also no general recovery mechanism for a save file containing invalid JSON.

<span id="no-se-guarda-una-captura" aria-hidden="true"></span>

## A screenshot is not saved

F12 saves inside `Content/Screenshots`. Check write permissions and available space. ScreenshotManager logs whether it could save the image; the capture sound plays only when the save operation returns success.

<span id="comunicar-un-problema-reproducible" aria-hidden="true"></span>

## Report a reproducible issue

When opening an issue in the [repository](https://github.com/Arukado01/AwesomeEngine), include the commit used, operating system, compiler, command run, working directory, error message, and steps to reproduce. Mention whether your copy has local changes: this helps distinguish published code from work still in development.

<span id="fuentes" aria-hidden="true"></span>

## Sources

- [Build configuration](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/CMakeLists.txt).
- [Engine behavior](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Core/Engine.cpp).
- [Actual scene registry](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Scene/SceneFactory.cpp).
- [SaveManager persistence](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/SaveManager.cpp).
