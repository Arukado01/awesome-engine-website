---
title: Configuration
description: Paramètres de fenêtre, de temps, d’audio et de curseur, et limites de la configuration JSON actuelle.
order: 3
category: Premiers pas
---

<span id="el-archivo-de-configuración" aria-hidden="true"></span>

## Le fichier de configuration

Le moteur lit `Content/Config.json` lors de la construction de l’objet global `gConfig`. Voici le contenu de la révision de référence :

```json
{
  "windowTitle": "Awesome Engine",
  "windowSize": [800, 800],
  "frameRateLimit": 120,
  "disableSfmlLogs": true,
  "maximumDeltaTime": 0.03,
  "globalVolume": 100,
  "backgroundColor": [100, 100, 100],
  "cursorRadius": 5,
  "cursorSpeed": 800,
  "cursorColor": [255, 100, 0],
  "joystickDeadzone": 0.1
}
```

<span id="qué-controla-cada-valor" aria-hidden="true"></span>

## Rôle de chaque valeur

| Clé | Effet |
| --- | --- |
| `windowTitle` | Titre de la fenêtre SFML. |
| `windowSize` | Taille initiale et référence des cibles de rendu et de plusieurs calculs des jeux. |
| `frameRateLimit` | Limite d’images demandée à la fenêtre ; 120 par défaut si la clé est absente. |
| `disableSfmlLogs` | Désactive le flux d’erreurs de SFML lorsque la valeur est `true`. |
| `maximumDeltaTime` | Delta de simulation maximal, en secondes, fourni par TimeManager pour chaque image. |
| `globalVolume` | Volume global appliqué à l’écouteur SFML. |
| `backgroundColor` | Teinte RVB du fond utilisé par RenderManager. |
| `cursorRadius` | Rayon du curseur circulaire personnalisé. |
| `cursorSpeed` | Vitesse du curseur lorsqu’il est déplacé avec la manette. |
| `cursorColor` | Couleur RVB du curseur. |
| `joystickDeadzone` | Seuil sous lequel les petits mouvements du stick sont ignorés pour déplacer le curseur. |

La limite de 120 images est un réglage, **pas une mesure de performances**. Elle n’implique pas non plus un pas de simulation fixe : le temps varie à chaque image et est borné par `maximumDeltaTime`.

<span id="cambiar-la-configuración" aria-hidden="true"></span>

## Modifier la configuration

Modifiez le JSON lorsque l’application est fermée, puis relancez-la depuis la racine du dépôt. La configuration est chargée au démarrage ; il n’existe ni rechargement automatique du fichier ni panneau de préférences écrivant ces valeurs.

Conservez les clés et les types de l’exemple. Le parseur ne fournit pas de schéma de validation ni de valeurs de remplacement pour tous les champs. Un fichier absent, un JSON invalide ou une clé obligatoire incorrecte peuvent empêcher le démarrage.

Modifier `windowSize` affecte aussi le code des jeux qui utilise `gConfig.windowSize`. Cela ne constitue pas un système complet de résolution dynamique. L’événement de redimensionnement ne recrée pas automatiquement les textures de post-traitement.

<span id="configuración-de-cada-juego" aria-hidden="true"></span>

## Configuration de chaque jeu

Les paramètres spécifiques se trouvent dans `Games/Include/Config` : `BounceConfig.h`, `ClickerConfig.h`, `MemoryCardConfig.h`, `TicTacToeConfig.h`, `MineSweeperConfig.h`, `RunnerConfig.h` et `TetrisConfig.h`.

Ce sont des constantes C++ ; toute modification nécessite une recompilation. La scène initiale n’est pas non plus choisie dans `Config.json` : elle est fixée par `ChangeScene("Tetris")` dans le constructeur d’`Engine`.

<span id="preferencias-del-sitio-y-del-motor" aria-hidden="true"></span>

## Préférences du site et du moteur

Le sélecteur clair, sombre ou système de ce site ne modifie que son interface web. Le moteur configure TGUI avec `Content/Themes/Dark.txt` ; la documentation ne suppose pas que ce sélecteur web existe dans l’exécutable.

<span id="fuentes" aria-hidden="true"></span>

## Sources

- [Valeurs d’origine de Config.json](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Content/Config.json).
- [Lecture d’EngineConfig](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Core/EngineConfig.cpp).
- [Calcul du delta time](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/TimeManager.cpp).
