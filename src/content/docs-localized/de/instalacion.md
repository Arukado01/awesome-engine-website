---
title: Installation und Kompilierung
description: Bereite CMake und einen C++20-Compiler vor, erstelle die ausführbare Datei und starte sie aus dem richtigen Verzeichnis.
order: 2
category: Erste Schritte
---

<span id="requisitos-del-proyecto" aria-hidden="true"></span>

## Voraussetzungen des Projekts

| Werkzeug | Verifizierte Voraussetzung |
| --- | --- |
| C++-Compiler | Unterstützung für C++20 und die verwendete Standardbibliothek, einschließlich `std::format`. |
| CMake | Version 3.28 oder neuer. |
| Git | Zum Klonen des Projekts und Herunterladen von SFML über FetchContent erforderlich. |
| Ninja | Erforderlich, wenn du den Generator aus den Befehlen dieses Leitfadens wählst. |
| Internetverbindung | Die erste Konfiguration lädt Abhängigkeiten herunter. |

Die in `.vscode` eingerichtete Umgebung verwendet Windows, MinGW GCC, Ninja und GDB. Die folgenden Befehle leiten sich aus `CMakeLists.txt` und dieser Konfiguration ab; sie stellen keine zertifizierte Build-Matrix dar.

<span id="obtener-el-código" aria-hidden="true"></span>

## Den Code abrufen

In einem Terminal, in dem die Werkzeuge über `PATH` erreichbar sind:

```sh
git clone https://github.com/Arukado01/AwesomeEngine.git
cd AwesomeEngine
```

Um genau den hier beschriebenen Code anzusehen, kannst du in einer neuen Kopie die geprüfte Revision auswählen:

```sh
git checkout 5a6dfacd86414c4cdfaa7157b533330f173a3126
```

Dieser letzte Befehl setzt die Kopie auf einen bestimmten Commit. Wenn du Änderungen entwickeln möchtest, erstelle vor Beginn einen eigenen Branch. Die Dokumentation verlinkt jede Quelle ebenfalls auf diese Revision, damit du sie mit späteren Aktualisierungen vergleichen kannst.

<span id="configurar-y-compilar" aria-hidden="true"></span>

## Konfigurieren und kompilieren

```sh
cmake -S . -B Build -G Ninja -DCMAKE_BUILD_TYPE=Debug
cmake --build Build --parallel
```

CMake fasst die `.cpp`-Dateien aus `Engine/Source` und `Games/Source` zu einer ausführbaren Datei namens `AwesomeEngine` zusammen. Die Abhängigkeiten werden mit `FetchContent` bezogen:

- SFML 3.1.0.
- nlohmann/json 3.12.0.
- spdlog 1.16.0.
- TGUI 1.13.0.
- magic_enum 0.9.8.

Für einen getrennten Release-Build:

```sh
cmake -S . -B BuildRelease -G Ninja -DCMAKE_BUILD_TYPE=Release
cmake --build BuildRelease --parallel
```

Das Projekt sieht auch Optionen für den MSVC-Compiler vor, die obigen Schritte verwenden jedoch Ninja und den Compiler deiner Umgebung. Mische keine Generatoren oder Compiler im selben Build-Verzeichnis.

<span id="ejecutar-en-windows" aria-hidden="true"></span>

## Unter Windows ausführen

Lass das Terminal im **Stammverzeichnis des Repositorys**, neben `Content`:

```powershell
.\Build\AwesomeEngine.exe
```

Die dokumentierte Revision fordert **Tetris** als Startszene an. In dieser Revision ist keine funktionsfähige Spielauswahl registriert: Die Startszene wird in `Engine.cpp` festgelegt.

Das Arbeitsverzeichnis ist wichtig. Konfiguration, Shader, Schrift und andere Ressourcen werden über relative Pfade wie `Content/Config.json` geladen. Ein Start aus `Build` kann verhindern, dass die Engine sie findet.

<span id="trabajo-con-vs-code" aria-hidden="true"></span>

## Mit VS Code arbeiten

Das Repository enthält Build-Aufgaben und eine Debugging-Konfiguration für GDB. Die ausführbare Datei liegt unter `Build/AwesomeEngine.exe`; das Arbeitsverzeichnis bleibt das Stammverzeichnis.

Einige Editoroptionen enthalten absolute Pfade vom Rechner des Autors. Passe die Pfade zu Compiler und Werkzeugen an deine Installation an; übernimm sie nicht als allgemeine Voraussetzungen.

<span id="si-la-compilación-o-el-arranque-fallan" aria-hidden="true"></span>

## Wenn Build oder Start fehlschlagen

Sieh unter [Fehlerbehebung](/de/docs/problemas/) nach: Dort werden Werkzeugprobleme, fehlgeschlagene Downloads, Ressourcenprobleme und bekannte Einschränkungen des Codes unterschieden. Dieser Leitfaden veröffentlicht weder einen Installer noch eine plattformübergreifende Binärdatei.

<span id="fuentes" aria-hidden="true"></span>

## Quellen

- [CMakeLists.txt](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/CMakeLists.txt).
- [Build-Aufgaben](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/.vscode/tasks.json).
- [Debugging und Arbeitsverzeichnis](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/.vscode/launch.json).
