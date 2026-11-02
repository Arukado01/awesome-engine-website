# Auditoría técnica de Awesome Engine

Fecha de referencia: **1 de noviembre de 2026**, zona America/Bogota. Auditoría del código en modo lectura; no se modificó el motor ni se presentó una compilación como validada.

## Base y método

- Repositorio: [Arukado01/AwesomeEngine](https://github.com/Arukado01/AwesomeEngine).
- Rama observada: `main`.
- HEAD y referencia local `origin/main`: `5a6dfacd86414c4cdfaa7157b533330f173a3126`.
- Las referencias técnicas se fijan a ese SHA para evitar que una actualización de main cambie su significado.
- Se examinaron los archivos propios del núcleo, los gestores, contratos de escenas, efectos, utilidades, CMake, configuración, fábrica de juegos, herramientas del editor e historial Git. Los juegos y medios visuales tienen una revisión complementaria en el proceso del sitio.
- El árbol de trabajo contenía modificaciones anteriores y cuatro archivos nuevos del núcleo. Se distingue ese contenido de la revisión registrada. Que un archivo exista localmente no implica que esté disponible en GitHub.
- El README original contiene únicamente el título. No aporta motivaciones personales, objetivos declarados ni un roadmap formal. No se inventaron.

La clasificación “Implementada” significa que existe código verificable. No equivale a una prueba de ejecución, ausencia de defectos ni compatibilidad certificada.

## Identidad y alcance

Motor 2D en C++20 basado en SFML, con escenas de juego y un contexto compartido de servicios. Se construye un ejecutable que incorpora el núcleo y las implementaciones de los juegos. El código no define una biblioteca SDK distribuida por separado ni un editor visual.

El motor tiene licencia MIT con copyright 2026 Carlos Cortina en [LICENSE.md][license]. No se encontró un inventario individual de procedencia/licencias de las imágenes, fuentes y pistas de audio; la licencia del código no debe utilizarse como prueba de autoría original de cada asset.

## Lenguajes y dependencias

| Elemento | Evidencia | Interpretación |
| --- | --- | --- |
| C++20 | [CMakeLists.txt:22][cmake] | Estándar requerido para el ejecutable. |
| CMake 3.28 mínimo | [CMakeLists.txt:1][cmake] | Orquestación de compilación y FetchContent. |
| SFML 3.1.0 | [CMakeLists.txt:11,24][cmake] | Ventana, gráficos, eventos y audio; se enlazan Graphics y Audio. |
| nlohmann/json 3.12.0 | [CMakeLists.txt:12][cmake] | Configuración y persistencia JSON. |
| spdlog 1.16.0 | [CMakeLists.txt:13][cmake] | Logging mediante macros propias. |
| TGUI 1.13.0 | [CMakeLists.txt:7,14][cmake] | Widgets, tema y overlay; backend SFML_GRAPHICS. |
| magic_enum 0.9.8 | [CMakeLists.txt:15][cmake] | Enumeración de opciones del overlay. |
| GLSL | [Content/Shaders][shaders] | Efectos de posprocesado. |
| JSON | Config.json y Save.json | Datos de configuración y estado persistente. |

SFML Network está deshabilitado. TGUI GUI Builder está deshabilitado. El proyecto no debe promocionarse como multijugador, motor de red o editor visual por depender de bibliotecas que tengan esas capacidades.

## Arquitectura comprobada

```text
main
  └─ Engine
      ├─ RenderWindow
      ├─ EngineContext
      │   ├─ RandomManager       ├─ TimeManager
      │   ├─ SaveManager         ├─ ClipboardManager
      │   ├─ ResourceManager     ├─ AudioManager
      │   ├─ InputManager        ├─ ParticleManager
      │   ├─ RenderManager       ├─ ScreenshotManager
      │   ├─ CursorManager       ├─ GuiManager
      │   └─ SceneManager
      ├─ SceneFactory::Scenes → nombre / unique_ptr<Scene>
      ├─ currentScene → referencia sin propiedad a una Scene
      └─ Overlay → grupo de widgets TGUI
```

Fuente: [EngineContext][context], [Engine.h][engine-header], [SceneFactory.h][factory-header]. Hay **13 managers** en EngineContext; AudioGroup local es una agrupación auxiliar, no un manager adicional incluido en ese contexto.

El ciclo de [Main.cpp][main] ejecuta ProcessEvent, Update y Render. Cuando no hay foco, omite Render y duerme 10 ms. Engine actualiza el tiempo antes de retornar por falta de foco.

En ProcessEvent se consume primero la transición de escena pendiente. Los eventos pasan por EngineVisitor, GuiManager y la escena cuando el overlay no está visible. En Update se actualizan tiempo, cursor y escena según foco/pausa. En Render se dibuja la escena a una textura, se aplican efectos, se presenta la textura, se dibujan GUI/cursor y se muestra el frame.

## Inventario de capacidades

| Área | Estado | Implementación y evidencia | Límite de la afirmación |
| --- | --- | --- | --- |
| Ventana/eventos | Implementada | [Engine.cpp:8,41][engine], visitor SFML | No hay sistema propio de ventanas multiplataforma certificado. |
| Ciclo de ejecución | Implementada | [Main.cpp:9][main] | Actualización variable por frame, sin timestep fijo. |
| Escenas | Implementada | [Scene.h:8][scene] y [SceneFactory.cpp:15][factory] | Siete clases registradas; no ECS ni entidades genéricas. |
| Cambio/reinicio | Implementada | [SceneManager.cpp:7][scene-manager] | Solicitud diferida; solo una pendiente; exige nombre registrado. |
| Renderizado 2D | Implementada | [RenderManager.cpp:12,31,44][renderer] | Drawables SFML y texturas intermedias; no renderizador 3D. |
| Bloom | Implementada | [EfflectBloom.cpp:10,25][bloom] | Downsample a mitad, blur separable y composición; sin benchmarks publicados. |
| Monitor | Implementada | [RenderManager.cpp:26][renderer] | Activo cuando hay soporte de shaders. |
| Glitch/inversión | Experimental | Clases y shaders presentes; [RenderManager.cpp:27][renderer] | Glitch comentado; inversión no añadida. “Experimental” es clasificación editorial de integración. |
| Cámaras/vistas | Implementada, básica | [RenderManager.cpp:35][renderer] | SetView/ResetView sobre sf::View; sin CameraManager o seguimiento automático. |
| Entrada por acciones | Implementada | [InputManager.cpp:6,23][input] | Consulta de estado de teclado/ratón/mando/ejes; no detector genérico de flancos. |
| Mapeo de mando | Implementada, limitada | [InputBindings.cpp:5][bindings] | Tablas Xbox/PlayStation; fallback por vendor, no base universal. |
| Audio | Implementada | [AudioManager.cpp][audio] y recursos | Volumen/listener; las escenas poseen fuentes. No mezclador de buses. |
| Caché de recursos | Implementada | [ResourceManager.cpp][resources] | Texturas/sonidos/fuentes por nombre; música sin caché; síncrona. |
| Persistencia | Implementada | [SaveManager.cpp:4][save] | JSON local, no nube ni transacciones. |
| Configuración | Implementada | [EngineConfig.cpp:6][config] | Lectura inicial; no hot reload ni esquema robusto. |
| UI/overlay | Implementada | [GuiManager.cpp:5][gui], [Overlay.cpp:36][overlay] | TGUI con tema oscuro y botones; opción Menu incompleta. |
| Partículas | Implementada | [ParticleManager.cpp:10][particles] | CPU, cuadrados con alpha, máximo predeterminado 128; no partículas GPU. |
| Colisiones básicas | Implementada | [SceneUtils.h:46][scene-utils] | Bounds, Contains, distancias; física específica por juego. |
| Animación en Runner | Implementada | [Runner.cpp][runner] | Lógica específica de juego en referencia; componente reusable nuevo es local. |
| Capturas PNG | Implementada | [ScreenshotManager.cpp:26][screenshots] | F12, archivo fechado, requiere escritura local. |
| Tiempo/cooldown | Implementada | [TimeManager.cpp][time], Cooldown de referencia | Delta limitado y temporizadores; la refactorización global de pausa es local. |
| Cursor | Implementada | [CursorManager.cpp][cursor] | Cursor circular, ratón/stick y conversión a sf::View. |
| Clipboard/azar/log | Implementada | [Managers][managers], utilidades | Wrappers y servicios pequeños; no herramientas de edición. |
| Memoria | Implementada por RAII | [SceneFactory.h][factory-header], RenderManager/Context | unique_ptr, mapas/vectores, objetos por valor; sin allocator propio. |
| AudioGroup | En desarrollo local | Nuevos AudioGroup.h/.cpp | Canales Music/Effect, pausa/reanudación; no presentes en SHA base. |
| SpriteAnimator | En desarrollo local | Nuevo Graphics/SpriteAnimator.h | Avance de frames, callbacks, FrameRect; no presente en SHA base. |
| Swept AABB | En desarrollo local | Nuevo Utils/SweptAabb.h | Contacto continuo entre cajas y normal; no presente en SHA base. |
| Reloj compartido de cooldown | En desarrollo local | Cooldown.cpp y Engine.cpp modificados | Unificación de tiempo de pausa; no presente en SHA base. |
| Próximas funciones | Planificada: sin entradas verificadas | No se encontró roadmap formal | No asignar fechas, compromisos o módulos futuros inventados. |

## Cambios locales observados

Archivos nuevos fuera del índice en la auditoría:

- `Engine/Include/Graphics/SpriteAnimator.h`.
- `Engine/Include/Managers/AudioGroup.h`.
- `Engine/Include/Utils/SweptAabb.h`.
- `Engine/Source/Managers/AudioGroup.cpp`.

Había modificaciones previas en AudioManager, Cooldown, Engine y varios archivos de Bounce, Clicker, MemoryCard, Runner y Tetris. AudioGroup ya se utilizaba desde Bounce y Runner; SpriteAnimator desde Runner; SweptAabb desde Bounce y Runner. No se hicieron commits de esos cambios ni se copiaron al repositorio del sitio como código del motor.

## Plataformas y herramientas

La configuración de `.vscode` documenta Windows/MinGW, Ninja y GDB. Hay clangd, clang-format y compile_commands habilitados. CMake contempla opciones para MSVC y GNU/Clang, pero una rama de configuración no demuestra que se haya validado la ejecución en cada plataforma.

No se encontró matriz de CI, suite de pruebas propia del motor, empaquetado de instaladores, exportación web, soporte móvil o historial de releases/tags. No afirmar que el sitio web demuestra ejecución del motor en un navegador.

## Limitaciones de código relevantes

1. **Menu no existe en la fábrica.** Engine solicita `Menu` desde la tecla M, Select y el overlay, pero la fábrica solo registra siete juegos. La búsqueda puede terminar en assert o excepción. [Engine][engine] y [fábrica][factory].
2. **Mayúsculas de rutas.** Git conserva `Engine/Include/utils` mientras los includes usan `Utils`; `icon.png` se carga como `Icon.png`. Puede fallar en sistemas sensibles a mayúsculas.
3. **Recursos relativos.** Configuración, shaders, fuentes y assets dependen del directorio de trabajo; debe contener `Content`.
4. **Redimensionado incompleto.** El handler registra el nuevo tamaño, pero no recrea los targets de posprocesado.
5. **Errores de configuración/guardado.** No hay tratamiento general de JSON inválido o esquema de validación.
6. **Borrado persistente.** SaveManager escribe solo si hay valores; Clear no borra necesariamente el archivo anterior.
7. **Fallo de carga en caché.** ResourceManager inserta la entrada antes de cargar; una carga posterior con igual nombre no vuelve a intentarlo automáticamente.
8. **Vida de escenas y assets.** La fábrica construye todas las escenas al iniciar; no hay carga asíncrona ni descarga explícita de recursos.
9. **Sin física general.** Hay utilidades de colisión y lógica de los juegos; no un solver general de cuerpos rígidos.
10. **Sin motivación/roadmap formal.** La información narrativa se limita a estructura, capacidades y evolución demostrable.

Estas observaciones se documentan; no se corrigieron en el motor porque la tarea exige conservar su funcionamiento y sus cambios existentes.

## Historial utilizable para Mejora Continua

Son commits, no versiones semánticas. Fechas del autor en zona -05:00. Las descripciones ampliadas deben contrastarse con el diff, evitando adjudicar mejoras de rendimiento cuantitativas no medidas.

| Fecha | Commit | Mensaje registrado |
| --- | --- | --- |
| 2026-11-01 | `5a6dfacd86414c4cdfaa7157b533330f173a3126` | Tetris Game |
| 2026-11-01 | `c4a9f07058550105c2b82f6f24d507417f919fd4` | Particle Manager |
| 2026-11-01 | `d183e6ddd6e8e7cd512a3d9ce49f84886d9497c9` | Fix scene pause synchronization |
| 2026-11-01 | `7b5481451c9d0149a6d8a14b3bdbde7906e2b9ff` | Add Runner music and sound effects |
| 2026-11-01 | `2672a328c2e415d6a844872d2c4bbc3954353a58` | Revamp Runner Game visuals, gameplay, and code |
| 2026-10-31 | `4ce0111354b7761a16fc2ce158e7d4a2cc557828` | Mine Sweeper Game |
| 2026-10-31 | `eaa54278bc7f2f31265dae96ade3883965f66ea6` | Add PvP or PvAI mode to TicTacToe game |
| 2026-10-20 | `a6ec9dde129bcad84b9113232d8480a28d6f85d3` | Memory Game |
| 2026-10-13 | `206a44c8b8968d9400b7311bd33e8336a26b4536` | Clicker Game |
| 2026-09-26 | `cfaebf34920f8f1bd0209080ee0771e677500daa` | Post Process Effects |

## Mantenimiento editorial

Las nueve guías se guardan en `src/content/docs/*.md` con frontmatter `title`, `description`, `order` y `category`. Los fragmentos C++ se extraen de la revisión pública; las API locales no se usan como si estuvieran publicadas.

Al actualizar el contenido: revisar un nuevo SHA, confirmar su disponibilidad pública, comprobar el diff y los estados, actualizar enlaces permanentes, incorporar las novedades a la fuente central del historial y ejecutar la validación del sitio. Registrar una mejora en el sitio no publica por sí mismo el cambio en el repositorio del motor.

[license]: https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/LICENSE.md
[cmake]: https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/CMakeLists.txt
[shaders]: https://github.com/Arukado01/AwesomeEngine/tree/5a6dfacd86414c4cdfaa7157b533330f173a3126/Content/Shaders
[context]: https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Include/Core/EngineContext.h
[engine-header]: https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Include/Core/Engine.h
[engine]: https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Core/Engine.cpp
[main]: https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Main.cpp
[factory-header]: https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Include/Scene/SceneFactory.h
[factory]: https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Scene/SceneFactory.cpp
[scene]: https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Include/Scene/Scene.h
[scene-manager]: https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/SceneManager.cpp
[renderer]: https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/RenderManager.cpp
[bloom]: https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Graphics/Effects/EfflectBloom.cpp
[input]: https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/InputManager.cpp
[bindings]: https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Utils/InputBindings.cpp
[audio]: https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/AudioManager.cpp
[resources]: https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/ResourceManager.cpp
[save]: https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/SaveManager.cpp
[config]: https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Core/EngineConfig.cpp
[gui]: https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/GuiManager.cpp
[overlay]: https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Core/Overlay.cpp
[particles]: https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/ParticleManager.cpp
[scene-utils]: https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Include/Scene/SceneUtils.h
[runner]: https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Games/Source/Runner.cpp
[screenshots]: https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/ScreenshotManager.cpp
[time]: https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/TimeManager.cpp
[cursor]: https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/CursorManager.cpp
[managers]: https://github.com/Arukado01/AwesomeEngine/tree/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers