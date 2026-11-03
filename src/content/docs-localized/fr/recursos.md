---
title: Ressources et persistance
description: Chargement des textures, sons, polices et musiques ; sauvegarde JSON et captures du moteur.
order: 6
category: Systèmes
---

<span id="dónde-busca-los-archivos" aria-hidden="true"></span>

## Où les fichiers sont recherchés

ResourceManager résout les noms dans des répertoires précis. Fournissez un nom de fichier relatif à la catégorie correspondante, pas le chemin complet depuis la racine.

| API | Répertoire | Résultat |
| --- | --- | --- |
| `FetchTexture(filename)` | `Content/Textures/` | `sf::Texture*` |
| `FetchSound(filename)` | `Content/Sounds/` | `sf::SoundBuffer*` |
| `FetchFont(filename)` | `Content/Fonts/` | `sf::Font*` |
| `FetchMusic(filename)` | `Content/Musics/` | `std::optional<sf::Music>` |

Les chemins sont relatifs au répertoire de travail de l’application. Vous devez donc lancer celle-ci depuis la racine du dépôt, où se trouve `Content`.

<span id="cómo-funciona-la-caché" aria-hidden="true"></span>

## Fonctionnement du cache

Les textures, buffers sonores et polices sont conservés dans des tables indexées par nom de fichier. Une demande ultérieure consulte l’entrée existante. La fonction suivante provient du code de référence :

```cpp
sf::Texture *ResourceManager::FetchTexture(const std::string &filename) {
  if (!textures_.contains(filename)) {
    if (!textures_[filename].loadFromFile("Content/Textures/" + filename)) {
      LOG_ERROR("Failed to load texture: {}", filename);
      return nullptr;
    }
  }

  return &textures_.at(filename);
}
```

Le gestionnaire reste propriétaire de ces objets. Leurs utilisateurs ne doivent pas supprimer les pointeurs reçus. Il n’existe pas non plus d’opération publique de déchargement, d’invalidation du cache ou de rechargement automatique.

Vérifiez le résultat avant utilisation. Les textures et polices insèrent une entrée avant le chargement ; un échec peut nécessiter un redémarrage. `AcquireSound` insère le tampon seulement après chargement et permet de réessayer.

<span id="música-y-sonido" aria-hidden="true"></span>

## Musique et sons

Les sons courts utilisent des `sf::SoundBuffer` mis en cache. Le jeu crée et conserve ses sources `sf::Sound` pendant qu’il utilise ces buffers.

`FetchMusic` ouvre un fichier dans un objet `sf::Music` et le renvoie dans un `optional` ; en cas d’échec, il renvoie `std::nullopt`. La musique n’est pas conservée dans le cache de ResourceManager : la scène garde l’objet reçu et contrôle sa lecture.

Tous les chargements du projet ne passent pas par ce gestionnaire. Le fond de RenderManager, les shaders et certaines ressources du noyau sont ouverts directement par leurs classes.

<span id="guardado-json" aria-hidden="true"></span>

## Sauvegarde JSON

SaveManager lit `Content/Save.json` lors de sa construction ; si le fichier n’existe pas, il commence avec un objet vide. Son interface propose `Set`, `Get`, `Has`, `Erase` et `Clear`.

Lors de sa destruction, il écrit les valeurs si l’objet n’est pas vide. Cela permet de conserver des données simples du jeu, mais ne constitue ni un système transactionnel ni une sauvegarde dans le cloud.

Deux limites sont à connaître :

- Aucune récupération générale n’est implémentée pour un JSON existant mais invalide.
- `Clear()` vide les valeurs en mémoire, mais le destructeur n’écrase pas le fichier lorsque l’objet est vide. Cela ne revient donc pas nécessairement à effacer la sauvegarde sur disque.

Pour tester des changements de persistance, conservez une copie de vos données avant de modifier le fichier.

<span id="capturas-de-pantalla" aria-hidden="true"></span>

## Captures d’écran

**F12** appelle `ScreenshotManager::Take`. Le gestionnaire copie la fenêtre dans une texture, récupère l’image et enregistre un PNG dans `Content/Screenshots`, en créant le répertoire si nécessaire.

Le nom contient la date et l’heure avec les millisecondes. Le résultat est journalisé et un son est joué lorsque la sauvegarde réussit. L’application doit disposer des droits d’écriture dans ce répertoire.

<span id="fuentes" aria-hidden="true"></span>

## Sources

- [Chargement et cache des ressources](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/ResourceManager.cpp).
- [API de ResourceManager](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Include/Managers/ResourceManager.h).
- [Persistance de SaveManager](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/SaveManager.cpp).
- [Captures PNG](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/ScreenshotManager.cpp).
