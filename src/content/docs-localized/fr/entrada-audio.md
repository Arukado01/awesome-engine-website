---
title: Entrées, audio et interface
description: Association d’actions, manettes, raccourcis globaux, lecture sonore et widgets TGUI.
order: 8
category: Systèmes
---

<span id="una-acción-varias-entradas" aria-hidden="true"></span>

## Une action, plusieurs entrées

InputManager utilise des identifiants d’action entiers et un `unordered_multimap` d’associations. Une action peut être liée à plusieurs entrées. `Pressed(action)` renvoie vrai lorsqu’au moins une entrée associée est enfoncée.

Les types d’association de la révision de référence sont :

```cpp
struct Keyboard {
  sf::Keyboard::Scan key;
};
struct Mouse {
  sf::Mouse::Button button;
};
struct Gamepad {
  GamepadButton button;
  int id = 0;
};
struct Axis {
  sf::Joystick::Axis axis;
  float threshold = 0.5f;
  int id = 0;
};

using Binding = std::variant<Keyboard, Mouse, Gamepad, Axis>;
```

Ces types appartiennent à l’espace de noms `Input`. La requête vérifie l’état actuel ; elle ne détecte pas automatiquement l’instant de l’appui. Pour les événements ponctuels, les scènes disposent aussi d’`OnEvent`.

Les axes sont normalisés en divisant leur valeur par 100, puis comparés au seuil positif ou négatif configuré. Engine supprime les associations lors d’un changement de scène ; chaque jeu doit rétablir les siennes au démarrage.

<span id="mandos-y-cursor" aria-hidden="true"></span>

## Manettes et curseur

Le code contient des tables de boutons logiques Xbox et PlayStation. Il choisit la table Xbox lorsqu’il identifie le fabricant Microsoft et utilise la table PlayStation dans les autres cas. Cette heuristique ne garantit pas une correspondance identique sur toutes les manettes.

Les gâchettes L2/R2 n’ont pas de bouton dans la table Xbox : leur entrée est indiquée comme indisponible dans cette table de boutons. Les axes constituent un type d’association séparé.

CursorManager permet de déplacer le curseur avec le stick en respectant `joystickDeadzone`. Il convertit aussi la position de la souris en coordonnées d’une vue. GuiManager transforme le bouton logique South en événements de clic pour les widgets.

<span id="atajos-globales" aria-hidden="true"></span>

## Raccourcis globaux

| Entrée | Action |
| --- | --- |
| F12 | Enregistrer une capture PNG. |
| R | Redémarrer la scène active. |
| Échap / Start de la manette | Afficher ou masquer le panneau de pause. |
| M / Select de la manette | Demander `Menu` ; cette scène n’est pas enregistrée dans la révision documentée. |

Les raccourcis sont traités dans `EngineVisitor`. La perte du focus met la scène en pause. Lorsqu’il revient, la scène reprend uniquement si le panneau n’est plus ouvert.

<span id="audio-de-la-revisión-de-referencia" aria-hidden="true"></span>

## Audio de la révision de référence

AudioManager expose le volume global ainsi que la position et la direction de l’écouteur via SFML. ResourceManager fournit les buffers sonores et les objets musicaux ; la scène possède les sources et contrôle leur lecture.

```cpp
void AudioManager::SetGlobalVolume(float volume) {
  sf::Listener::setGlobalVolume(volume);
}
```

Dans cette révision, les jeux coordonnent leur propre audio dans `OnPause` et `OnCleanup`. Aucun mélangeur de bus configurable ni éditeur audio n’est documenté.

<span id="trabajo-local-en-desarrollo" aria-hidden="true"></span>

### Travail local en développement

L’audit a relevé `AudioGroup.h` et `AudioGroup.cpp` comme fichiers encore absents du commit de référence. Ils regroupent les sources par scène, distinguent les canaux Music/Effect et mémorisent celles qui étaient en lecture avant la pause.

Des changements locaux concernent aussi une horloge partagée des délais de récupération. Ces implémentations ont été observées, mais ne font pas partie des exemples publics de ce guide. N’utilisez pas ces API en pensant les trouver dans le commit lié.

<span id="interfaz-tgui" aria-hidden="true"></span>

## Interface TGUI

GuiManager relie TGUI à la fenêtre SFML. Il charge `Content/Themes/Dark.txt`, applique la police `Relidux.otf`, active la navigation par Tab et fournit des méthodes pour ajouter ou retirer des widgets.

Le panneau crée ses boutons à partir d’`OverlaySelection` avec `magic_enum`. La sélection est consommée une seule fois, puis Engine exécute l’action correspondante. La GUI est dessinée après le post-traitement de la scène.

<span id="fuentes" aria-hidden="true"></span>

## Sources

- [Types d’entrée](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Include/utils/InputBindings.h).
- [Consultation des associations](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/InputManager.cpp).
- [Correspondance des manettes](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Utils/InputBindings.cpp).
- [AudioManager](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/AudioManager.cpp).
- [GuiManager](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/GuiManager.cpp).
