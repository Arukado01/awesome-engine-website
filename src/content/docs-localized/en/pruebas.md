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
ctest --test-dir Build -R '^core[.]collision([.]|$)' --output-on-failure --no-tests=error
```

`core.collision` checks the six cases without opening a window. `core.collision.detects_failure` uses `AE_TEST_FORCE_FAIL` to trigger a failure and verifies that the executable exits with a nonzero code.

[Test source](https://github.com/Arukado01/AwesomeEngine/blob/61a3244690f7763d41a8f0ba6f0f2ac3deb53ee2/Tests/Core/CollisionTests.cpp) · [CTest registration](https://github.com/Arukado01/AwesomeEngine/blob/61a3244690f7763d41a8f0ba6f0f2ac3deb53ee2/Tests/CMakeLists.txt)
