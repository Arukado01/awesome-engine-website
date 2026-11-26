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

<span id="animación-de-sprites" aria-hidden="true"></span>

### Sprite-Animation

Zehn Fälle prüfen den Anfangszustand, das Fortschreiten der Frames, eine komplette Schleife, das Ende des `Once`-Modus, das Pausieren und Fortsetzen, das Zurücksetzen, den Abbruch des Fortschritts über einen Callback, das Rechteck jedes Frames, ungültige Parameter und den Moduswechsel.

Um nur diese Suite zu bauen und auszuführen, nutze das Ziel `ae_sprite_animator_tests` und filtere nach Namen.

```sh
cmake --build Build --target ae_sprite_animator_tests --parallel
ctest --test-dir Build -R '^core[.]sprite_animator$' --output-on-failure --no-tests=error
```

`core.sprite_animator` prüft die zehn Fälle ohne Fenster: Er spielt im `Loop`- und `Once`-Modus, behält beim Pausieren den Frame-Anteil, ignoriert ungültige Dauern oder Geschwindigkeiten und berechnet das Rechteck des aktiven Frames mit `FrameRect`.

[Testquellcode](https://github.com/Arukado01/AwesomeEngine/blob/34702d1447e3252b156df7e71cda3030dd80cdf9/Tests/Core/SpriteAnimatorTests.cpp) · [Registrierung in CTest](https://github.com/Arukado01/AwesomeEngine/blob/34702d1447e3252b156df7e71cda3030dd80cdf9/Tests/CMakeLists.txt)
