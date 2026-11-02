---
title: Ressourcen und Persistenz
description: Laden von Texturen, Sounds, Schriften und Musik sowie JSON-Speicherung und Bildschirmaufnahmen der Engine.
order: 6
category: Systeme
---

<span id="dónde-busca-los-archivos" aria-hidden="true"></span>

## Wo nach Dateien gesucht wird

ResourceManager löst Namen innerhalb bestimmter Verzeichnisse auf. Übergib einen Dateinamen relativ zur passenden Kategorie, nicht den vollständigen Pfad ab dem Stammverzeichnis.

| API | Verzeichnis | Ergebnis |
| --- | --- | --- |
| `FetchTexture(filename)` | `Content/Textures/` | `sf::Texture*` |
| `FetchSound(filename)` | `Content/Sounds/` | `sf::SoundBuffer*` |
| `FetchFont(filename)` | `Content/Fonts/` | `sf::Font*` |
| `FetchMusic(filename)` | `Content/Musics/` | `std::optional<sf::Music>` |

Die Pfade beziehen sich auf das Arbeitsverzeichnis der Anwendung. Starte sie deshalb aus dem Repository-Stammverzeichnis, in dem `Content` liegt.

<span id="cómo-funciona-la-caché" aria-hidden="true"></span>

## Funktionsweise des Caches

Texturen, Soundbuffer und Schriften werden in nach Dateinamen indizierten Maps gespeichert. Eine spätere Anfrage nutzt den vorhandenen Eintrag. Die folgende Funktion stammt aus dem Referenzcode:

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

Der Manager behält den Besitz dieser Objekte. Nutzer dürfen die erhaltenen Zeiger nicht löschen. Es gibt auch keine öffentliche Operation zum Entladen, zur Cache-Invalidierung oder zum automatischen Neuladen.

Prüfe das Ergebnis vor der Nutzung: Der erste fehlgeschlagene Ladevorgang gibt `nullptr` zurück. Die Implementierung fügt den Eintrag vor dem Ladeversuch ein; eine spätere Anfrage desselben Namens versucht das Laden daher nicht automatisch erneut. Nach dem Wiederherstellen einer fehlenden Datei ist mit der aktuellen Implementierung meist ein Neustart nötig.

<span id="música-y-sonido" aria-hidden="true"></span>

## Musik und Sounds

Kurze Sounds verwenden zwischengespeicherte `sf::SoundBuffer`. Das Spiel erstellt und hält seine `sf::Sound`-Quellen, während es diese Buffer nutzt.

`FetchMusic` öffnet eine Datei in einem `sf::Music`-Objekt und gibt es in einem `optional` zurück; bei einem Fehler liefert es `std::nullopt`. Musik wird nicht im Cache von ResourceManager gehalten: Die Szene hält das erhaltene Objekt und steuert seine Wiedergabe.

Nicht alle Ladevorgänge des Projekts laufen über den Manager. Der Hintergrund von RenderManager, Shader und bestimmte Kernressourcen werden direkt durch ihre Klassen geöffnet.

<span id="guardado-json" aria-hidden="true"></span>

## JSON-Speicherung

SaveManager liest beim Erstellen `Content/Save.json`; existiert die Datei nicht, beginnt er mit einem leeren Objekt. Seine Schnittstelle bietet `Set`, `Get`, `Has`, `Erase` und `Clear`.

Bei seiner Zerstörung schreibt er die Werte, sofern das Objekt nicht leer ist. Damit lassen sich einfache Spieldaten dauerhaft speichern; es handelt sich aber weder um ein transaktionales System noch um Cloud-Speicherung.

Zwei wichtige Grenzen:

- Für vorhandenes, aber ungültiges JSON gibt es keine allgemeine Wiederherstellung.
- `Clear()` leert die Werte im Speicher, doch der Destruktor überschreibt die Datei nicht, wenn das Objekt leer bleibt. Das löscht also nicht zwangsläufig den Spielstand auf dem Datenträger.

Lege vor Tests an der Persistenz eine Kopie deiner Daten an, bevor du die Datei änderst.

<span id="capturas-de-pantalla" aria-hidden="true"></span>

## Bildschirmaufnahmen

**F12** ruft `ScreenshotManager::Take` auf. Der Manager kopiert das Fenster in eine Textur, entnimmt das Bild und speichert ein PNG unter `Content/Screenshots`. Das Verzeichnis wird bei Bedarf erstellt.

Der Name enthält Datum und Uhrzeit samt Millisekunden. Das Ergebnis wird protokolliert, und bei erfolgreicher Speicherung wird ein Ton abgespielt. Die Anwendung benötigt Schreibrechte für dieses Verzeichnis.

<span id="fuentes" aria-hidden="true"></span>

## Quellen

- [Laden und Caching von Ressourcen](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/ResourceManager.cpp).
- [ResourceManager-API](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Include/Managers/ResourceManager.h).
- [Persistenz mit SaveManager](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/SaveManager.cpp).
- [PNG-Aufnahmen](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/ScreenshotManager.cpp).
