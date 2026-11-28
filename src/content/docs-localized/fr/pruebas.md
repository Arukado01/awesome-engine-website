---
title: Tests du moteur
description: Exécuter les tests avec CMake et CTest et consulter la couverture de chaque suite.
order: 10
category: Tests
---

<span id="compilar-y-ejecutar-las-pruebas" aria-hidden="true"></span>

## Compiler et exécuter les tests

À la racine du dépôt, configurez CMake avec les tests activés, compilez et lancez CTest.

```sh
cmake -S . -B Build -G Ninja -DCMAKE_BUILD_TYPE=Debug -DBUILD_TESTING=ON
cmake --build Build --parallel
ctest --test-dir Build --output-on-failure --no-tests=error
```

<span id="suites-disponibles" aria-hidden="true"></span>

## Suites disponibles

<span id="colisiones-2d" aria-hidden="true"></span>

### Collisions 2D

Six cas couvrent l’intersection, les boîtes séparées, le chevauchement initial, un impact en mouvement, un balayage sans impact et un contact par un coin.

Pour compiler et exécuter uniquement cette suite, utilisez la cible `ae_collision_tests` et filtrez par nom.

```sh
cmake --build Build --target ae_collision_tests --parallel
ctest --test-dir Build -R '^core[.]collision(\.|$)' --output-on-failure --no-tests=error
```

Pour exécuter uniquement le test principal (sans le test négatif), utilisez `-R '^core[.]collision$'`.

`core.collision` vérifie les six cas sans ouvrir de fenêtre. `core.collision.detects_failure` force un échec avec `AE_TEST_FORCE_FAIL` et vérifie que l’exécutable renvoie un code de sortie non nul.

[Code des tests](https://github.com/Arukado01/AwesomeEngine/blob/61a3244690f7763d41a8f0ba6f0f2ac3deb53ee2/Tests/Core/CollisionTests.cpp) · [Déclaration dans CTest](https://github.com/Arukado01/AwesomeEngine/blob/61a3244690f7763d41a8f0ba6f0f2ac3deb53ee2/Tests/CMakeLists.txt)

<span id="animación-de-sprites" aria-hidden="true"></span>

### Animation de sprites

Dix cas couvrent l’état initial, l’avancement des frames, une boucle complète, la fin du mode `Once`, la pause et la reprise, la réinitialisation, l’annulation de l’avancement depuis un callback, le rectangle de chaque frame, les paramètres invalides et le changement de mode.

Pour compiler et exécuter uniquement cette suite, utilisez la cible `ae_sprite_animator_tests` et filtrez par nom.

```sh
cmake --build Build --target ae_sprite_animator_tests --parallel
ctest --test-dir Build -R '^core[.]sprite_animator$' --output-on-failure --no-tests=error
```

`core.sprite_animator` vérifie les dix cas sans ouvrir de fenêtre : lecture en modes `Loop` et `Once`, conservation de la fraction de frame en pause, tolérance aux durées ou vitesses invalides et calcul du rectangle de la frame active avec `FrameRect`.

[Code des tests](https://github.com/Arukado01/AwesomeEngine/blob/34702d1447e3252b156df7e71cda3030dd80cdf9/Tests/Core/SpriteAnimatorTests.cpp) · [Déclaration dans CTest](https://github.com/Arukado01/AwesomeEngine/blob/34702d1447e3252b156df7e71cda3030dd80cdf9/Tests/CMakeLists.txt)

<span id="guardado-y-persistencia" aria-hidden="true"></span>

### Sauvegarde et persistance

Sept cas caractérisent SaveManager dans un répertoire temporaire : l'objet vide sans fichier, la création de `Save.json` à la destruction après `Set`, les clés conservées lors d'une modification, la suppression d'une clé parmi plusieurs, deux problèmes connus documentés (supprimer la dernière clé et `Clear` ne persistent pas) et un JSON corrompu qui propage l'exception de parse.

Pour compiler et exécuter uniquement cette suite, utilisez la cible `ae_save_manager_tests` et filtrez par nom.

```sh
cmake --build Build --target ae_save_manager_tests --parallel
ctest --test-dir Build -R '^core[.]save_manager$' --output-on-failure --no-tests=error
```

`core.save_manager` vérifie les sept cas sans ouvrir de fenêtre. Chaque cas travaille dans son propre répertoire temporaire, sans toucher à votre vrai `Content/Save.json`.

[Code des tests](https://github.com/Arukado01/AwesomeEngine/blob/c72ae6fef8a324b4cfd5e73e2e4928d2201a81b3/Tests/Core/SaveManagerTests.cpp) · [Déclaration dans CTest](https://github.com/Arukado01/AwesomeEngine/blob/c72ae6fef8a324b4cfd5e73e2e4928d2201a81b3/Tests/CMakeLists.txt)

<span id="configuración-del-motor" aria-hidden="true"></span>

### Configuration du moteur

Deux cas vérifient le chargement de `Config.json` via des fixtures choisis avec la variable `AE_CONFIG_CASE` : le scénario `valid` couvre un fichier complet avec deux jeux et une limite de 60 FPS ; le scénario `minimal` confirme les valeurs par défaut, dont 120 FPS et un curseur de 24 px.

Pour compiler et exécuter uniquement cette suite, utilisez la cible `ae_engine_config_tests` et filtrez par nom.

```sh
cmake --build Build --target ae_engine_config_tests --parallel
ctest --test-dir Build -R '^core[.]engine_config[.]' --output-on-failure --no-tests=error
```

Les cas `core.engine_config.valid` et `core.engine_config.minimal` s'exécutent sans ouvrir de fenêtre, chacun depuis son fixture dans `Tests/Fixtures/Config`.

[Code des tests](https://github.com/Arukado01/AwesomeEngine/blob/d20cf006b765bbc7c9f09c2726d99e5f34746610/Tests/Core/EngineConfigTests.cpp) · [Déclaration dans CTest](https://github.com/Arukado01/AwesomeEngine/blob/d20cf006b765bbc7c9f09c2726d99e5f34746610/Tests/CMakeLists.txt)
