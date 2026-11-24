---
title: Konfiguration
description: Einstellungen für Fenster, Zeit, Audio und Cursor sowie Grenzen der aktuellen JSON-Konfiguration.
order: 3
category: Erste Schritte
---

<span id="el-archivo-de-configuración" aria-hidden="true"></span>

## Die Konfigurationsdatei

Die Engine liest `Content/Config.json` beim Start. Das Beispiel zeigt einen Eintrag in `games`.

```json
{
  "windowTitle": "Awesome Engine",
  "windowSize": [800, 800],
  "frameRateLimit": 120,
  "disableSfmlLogs": true,
  "maximumDeltaTime": 0.03,
  "globalVolume": 100,
  "backgroundColor": [100, 100, 100],
  "cursorSize": 21,
  "cursorSpeed": 800,
  "joystickDeadzone": 0.1,
  "games": [
    {
      "name": "Clicker",
      "title": "Clicker",
      "controls": "Hit: Left Click / South"
    }
  ]
}
```

<span id="qué-controla-cada-valor" aria-hidden="true"></span>

## Was die einzelnen Werte steuern

| Schlüssel | Wirkung |
| --- | --- |
| `windowTitle` | Titel des SFML-Fensters. |
| `windowSize` | Anfängliche Fenstergröße und logische Größe des Spielbereichs. |
| `frameRateLimit` | Für das Fenster angeforderte Bildratenbegrenzung; standardmäßig 120, wenn der Schlüssel fehlt. |
| `disableSfmlLogs` | Unterdrückt den SFML-Fehlerstream, wenn der Wert `true` ist. |
| `maximumDeltaTime` | Maximaler Simulationszeitschritt in Sekunden, den TimeManager pro Frame liefert. |
| `globalVolume` | Globale Lautstärke des SFML-Listeners. |
| `backgroundColor` | RGB-Färbung des von RenderManager verwendeten Hintergrunds. |
| `cursorSize` | Längste Seite des Zeigers aus `Icon.png` in Pixeln. Der Standardwert ist 24. |
| `cursorSpeed` | Geschwindigkeit des Cursors bei Steuerung mit dem Controller. |
| `joystickDeadzone` | Schwelle, unter der kleine Stickbewegungen beim Bewegen des Cursors ignoriert werden. |

Die Begrenzung auf 120 Frames ist eine Einstellung, **keine Leistungsmessung**. Sie bedeutet auch nicht, dass die Simulation einen festen Zeitschritt verwendet: Die Zeit variiert pro Frame und wird durch `maximumDeltaTime` begrenzt.

<span id="cambiar-la-configuración" aria-hidden="true"></span>

## Die Konfiguration ändern

Ändere das JSON bei geschlossener Anwendung und starte sie erneut aus dem Repository-Stammverzeichnis. Die Konfiguration wird beim Start geladen; es gibt weder automatisches Neuladen noch ein Einstellungsfenster, das diese Werte schreibt.

Behalte die Schlüssel und Typen des Beispiels bei. Der Parser implementiert weder ein Validierungsschema noch Ersatzwerte für alle Felder. Eine fehlende Datei, ungültiges JSON oder ein falscher Pflichtschlüssel können den Start verhindern.

`windowSize` legt die Referenzgröße für die Spiele fest. Ändert sich die Fenstergröße, passt die Engine die Darstellung an die tatsächliche Größe an und behält die Koordinaten und Proportionen bei.

<span id="configuración-de-cada-juego" aria-hidden="true"></span>

## Konfiguration der einzelnen Spiele

Die Liste `games` bestimmt die Spiele im Menü und ihre Reihenfolge. `name` muss dem Schlüssel in `SceneFactory` entsprechen. `title` ist die Beschriftung und `controls` der Hilfetext. Lass mindestens einen Eintrag in der Liste und starte die Engine nach Änderungen neu.

Die Regeln liegen in `Games/Include/Config`. Änderungen erfordern eine Neukompilierung. `Engine` startet die Szene `Menu`.

<span id="preferencias-del-sitio-y-del-motor" aria-hidden="true"></span>

## Einstellungen der Website und der Engine

Die Auswahl zwischen hellem, dunklem und System-Design auf dieser Website verändert nur ihre Weboberfläche. Die Engine richtet TGUI mit `Content/Themes/Dark.txt` ein; die Dokumentation setzt nicht voraus, dass die Web-Designauswahl im Programm existiert.

<span id="fuentes" aria-hidden="true"></span>

## Quellen

- [Originalwerte von Config.json](https://github.com/Arukado01/AwesomeEngine/blob/60ce8139fbd36713821bf85debd96bf0bd1c8bb3/Content/Config.json).
- [Einlesen von EngineConfig](https://github.com/Arukado01/AwesomeEngine/blob/60ce8139fbd36713821bf85debd96bf0bd1c8bb3/Engine/Source/Core/EngineConfig.cpp).
- [Berechnung der Delta-Zeit](https://github.com/Arukado01/AwesomeEngine/blob/60ce8139fbd36713821bf85debd96bf0bd1c8bb3/Engine/Source/Managers/TimeManager.cpp).
