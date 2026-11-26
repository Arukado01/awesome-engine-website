---
title: Tests der Engine
description: Die Tests mit CMake und CTest ausführen und den Umfang jeder Suite nachlesen.
order: 10
category: Tests
---

<span id="compilar-y-ejecutar-las-pruebas" aria-hidden="true"></span>

## Tests bauen und ausführen

Aktiviere im Repository-Stammverzeichnis die Tests in CMake, baue das Projekt und starte CTest.

```sh
cmake -S . -B Build -G Ninja -DCMAKE_BUILD_TYPE=Debug -DBUILD_TESTING=ON
cmake --build Build --parallel
ctest --test-dir Build --output-on-failure --no-tests=error
```

<span id="suites-disponibles" aria-hidden="true"></span>

## Verfügbare Testsuiten

<span id="colisiones-2d" aria-hidden="true"></span>

### 2D-Kollisionen

Sechs Fälle prüfen Überschneidung, getrennte Boxen, anfängliche Überlappung, einen Treffer bei Bewegung, eine Bewegung ohne Treffer und eine Eckberührung.

Um nur diese Suite zu bauen und auszuführen, nutze das Ziel `ae_collision_tests` und filtere nach Namen.

```sh
cmake --build Build --target ae_collision_tests --parallel
ctest --test-dir Build -R '^core[.]collision(\.|$)' --output-on-failure --no-tests=error
```

Um nur den Haupttest (ohne den Negativtest) auszuführen, verwenden Sie `-R '^core[.]collision$'`.

`core.collision` prüft die sechs Fälle ohne Fenster. `core.collision.detects_failure` löst mit `AE_TEST_FORCE_FAIL` einen Fehler aus und prüft, ob das Programm einen Exitcode ungleich null liefert.

[Testquellcode](https://github.com/Arukado01/AwesomeEngine/blob/61a3244690f7763d41a8f0ba6f0f2ac3deb53ee2/Tests/Core/CollisionTests.cpp) · [Registrierung in CTest](https://github.com/Arukado01/AwesomeEngine/blob/61a3244690f7763d41a8f0ba6f0f2ac3deb53ee2/Tests/CMakeLists.txt)
