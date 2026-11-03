/** Datos verificados en AwesomeEngine, commit f0e88ed, 2 de noviembre de 2026. */
const sourceRoot =
  'https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa';

export const games = [
  {
    id: 'runner',
    name: 'Runner',
    genre: 'Plataformas · carrera infinita',
    description:
      'Corre, salta y deslízate entre obstáculos. Un escenario con parallax, animación de sprites, partículas de polvo y audio acompaña una dificultad que aumenta con la distancia.',
    source: `${sourceRoot}/Games/Source/Runner.cpp`,
  },
  {
    id: 'tetris',
    name: 'Tetris',
    genre: 'Puzle · bloques',
    description:
      'Mueve y rota las piezas, anticipa la siguiente y completa líneas. Incluye caída suave, caída rápida, puntuación y controles de teclado o gamepad.',
    source: `${sourceRoot}/Games/Source/Tetris.cpp`,
  },
  {
    id: 'minesweeper',
    name: 'MineSweeper',
    genre: 'Puzle · lógica',
    description:
      'Un tablero de 8 × 8 con diez minas, primer clic seguro, banderas y revelado de casillas vacías. El resultado de la partida se muestra antes del reinicio.',
    source: `${sourceRoot}/Games/Source/MineSweeper.cpp`,
  },
  {
    id: 'tictactoe',
    name: 'TicTacToe',
    genre: 'Estrategia · turnos',
    description:
      'Tres en raya para dos jugadores locales o contra la máquina. La IA busca ganar, bloquea una victoria rival y, si no hay una jugada decisiva, elige al azar.',
    source: `${sourceRoot}/Games/Source/TicTacToe.cpp`,
  },
  {
    id: 'memorycard',
    name: 'MemoryCard',
    genre: 'Puzle · memoria',
    description:
      'Encuentra los pares de cartas por color. Las cartas se mezclan en cada ronda y su cantidad aumenta al avanzar de nivel.',
    source: `${sourceRoot}/Games/Source/MemoryCard.cpp`,
  },
  {
    id: 'clicker',
    name: 'Clicker',
    genre: 'Arcade · precisión',
    description:
      'Alcanza un objetivo que cambia de posición antes de agotar el tiempo. Admite mouse y gamepad, y conserva el mejor tiempo mediante el sistema de guardado.',
    source: `${sourceRoot}/Games/Source/Clicker.cpp`,
  },
  {
    id: 'bounce',
    name: 'Bounce',
    genre: 'Arcade · reflejos',
    description:
      'Mantén las pelotas en juego con una paleta controlada por teclado o joystick. Combina rebotes, vidas, música, efectos y un récord persistente.',
    source: `${sourceRoot}/Games/Source/Bounce.cpp`,
  },
] as const;

export const technologies = [
  {
    name: 'C++',
    version: '20',
    role: 'Lenguaje del motor y de las escenas de juego.',
    url: 'https://github.com/cplusplus/draft',
    linkLabel: 'Borrador del estándar',
  },
  {
    name: 'SFML',
    version: '3.1.0',
    role: 'Ventana, eventos, gráficos 2D, entradas y audio.',
    url: 'https://github.com/SFML/SFML',
    linkLabel: 'Consultar repositorio',
  },
  {
    name: 'TGUI',
    version: '1.13.0',
    role: 'Interfaz gráfica con el backend SFML_GRAPHICS.',
    url: 'https://github.com/texus/TGUI',
    linkLabel: 'Consultar repositorio',
  },
  {
    name: 'CMake',
    version: '3.28+',
    role: 'Configuración, compilación y descarga de dependencias con FetchContent.',
    url: 'https://gitlab.kitware.com/cmake/cmake',
    linkLabel: 'Consultar repositorio',
  },
  {
    name: 'nlohmann/json',
    version: '3.12.0',
    role: 'Configuración y persistencia en archivos JSON.',
    url: 'https://github.com/nlohmann/json',
    linkLabel: 'Consultar repositorio',
  },
  {
    name: 'spdlog',
    version: '1.16.0',
    role: 'Registro de eventos y diagnóstico.',
    url: 'https://github.com/gabime/spdlog',
    linkLabel: 'Consultar repositorio',
  },
  {
    name: 'magic_enum',
    version: '0.9.8',
    role: 'Utilidades de reflexión para enumeraciones de C++.',
    url: 'https://github.com/Neargye/magic_enum',
    linkLabel: 'Consultar repositorio',
  },
  {
    name: 'GLSL',
    version: 'Shaders',
    role: 'Efectos de bloom, glitch, inversión de color y monitor.',
    url: 'https://github.com/KhronosGroup/GLSL',
    linkLabel: 'Especificación',
  },
] as const;
