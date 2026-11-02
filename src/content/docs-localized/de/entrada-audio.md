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

AudioManager stellt über SFML die globale Lautstärke sowie Position und Richtung des Listeners bereit. ResourceManager liefert Soundbuffer und Musikobjekte; die Szene besitzt die Quellen und steuert deren Wiedergabe.

```cpp
void AudioManager::SetGlobalVolume(float volume) {
  sf::Listener::setGlobalVolume(volume);
}
```

In dieser Revision koordinieren die Spiele ihr eigenes Audio während `OnPause` und `OnCleanup`. Ein konfigurierbarer Bus-Mixer oder Audioeditor ist nicht dokumentiert.

<span id="trabajo-local-en-desarrollo" aria-hidden="true"></span>

### Lokale Arbeiten in Entwicklung

Beim Audit wurden `AudioGroup.h` und `AudioGroup.cpp` als noch nicht im Referenz-Commit enthaltene Dateien gefunden. Sie gruppieren Quellen je Szene, unterscheiden Music-/Effect-Kanäle und merken sich, welche Quellen vor der Pause liefen.

Es gibt auch lokale Änderungen für eine gemeinsame Cooldown-Uhr. Diese Implementierungen wurden beobachtet, gehören jedoch nicht zu den öffentlichen Beispielen dieses Leitfadens. Verwende diese APIs nicht in der Erwartung, sie im verlinkten Commit zu finden.

<span id="interfaz-tgui" aria-hidden="true"></span>

## TGUI-Oberfläche

GuiManager verbindet TGUI mit dem SFML-Fenster. Er lädt `Content/Themes/Dark.txt`, verwendet die Schrift `Relidux.otf`, aktiviert Tab-Navigation und bietet Methoden zum Hinzufügen und Entfernen von Widgets.

Das Overlay erstellt Buttons mithilfe von `magic_enum` aus `OverlaySelection`. Die Auswahl wird einmal verarbeitet, und Engine führt die zugehörige Aktion aus. Die GUI wird nach der Nachbearbeitung der Szene gezeichnet.

<span id="fuentes" aria-hidden="true"></span>

## Quellen

- [Eingabetypen](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Include/utils/InputBindings.h).
- [Abfrage der Belegungen](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/InputManager.cpp).
- [Controller-Zuordnung](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Utils/InputBindings.cpp).
- [AudioManager](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/AudioManager.cpp).
- [GuiManager](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/GuiManager.cpp).
