---
title: Engine tests
description: How to run the engine tests with CMake and CTest and check what each suite covers.
order: 10
category: Testing
---

<span id="compilar-y-ejecutar-las-pruebas" aria-hidden="true"></span>

## Build and run the tests

From the repository root, configure CMake with testing enabled, build, and run CTest.

```sh
cmake -S . -B Build -G Ninja -DCMAKE_BUILD_TYPE=Debug -DBUILD_TESTING=ON
cmake --build Build --parallel
ctest --test-dir Build --output-on-failure --no-tests=error
```

<span id="suites-disponibles" aria-hidden="true"></span>

## Available suites

<span id="colisiones-2d" aria-hidden="true"></span>

### 2D collisions

Six cases cover intersection, separate boxes, initial overlap, impact during motion, a sweep with no impact, and corner contact.

To build and run just this suite, use the `ae_collision_tests` target and filter by name.

```sh
cmake --build Build --target ae_collision_tests --parallel
ctest --test-dir Build -R '^core[.]collision(\.|$)' --output-on-failure --no-tests=error
```

To run only the main test (without the negative test), use `-R '^core[.]collision$'`.

`core.collision` checks the six cases without opening a window. `core.collision.detects_failure` uses `AE_TEST_FORCE_FAIL` to trigger a failure and verifies that the executable exits with a nonzero code.

[Test source](https://github.com/Arukado01/AwesomeEngine/blob/61a3244690f7763d41a8f0ba6f0f2ac3deb53ee2/Tests/Core/CollisionTests.cpp) · [CTest registration](https://github.com/Arukado01/AwesomeEngine/blob/61a3244690f7763d41a8f0ba6f0f2ac3deb53ee2/Tests/CMakeLists.txt)

<span id="animación-de-sprites" aria-hidden="true"></span>

### Sprite animation

Ten cases cover the initial state, frame advancement, a full loop, the `Once` mode finishing, pausing and resuming, resetting, cancelling the advance from a callback, the rectangle of each frame, invalid parameters, and changing the mode.

To build and run just this suite, use the `ae_sprite_animator_tests` target and filter by name.

```sh
cmake --build Build --target ae_sprite_animator_tests --parallel
ctest --test-dir Build -R '^core[.]sprite_animator$' --output-on-failure --no-tests=error
```

`core.sprite_animator` checks the ten cases without opening a window: it plays in `Loop` and `Once` modes, keeps the frame fraction while paused, ignores invalid durations or speeds, and computes the active frame rectangle with `FrameRect`.

[Test source](https://github.com/Arukado01/AwesomeEngine/blob/34702d1447e3252b156df7e71cda3030dd80cdf9/Tests/Core/SpriteAnimatorTests.cpp) · [CTest registration](https://github.com/Arukado01/AwesomeEngine/blob/34702d1447e3252b156df7e71cda3030dd80cdf9/Tests/CMakeLists.txt)

<span id="guardado-y-persistencia" aria-hidden="true"></span>

### Save and persistence

Seven cases characterize SaveManager in a temporary directory: the empty object without a file, `Save.json` creation on destroy after `Set`, preserved keys when modifying, erasing one key among several, two documented known issues (erasing the last key and `Clear` do not persist), and corrupt JSON that propagates the parse exception.

To build and run just this suite, use the `ae_save_manager_tests` target and filter by name.

```sh
cmake --build Build --target ae_save_manager_tests --parallel
ctest --test-dir Build -R '^core[.]save_manager$' --output-on-failure --no-tests=error
```

`core.save_manager` checks the seven cases without opening a window. Each case works in its own temporary directory, so it never touches your real `Content/Save.json`.

[Test source](https://github.com/Arukado01/AwesomeEngine/blob/c72ae6fef8a324b4cfd5e73e2e4928d2201a81b3/Tests/Core/SaveManagerTests.cpp) · [CTest registration](https://github.com/Arukado01/AwesomeEngine/blob/c72ae6fef8a324b4cfd5e73e2e4928d2201a81b3/Tests/CMakeLists.txt)

<span id="configuración-del-motor" aria-hidden="true"></span>

### Engine configuration

Two cases check the `Config.json` load through fixtures selected with the `AE_CONFIG_CASE` variable: the `valid` scenario covers a complete file with two games and a 60 FPS limit; the `minimal` scenario confirms the default values, including 120 FPS and a 24 px cursor.

To build and run just this suite, use the `ae_engine_config_tests` target and filter by name.

```sh
cmake --build Build --target ae_engine_config_tests --parallel
ctest --test-dir Build -R '^core[.]engine_config[.]' --output-on-failure --no-tests=error
```

The `core.engine_config.valid` and `core.engine_config.minimal` cases run without opening a window, each from its fixture in `Tests/Fixtures/Config`.

[Test source](https://github.com/Arukado01/AwesomeEngine/blob/d20cf006b765bbc7c9f09c2726d99e5f34746610/Tests/Core/EngineConfigTests.cpp) · [CTest registration](https://github.com/Arukado01/AwesomeEngine/blob/d20cf006b765bbc7c9f09c2726d99e5f34746610/Tests/CMakeLists.txt)
