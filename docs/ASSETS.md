# Procedencia de recursos visuales

Auditoría de AwesomeEngine realizada el 1 de noviembre de 2026. Revisión del código: `5a6dfacd86414c4cdfaa7157b533330f173a3126`.

## Captura principal de Runner

Origen local:

`Content/Screenshots/Screenshot_20261101_161342_465.png`

Ruta del proyecto original: `D:/Proyectos/SFML/AwesomeEngine/Content/Screenshots/Screenshot_20261101_161342_465.png`.

La imagen es una captura real existente, de 800 × 800 píxeles. Muestra al personaje de Runner, obstáculos, escenario y HUD. Fue inspeccionada durante la auditoría. El directorio de capturas está ignorado por Git en el motor, por lo que la captura no forma parte del commit enlazado. La versión web se copia desde este archivo y puede comprimirse conservando su contenido. No debe rotularse como captura de otra escena, un editor visual o una función nueva del motor.

Atribución sugerida: «Runner · captura real de Awesome Engine. Carlos Cortina, 2026».

## GIF de Runner en la portada

Creado y ajustado el **2 de noviembre de 2026, hora de Colombia**, a partir de gameplay auténtico. El usuario pidió **8,5 segundos por ciclo** y una unión suave entre final e inicio. Se montaron dos fragmentos distintos de la grabación real, con fundidos breves; no se generaron imágenes con IA ni se recreó el juego.

- Archivo publicado: `public/images/runner-hero-loop-8-5s.gif`. El nombre nuevo evita reutilizar en caché las versiones anteriores más cortas.
- Fuente: `public/media/showcase/runner/videos/runner-gameplay.mp4`, fragmento **A: 00:00.800–00:06.300** (5,5 s) y fragmento **B: 00:09.500–00:13.500** (4 s). Ambos corresponden a los mismos intervalos de `.capture-work/runner-overview-master.mp4`, en la primera toma del montaje publicado. Procedimiento y revisión del juego en [CAPTURE.md](CAPTURE.md).
- Se revisaron las tres tomas originales de Runner y no se encontró un tramo continuo suficientemente largo sin derrota. Esta versión es un **montaje de dos momentos reales**, no una partida continua ni la duplicación del GIF anterior. Muestra carrera, salto, obstáculos, ciudad nocturna y HUD; excluye pantallas de derrota, escritorio y ventanas externas.
- Lienzo: **800 × 800**, sin reescalar. Salida: **102 fotogramas a 12 FPS nominales**, **8500 ms exactos por ciclo** y repetición infinita (extensión NETSCAPE2.0, loop 0).
- La velocidad y el sentido de avance se conservan. Pasar a 12 FPS descarta cuadros de la grabación, sin ralentizar ni acelerar el gameplay. Dos solapamientos de 0,5 s reducen los 9,5 s de material seleccionado a los 8,5 s solicitados.

La edición usa índices base cero a 12 FPS. A contiene 66 cuadros y B contiene 48. La secuencia de salida es:

| Tramo | Fotogramas fuente | Cuadros de salida | Duración |
|---|---|---:|---:|
| Centro de A | A 6–59 | 54 | 4,5 s |
| Fundido A → B | A 60–65 con B 0–5 | 6 | 0,5 s |
| Centro de B | B 6–41 | 36 | 3 s |
| Fundido B → A | B 42–47 con A 0–5 | 6 | 0,5 s |

En cada fundido, el peso del fragmento entrante es `alpha = min(2,4 × t, 1)`, con tiempo local `t = 0, 1/12, …, 5/12` segundos. Pasa del cuadro saliente puro al entrante puro. El último cuadro del ciclo corresponde a A 5; al repetir continúa con A 6. No hay reversa, cuadro de parada ni duplicación del límite. Los fundidos son una edición visible, no una escena naturalmente periódica.

- Optimización: paleta de 64 colores, sin dithering y codificación de diferencias. No se reescala ni se reconstruye movimiento. Las demoras de 80/90 ms del GIF suman exactamente **8500 ms**, sin parchear el último cuadro. Solo se mezclan los extremos durante los fundidos; no se cambia la lógica del juego.
- Tamaño: **18.124.532 bytes** (17,29 MiB). Se conserva la resolución nativa y la legibilidad del arte; la paleta reducida puede introducir bandas suaves en el cielo oscuro.
- La imagen estática `public/images/runner-hero.webp` y los videos originales se conservan. El sitio usa la imagen estática al pausar o respetar una preferencia de movimiento reducido.

Se inspeccionaron hojas de los fragmentos originales, el ciclo completo y los ocho últimos cuadros seguidos de los ocho primeros. El GIF se decodificó completo sin errores y se verificaron dimensiones, cantidad de cuadros, demoras y extensión de repetición.

Comando reproducible desde la raíz del sitio (FFmpeg 8.1.1):

```powershell
$loopFilter = @"
[0:v]fps=12,trim=end_frame=66,setpts=N/(12*TB),split=3[ahs][ams][ats];[ahs]trim=end_frame=6,setpts=PTS-STARTPTS[ah];[ams]trim=start_frame=6:end_frame=60,setpts=PTS-STARTPTS[am];[ats]trim=start_frame=60:end_frame=66,setpts=PTS-STARTPTS[at];[1:v]fps=12,trim=end_frame=48,setpts=N/(12*TB),split=3[bhs][bms][bts];[bhs]trim=end_frame=6,setpts=PTS-STARTPTS[bh];[bms]trim=start_frame=6:end_frame=42,setpts=PTS-STARTPTS[bm];[bts]trim=start_frame=42:end_frame=48,setpts=PTS-STARTPTS[bt];[at][bh]blend=all_expr='A*(1-min(T*2.4,1))+B*min(T*2.4,1)':shortest=1[ab];[bt][ah]blend=all_expr='A*(1-min(T*2.4,1))+B*min(T*2.4,1)':shortest=1[ba];[am][ab][bm][ba]concat=n=4:v=1:a=0,setpts=N/(12*TB),split[a][b];[a]palettegen=max_colors=64:stats_mode=diff[p];[b][p]paletteuse=dither=none:diff_mode=rectangle
"@
ffmpeg -hide_banner -loglevel error -y -ss 0.8 -t 5.5 -i public/media/showcase/runner/videos/runner-gameplay.mp4 -ss 9.5 -t 4 -i public/media/showcase/runner/videos/runner-gameplay.mp4 -filter_complex $loopFilter -loop 0 public/images/runner-hero-loop-8-5s.gif
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

El usuario eligió expresamente el símbolo A diseñado para el sitio y su paleta lavanda. Los correos utilizan la variante blanca sobre fondo oscuro. La variante con trazo oscuro y acento lavanda está disponible en public/images/awesome-engine-logo-dark.png y se utiliza en la copia local del motor. La fuente vectorial es public/images/awesome-engine-mark.svg; su derivado PNG transparente de 512 × 512 es public/images/awesome-engine-logo.png. El favicon y Open Graph emplean el mismo diseño. Al finalizar la entrega se sustituye únicamente Content/Textures/icon.png del motor, por petición explícita del usuario. El icono anterior se conserva fuera de los archivos públicos en .capture-work/originals/engine-icon-original.png.

## Fuentes del sitio

Inter y Space Grotesk se sirven localmente mediante Fontsource y conservan SIL Open Font License 1.1. Los textos completos, incluidos sus avisos de autoría, se distribuyen en public/fonts/OFL-Inter.txt y public/fonts/OFL-SpaceGrotesk.txt.

