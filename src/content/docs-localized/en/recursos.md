---
title: Resources and persistence
description: Loading textures, sounds, fonts, and music; JSON saves and engine screenshots.
order: 6
category: Systems
---

<span id="dónde-busca-los-archivos" aria-hidden="true"></span>

## Where files are located

ResourceManager resolves names within specific directories. Pass a filename relative to the corresponding category, not the full path from the root.

| API | Directory | Result |
| --- | --- | --- |
| `FetchTexture(filename)` | `Content/Textures/` | `sf::Texture*` |
| `FetchSound(filename)` | `Content/Sounds/` | `sf::SoundBuffer*` |
| `FetchFont(filename)` | `Content/Fonts/` | `sf::Font*` |
| `FetchMusic(filename)` | `Content/Musics/` | `std::optional<sf::Music>` |

Paths are relative to the application's working directory. This is why you must run from the repository root, where `Content` exists.

<span id="cómo-funciona-la-caché" aria-hidden="true"></span>

## How the cache works

Textures, sound buffers, and fonts are stored in maps indexed by filename. A subsequent request looks up the existing entry. The following function comes from the reference code:

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

The manager retains ownership of these objects. Consumers must not delete the pointers they receive. There is also no public unload, cache invalidation, or automatic reload operation.

Check results before use. Textures and fonts insert an entry before loading, so a failure may require a restart to retry. `AcquireSound` only inserts a buffer after loading and allows a failed load to be retried.

<span id="música-y-sonido" aria-hidden="true"></span>

## Music and sound

Short sounds use cached `sf::SoundBuffer` objects. The game creates and maintains its `sf::Sound` sources while using those buffers.

`FetchMusic` opens a file in an `sf::Music` object and returns it inside an `optional`; if it cannot open the file, it returns `std::nullopt`. Music is not retained in ResourceManager's cache: the scene keeps the returned object and controls playback.

Not every project asset is loaded through the manager. The RenderManager background, shaders, and certain core resources are opened directly by their classes.

<span id="guardado-json" aria-hidden="true"></span>

## JSON saves

SaveManager reads `Content/Save.json` when constructed; if the file does not exist, it starts with an empty object. Its interface provides `Set`, `Get`, `Has`, `Erase`, and `Clear`.

On destruction, it writes the values if the object is not empty. This persists simple game data, but is not a transactional or cloud save system.

Two limitations to keep in mind:

- There is no general recovery mechanism for an existing but invalid JSON file.
- `Clear()` empties the values in memory, but the destructor does not overwrite the file when the object is empty. This does not necessarily delete the saved data on disk.

When testing persistence changes, keep a copy of your data before modifying the file.

<span id="capturas-de-pantalla" aria-hidden="true"></span>

## Screenshots

**F12** invokes `ScreenshotManager::Take`. The manager copies the window to a texture, retrieves the image, and saves a PNG in `Content/Screenshots`, creating the directory if needed.

The filename contains the date and time with milliseconds. The result is logged, and a sound plays when saving succeeds. The application needs write permission for that directory.

<span id="fuentes" aria-hidden="true"></span>

## Sources

- [Resource loading and caching](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/ResourceManager.cpp).
- [ResourceManager API](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Include/Managers/ResourceManager.h).
- [SaveManager persistence](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/SaveManager.cpp).
- [PNG screenshots](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/ScreenshotManager.cpp).
