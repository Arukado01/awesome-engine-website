---
title: Architecture du moteur
description: Explorez la boucle principale, EngineContext, la propriété des objets et les relations entre systèmes.
order: 4
category: Cœur du moteur
---

<span id="de-la-entrada-al-frame" aria-hidden="true"></span>

## De l’entrée à l’image

`main()` construit un `Engine` et répète trois opérations tant que la fenêtre reste ouverte. Cet extrait provient du code de référence :

```cpp
while (engine.IsRunning()) {
  engine.ProcessEvent();
  engine.Update();

  if (!engine.HasFocus()) {
    sf::sleep(sf::milliseconds(10));
    continue;
  }

  engine.Render();
}
```

Sans focus, la boucle continue à traiter les événements et à mettre l’horloge à jour ; elle omet le rendu et attend 10 ms. `Engine::Update` vérifie aussi le focus avant de faire avancer la scène.

<span id="responsabilidades-de-engine" aria-hidden="true"></span>

## Responsabilités d’Engine

`Engine` possède la fenêtre, un `EngineContext`, le registre des scènes, la référence à la scène active et un panneau de pause. Son rôle est de coordonner ces éléments.

```text
Engine
├── sf::RenderWindow
├── EngineContext
│   ├── renderer · resources · particles
│   ├── input · cursor · gui
│   ├── audio · time · random
│   └── scenes · save · screenshot · clipboard
├── SceneFactory::Scenes
│   └── nom → unique_ptr<Scene>
├── currentScene → Scene active
└── Overlay → widgets TGUI
```

Le contexte est transmis par référence à chaque scène. Un jeu accède ainsi à `ctx.renderer`, `ctx.input` ou `ctx.resources` sans créer de services en double.

<span id="procesamiento-de-eventos" aria-hidden="true"></span>

## Traitement des événements

Au début de `ProcessEvent`, le moteur consomme le changement de scène en attente. Il récupère ensuite les événements de `sf::RenderWindow` et les distribue :

1. `EngineVisitor` traite la fermeture, le focus, la taille, les manettes et les raccourcis globaux.
2. `GuiManager` transmet l’événement à TGUI.
3. La scène reçoit `OnEvent` lorsque le panneau est masqué.
4. Le moteur traite toute sélection du panneau et synchronise l’état de pause.

La GUI et la scène participent au même traitement ; aucun bus d’événements distinct n’est documenté.

<span id="actualización-y-tiempo" aria-hidden="true"></span>

## Mise à jour et temps

`TimeManager` calcule le temps écoulé depuis l’image précédente et le limite à `gConfig.maximumDeltaTime`. Le curseur est ensuite mis à jour et, si le panneau est masqué, `Scene::Update` est appelé.

Le système n’implémente pas d’accumulateur à pas fixe. Les jeux décident comment utiliser le delta de temps et leurs propres temporisateurs.

Dans la révision de référence, chaque scène implémente sa réaction à `OnPause`, y compris pour l’audio et les temporisateurs. Une refactorisation locale de l’horloge des délais de récupération est signalée comme **en développement** ; elle ne fait pas partie de cette API publique de référence.

<span id="renderizado-y-capas" aria-hidden="true"></span>

## Rendu et couches

La scène dessine sur une `sf::RenderTexture`. RenderManager applique la chaîne d’effets et renvoie la texture finale. Engine la présente dans la fenêtre, puis dessine la GUI et le curseur par-dessus.

```text
Scene::Render
     ↓
RenderManager / RenderTexture
     ↓
Bloom → Monitor
     ↓
Fenêtre → GUI → Cursor → display
```

Les effets ne sont ajoutés que lorsque `sf::Shader::isAvailable()` renvoie vrai. La GUI et le curseur sont dessinés après le post-traitement. Consultez le [Rendu](/fr/docs/renderizado/) pour suivre les passes de Bloom.

<span id="propiedad-y-memoria" aria-hidden="true"></span>

## Propriété et mémoire

- Les scènes sont stockées dans un `unordered_map` de `unique_ptr<Scene>`.
- Les effets sont stockés dans un vecteur de `unique_ptr<Effect>`.
- La scène active est un pointeur non propriétaire ; son objet appartient toujours au registre.
- Les gestionnaires font partie d’`EngineContext` par valeur.
- ResourceManager conserve les ressources par valeur dans des tables associatives.

Le projet utilise RAII et les conteneurs standard. Il n’existe ni gestionnaire de mémoire personnalisé ni ECS générique. Toutes les scènes enregistrées sont construites dans `CreateScenes` ; chaque transition ne crée pas une nouvelle instance.

<span id="organización-del-código" aria-hidden="true"></span>

## Organisation du code

| Répertoire | Contenu |
| --- | --- |
| `Engine/Include` | Contrats et types du noyau, gestionnaires, scènes, effets et utilitaires. |
| `Engine/Source` | Implémentations et point d’entrée. |
| `Games/Include` | Classes de jeu, types et constantes de configuration. |
| `Games/Source` | Logique et rendu des jeux. |
| `Content` | Ressources graphiques et sonores, polices, shaders, thème et JSON. |

<span id="fuentes" aria-hidden="true"></span>

## Sources

- [Boucle principale](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Main.cpp).
- [Coordination d’Engine](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Core/Engine.cpp).
- [Définition d’EngineContext](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Include/Core/EngineContext.h).
- [Propriété des scènes](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Include/Scene/SceneFactory.h).
