---
title: Architektur der Engine
description: Erkunde die Hauptschleife, EngineContext, Objektbesitz und die Beziehungen zwischen den Systemen.
order: 4
category: Engine-Kern
---

<span id="de-la-entrada-al-frame" aria-hidden="true"></span>

## Von der Eingabe zum Frame

`main()` erstellt eine `Engine` und wiederholt drei Operationen, solange das Fenster geöffnet bleibt. Dieser Ausschnitt stammt aus dem Referenzcode:

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

Ohne Fokus verarbeitet die Schleife weiterhin Ereignisse und aktualisiert die Uhr; sie überspringt das Rendering und wartet 10 ms. Auch `Engine::Update` prüft den Fokus, bevor die Szene fortschreitet.

<span id="responsabilidades-de-engine" aria-hidden="true"></span>

## Aufgaben von Engine

`Engine` besitzt das Fenster, einen `EngineContext`, das Szenenregister, die Referenz auf die aktive Szene und ein Pausen-Overlay. Ihre Aufgabe ist es, diese Elemente zu koordinieren.

```text
Engine
├── sf::RenderWindow
├── EngineContext
│   ├── renderer · resources · particles
│   ├── input · cursor · gui
│   ├── audio · time · random
│   └── scenes · save · screenshot · clipboard
├── SceneFactory::Scenes
│   └── Name → unique_ptr<Scene>
├── currentScene → aktive Scene
└── Overlay → TGUI-Widgets
```

Der Kontext wird jeder Szene als Referenz übergeben. So kann ein Spiel auf `ctx.renderer`, `ctx.input` oder `ctx.resources` zugreifen, ohne Dienste doppelt anzulegen.

<span id="procesamiento-de-eventos" aria-hidden="true"></span>

## Ereignisverarbeitung

Zu Beginn von `ProcessEvent` verarbeitet die Engine den ausstehenden Szenenwechsel. Anschließend entnimmt sie die Ereignisse aus `sf::RenderWindow` und verteilt sie:

1. `EngineVisitor` behandelt Schließen, Fokus, Größe, Controller und globale Tastenkürzel.
2. `GuiManager` übergibt das Ereignis an TGUI.
3. Die Szene erhält `OnEvent`, wenn das Overlay verborgen ist.
4. Die Engine verarbeitet eine mögliche Overlay-Auswahl und synchronisiert den Pausenzustand.

GUI und Szene nehmen an derselben Verarbeitung teil; ein separater Ereignisbus ist nicht dokumentiert.

<span id="actualización-y-tiempo" aria-hidden="true"></span>

## Aktualisierung und Zeit

`TimeManager` berechnet die seit dem vorherigen Frame verstrichene Zeit und begrenzt sie auf `gConfig.maximumDeltaTime`. Danach wird der Cursor aktualisiert; ist das Overlay verborgen, wird `Scene::Update` aufgerufen.

Das System implementiert keinen Akkumulator für feste Zeitschritte. Die Spiele entscheiden, wie sie die Delta-Zeit und ihre eigenen Timer verwenden.

In der Referenzrevision implementiert jede Szene ihre Reaktion auf `OnPause`, einschließlich Audio und Timer. Eine lokale Überarbeitung der Cooldown-Uhr ist als **in Entwicklung** gekennzeichnet und gehört nicht zu dieser öffentlichen Referenz-API.

<span id="renderizado-y-capas" aria-hidden="true"></span>

## Rendering und Ebenen

Die Szene zeichnet auf eine `sf::RenderTexture`. RenderManager wendet die Effektkette an und gibt die fertige Textur zurück. Engine zeigt sie im Fenster an und zeichnet GUI und Cursor darüber.

```text
Scene::Render
     ↓
RenderManager / RenderTexture
     ↓
Bloom → Monitor
     ↓
Fenster → GUI → Cursor → display
```

Die Effekte werden nur hinzugefügt, wenn `sf::Shader::isAvailable()` wahr zurückgibt. GUI und Cursor werden nach der Nachbearbeitung gezeichnet. Unter [Rendering](/de/docs/renderizado/) findest du die einzelnen Bloom-Durchläufe.

<span id="propiedad-y-memoria" aria-hidden="true"></span>

## Besitz und Speicher

- Szenen werden in einer `unordered_map` mit `unique_ptr<Scene>` gespeichert.
- Effekte werden in einem Vektor mit `unique_ptr<Effect>` gespeichert.
- Die aktive Szene ist ein nicht besitzender Zeiger; ihr Objekt gehört weiterhin dem Register.
- Die Manager sind als Werte in `EngineContext` enthalten.
- ResourceManager speichert Ressourcen als Werte in Maps.

Das Projekt verwendet RAII und Standardcontainer. Es gibt weder eine eigene Speicherverwaltung noch ein generisches ECS. Alle registrierten Szenen werden in `CreateScenes` erstellt; ein Szenenwechsel erzeugt nicht bei jeder Transition eine neue Instanz.

<span id="organización-del-código" aria-hidden="true"></span>

## Aufbau des Codes

| Verzeichnis | Inhalt |
| --- | --- |
| `Engine/Include` | Verträge und Typen für Kern, Manager, Szenen, Effekte und Hilfsfunktionen. |
| `Engine/Source` | Implementierungen und Einstiegspunkt. |
| `Games/Include` | Spielklassen, Typen und Konfigurationskonstanten. |
| `Games/Source` | Spiellogik und Rendering. |
| `Content` | Grafik- und Audioressourcen, Schriften, Shader, Theme und JSON. |

<span id="fuentes" aria-hidden="true"></span>

## Quellen

- [Hauptschleife](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Main.cpp).
- [Koordination durch Engine](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Core/Engine.cpp).
- [Definition von EngineContext](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Include/Core/EngineContext.h).
- [Besitz der Szenen](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Include/Scene/SceneFactory.h).
