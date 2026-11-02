# Procedencia de recursos visuales

Auditoría de AwesomeEngine realizada el 1 de noviembre de 2026. Revisión del código: `5a6dfacd86414c4cdfaa7157b533330f173a3126`.

## Captura principal de Runner

Origen local:

`Content/Screenshots/Screenshot_20261101_161342_465.png`

Ruta del proyecto original: `D:/Proyectos/SFML/AwesomeEngine/Content/Screenshots/Screenshot_20261101_161342_465.png`.

La imagen es una captura real existente, de 800 × 800 píxeles. Muestra al personaje de Runner, obstáculos, escenario y HUD. Fue inspeccionada durante la auditoría. El directorio de capturas está ignorado por Git en el motor, por lo que la captura no forma parte del commit enlazado. La versión web se copia desde este archivo y puede comprimirse conservando su contenido. No debe rotularse como captura de otra escena, un editor visual o una función nueva del motor.

Atribución sugerida: «Runner · captura real de Awesome Engine. Carlos Cortina, 2026».

## Otros recursos existentes

- `Build/RunnerStress.png`: captura real de una prueba de resistencia. El programa de prueba retira obstáculos antes de que alcancen al jugador. No representa una partida normal ni demuestra un rendimiento garantizado.
- `Build/RunnerTikTokPreview.png`: composición promocional preexistente con imagen del juego y textos añadidos. No es una captura íntegra de la ventana.
- `Content/Textures/Runner*.png`: recursos usados por la escena Runner. Su incorporación está registrada en el commit `2672a328c2e415d6a844872d2c4bbc3954353a58`.

La presencia de estos archivos en el motor no implica que todos estén incluidos en el sitio. No se encontró un archivo de video entregable dentro del proyecto auditado; el sitio no debe anunciar un video inexistente.

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

