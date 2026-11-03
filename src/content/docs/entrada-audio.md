---
title: Entrada, audio e interfaz
description: Asignación de acciones, mandos, atajos globales, reproducción sonora y widgets TGUI.
order: 8
category: Sistemas
---

## Una acción, varias entradas

InputManager utiliza identificadores enteros de acción y un `unordered_multimap` de bindings. Una acción puede asociarse a más de una entrada. `Pressed(action)` devuelve verdadero cuando alguna de las asignaciones está presionada.

Los tipos de binding de la revisión de referencia son:

```cpp
struct Keyboard {
  sf::Keyboard::Scan key;
};
struct Mouse {
  sf::Mouse::Button button;
};
struct Gamepad {
  GamepadButton button;
  int id = 0;
};
struct Axis {
  sf::Joystick::Axis axis;
  float threshold = 0.5f;
  int id = 0;
};

using Binding = std::variant<Keyboard, Mouse, Gamepad, Axis>;
```

Estos tipos pertenecen al namespace `Input`. La consulta es de estado actual, no un detector automático del instante de pulsación. Para eventos discretos, las escenas también disponen de `OnEvent`.

Los ejes se normalizan dividiendo su valor entre 100 y se comparan con el umbral positivo o negativo configurado. Engine limpia los bindings al cambiar de escena; cada juego debe volver a establecer los suyos al comenzar.

## Mandos y cursor

El código contiene tablas de botones lógicos para Xbox y PlayStation. Selecciona la tabla Xbox cuando identifica el vendor de Microsoft; utiliza la tabla PlayStation en los demás casos. Esta heurística no garantiza que todo mando tenga el mismo mapeo.

Los gatillos L2/R2 no tienen botón en la tabla Xbox: su entrada figura como no disponible en ese mapeo de botones. Los ejes son un tipo de binding independiente.

CursorManager permite mover el cursor con el stick, respetando `joystickDeadzone`. También convierte la posición del ratón a coordenadas de una vista. GuiManager transforma el botón lógico South en eventos de clic para los widgets.

## Atajos globales

| Entrada | Acción |
| --- | --- |
| F12 | Guardar una captura PNG. |
| R | Reiniciar la escena activa. |
| Escape / Start del mando | Alternar el overlay de pausa. |
| M / Select del mando | Solicitar `Menu`; esa escena no está registrada en la revisión documentada. |

Los atajos se procesan en `EngineVisitor`. La pérdida de foco pausa la escena. Al recuperarlo, se reanuda únicamente si el overlay no sigue abierto.

## Audio de la revisión de referencia

AudioManager mantiene el volumen global y los niveles Music/Effect. ResourceManager entrega buffers compartidos y música; cada escena administra sus fuentes.

```cpp
void AudioManager::SetGlobalVolume(float volume) {
  sf::Listener::setGlobalVolume(volume);
}
```

<span id="trabajo-local-en-desarrollo" aria-hidden="true"></span>

### Grupos de audio

`AudioManager::CreateGroup` crea un `AudioGroup` para reunir sonidos y música de una escena. El grupo pausa y reanuda únicamente las fuentes que estaban reproduciéndose, y permite detener o ajustar sus canales. Runner y Bounce lo utilizan.

Conserva el grupo en la escena para mantener sus fuentes; por ejemplo:

```cpp
auto sound = audioGroup.AddSound(ctx.resources.AcquireSound("RunnerJump.wav"), 20.f);
if (sound) audioGroup.Play(*sound);
```

## Interfaz TGUI

GuiManager conecta TGUI con la ventana SFML. Carga `Content/Themes/Dark.txt`, aplica la fuente `Relidux.otf`, habilita el uso de Tab y proporciona métodos para añadir o retirar widgets.

El overlay crea botones a partir de `OverlaySelection` usando `magic_enum`. La selección se consume una vez y Engine ejecuta la acción correspondiente. La GUI se dibuja después del posprocesado de la escena.

## Fuentes

- [Tipos de entrada](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Include/utils/InputBindings.h).
- [Consulta de bindings](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/InputManager.cpp).
- [Mapeo de mandos](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Utils/InputBindings.cpp).
- [AudioManager](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/AudioManager.cpp).
- [GuiManager](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/GuiManager.cpp).
- [AudioGroup](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Include/Managers/AudioGroup.h).
