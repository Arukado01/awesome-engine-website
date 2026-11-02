# Procedencia de recursos visuales

Auditoría de AwesomeEngine realizada el 1 de noviembre de 2026. Revisión del código: `5a6dfacd86414c4cdfaa7157b533330f173a3126`.

## Captura principal de Runner

Origen local:

`Content/Screenshots/Screenshot_20261101_161342_465.png`

Ruta del proyecto original: `D:/Proyectos/SFML/AwesomeEngine/Content/Screenshots/Screenshot_20261101_161342_465.png`.

La imagen es una captura real existente, de 800 × 800 píxeles. Muestra al personaje de Runner, obstáculos, escenario y HUD. Fue inspeccionada durante la auditoría. El directorio de capturas está ignorado por Git en el motor, por lo que la captura no forma parte del commit enlazado. La versión web se copia desde este archivo y puede comprimirse conservando su contenido. No debe rotularse como captura de otra escena, un editor visual o una función nueva del motor.

Atribución sugerida: «Runner · captura real de Awesome Engine. Carlos Cortina, 2026».

## GIF de Runner en la portada

Creado y ajustado el **2 de noviembre de 2026, hora de Colombia**, a partir de la grabación auténtica ya publicada. El usuario pidió conectar el final con el comienzo para suavizar la repetición; se añadió un fundido cíclico entre esos fragmentos reales, sin imágenes de IA ni recreaciones del juego.

- Archivo publicado: `public/images/runner-hero-loop.gif`. El nombre nuevo evita reutilizar en caché la primera versión con corte directo.
- Fuente: `public/media/showcase/runner/videos/runner-gameplay.mp4`, intervalo **00:01.000–00:04.000**; corresponde al mismo intervalo de `.capture-work/runner-overview-master.mp4` en la primera toma del montaje. Procedimiento y revisión del juego en [CAPTURE.md](CAPTURE.md).
- Contenido inspeccionado: carrera, salto, obstáculos, ciudad nocturna y HUD de Runner. No contiene la pantalla de derrota, escritorio ni ventanas externas.
- Edición cíclica: de los 45 fotogramas fuente a 15 FPS se presentan primero los fotogramas **6–38** (tiempo fuente 1,4–3,6 s), seguidos de un fundido de **6 fotogramas / 0,4 s** entre la cola **39–44** (3,6–4,0 s) y la cabecera **0–5** (1,0–1,4 s). Los índices son base cero; los límites superiores de tiempo son exclusivos.
- En el fundido, el peso de la cabecera es `alpha = min(3 × t, 1)`, donde `t` es su tiempo local: 0, 1/15, …, 5/15 s. Pasa de cola pura a cabecera pura. El último fotograma corresponde a la cabecera 5 y al repetir se continúa con el 6; no hay reversa, fotograma de parada ni duplicación del límite. La disolución breve sigue siendo una edición visible; no se presenta como una escena naturalmente periódica.
- Lienzo y fotogramas: **800 × 800**, proporción original, **39 fotogramas a 15 FPS nominales**, **2,6 segundos por ciclo** y repetición infinita (extensión NETSCAPE2.0, loop 0). La superposición reduce la duración del ciclo de 3 a 2,6 s; **no cambia la velocidad del gameplay**.
- Optimización: paleta de 64 colores, sin dithering y codificación de diferencias. No se reescala ni se reconstruye movimiento. GIF representa el tiempo en centésimas: alterna intervalos de 60/70 ms, cuya suma es 2600 ms. Solo se mezclan los extremos durante el fundido; no se cambia la lógica del juego.
- Tamaño: **6.915.294 bytes** (6,60 MiB). Se conserva la resolución nativa y la legibilidad del arte; la paleta reducida puede introducir bandas suaves en el cielo oscuro.
- La imagen estática `public/images/runner-hero.webp` y los videos originales se conservan. El sitio usa la imagen estática al pausar o respetar una preferencia de movimiento reducido.

Se inspeccionó una hoja con los ocho últimos fotogramas seguidos de los ocho primeros, además de una comparación del cierre antes y después. El GIF se decodificó completo sin errores y se verificaron dimensiones, cantidad de cuadros, demoras y extensión de repetición.

Comando reproducible desde la raíz del sitio (FFmpeg 8.1.1):

```powershell
$loopFilter = @"
[0:v]fps=15,trim=end_frame=45,setpts=N/(15*TB),split=3[hs][ms][ts];[hs]trim=end_frame=6,setpts=PTS-STARTPTS[head];[ms]trim=start_frame=6:end_frame=39,setpts=PTS-STARTPTS[middle];[ts]trim=start_frame=39:end_frame=45,setpts=PTS-STARTPTS[tail];[tail][head]blend=all_expr='A*(1-min(T*3,1))+B*min(T*3,1)':shortest=1[join];[middle][join]concat=n=2:v=1:a=0,setpts=N/(15*TB),split[a][b];[a]palettegen=max_colors=64:stats_mode=diff[p];[b][p]paletteuse=dither=none:diff_mode=rectangle
"@
ffmpeg -hide_banner -loglevel error -y -ss 1 -t 3 -i public/media/showcase/runner/videos/runner-gameplay.mp4 -filter_complex $loopFilter -loop 0 public/images/runner-hero-loop.gif
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

