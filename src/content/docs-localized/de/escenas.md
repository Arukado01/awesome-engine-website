---
title: Szenen und Lebenszyklus
description: Der Scene-Vertrag, die Spielregistrierung, verzögerte Übergänge und das Aufräumen des Zustands.
order: 7
category: Engine-Kern
---

<span id="el-contrato-de-una-escena" aria-hidden="true"></span>

## Der Vertrag einer Szene

Eine Szene erhält `EngineContext` als Referenz und definiert, wie sie startet, aktualisiert und gezeichnet wird. Dieser Vertrag existiert in der Referenzrevision:

```cpp
class Scene {
protected:
  EngineContext &ctx;

public:
  Scene(EngineContext &context) : ctx(context) {}
  virtual ~Scene() = default;

  virtual void Start() = 0;
  virtual void Update() = 0;
  virtual void Render() const = 0;

  virtual void OnEvent(const sf::Event &) {};
  virtual void OnPause(bool /* pausa */) {};
  virtual void OnCleanup() {};
};
```

`Start`, `Update` und `Render` sind verpflichtend. Die anderen Callbacks haben eine leere Implementierung und werden bei Bedarf vom Spiel spezialisiert.

<span id="responsabilidades-por-etapa" aria-hidden="true"></span>

## Aufgaben nach Phase

| Phase | Zeitpunkt | Verwendung im Spiel |
| --- | --- | --- |
| Konstruktor | Beim Erstellen des anfänglichen Szenenregisters. | Objekte und Ressourcen der Instanz vorbereiten. |
| `Start` | Beim Aktivieren oder Neustarten der Szene. | Die Partie zurücksetzen und ihre Steuerung registrieren. |
| `OnEvent` | Bei Ereignissen mit verborgenem Overlay. | Einzelne Spielereignisse behandeln. |
| `Update` | Pro Frame, mit Fokus und ohne sichtbares Overlay. | Logik, Bewegung und Zustand fortschreiben. |
| `Render` | Beim Zeichnen des Frames der aktiven Szene. | Objekte an `ctx.renderer` senden. |
| `OnPause` | Bei einer Änderung des Pausenzustands. | Die von der Szene verwalteten Elemente pausieren oder fortsetzen. |
| `OnCleanup` | Vor dem Verlassen oder Neustarten der Szene. | Audio stoppen und Zustand entfernen, der nicht fortbestehen soll. |

Konstruktor und `Start` sind nicht gleichbedeutend. Instanzen bleiben im Register und können mehrere `Start`-Aufrufe erhalten.

<span id="registro-de-juegos" aria-hidden="true"></span>

## Registrierung der Spiele

`SceneFactory::Scenes` ist eine `unordered_map`, die Namen mit `unique_ptr<Scene>` verbindet. Die Factory registriert sieben Instanzen:

```cpp
scenes.emplace("Bounce", std::make_unique<Bounce::Game>(context));
scenes.emplace("Clicker", std::make_unique<Clicker::Game>(context));
scenes.emplace("MemoryCard", std::make_unique<MemoryCard::Game>(context));
scenes.emplace("TicTacToe", std::make_unique<TicTacToe::Game>(context));
scenes.emplace("MineSweeper", std::make_unique<MineSweeper::Game>(context));
scenes.emplace("Runner", std::make_unique<Runner::Game>(context));
scenes.emplace("Tetris", std::make_unique<Tetris::Game>(context));
```

Die dokumentierte Revision fordert Tetris im Konstruktor von Engine an. Die Namen sind exakte Schlüssel des Registers; für eine unbekannte Szene ist keine Wiederherstellung implementiert.

<span id="transición-diferida" aria-hidden="true"></span>

## Verzögerter Übergang

`SceneManager::ChangeScene` speichert den angeforderten Namen, sofern noch kein anderer Wechsel aussteht. Engine verarbeitet die Anfrage zu Beginn des nächsten Ereignisverarbeitungsschritts.

```text
ChangeScene(Name)
     ↓
Ausstehende Anfrage
     ↓
Nächster ProcessEvent-Aufruf
     ↓
OnCleanup der vorherigen Szene
     ↓
Partikel und Eingabebindungen löschen
     ↓
Aktiven Zeiger wechseln
     ↓
Start der angeforderten Szene
     ↓
Pausenzustand synchronisieren
```

`RestartCurrentScene` verwendet denselben Mechanismus mit dem aktuellen Namen. Das Objekt wird nicht zerstört und neu aufgebaut; deshalb muss `Start` die Partie auch bei wiederholtem Aufruf in einen gültigen Zustand versetzen.

<span id="explorar-una-implementación-real" aria-hidden="true"></span>

## Eine echte Implementierung erkunden

[Bounce](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Games/Source/Bounce.cpp) zeigt, wie eine Spielklasse den Kontext erhält, Schläger und Statistiken vorbereitet, Sound und Musik anfordert und die Szenen-Callbacks verwendet.

Um eine Szene in deiner Kopie hinzuzufügen, halte dich an die bestehende Aufteilung: Deklaration unter `Games/Include`, Implementierung unter `Games/Source` und explizite Registrierung in `SceneFactory.cpp`. CMake entdeckt die `.cpp`-Dateien dieser Ordner mit `GLOB_RECURSE CONFIGURE_DEPENDS`; es gibt kein zur Laufzeit geladenes Szenen-Plugin.

<span id="limitación-del-acceso-al-menú" aria-hidden="true"></span>

## Einschränkung beim Menüzugriff

Das Overlay enthält einen **Menu**-Button, und die Taste **M** führt denselben Ablauf aus. Engine fordert eine Szene namens `Menu` an, aber die Factory dieser Revision registriert sie nicht. Vermeide diese Aktion beim Erkunden der Version: Sie kann eine Assertion oder eine Exception wegen eines fehlenden Schlüssels auslösen.

Diese Dokumentation benennt die Einschränkung ausdrücklich; sie stellt das Menü nicht als verfügbare Spielauswahl dar.

<span id="fuentes" aria-hidden="true"></span>

## Quellen

- [Scene-Vertrag](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Include/Scene/Scene.h).
- [SceneFactory-Register](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Scene/SceneFactory.cpp).
- [Anfragen an SceneManager](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/SceneManager.cpp).
- [Übergänge in Engine](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Core/Engine.cpp).
