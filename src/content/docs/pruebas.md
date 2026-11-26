---
title: Pruebas del motor
description: Cómo ejecutar las pruebas del motor con CMake y CTest y consultar qué cubre cada suite.
order: 10
category: Pruebas
---

## Compilar y ejecutar las pruebas

Desde la raíz del repositorio, configura CMake con las pruebas habilitadas, compila y ejecuta CTest.

```sh
cmake -S . -B Build -G Ninja -DCMAKE_BUILD_TYPE=Debug -DBUILD_TESTING=ON
cmake --build Build --parallel
ctest --test-dir Build --output-on-failure --no-tests=error
```

## Suites disponibles

### Colisiones 2D

Seis casos cubren intersección, cajas separadas, solapamiento inicial, impacto durante el movimiento, barrido sin impacto y contacto en una esquina.

Para compilar y ejecutar solo esta suite, usa el objetivo `ae_collision_tests` y el filtro por nombre.

```sh
cmake --build Build --target ae_collision_tests --parallel
ctest --test-dir Build -R '^core[.]collision([.]|$)' --output-on-failure --no-tests=error
```

`core.collision` comprueba los seis casos sin abrir una ventana. `core.collision.detects_failure` fuerza un fallo con `AE_TEST_FORCE_FAIL` y comprueba que el ejecutable devuelva un código distinto de cero.

[Código de las pruebas](https://github.com/Arukado01/AwesomeEngine/blob/61a3244690f7763d41a8f0ba6f0f2ac3deb53ee2/Tests/Core/CollisionTests.cpp) · [Registro en CTest](https://github.com/Arukado01/AwesomeEngine/blob/61a3244690f7763d41a8f0ba6f0f2ac3deb53ee2/Tests/CMakeLists.txt)
