---
title: Arquitectura del motor
description: Recorre el bucle principal, EngineContext, la propiedad de los objetos y la relación entre sistemas.
order: 4
category: Núcleo del motor
---

## De la entrada al frame

`main()` construye un `Engine` y repite tres operaciones mientras la ventana sigue abierta. Este fragmento procede del código de referencia:

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

Sin foco, el bucle sigue procesando eventos y actualizando el reloj; omite el renderizado y duerme 10 ms. `Engine::Update` también comprueba el foco antes de avanzar la escena.

## Responsabilidades de Engine

`Engine` posee la ventana, un `EngineContext`, el registro de escenas, la referencia a la escena activa y un overlay de pausa. Su función es coordinar estos elementos.

```text
Engine
├── sf::RenderWindow
├── EngineContext
│   ├── renderer · resources · particles
│   ├── input · cursor · gui
│   ├── audio · time · random
│   └── scenes · save · screenshot · clipboard
├── SceneFactory::Scenes
│   └── nombre → unique_ptr<Scene>
├── currentScene → Scene activa
└── Overlay → widgets TGUI
```

El contexto se pasa por referencia a cada escena. Así, un juego accede a `ctx.renderer`, `ctx.input` o `ctx.resources` sin construir servicios duplicados.

## Procesamiento de eventos

Al comenzar `ProcessEvent`, el motor consume el cambio de escena pendiente. Después extrae los eventos de `sf::RenderWindow` y los distribuye:

1. `EngineVisitor` atiende cierre, foco, tamaño, mandos y atajos globales.
2. `GuiManager` envía el evento a TGUI.
3. La escena recibe `OnEvent` cuando el overlay está oculto.
4. El motor procesa cualquier selección del overlay y sincroniza el estado de pausa.

La GUI y la escena participan en el mismo procesamiento; no hay un bus de eventos separado documentado.

## Actualización y tiempo

`TimeManager` calcula el tiempo transcurrido desde el frame anterior y lo limita a `gConfig.maximumDeltaTime`. Después se actualiza el cursor y, si el overlay está oculto, se llama a `Scene::Update`.

El sistema no implementa un acumulador de pasos fijos. Los juegos deciden cómo utilizar el delta de tiempo y sus propios temporizadores.

En la revisión de referencia, cada escena implementa su reacción a `OnPause`, incluido su audio y sus temporizadores. Existe una refactorización local del reloj de cooldowns, identificada como **en desarrollo**, que no forma parte de esta API pública de referencia.

## Renderizado y capas

La escena dibuja sobre una `sf::RenderTexture`. RenderManager aplica la cadena de efectos y devuelve la textura final. Engine la presenta en la ventana y dibuja encima la GUI y el cursor.

```text
Scene::Render
     ↓
RenderManager / RenderTexture
     ↓
Bloom → Monitor
     ↓
Ventana → GUI → Cursor → display
```

Los efectos solo se incorporan cuando `sf::Shader::isAvailable()` devuelve verdadero. La GUI y el cursor se dibujan después del posprocesado. Consulta [Renderizado](/docs/renderizado/) para seguir las pasadas de Bloom.

## Propiedad y memoria

- Las escenas se almacenan en un `unordered_map` de `unique_ptr<Scene>`.
- Los efectos se almacenan en un vector de `unique_ptr<Effect>`.
- La escena activa es un puntero sin propiedad; su objeto sigue perteneciendo al registro.
- Los managers forman parte de `EngineContext` por valor.
- ResourceManager conserva recursos por valor dentro de mapas.

El proyecto emplea RAII y contenedores estándar. No hay un gestor de memoria personalizado ni un ECS genérico. Todas las escenas registradas se construyen en `CreateScenes`; el cambio de escena no construye una nueva instancia en cada transición.

## Organización del código

| Directorio | Contenido |
| --- | --- |
| `Engine/Include` | Contratos y tipos del núcleo, managers, escenas, efectos y utilidades. |
| `Engine/Source` | Implementaciones y punto de entrada. |
| `Games/Include` | Clases de juego, tipos y constantes de configuración. |
| `Games/Source` | Lógica y renderizado de los juegos. |
| `Content` | Recursos gráficos y sonoros, fuentes, shaders, tema y JSON. |

## Fuentes

- [Bucle principal](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Main.cpp).
- [Coordinación de Engine](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Core/Engine.cpp).
- [Definición de EngineContext](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Include/Core/EngineContext.h).
- [Propiedad de las escenas](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Include/Scene/SceneFactory.h).