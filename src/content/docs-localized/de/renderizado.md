---
title: Rendering und Effekte
description: Wie eine 2D-Szene gezeichnet wird, Bloom und Monitor angewendet werden und Ansichten sowie Partikel funktionieren.
order: 5
category: Systeme
---

<span id="una-escena-una-textura-intermedia" aria-hidden="true"></span>

## Eine Szene, eine Zwischentextur

RenderManager bietet `Draw(const sf::Drawable&)` zum Zeichnen der SFML-Objekte einer Szene an. Intern leitet er sie an `target_` weiter, eine mit der konfigurierten Größe erzeugte `sf::RenderTexture`.

Zu Beginn des Frames leert `BeginDrawing` das Ziel und zeichnet den Hintergrund. `FinishDrawing` stellt die Textur bereit, wendet die Effekte an und gibt die Textur zurück, die Engine im Fenster anzeigt. Szenen müssen das Fenster nicht direkt verwalten.

<span id="cadena-de-posprocesado" aria-hidden="true"></span>

## Nachbearbeitungskette

Dies ist die Effektauswahl im Referenzcode:

```cpp
// Post Process Effects
 effects_.emplace_back(std::make_unique<EffectBloom>());
 effects_.emplace_back(std::make_unique<EffectMonitor>());
 // effects_.emplace_back(std::make_unique<EffectGlitch>());
```

Bloom und Monitor werden nur hinzugefügt, wenn Shader verfügbar sind. Um mehrere Effekte anzuwenden, wechselt `FinishDrawing` zwischen zwei Zielen: Die Ausgabe eines Durchlaufs wird zur Eingabe des nächsten.

| Effekt | Status | Funktion |
| --- | --- | --- |
| Bloom | Implementiert und aktiv | Zeichnet das Bild mit halber Auflösung weich und addiert das Ergebnis zum Originalbild. |
| Monitor | Implementiert und aktiv | Wendet den Monitor-Shader mit Auflösung und Zeit als Parametern an. |
| Glitch | Experimentell; deaktiviert | Klasse und Shader existieren, die Einbindung in die Pipeline ist jedoch auskommentiert. |
| Invertierung | Experimentell; nicht verbunden | Klasse und Shader existieren; RenderManager fügt den Effekt nicht zur Kette hinzu. |

Die Bezeichnung experimentell beschreibt die aktuelle Einbindung. Sie sagt keinen geplanten Aktivierungstermin aus.

<span id="las-cuatro-etapas-de-bloom" aria-hidden="true"></span>

## Die vier Bloom-Schritte

```text
Szenenbild
       ↓
1. Downsample → Textur A, halbe Breite und Höhe
       ↓
2. Blur (vertikal) → Textur B
       ↓
3. Blur (horizontal) → Textur A
       ↓
4. Additive Komposition: Original + Textur A
```

`EffectBloom` lädt `Default.vert`, `Downsample.frag`, `Blur.frag` und `Additive.frag` aus `Content/Shaders`. Die Zwischentexturen erhalten ihre Größe beim Erstellen des Effekts.

Dieser Aufbau erlaubt es, die vorhandenen Durchläufe zu beschreiben; veröffentlichte Messungen für eine prozentuale Leistungssteigerung gibt es nicht.

<span id="vistas-y-coordenadas" aria-hidden="true"></span>

## Ansichten und Koordinaten

Der Manager bietet zwei einfache Operationen an:

```cpp
void RenderManager::SetView(const sf::View &view) {
  target_.setView(view);
}

void RenderManager::ResetView() {
  SetView(target_.getDefaultView());
}
```

Damit wird auf die 2D-Ansichten von SFML zugegriffen. Es gibt weder einen `CameraManager`, eine 3D-Kamera noch eine automatische Verfolgung. `CursorManager` erlaubt die Abfrage der in eine `sf::View` umgerechneten Cursorposition.

Die Methode für Größenänderungen in Engine protokolliert die neue Fenstergröße, erstellt die Renderziele aber nicht neu. Das ist keine vollständige Unterstützung dynamischer Auflösung.

<span id="partículas" aria-hidden="true"></span>

## Partikel

`ParticleManager` verwaltet Partikel mit Position, Geschwindigkeit, Beschleunigung, Lebensdauer, Größe und Farbe. `Update` bewegt sie weiter und entfernt abgelaufene Partikel; `Render` zeichnet Quadrate, deren Deckkraft mit der Zeit abnimmt.

Die Standardgrenze beträgt **128 Partikel**. Der Vektor reserviert diese Kapazität, und `Emit` verwirft neue Partikel bei Platzmangel oder ungültiger Lebensdauer. Die Grenze ist eine Implementierungseinstellung, keine Messung der maximalen Engine-Kapazität.

Die Szene entscheidet, wann die Partikel aktualisiert und gezeichnet werden. Engine entfernt sie beim Szenenwechsel. Runner verwendet das System für Bewegungsstaub.

`EmitBurst` erzeugt Partikel mit `ParticleEmitterConfig` und `RandomManager`. Es prüft die Bereiche und begrenzt die Anzahl auf die verfügbare Kapazität.

<span id="animación-y-colisiones" aria-hidden="true"></span>

## Animation und Kollisionen

`SpriteAnimator` spielt Clips wiederholt oder einmal ab, meldet durchlaufene Frames und berechnet Rechtecke eines Sprite-Sheets. `AnimationManager` verwaltet Kennungen, Gruppen und Pausen; Runner holt einen Animator und bewegt seinen Lauf-Clip direkt.

`CollisionManager` bietet `Intersect` und `Sweep` für achsenparallele Rechtecke. Der Sweep liefert Kontaktzeit, Normale und anfängliche Überschneidung; Runner und Bounce nutzen ihn für ausgewählte Kollisionen. Es ist keine allgemeine Physik-Engine.

Erstelle und konfiguriere den Animator einmal; behalte die Gruppe und aktualisiere sie bei jedem Update:

```cpp
const AnimationGroup group = 1;
const AnimationHandle handle = ctx.animations.Create(group);
ctx.animations.Configure(handle, {0, 6, 12.f}, SpritePlaybackMode::Loop);
ctx.animations.AdvanceGroup(group, ctx.time.GetDeltaTime());
```

<span id="fuentes" aria-hidden="true"></span>

## Quellen

- [Pipeline von RenderManager](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/RenderManager.cpp).
- [Bloom-Implementierung](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Graphics/Effects/EfflectBloom.cpp).
- [Monitor-Shader](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Content/Shaders/Monitor.frag).
- [Partikel](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/ParticleManager.cpp).

- [AnimationManager](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Include/Managers/AnimationManager.h).
- [SpriteAnimator](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Include/Graphics/SpriteAnimator/SpriteAnimator.h).
- [CollisionManager](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Include/Managers/CollisionManager.h).
