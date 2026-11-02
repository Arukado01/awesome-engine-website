# Registro de captura de juegos

## Identidad y aislamiento

El proyecto referido como «Plagetale» fue confirmado por el usuario como **Plaguefront — La frontera gris**. El directorio público conserva el identificador solicitado `plagetale`; el nombre visible es Plaguefront.

- AwesomeEngine: `D:/Proyectos/SFML/AwesomeEngine`, revisión `5a6dfacd86414c4cdfaa7157b533330f173a3126`, más cambios locales preexistentes.
- Plaguefront: `D:/Proyectos/SFML/Plagefront`, revisión `d23ad860eecbb702e82626f61dee8550cd2ae8bc`, con un cambio preexistente en `Content/Textures/Card.png`.
- El conector GitHub confirmó público el repositorio [Arukado01/Plagefront](https://github.com/Arukado01/Plagefront).
- Copias de fuentes, contenido, ejecutables, registros y originales de grabación: `.capture-work/`, excluido de Git y del directorio público.

Se recompilaron 33 unidades C++ de AwesomeEngine y 48 de Plaguefront desde fuentes copiadas. Se reutilizaron las bibliotecas de dependencias ya compiladas de cada proyecto. Las fuentes originales no se editaron.

La copia de Runner tiene exclusivamente estos ajustes de arranque: selección inicial de `Runner` en lugar de `Tetris`; resolución del directorio de trabajo junto al ejecutable antes de leer la configuración global y al entrar en main. No se modificaron reglas, velocidades, colisiones, temporizadores, recursos ni lógica de escenas. Plaguefront se compiló sin cambios de código.

Los manifiestos locales `source-sha256.json` registran las fuentes antes de los ajustes de arranque. `compile-result.json` registra los archivos compilados y sus resultados. Las capturas corresponden al código local auditado, por lo que no deben presentarse como binarios de una release publicada.

## Archivos publicados

Fecha de las nuevas tomas: **1 de noviembre de 2026, hora de Colombia**. Se mantienen las proporciones y resoluciones nativas: Runner 800 × 800; Plaguefront 1440 × 900.

| Video | Duración | Contenido y procedencia |
|---|---:|---|
| `runner/videos/runner-gameplay.mp4` | 35 s | Montaje de dos tomas reales: primeros 15 s de `runner-overview-master.mp4` y primeros 20 s de `runner-overview-take3.mp4`. Carrera, salto, obstáculos y reinicio. |
| `runner/videos/runner-systems.mp4` | 25 s | Primeros 25 s de `runner-gameplay-master.mp4`. Escenario, HUD, colisión y reinicio. Se excluye el cierre final de la ventana. |
| `plagetale/videos/plaguefront-gameplay.mp4` | 40 s | Desde el segundo 10 de `plaguefront-overview-take2.mp4`: preparación, mapa, selección y movimiento de Saber. |
| `plagetale/videos/plaguefront-tactics.mp4` | 29 s | Desde el segundo 7 de `plaguefront-tactics-master.mp4`: elección de destino, movimiento de Rider y consulta de habilidades. |

Todas las rutas de esta tabla son relativas a `public/media/showcase/`. Los clips conservan la velocidad real. Solo se recortan tiempos o se unen tomas mediante un corte; no se interpolan cuadros, se duplican secuencias, se altera la lógica del juego ni se añaden interfaces ficticias. Los reinicios y derrotas de Runner son comportamiento real visible durante las partidas; no se presenta el recorrido como una prueba de habilidad ni un benchmark.

Los cuatro archivos usan H.264, 30 FPS, yuv420p, CRF 23 y `faststart`, sin reescalar. DirectShow no expuso un dispositivo de audio capturable; los videos no incluyen pista de audio ni música añadida. El manifiesto declara `audio: false`.

### Capturas de Runner

- `runner-gameplay.png`: captura existente de AwesomeEngine `Content/Screenshots/Screenshot_20261101_161342_465.png`.
- `runner-city.png`: F12 de la nueva ejecución aislada, `Screenshot_20261101_234100_167.png`.
- `runner-jump.png`: fotograma de `runner-overview-master.mp4` a 1,2 s.
- `runner-obstacles.png`: fotograma de la misma toma a 5,2 s.
- `runner-gameover.png`: fotograma de la misma toma a 7,8 s.

### Capturas de Plaguefront

Las cinco son capturas nativas obtenidas con F12 mediante ScreenshotManager en una partida iniciada desde la interfaz normal. No se emplearon escenarios de regresión ni el modo smoke para crear estas imágenes.

| Archivo | Original de la copia aislada |
|---|---|
| `plaguefront-menu.png` | `Screenshot_20261101_233434_258.png` |
| `plaguefront-armies.png` | `Screenshot_20261101_233627_418.png` |
| `plaguefront-map.png` | `Screenshot_20261101_233640_152.png` |
| `plaguefront-orders.png` | `Screenshot_20261101_233708_724.png` |
| `plaguefront-abilities.png` | `Screenshot_20261101_233757_294.png` |

Los PNG se comprimen sin pérdida y sin cambiar dimensiones. Las miniaturas de videos se extraen de cada archivo correspondiente. Las capturas y los videos muestran únicamente el cliente del juego; no incluyen escritorio, terminales ni otras aplicaciones.

## Procedimiento reproducible

1. Crear una copia de Engine, Games y Content dentro de `.capture-work`, preservando los originales.
2. Compilar con las mismas versiones y dependencias locales. Registrar hashes antes de ajustes de launcher y el resultado de cada unidad compilada.
3. Abrir la copia, comprobar su ventana y comenzar una partida desde sus controles normales.
4. Capturar la ventana por título; el comando base es el siguiente:

```powershell
ffmpeg -f gdigrab -framerate 30 -draw_mouse 0 -i "title=Awesome Engine" -t 50 -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p toma-original.mp4
```

Para Plaguefront, el título es `Plaguefront`. Usar una ruta de salida dentro de `.capture-work`. Para PNG nativos, pulsar F12 y copiar después el archivo creado en el Content de la copia.

5. Revisar las tomas a intervalos, comprobar encuadre y descartar cambios de foco. Convertir las elegidas a CRF 23, añadir `-movflags +faststart` y conservar el framerate y la resolución.
6. Inspeccionar duración, dimensiones y streams mediante ffprobe; decodificar cada video completo para detectar errores. Registrar esos resultados en `docs/media-verification.json`.
7. Actualizar `src/data/showcase-media.json` con rutas, títulos, textos alternativos, duración y disponibilidad de audio reales.

## Incidencias y límites

Se descartó la primera toma de Plaguefront por un cambio de foco. Permanece únicamente en `.capture-work/plaguefront-overview-master.mp4` y no está publicada. Las tomas finales se inspeccionaron visualmente mediante hojas de cuadros a intervalos y las capturas individuales.

Una sesión de Runner terminó con código 0 y el capturador informó pérdida de la ventana; el fragmento final interrumpido quedó fuera de los clips publicados. No se reprodujo ni se atribuye un fallo del motor a ese cierre.

La licencia y procedencia de arte se documentan en [ASSETS.md](ASSETS.md). La presencia de una captura no amplía las capacidades del motor base: Plaguefront contiene sistemas específicos de ese juego que no deben anunciarse como managers generales de AwesomeEngine.
