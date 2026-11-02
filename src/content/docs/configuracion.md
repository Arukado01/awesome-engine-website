---
title: Configuración
description: Valores de la ventana, tiempo, audio y cursor, y límites de la configuración JSON actual.
order: 3
category: Primeros pasos
---

## El archivo de configuración

El motor lee `Content/Config.json` al construir el objeto global `gConfig`. Este es el contenido de la revisión de referencia:

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

## Qué controla cada valor

| Clave | Efecto |
| --- | --- |
| `windowTitle` | Título de la ventana SFML. |
| `windowSize` | Tamaño inicial y referencia para los targets de renderizado y varios cálculos de los juegos. |
| `frameRateLimit` | Límite de frames solicitado a la ventana; por defecto, 120 si la clave no existe. |
| `disableSfmlLogs` | Silencia el stream de errores de SFML cuando vale `true`. |
| `maximumDeltaTime` | Máximo delta de simulación, en segundos, que entrega TimeManager por frame. |
| `globalVolume` | Volumen global aplicado al listener de SFML. |
| `backgroundColor` | Tinte RGB del fondo utilizado por RenderManager. |
| `cursorRadius` | Radio del cursor circular personalizado. |
| `cursorSpeed` | Velocidad del cursor al moverlo con el mando. |
| `cursorColor` | Color RGB del cursor. |
| `joystickDeadzone` | Umbral usado para ignorar desplazamientos pequeños del stick al mover el cursor. |

El límite de 120 frames es una configuración, **no una medición de rendimiento**. Tampoco implica que la simulación use un timestep fijo: el tiempo varía por frame y se limita con `maximumDeltaTime`.

## Cambiar la configuración

Modifica el JSON con la aplicación cerrada y vuelve a ejecutarla desde la raíz del repositorio. La configuración se carga al inicio; no hay recarga automática del archivo ni panel de preferencias que escriba estos valores.

Conserva las claves y los tipos del ejemplo. El parser no implementa un esquema de validación ni valores alternativos para todos los campos. Un archivo ausente, JSON inválido o una clave obligatoria incorrecta puede impedir el arranque.

Cambiar `windowSize` también afecta a código de juego que utiliza `gConfig.windowSize`. No equivale a disponer de un sistema completo de resolución dinámica. El evento de redimensionado no reconstruye automáticamente las texturas de posprocesado.

## Configuración de cada juego

Los parámetros específicos viven en `Games/Include/Config`: `BounceConfig.h`, `ClickerConfig.h`, `MemoryCardConfig.h`, `TicTacToeConfig.h`, `MineSweeperConfig.h`, `RunnerConfig.h` y `TetrisConfig.h`.

Son constantes C++; sus cambios requieren recompilar. La escena de inicio tampoco se elige desde `Config.json`: está fijada mediante `ChangeScene("Tetris")` en el constructor de `Engine`.

## Preferencias del sitio y del motor

El selector claro, oscuro o sistema de este sitio modifica únicamente su interfaz web. El motor configura TGUI con `Content/Themes/Dark.txt`; la documentación no presupone que el selector web exista dentro del ejecutable.

## Fuentes

- [Valores originales de Config.json](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Content/Config.json).
- [Lectura de EngineConfig](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Core/EngineConfig.cpp).
- [Cálculo del delta time](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/TimeManager.cpp).