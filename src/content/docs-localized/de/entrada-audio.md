---
title: Eingabe, Audio und Oberfläche
description: Aktionsbelegung, Controller, globale Tastenkürzel, Audiowiedergabe und TGUI-Widgets.
order: 8
category: Systeme
---

<span id="una-acción-varias-entradas" aria-hidden="true"></span>

## Eine Aktion, mehrere Eingaben

InputManager verwendet ganzzahlige Aktionskennungen und eine `unordered_multimap` für Belegungen. Eine Aktion kann mit mehreren Eingaben verknüpft werden. `Pressed(action)` gibt wahr zurück, sobald eine der zugewiesenen Eingaben gedrückt ist.

Die Referenzrevision enthält folgende Belegungstypen:

```cpp
struct Keyboard {
  sf::Keyboard::Scan key;
};
struct Mouse {
  sf::Mouse::Button button;
};
struct Gamepad {
  GamepadButton button;
  int id = 0;
};
struct Axis {
  sf::Joystick::Axis axis;
  float threshold = 0.5f;
  int id = 0;
};

using Binding = std::variant<Keyboard, Mouse, Gamepad, Axis>;
```

Diese Typen gehören zum Namensraum `Input`. Die Abfrage liefert den aktuellen Zustand und erkennt nicht automatisch den Zeitpunkt des Tastendrucks. Für einzelne Ereignisse steht den Szenen auch `OnEvent` zur Verfügung.

Achsen werden durch Division ihres Werts durch 100 normalisiert und mit der eingestellten positiven oder negativen Schwelle verglichen. Engine löscht die Belegungen beim Szenenwechsel; jedes Spiel muss seine Belegungen beim Start erneut setzen.

<span id="mandos-y-cursor" aria-hidden="true"></span>

## Controller und Cursor

Der Code enthält Tabellen logischer Tasten für Xbox und PlayStation. Bei Erkennung des Herstellers Microsoft wird die Xbox-Tabelle gewählt, andernfalls die PlayStation-Tabelle. Diese Heuristik garantiert keine gleiche Belegung aller Controller.

Die L2/R2-Trigger besitzen in der Xbox-Tabelle keinen Button: In dieser Tastenbelegung ist ihr Eintrag als nicht verfügbar markiert. Achsen sind ein eigenständiger Belegungstyp.

CursorManager bewegt den Cursor mit dem Stick unter Berücksichtigung von `joystickDeadzone`. Er rechnet außerdem die Mausposition in die Koordinaten einer Ansicht um. GuiManager wandelt den logischen Button South in Klickereignisse für Widgets um.

<span id="atajos-globales" aria-hidden="true"></span>

## Globale Tastenkürzel

| Eingabe | Aktion |
| --- | --- |
| F12 | Eine PNG-Aufnahme speichern. |
| R | Die aktive Szene neu starten. |
| Escape / Start am Controller | Das Pausen-Overlay ein- oder ausblenden. |
| M / Select am Controller | `Menu` anfordern; diese Szene ist in der dokumentierten Revision nicht registriert. |

Die Tastenkürzel werden in `EngineVisitor` verarbeitet. Bei Fokusverlust wird die Szene pausiert. Bei Rückkehr des Fokus wird sie nur fortgesetzt, wenn das Overlay nicht mehr geöffnet ist.

<span id="audio-de-la-revisión-de-referencia" aria-hidden="true"></span>

## Audio in der Referenzrevision

AudioManager verwaltet globale Lautstärke und Music-/Effect-Pegel. ResourceManager liefert gemeinsame Puffer und Musik; jede Szene verwaltet ihre Quellen.

```cpp
void AudioManager::SetGlobalVolume(float volume) {
  sf::Listener::setGlobalVolume(volume);
}
```

<span id="trabajo-local-en-desarrollo" aria-hidden="true"></span>

<span id="grupos-de-audio" aria-hidden="true"></span>

### Audiogruppen

`AudioManager::CreateGroup` erstellt eine `AudioGroup` für Sounds und Musik einer Szene. Sie pausiert und startet nur zuvor laufende Quellen und kann Kanäle stoppen oder einstellen. Runner und Bounce nutzen sie.

Bewahre die Gruppe in der Szene auf, damit ihre Quellen erhalten bleiben; zum Beispiel:

```cpp
auto sound = audioGroup.AddSound(ctx.resources.AcquireSound("RunnerJump.wav"), 20.f);
if (sound) audioGroup.Play(*sound);
```

<span id="interfaz-tgui" aria-hidden="true"></span>

## TGUI-Oberfläche

GuiManager verbindet TGUI mit dem SFML-Fenster. Er lädt `Content/Themes/Dark.txt`, verwendet die Schrift `Relidux.otf`, aktiviert Tab-Navigation und bietet Methoden zum Hinzufügen und Entfernen von Widgets.

Das Overlay erstellt Buttons mithilfe von `magic_enum` aus `OverlaySelection`. Die Auswahl wird einmal verarbeitet, und Engine führt die zugehörige Aktion aus. Die GUI wird nach der Nachbearbeitung der Szene gezeichnet.

<span id="fuentes" aria-hidden="true"></span>

## Quellen

- [Eingabetypen](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Include/utils/InputBindings.h).
- [Abfrage der Belegungen](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/InputManager.cpp).
- [Controller-Zuordnung](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Utils/InputBindings.cpp).
- [AudioManager](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/AudioManager.cpp).
- [GuiManager](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/GuiManager.cpp).

- [AudioGroup](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Include/Managers/AudioGroup.h).
