---
title: Konfiguration
description: Einstellungen für Fenster, Zeit, Audio und Cursor sowie Grenzen der aktuellen JSON-Konfiguration.
order: 3
category: Erste Schritte
---

<span id="el-archivo-de-configuración" aria-hidden="true"></span>

## Die Konfigurationsdatei

Die Engine liest `Content/Config.json` beim Erstellen des globalen Objekts `gConfig`. Dies ist der Inhalt der Referenzrevision:

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

## Was die einzelnen Werte steuern

| Schlüssel | Wirkung |
| --- | --- |
| `windowTitle` | Titel des SFML-Fensters. |
| `windowSize` | Anfangsgröße und Referenz für Renderziele und verschiedene Berechnungen der Spiele. |
| `frameRateLimit` | Für das Fenster angeforderte Bildratenbegrenzung; standardmäßig 120, wenn der Schlüssel fehlt. |
| `disableSfmlLogs` | Unterdrückt den SFML-Fehlerstream, wenn der Wert `true` ist. |
| `maximumDeltaTime` | Maximaler Simulationszeitschritt in Sekunden, den TimeManager pro Frame liefert. |
| `globalVolume` | Globale Lautstärke des SFML-Listeners. |
| `backgroundColor` | RGB-Färbung des von RenderManager verwendeten Hintergrunds. |
| `cursorRadius` | Radius des eigenen kreisförmigen Cursors. |
| `cursorSpeed` | Geschwindigkeit des Cursors bei Steuerung mit dem Controller. |
| `cursorColor` | RGB-Farbe des Cursors. |
| `joystickDeadzone` | Schwelle, unter der kleine Stickbewegungen beim Bewegen des Cursors ignoriert werden. |

Die Begrenzung auf 120 Frames ist eine Einstellung, **keine Leistungsmessung**. Sie bedeutet auch nicht, dass die Simulation einen festen Zeitschritt verwendet: Die Zeit variiert pro Frame und wird durch `maximumDeltaTime` begrenzt.

<span id="cambiar-la-configuración" aria-hidden="true"></span>

## Die Konfiguration ändern

Ändere das JSON bei geschlossener Anwendung und starte sie erneut aus dem Repository-Stammverzeichnis. Die Konfiguration wird beim Start geladen; es gibt weder automatisches Neuladen noch ein Einstellungsfenster, das diese Werte schreibt.

Behalte die Schlüssel und Typen des Beispiels bei. Der Parser implementiert weder ein Validierungsschema noch Ersatzwerte für alle Felder. Eine fehlende Datei, ungültiges JSON oder ein falscher Pflichtschlüssel können den Start verhindern.

Änderungen an `windowSize` beeinflussen auch Spielcode, der `gConfig.windowSize` nutzt. Das entspricht keinem vollständigen System für dynamische Auflösung. Das Größenänderungsereignis erstellt die Nachbearbeitungstexturen nicht automatisch neu.

<span id="configuración-de-cada-juego" aria-hidden="true"></span>

## Konfiguration der einzelnen Spiele

Spielspezifische Parameter liegen in `Games/Include/Config`: `BounceConfig.h`, `ClickerConfig.h`, `MemoryCardConfig.h`, `TicTacToeConfig.h`, `MineSweeperConfig.h`, `RunnerConfig.h` und `TetrisConfig.h`.

Es handelt sich um C++-Konstanten; Änderungen erfordern eine Neukompilierung. Auch die Startszene wird nicht über `Config.json` gewählt: Sie ist mit `ChangeScene("Tetris")` im Konstruktor von `Engine` festgelegt.

<span id="preferencias-del-sitio-y-del-motor" aria-hidden="true"></span>

## Einstellungen der Website und der Engine

Die Auswahl zwischen hellem, dunklem und System-Design auf dieser Website verändert nur ihre Weboberfläche. Die Engine richtet TGUI mit `Content/Themes/Dark.txt` ein; die Dokumentation setzt nicht voraus, dass die Web-Designauswahl im Programm existiert.

<span id="fuentes" aria-hidden="true"></span>

## Quellen

- [Originalwerte von Config.json](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Content/Config.json).
- [Einlesen von EngineConfig](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Core/EngineConfig.cpp).
- [Berechnung der Delta-Zeit](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/TimeManager.cpp).
