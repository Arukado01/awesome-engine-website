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

<span id="guardado-y-persistencia" aria-hidden="true"></span>

### Speichern und Persistenz

Sieben Fälle charakterisieren SaveManager in einem temporären Verzeichnis: das leere Objekt ohne Datei, die Erstellung von `Save.json` beim Zerstören nach `Set`, erhaltene Schlüssel beim Ändern, das Löschen eines Schlüssels unter mehreren, zwei dokumentierte bekannte Fehler (das Löschen des letzten Schlüssels und `Clear` bleiben nicht bestehen) sowie beschädigtes JSON, das die Parse-Ausnahme weitergibt.

Um nur diese Suite zu bauen und auszuführen, nutze das Ziel `ae_save_manager_tests` und filtere nach Namen.

```sh
cmake --build Build --target ae_save_manager_tests --parallel
ctest --test-dir Build -R '^core[.]save_manager$' --output-on-failure --no-tests=error
```

`core.save_manager` prüft die sieben Fälle ohne Fenster. Jeder Fall arbeitet in einem eigenen temporären Verzeichnis und berührt daher nie deine echte `Content/Save.json`.

[Testquellcode](https://github.com/Arukado01/AwesomeEngine/blob/c72ae6fef8a324b4cfd5e73e2e4928d2201a81b3/Tests/Core/SaveManagerTests.cpp) · [Registrierung in CTest](https://github.com/Arukado01/AwesomeEngine/blob/c72ae6fef8a324b4cfd5e73e2e4928d2201a81b3/Tests/CMakeLists.txt)

<span id="configuración-del-motor" aria-hidden="true"></span>

### Konfiguration der Engine

Zwei Fälle prüfen das Laden von `Config.json` über Fixtures, die mit der Variable `AE_CONFIG_CASE` gewählt werden: das Szenario `valid` deckt eine vollständige Datei mit zwei Spielen und einem 60-FPS-Limit ab; das Szenario `minimal` bestätigt die Standardwerte, darunter 120 FPS und einen 24-px-Cursor.

Um nur diese Suite zu bauen und auszuführen, nutze das Ziel `ae_engine_config_tests` und filtere nach Namen.

```sh
cmake --build Build --target ae_engine_config_tests --parallel
ctest --test-dir Build -R '^core[.]engine_config[.]' --output-on-failure --no-tests=error
```

Die Fälle `core.engine_config.valid` und `core.engine_config.minimal` laufen ohne Fenster, jeder aus seinem Fixture in `Tests/Fixtures/Config`.

[Testquellcode](https://github.com/Arukado01/AwesomeEngine/blob/d20cf006b765bbc7c9f09c2726d99e5f34746610/Tests/Core/EngineConfigTests.cpp) · [Registrierung in CTest](https://github.com/Arukado01/AwesomeEngine/blob/d20cf006b765bbc7c9f09c2726d99e5f34746610/Tests/CMakeLists.txt)
