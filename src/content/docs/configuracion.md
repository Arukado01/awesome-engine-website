---
title: Configuración
description: Valores de la ventana, tiempo, audio y cursor, y límites de la configuración JSON actual.
order: 3
category: Primeros pasos
---

## El archivo de configuración

El motor lee `Content/Config.json` al iniciar. Este ejemplo muestra una sola entrada de `games`.

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

## Qué controla cada valor

| Clave | Efecto |
| --- | --- |
| `windowTitle` | Título de la ventana SFML. |
| `windowSize` | Tamaño inicial en modo ventana y tamaño lógico del área de juego. |
| `frameRateLimit` | Límite de frames solicitado a la ventana; por defecto, 120 si la clave no existe. |
| `disableSfmlLogs` | Silencia el stream de errores de SFML cuando vale `true`. |
| `maximumDeltaTime` | Máximo delta de simulación, en segundos, que entrega TimeManager por frame. |
| `globalVolume` | Volumen global aplicado al listener de SFML. |
| `backgroundColor` | Tinte RGB del fondo utilizado por RenderManager. |
| `cursorSize` | Tamaño en píxeles del lado más largo del cursor basado en `Icon.png`. Por defecto, 24. |
| `cursorSpeed` | Velocidad del cursor al moverlo con el mando. |
| `joystickDeadzone` | Umbral usado para ignorar desplazamientos pequeños del stick al mover el cursor. |

El límite de 120 frames es una configuración, **no una medición de rendimiento**. Tampoco implica que la simulación use un timestep fijo: el tiempo varía por frame y se limita con `maximumDeltaTime`.

## Cambiar la configuración

Modifica el JSON con la aplicación cerrada y vuelve a ejecutarla desde la raíz del repositorio. La configuración se carga al inicio; no hay recarga automática del archivo ni panel de preferencias que escriba estos valores.

Conserva las claves y los tipos del ejemplo. El parser no implementa un esquema de validación ni valores alternativos para todos los campos. Un archivo ausente, JSON inválido o una clave obligatoria incorrecta puede impedir el arranque.

`windowSize` fija el tamaño de diseño que usan los juegos. Al cambiar el tamaño de la ventana, el motor adapta el renderizado al tamaño real y mantiene las coordenadas y proporciones del diseño.

## Configuración de cada juego

La lista `games` define qué juegos muestra el menú y en qué orden. `name` debe coincidir con la clave de `SceneFactory`. `title` es la etiqueta y `controls` es el texto de ayuda. Conserva al menos una entrada y reinicia el motor tras editar el archivo.

Las reglas de cada juego están en `Games/Include/Config` y requieren recompilar si cambian. `Engine` inicia la escena `Menu`.

## Preferencias del sitio y del motor

El selector claro, oscuro o sistema de este sitio modifica únicamente su interfaz web. El motor configura TGUI con `Content/Themes/Dark.txt`; la documentación no presupone que el selector web exista dentro del ejecutable.

## Fuentes

- [Valores originales de Config.json](https://github.com/Arukado01/AwesomeEngine/blob/61a3244690f7763d41a8f0ba6f0f2ac3deb53ee2/Content/Config.json).
- [Lectura de EngineConfig](https://github.com/Arukado01/AwesomeEngine/blob/61a3244690f7763d41a8f0ba6f0f2ac3deb53ee2/Engine/Source/Core/EngineConfig.cpp).
- [Cálculo del delta time](https://github.com/Arukado01/AwesomeEngine/blob/61a3244690f7763d41a8f0ba6f0f2ac3deb53ee2/Engine/Source/Managers/TimeManager.cpp).