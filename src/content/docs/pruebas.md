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
ctest --test-dir Build -R '^core[.]collision(\.|$)' --output-on-failure --no-tests=error
```

Para ejecutar solo el test principal (sin el test negativo), usa `-R '^core[.]collision$'`.

`core.collision` comprueba los seis casos sin abrir una ventana. `core.collision.detects_failure` fuerza un fallo con `AE_TEST_FORCE_FAIL` y comprueba que el ejecutable devuelva un código distinto de cero.

[Código de las pruebas](https://github.com/Arukado01/AwesomeEngine/blob/61a3244690f7763d41a8f0ba6f0f2ac3deb53ee2/Tests/Core/CollisionTests.cpp) · [Registro en CTest](https://github.com/Arukado01/AwesomeEngine/blob/61a3244690f7763d41a8f0ba6f0f2ac3deb53ee2/Tests/CMakeLists.txt)

### Animación de sprites

Diez casos cubren el estado inicial, el avance de cuadros, el bucle completo, la finalización del modo `Once`, la pausa y la reanudación, el reinicio, la cancelación del avance desde un callback, el rectángulo de cada cuadro, los parámetros inválidos y el cambio de modo.

Para compilar y ejecutar solo esta suite, usa el objetivo `ae_sprite_animator_tests` y el filtro por nombre.

```sh
cmake --build Build --target ae_sprite_animator_tests --parallel
ctest --test-dir Build -R '^core[.]sprite_animator$' --output-on-failure --no-tests=error
```

`core.sprite_animator` comprueba los diez casos sin abrir una ventana: reproduce en modo `Loop` y `Once`, conserva la fracción de cuadro durante la pausa, ignora duraciones o velocidades inválidas y calcula el rectángulo del cuadro activo con `FrameRect`.

[Código de las pruebas](https://github.com/Arukado01/AwesomeEngine/blob/34702d1447e3252b156df7e71cda3030dd80cdf9/Tests/Core/SpriteAnimatorTests.cpp) · [Registro en CTest](https://github.com/Arukado01/AwesomeEngine/blob/34702d1447e3252b156df7e71cda3030dd80cdf9/Tests/CMakeLists.txt)

### Guardado y persistencia

Siete casos caracterizan SaveManager en un directorio temporal: el objeto vacío sin archivo, la creación de `Save.json` al destruir tras `Set`, la conservación de claves existentes, el borrado de una clave entre varias, dos fallos conocidos documentados (borrar la última clave y `Clear` no persisten) y un JSON corrupto que propaga la excepción de parseo.

Para compilar y ejecutar solo esta suite, usa el objetivo `ae_save_manager_tests` y el filtro por nombre.

```sh
cmake --build Build --target ae_save_manager_tests --parallel
ctest --test-dir Build -R '^core[.]save_manager$' --output-on-failure --no-tests=error
```

`core.save_manager` comprueba los siete casos sin abrir una ventana. Cada caso trabaja en un directorio temporal propio, así que no toca tu `Content/Save.json` real.

[Código de las pruebas](https://github.com/Arukado01/AwesomeEngine/blob/c72ae6fef8a324b4cfd5e73e2e4928d2201a81b3/Tests/Core/SaveManagerTests.cpp) · [Registro en CTest](https://github.com/Arukado01/AwesomeEngine/blob/c72ae6fef8a324b4cfd5e73e2e4928d2201a81b3/Tests/CMakeLists.txt)

### Configuración del motor

Dos casos comprueban la carga de `Config.json` mediante fixtures seleccionados con la variable `AE_CONFIG_CASE`: el escenario `valid` cubre un archivo completo con dos juegos y límite de 60 FPS; el escenario `minimal` confirma los valores por defecto, incluidos 120 FPS y cursor de 24 px.

Para compilar y ejecutar solo esta suite, usa el objetivo `ae_engine_config_tests` y el filtro por nombre.

```sh
cmake --build Build --target ae_engine_config_tests --parallel
ctest --test-dir Build -R '^core[.]engine_config[.]' --output-on-failure --no-tests=error
```

Los casos `core.engine_config.valid` y `core.engine_config.minimal` se ejecutan sin abrir una ventana, cada uno desde su fixture en `Tests/Fixtures/Config`.

[Código de las pruebas](https://github.com/Arukado01/AwesomeEngine/blob/d20cf006b765bbc7c9f09c2726d99e5f34746610/Tests/Core/EngineConfigTests.cpp) · [Registro en CTest](https://github.com/Arukado01/AwesomeEngine/blob/d20cf006b765bbc7c9f09c2726d99e5f34746610/Tests/CMakeLists.txt)
