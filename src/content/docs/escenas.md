---
title: Escenas y ciclo de vida
description: El contrato Scene, el registro de juegos, las transiciones diferidas y la limpieza de estado.
order: 7
category: Núcleo del motor
---

## El contrato de una escena

Una escena recibe `EngineContext` por referencia y define cómo comenzar, actualizarse y dibujarse. Este contrato existe en la revisión de referencia:

```cpp
class Scene {
protected:
  EngineContext &ctx;

public:
  Scene(EngineContext &context) : ctx(context) {}
  virtual ~Scene() = default;

  virtual void Start() = 0;
  virtual void Update() = 0;
  virtual void Render() const = 0;

  virtual void OnEvent(const sf::Event &) {};
  virtual void OnPause(bool /* pausa */) {};
  virtual void OnCleanup() {};
};
```

`Start`, `Update` y `Render` son obligatorios. Los demás callbacks tienen una implementación vacía y se especializan cuando el juego los necesita.

## Responsabilidades por etapa

| Etapa | Cuándo ocurre | Uso dentro del juego |
| --- | --- | --- |
| Constructor | Al crear el registro inicial de escenas. | Preparar objetos y recursos de la instancia. |
| `Start` | Al activar o reiniciar la escena. | Restablecer la partida y registrar sus controles. |
| `OnEvent` | Al recibir eventos con el overlay oculto. | Atender eventos discretos del juego. |
| `Update` | Por frame, con foco y sin overlay visible. | Avanzar lógica, movimiento y estado. |
| `Render` | Al dibujar el frame de la escena activa. | Enviar objetos a `ctx.renderer`. |
| `OnPause` | Cuando cambia el estado de pausa. | Pausar o reanudar los elementos que controla la escena. |
| `OnCleanup` | Antes de salir o reiniciar la escena. | Detener audio y limpiar estado que no debe continuar. |

El constructor y `Start` no son equivalentes. Las instancias permanecen en el registro y pueden recibir `Start` varias veces.

## Registro de juegos

`SceneFactory::Scenes` es un `unordered_map` que asocia nombres con `unique_ptr<Scene>`. La fábrica registra siete instancias:

```cpp
scenes.emplace("Bounce", std::make_unique<Bounce::Game>(context));
scenes.emplace("Clicker", std::make_unique<Clicker::Game>(context));
scenes.emplace("MemoryCard", std::make_unique<MemoryCard::Game>(context));
scenes.emplace("TicTacToe", std::make_unique<TicTacToe::Game>(context));
scenes.emplace("MineSweeper", std::make_unique<MineSweeper::Game>(context));
scenes.emplace("Runner", std::make_unique<Runner::Game>(context));
scenes.emplace("Tetris", std::make_unique<Tetris::Game>(context));
```

La revisión documentada solicita Tetris en el constructor de Engine. Los nombres son claves exactas del registro; una escena desconocida no tiene una ruta de recuperación implementada.

## Transición diferida

`SceneManager::ChangeScene` almacena el nombre solicitado si todavía no hay otro cambio pendiente. Engine consume esa solicitud al principio del siguiente procesamiento de eventos.

```text
ChangeScene(nombre)
     ↓
Solicitud pendiente
     ↓
Siguiente ProcessEvent
     ↓
OnCleanup de la escena anterior
     ↓
Limpieza de partículas y bindings de entrada
     ↓
Cambio del puntero activo
     ↓
Start de la escena solicitada
     ↓
Sincronización de pausa
```

`RestartCurrentScene` utiliza el mismo mecanismo con el nombre actual. No destruye y reconstruye el objeto: por eso `Start` debe dejar la partida en un estado válido al repetirse.

## Explorar una implementación real

[Bounce](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Games/Source/Bounce.cpp) muestra cómo una clase de juego recibe el contexto, prepara su paleta y estadísticas, solicita sonido y música y utiliza los callbacks de escena.

Para incorporar una escena en tu propia copia, sigue la separación existente: declaración en `Games/Include`, implementación en `Games/Source` y registro explícito en `SceneFactory.cpp`. CMake descubre los `.cpp` de esas carpetas con `GLOB_RECURSE CONFIGURE_DEPENDS`; no existe un plugin de escenas cargado en tiempo de ejecución.

## Limitación del acceso al menú

El overlay incluye un botón **Menu**, y el atajo **M** llama al mismo flujo. Engine solicita una escena llamada `Menu`, pero la fábrica de esta revisión no la registra. Evita esa acción al explorar esta versión: puede activar una aserción o una excepción por clave inexistente.

Esta documentación conserva esa limitación de forma explícita; no presenta el menú como un selector de juegos disponible.

## Fuentes

- [Contrato Scene](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Include/Scene/Scene.h).
- [Registro SceneFactory](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Scene/SceneFactory.cpp).
- [Solicitudes de SceneManager](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/SceneManager.cpp).
- [Transiciones en Engine](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Core/Engine.cpp).