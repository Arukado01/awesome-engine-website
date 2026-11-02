---
title: Fehlerbehebung
description: Konkrete Diagnose für Builds, Ressourcen, Steuerung, Speicherung und Grenzen der geprüften Revision.
order: 9
category: Referenz
---

<span id="cmake-no-configura-el-proyecto" aria-hidden="true"></span>

## CMake konfiguriert das Projekt nicht

Prüfe, ob du im richtigen Stammverzeichnis bist und `cmake --version` mindestens Version 3.28 zeigt. Wenn du `-G Ninja` gewählt hast, müssen Ninja und der Compiler im Terminal erreichbar sein.

CMake verwendet FetchContent zum Herunterladen von Abhängigkeiten. Ein Verbindungs-, Proxy- oder Git-Fehler kann diese Phase schon vor dem Kompilieren der Engine stoppen. Bewahre die ursprüngliche Meldung auf, um einen fehlgeschlagenen Download von einem C++-Fehler unterscheiden zu können.

Wenn du Generator oder Compiler wechseln musst, konfiguriere ein neues Verzeichnis; verwende keinen Cache weiter, der mit anderen Werkzeugen erstellt wurde.

<span id="el-compilador-no-encuentra-funciones-de-c20" aria-hidden="true"></span>

## Der Compiler findet C++20-Funktionen nicht

Das Projekt fordert C++20 an und verwendet Standardbibliotheksfunktionen wie `std::format`. Die Auswahl des Standards ergänzt keine Funktionen, die einer alten Compilerbibliothek fehlen. Prüfe sowohl die Compilerversion als auch die Standardbibliothek.

Die Pfade in `.vscode` stammen vom Rechner des Autors. Ein ungültiger Pfad in diesen Einstellungen bedeutet nicht, dass du deine Werkzeuge am gleichen Ort installieren musst.

<span id="el-ejecutable-no-encuentra-configjson-o-los-recursos" aria-hidden="true"></span>

## Das Programm findet Config.json oder Ressourcen nicht

Starte es aus dem Stammverzeichnis neben `Content`:

```powershell
.\Build\AwesomeEngine.exe
```

Wechsle vorher nicht in das Verzeichnis `Build`. Konfiguration, Shader, Texturen, Schriften und Sounds nutzen relative Pfade. Prüfe außerdem, ob die Namen genau mit den Dateien deiner Kopie übereinstimmen.

Ungültiges JSON oder ein fehlender Pflichtschlüssel können den Start stoppen. Vergleiche mit der [Referenzdatei](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Content/Config.json) und behalte die erwarteten Typen bei.

<span id="fallos-en-sistemas-sensibles-a-mayúsculas" aria-hidden="true"></span>

## Fehler auf Systemen mit Beachtung der Großschreibung

Die geprüfte Revision enthält Unterschiede zwischen Git-Pfaden und den im Code verwendeten Pfaden. Beispielsweise enthält der Baum `Engine/Include/utils`, während mehrere Includes `Utils` verwenden.

Windows kann diese Unterschiede in seiner üblichen Konfiguration tolerieren. Andere Systeme können sie ablehnen. Die Dokumentation bestätigt keine Linux-/macOS-Kompatibilität und stellt deren Builds nicht als geprüft dar.

<span id="menu-o-la-tecla-m-detienen-la-aplicación" aria-hidden="true"></span>

## Menu oder die Taste M stoppen die Anwendung

Engine fordert eine Szene namens `Menu` an, doch SceneFactory registriert diesen Namen nicht. In Debug kann dadurch eine Assertion auslösen; auch in anderen Konfigurationen kann der Map-Zugriff fehlschlagen.

Vermeide in dieser Revision den Menu-Button, M und Select am Controller. Mit Escape setzt du fort, mit R startest du neu, und mit Quit beendest du die Anwendung. Es gibt keine funktionierende Szenenauswahl, die diese Dokumentation empfehlen könnte.

<span id="el-juego-se-pausa-al-cambiar-de-ventana" aria-hidden="true"></span>

## Das Spiel pausiert beim Fensterwechsel

Das ist vorgesehenes Verhalten: Engine reagiert auf Fokusverlust, indem sie die Szene pausiert. Die Schleife rendert ohne Fokus nicht, hält aber die Uhr aktuell. Ist das Overlay nach der Rückkehr noch sichtbar, verwende Resume oder Escape.

In der öffentlichen Referenzrevision steuert jede Szene ihre Reaktion auf Pausen selbst. Die auf dem Rechner beobachtete Überarbeitung der gemeinsamen Cooldown-Uhr war noch eine lokale Änderung.

<span id="no-aparecen-los-efectos-o-cambia-su-aspecto-al-redimensionar" aria-hidden="true"></span>

## Effekte fehlen oder sehen nach einer Größenänderung anders aus

Die Kette wird nur konfiguriert, wenn `sf::Shader::isAvailable()` wahr ist. Bei ihrer Erstellung sind Bloom und Monitor aktiv; Glitch und Invertierung sind nicht in den normalen Ablauf eingebunden.

Die Rendertexturen werden mit der konfigurierten Größe erstellt. Der Resize-Callback erstellt sie nicht neu; ein vollständiges System für dynamische Auflösung ist daher nicht zu erwarten.

<span id="un-mando-responde-de-forma-inesperada" aria-hidden="true"></span>

## Ein Controller reagiert unerwartet

Die Tastenzuordnung unterscheidet den Hersteller Microsoft und verwendet für andere Controller eine alternative Tabelle. Prüfe `InputBindings.cpp` und die von SFML gelieferte Identifikation. Eine universelle Controller-Datenbank oder eine Oberfläche für dauerhaftes Neubelegen wurde nicht gefunden.

<span id="el-guardado-no-se-borra-al-llamar-clear" aria-hidden="true"></span>

## Clear löscht den Spielstand nicht

SaveManager leert die Daten im Speicher, schreibt bei seiner Zerstörung aber nur, wenn noch Werte vorhanden sind. `Clear` entfernt deshalb nicht zwangsläufig die vorherige Datei. Sichere vor Tests `Content/Save.json` und prüfe ihren Inhalt bei geschlossener Anwendung.

Auch für eine Speicherdatei mit ungültigem JSON ist keine allgemeine Wiederherstellung implementiert.

<span id="no-se-guarda-una-captura" aria-hidden="true"></span>

## Eine Bildschirmaufnahme wird nicht gespeichert

F12 speichert unter `Content/Screenshots`. Prüfe Schreibrechte und freien Speicherplatz. ScreenshotManager protokolliert, ob das Bild gespeichert werden konnte; der Aufnahmeton wird nur abgespielt, wenn der Speichervorgang Erfolg meldet.

<span id="comunicar-un-problema-reproducible" aria-hidden="true"></span>

## Ein reproduzierbares Problem melden

Gib beim Erstellen eines Issues im [Repository](https://github.com/Arukado01/AwesomeEngine) den verwendeten Commit, das Betriebssystem, den Compiler, den ausgeführten Befehl, das Arbeitsverzeichnis, die Fehlermeldung und die Schritte zur Reproduktion an. Teile mit, ob deine Kopie lokale Änderungen enthält: So lässt sich veröffentlichter Code von noch laufender Entwicklung unterscheiden.

<span id="fuentes" aria-hidden="true"></span>

## Quellen

- [Build-Konfiguration](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/CMakeLists.txt).
- [Verhalten von Engine](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Core/Engine.cpp).
- [Tatsächliches Szenenregister](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Scene/SceneFactory.cpp).
- [Persistenz mit SaveManager](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/SaveManager.cpp).
