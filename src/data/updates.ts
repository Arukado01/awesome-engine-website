/** Historial editorial basado en commits reales. Los identificadores no son versiones de lanzamiento. */
export type Update = {
  id: string;
  date: string;
  title: string;
  description: string;
  category: string;
  status: 'implemented';
  added: string[];
  fixed: string[];
  performance: string[];
  architecture: string[];
  source: string;
};

const commit = (sha: string) => `https://github.com/Arukado01/AwesomeEngine/commit/${sha}`;

/** Agregar nuevas entradas al principio, conservar la fecha y enlazar la evidencia del cambio. */
export const updates: Update[] = [
  {
    id: '5a6dfac',
    date: '2026-11-01T22:38:24-05:00',
    title: 'Tetris se une a las escenas del motor',
    description:
      'Una nueva escena ejercita entrada, temporizadores, renderizado de formas y lógica de tablero.',
    category: 'Juegos',
    status: 'implemented',
    added: [
      'Movimiento y rotación de piezas.',
      'Caída suave y rápida, próxima pieza, eliminación de líneas y puntuación.',
      'Controles de teclado y gamepad.',
    ],
    fixed: [],
    performance: [],
    architecture: ['Registro de Tetris en SceneFactory.'],
    source: commit('5a6dfacd86414c4cdfaa7157b533330f173a3126'),
  },
  {
    id: 'c4a9f07',
    date: '2026-11-01T21:17:58-05:00',
    title: 'Un gestor compartido para las partículas',
    description:
      'La gestión de partículas sale del juego Runner y pasa a formar parte de los servicios del motor.',
    category: 'Arquitectura',
    status: 'implemented',
    added: ['ParticleManager para emitir, actualizar, dibujar y limpiar partículas.'],
    fixed: [],
    performance: [],
    architecture: [
      'Integración de ParticleManager en EngineContext.',
      'Runner utiliza el gestor para sus partículas de polvo.',
    ],
    source: commit('c4a9f07058550105c2b82f6f24d507417f919fd4'),
  },
  {
    id: 'd183e6d',
    date: '2026-11-01T20:53:24-05:00',
    title: 'Pausa de escenas sincronizada',
    description: 'El motor coordina el estado de pausa al cambiar el foco o la escena.',
    category: 'Correcciones',
    status: 'implemented',
    added: [],
    fixed: ['Sincronización del estado de pausa en Engine.'],
    performance: [],
    architecture: [],
    source: commit('d183e6ddd6e8e7cd512a3d9ce49f84886d9497c9'),
  },
  {
    id: '548e2df',
    date: '2026-11-01T17:57:20-05:00',
    title: 'Límite de cuadros y ajustes de Runner',
    description:
      'La configuración permite limitar la tasa de cuadros y Runner evita operaciones redundantes sobre su sonido de deslizamiento.',
    category: 'Rendimiento',
    status: 'implemented',
    added: ['Opción frameRateLimit en la configuración, con valor predeterminado 120.'],
    fixed: ['Ajustes de inicialización y audio del Runner.'],
    performance: [
      'Se evita detener de nuevo un sonido que ya está detenido.',
      'El límite de cuadros permite acotar el trabajo del bucle de renderizado.',
    ],
    architecture: ['EngineConfig y Engine aplican la configuración de tasa de cuadros.'],
    source: commit('548e2dfafe5a1e6f2a6a097a3f3063ac2bd457f5'),
  },
  {
    id: '7b54814',
    date: '2026-11-01T17:20:57-05:00',
    title: 'Runner encuentra su sonido',
    description: 'La escena incorpora música y efectos asociados a las acciones del personaje.',
    category: 'Audio',
    status: 'implemented',
    added: ['Música para Runner.', 'Efectos de pasos, salto y deslizamiento.'],
    fixed: [],
    performance: [],
    architecture: [],
    source: commit('7b5481451c9d0149a6d8a14b3bdbde7906e2b9ff'),
  },
  {
    id: '2672a32',
    date: '2026-11-01T13:59:36-05:00',
    title: 'Una ciudad para Runner',
    description:
      'Una renovación del escenario y del personaje amplía la presentación visual y la lógica de juego.',
    category: 'Gráficos',
    status: 'implemented',
    added: [
      'Sprites del personaje y los obstáculos.',
      'Texturas de skyline, ciudad, primer plano y plataforma.',
      'Renovación de la lógica y presentación de Runner.',
    ],
    fixed: [],
    performance: [],
    architecture: [],
    source: commit('2672a328c2e415d6a844872d2c4bbc3954353a58'),
  },
  {
    id: '87659f4',
    date: '2026-11-01T10:11:32-05:00',
    title: 'Primera implementación de Runner',
    description: 'El catálogo de escenas suma un juego de carrera y obstáculos.',
    category: 'Juegos',
    status: 'implemented',
    added: ['Escena Runner y su configuración de juego.'],
    fixed: [],
    performance: [],
    architecture: [],
    source: commit('87659f49971e373aa5cb1b790958a8aada86247f'),
  },
  {
    id: '4ce0111',
    date: '2026-10-31T21:21:43-05:00',
    title: 'MineSweeper: lógica sobre una cuadrícula',
    description: 'Una nueva escena incorpora el juego de búsqueda de minas.',
    category: 'Juegos',
    status: 'implemented',
    added: ['Tablero, minas, banderas y revelado de casillas.'],
    fixed: [],
    performance: [],
    architecture: [],
    source: commit('4ce0111354b7761a16fc2ce158e7d4a2cc557828'),
  },
  {
    id: 'eaa5427',
    date: '2026-10-31T19:44:14-05:00',
    title: 'TicTacToe para dos o contra la máquina',
    description:
      'La escena permite elegir entre una partida local de dos jugadores y una partida contra la IA.',
    category: 'Jugabilidad',
    status: 'implemented',
    added: ['Selector de modos PvP y PvAI en TicTacToe.'],
    fixed: [],
    performance: [],
    architecture: [],
    source: commit('eaa54278bc7f2f31265dae96ade3883965f66ea6'),
  },
  {
    id: 'c3a1c24',
    date: '2026-10-28T21:08:23-05:00',
    title: 'TicTacToe llega al motor',
    description: 'El tres en raya añade un ejemplo de juego por turnos al proyecto.',
    category: 'Juegos',
    status: 'implemented',
    added: ['Escena TicTacToe.'],
    fixed: [],
    performance: [],
    architecture: [],
    source: commit('c3a1c24656490780e1bdef1f07f5eb5aaf5175f0'),
  },
  {
    id: 'a6ec9dd',
    date: '2026-10-20T22:24:47-05:00',
    title: 'Memoria, cartas y pares',
    description:
      'MemoryCard añade un ejemplo de selección con cursor, comparación de pares y avance de nivel.',
    category: 'Juegos',
    status: 'implemented',
    added: ['Escena MemoryCard.'],
    fixed: [],
    performance: [],
    architecture: [],
    source: commit('a6ec9dde129bcad84b9113232d8480a28d6f85d3'),
  },
  {
    id: '206a44c',
    date: '2026-10-13T12:28:30-05:00',
    title: 'Precisión contra el reloj con Clicker',
    description:
      'Clicker amplía el catálogo con un objetivo móvil y una meta de puntuación bajo límite de tiempo.',
    category: 'Juegos',
    status: 'implemented',
    added: ['Escena Clicker.'],
    fixed: [],
    performance: [],
    architecture: [],
    source: commit('206a44c8b8968d9400b7311bd33e8336a26b4536'),
  },
  {
    id: 'cfaebf3',
    date: '2026-09-26T22:02:15-05:00',
    title: 'Posprocesado sobre el renderizado 2D',
    description: 'El pipeline gráfico incorpora efectos aplicados a la imagen renderizada.',
    category: 'Gráficos',
    status: 'implemented',
    added: [
      'Efectos de bloom, glitch, inversión de color y monitor.',
      'Shaders GLSL para las etapas de posprocesado.',
    ],
    fixed: [],
    performance: [],
    architecture: ['Abstracción Effect e integración de efectos en RenderManager.'],
    source: commit('cfaebf34920f8f1bd0209080ee0771e677500daa'),
  },
  {
    id: '0c5f8f9',
    date: '2026-09-20T18:47:52-05:00',
    title: 'Bounce, el primer juego',
    description:
      'El primer juego del proyecto conecta los servicios del motor en una escena de paleta y pelotas.',
    category: 'Juegos',
    status: 'implemented',
    added: ['Escena Bounce.'],
    fixed: [],
    performance: [],
    architecture: [],
    source: commit('0c5f8f9415139d7759537a82b38569b1c260fc4f'),
  },
];
