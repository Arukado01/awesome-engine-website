---
title: Einführung
description: Was Awesome Engine enthält, was du in seinem Code untersuchen kannst und wie der Status der Systeme zu verstehen ist.
order: 1
category: Erste Schritte
---

<span id="un-motor-2d-que-puedes-recorrer-por-dentro" aria-hidden="true"></span>

## Eine 2D-Engine, die du von innen erkunden kannst

Awesome Engine ist eine in **C++20** geschriebene Spiele-Engine auf Basis von SFML. Ihr Kern verbindet Szenen mit Diensten für Rendering, Ressourcen, Eingabe, Audio, Benutzeroberflächen und Persistenz. Die Spiele im Repository zeigen die Verwendung dieser Dienste aus C++.

Die Dokumentation bezieht sich auf den [Commit `5a6dfac`](https://github.com/Arukado01/AwesomeEngine/tree/5a6dfacd86414c4cdfaa7157b533330f173a3126). Sie beschreibt den Inhalt dieser Revision; Änderungen, die nur im lokalen Arbeitsverzeichnis beobachtet wurden, sind als **in Entwicklung** gekennzeichnet.

<span id="lo-que-encontrarás" aria-hidden="true"></span>

## Was du findest

- **Sieben Spielszenen:** Bounce, Clicker, MemoryCard, TicTacToe, MineSweeper, Runner und Tetris.
- **2D-Rendering:** darstellbare SFML-Objekte, Zwischentexturen und die Nachbearbeitung mit Bloom und Monitor.
- **Aktionsbasierte Eingabe:** Tastatur, Maus und Controller mit mehreren Belegungen für dieselbe Aktion.
- **Gemeinsame Dienste:** Ressourcen, Zeit, Audio, Partikel, JSON-Speicherung und PNG-Aufnahmen.
- **TGUI-Oberfläche:** Widgets und ein Pausen-Overlay, die in die Fensterereignisse eingebunden sind.

Diese Systeme werden über `EngineContext` verbunden. Jedes Spiel implementiert die Schnittstelle `Scene` und verwaltet seine eigenen Objekte und Regeln. Die dokumentierte Revision enthält weder eine ECS-Architektur noch einen visuellen Editor.

<span id="el-recorrido-recomendado" aria-hidden="true"></span>

## Der empfohlene Einstieg

1. [Installiere und kompiliere das Projekt](/de/docs/instalacion/).
2. [Prüfe die Laufzeitkonfiguration](/de/docs/configuracion/).
3. [Verfolge die Engine-Schleife und ihre Abhängigkeiten](/de/docs/arquitectura/).
4. [Lies den Vertrag der Szenen](/de/docs/escenas/).
5. Erkunde [Rendering](/de/docs/renderizado/), [Ressourcen](/de/docs/recursos/) sowie [Eingabe und Audio](/de/docs/entrada-audio/).

<span id="cómo-interpretar-los-estados" aria-hidden="true"></span>

## So sind die Statusangaben zu verstehen

| Status | Bedeutung auf dieser Website |
| --- | --- |
| Implementiert | In der Referenzrevision existiert konkreter Code. Das ist keine Zertifizierung sämtlicher Plattformen oder Anwendungsfälle. |
| In Entwicklung | Eine Implementierung oder Änderungen liegen lokal vor, sind aber noch nicht Teil des Referenz-Commits. |
| Experimentell | Der Code existiert, seine Einbindung ist jedoch deaktiviert oder nicht am beschriebenen normalen Ablauf beteiligt. |
| Geplant | Das Projekt muss eine entsprechende Absicht dokumentiert haben. Ohne diesen Nachweis wird keine Funktion so eingeordnet. |

`AudioGroup`, `SpriteAnimator`, `SweptAabb` und die gemeinsame Uhr für Cooldowns wurden als lokale Arbeiten beobachtet. Diese APIs sind beim Klonen der Referenzrevision nicht zu erwarten.

<span id="alcance-de-la-plataforma" aria-hidden="true"></span>

## Plattformumfang

Das Repository enthält eine Arbeitskonfiguration für **Windows mit MinGW, Ninja und GDB**. Das Audit bestätigt weder Kompilierung noch Ausführung unter Linux, macOS, auf Mobilgeräten oder im Browser. Die verwendeten Bibliotheken allein belegen keine vollständige Plattformkompatibilität der Engine.

Der Engine-Code steht unter der [MIT-Lizenz](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/LICENSE.md). Die Einträge im Änderungsverlauf beziehen sich auf echte Commits, nicht auf erfundene Release-Versionen.

<span id="fuentes" aria-hidden="true"></span>

## Quellen

- [Abhängigkeiten und Build-Optionen](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/CMakeLists.txt).
- [Registrierung der Szenen](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Scene/SceneFactory.cpp).
- [Dienste von EngineContext](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Include/Core/EngineContext.h).
