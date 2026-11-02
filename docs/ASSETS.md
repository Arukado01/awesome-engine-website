# Procedencia de recursos visuales

Auditoría de AwesomeEngine realizada el 1 de noviembre de 2026. Revisión del código: `5a6dfacd86414c4cdfaa7157b533330f173a3126`.

## Captura principal de Runner

Origen local:

`Content/Screenshots/Screenshot_20261101_161342_465.png`

Ruta del proyecto original: `D:/Proyectos/SFML/AwesomeEngine/Content/Screenshots/Screenshot_20261101_161342_465.png`.

La imagen es una captura real existente, de 800 × 800 píxeles. Muestra al personaje de Runner, obstáculos, escenario y HUD. Fue inspeccionada durante la auditoría. El directorio de capturas está ignorado por Git en el motor, por lo que la captura no forma parte del commit enlazado. La versión web se copia desde este archivo y puede comprimirse conservando su contenido. No debe rotularse como captura de otra escena, un editor visual o una función nueva del motor.

Atribución sugerida: «Runner · captura real de Awesome Engine. Carlos Cortina, 2026».

## GIF de Runner en la portada

Creado el **2 de noviembre de 2026, hora de Colombia**, a partir de la grabación auténtica ya publicada, sin ejecutar una simulación ni generar imágenes nuevas.

- Archivo publicado: `public/images/runner-hero.gif`.
- Fuente: `public/media/showcase/runner/videos/runner-gameplay.mp4`, intervalo **00:01.000–00:04.000**; corresponde al mismo intervalo de `.capture-work/runner-overview-master.mp4` en la primera toma del montaje. Procedimiento y revisión del juego en [CAPTURE.md](CAPTURE.md).
- Contenido inspeccionado: carrera, salto, obstáculos, ciudad nocturna y HUD de Runner. No contiene la pantalla de derrota, escritorio ni ventanas externas.
- Lienzo y fotogramas: **800 × 800**, proporción original, **45 fotogramas a 15 FPS nominales**, tres segundos por ciclo y repetición infinita (extensión NETSCAPE, loop 0).
- Optimización: paleta de 64 colores, sin dithering y codificación de diferencias. No se reescala, no se modifica la velocidad, no se interpolan fotogramas ni se cambia la lógica del juego. GIF representa el tiempo en centésimas: alterna intervalos de 60/70 ms para conservar el ritmo de 15 FPS.
- Tamaño: **7.954.676 bytes** (7,59 MiB). Se conserva la resolución nativa y la legibilidad del arte; la paleta reducida puede introducir bandas suaves en el cielo oscuro.
- La imagen estática `public/images/runner-hero.webp` y los videos originales se conservan. El sitio puede usar la imagen estática al pausar o respetar una preferencia de movimiento reducido.

Comando reproducible desde la raíz del sitio (FFmpeg 8.1.1):

```powershell
ffmpeg -hide_banner -loglevel error -y -ss 1 -t 3 -i public/media/showcase/runner/videos/runner-gameplay.mp4 -filter_complex "fps=15,split[a][b];[a]palettegen=max_colors=64:stats_mode=diff[p];[b][p]paletteuse=dither=none:diff_mode=rectangle" -loop 0 public/images/runner-hero.gif
```

## Otros recursos existentes

- `Build/RunnerStress.png`: captura real de una prueba de resistencia. El programa de prueba retira obstáculos antes de que alcancen al jugador. No representa una partida normal ni demuestra un rendimiento garantizado.
- `Build/RunnerTikTokPreview.png`: composición promocional preexistente con imagen del juego y textos añadidos. No es una captura íntegra de la ventana.
- `Content/Textures/Runner*.png`: recursos usados por la escena Runner. Su incorporación está registrada en el commit `2672a328c2e415d6a844872d2c4bbc3954353a58`.

La presencia de estos archivos en el motor no implica que todos estén incluidos en el sitio. Después de la auditoría inicial se grabaron ejecuciones reales de Runner y Plaguefront; los originales, el procedimiento y los cuatro MP4 publicados se documentan en [CAPTURE.md](CAPTURE.md).

## Licencias y alcance

El repositorio del motor contiene una licencia MIT con copyright 2026 Carlos Cortina: [LICENSE.md](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/LICENSE.md).

No contiene un manifiesto de autoría o licencia individual para cada textura, fuente y sonido. Este documento registra el origen observable de los archivos, sin atribuir una licencia individual que no está documentada. La licencia MIT del código nuevo del sitio no cambia los derechos de recursos de terceros. Conservar las atribuciones originales y completar el registro de procedencia al incorporar nuevos materiales.

`Games/Include/Tetris.h` incluye un aviso «Copyright (c) 2025 Adel Hales». Si se reutiliza código de ese archivo, conservar ese aviso. El sitio no necesita copiar la fuente `Relidux.otf` ni distribuir sonidos del motor para presentar la captura.

Los diagramas de arquitectura y el logotipo vectorial elaborados para este sitio son recursos propios del sitio. Los diagramas explican el código y deben identificarse como diagramas, no como capturas del motor.

## Incorporar una captura nueva

1. Obtenerla de una ejecución real del motor y conservar el archivo original.
2. Registrar escena, revisión del motor, fecha y ruta de origen.
3. Exportar un formato optimizado para la web, sin alterar la funcionalidad mostrada.
4. Añadir texto alternativo descriptivo y dimensiones para evitar saltos de diseño.
5. Incorporar la atribución y cualquier licencia específica conocida.

## Identidad visual aprobada

El usuario eligió expresamente el símbolo A diseñado para el sitio y su paleta lavanda. La fuente vectorial es public/images/awesome-engine-mark.svg; su derivado PNG transparente de 512 × 512 es public/images/awesome-engine-logo.png. El favicon y Open Graph emplean el mismo diseño. Al finalizar la entrega se sustituye únicamente Content/Textures/icon.png del motor, por petición explícita del usuario. El icono anterior se conserva fuera de los archivos públicos en .capture-work/originals/engine-icon-original.png.

## Fuentes del sitio

Inter y Space Grotesk se sirven localmente mediante Fontsource y conservan SIL Open Font License 1.1. Los textos completos, incluidos sus avisos de autoría, se distribuyen en public/fonts/OFL-Inter.txt y public/fonts/OFL-SpaceGrotesk.txt.

