---
title: Renderizado y efectos
description: Cómo se dibuja una escena 2D, se aplican Bloom y Monitor y se controlan las vistas y partículas.
order: 5
category: Sistemas
---

## Una escena, una textura intermedia

RenderManager ofrece `Draw(const sf::Drawable&)` para dibujar los objetos SFML de una escena. Internamente, los envía a `target_`, una `sf::RenderTexture` creada con el tamaño de configuración.

Al comenzar el frame, `BeginDrawing` limpia el target y dibuja el fondo. `FinishDrawing` publica la textura, aplica los efectos y devuelve la textura que Engine presenta en la ventana. Las escenas no necesitan gestionar directamente la ventana.

## Cadena de posprocesado

Esta es la selección de efectos del código de referencia:

```cpp
// Post Process Effects
 effects_.emplace_back(std::make_unique<EffectBloom>());
 effects_.emplace_back(std::make_unique<EffectMonitor>());
 // effects_.emplace_back(std::make_unique<EffectGlitch>());
```

Bloom y Monitor se añaden únicamente si los shaders están disponibles. Para aplicar varios efectos, `FinishDrawing` alterna dos targets: la salida de una pasada se convierte en la entrada de la siguiente.

| Efecto | Estado | Función |
| --- | --- | --- |
| Bloom | Implementado y activo | Difumina la imagen a media resolución y suma el resultado a la imagen original. |
| Monitor | Implementado y activo | Aplica el shader de monitor, con resolución y tiempo como parámetros. |
| Glitch | Experimental; desactivado | Su clase y shader existen, pero la incorporación al pipeline está comentada. |
| Inversión | Experimental; no conectada | Su clase y shader existen; RenderManager no lo añade a la cadena. |

La etiqueta experimental describe su integración actual. No presupone una fecha prevista de activación.

## Las cuatro etapas de Bloom

```text
Imagen de la escena
       ↓
1. Downsample → textura A, mitad de ancho y alto
       ↓
2. Blur vertical → textura B
       ↓
3. Blur horizontal → textura A
       ↓
4. Composición aditiva: original + textura A
```

`EffectBloom` carga `Default.vert`, `Downsample.frag`, `Blur.frag` y `Additive.frag` desde `Content/Shaders`. Las texturas intermedias se dimensionan al construir el efecto.

Esta organización permite describir las pasadas existentes; no hay mediciones publicadas que permitan asignar un porcentaje de mejora de rendimiento.

## Vistas y coordenadas

El manager expone dos operaciones sencillas:

```cpp
void RenderManager::SetView(const sf::View &view) {
  target_.setView(view);
}

void RenderManager::ResetView() {
  SetView(target_.getDefaultView());
}
```

Se trata de acceso a vistas 2D de SFML. No existe un `CameraManager`, cámara 3D ni sistema automático de seguimiento. `CursorManager` permite consultar la posición del cursor convertida a una `sf::View`.

El método de redimensionado de Engine registra el nuevo tamaño de ventana, pero no recrea los targets de renderizado. No debe interpretarse como soporte completo de resolución dinámica.

## Partículas

`ParticleManager` mantiene partículas con posición, velocidad, aceleración, tiempo de vida, tamaño y color. `Update` avanza su movimiento y elimina las que terminan; `Render` dibuja cuadrados que pierden opacidad con el tiempo.

El límite por defecto es **128 partículas**. El vector reserva esa capacidad y `Emit` descarta nuevas partículas cuando no hay espacio o la vida es inválida. El límite es una configuración de implementación, no una medida de capacidad máxima del motor.

La escena decide cuándo actualizar y renderizar las partículas. Engine las limpia al cambiar de escena. Runner utiliza este sistema para el polvo de movimiento.

## Fuentes

- [Pipeline de RenderManager](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/RenderManager.cpp).
- [Implementación de Bloom](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Graphics/Effects/EfflectBloom.cpp).
- [Shader Monitor](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Content/Shaders/Monitor.frag).
- [Partículas](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/ParticleManager.cpp).