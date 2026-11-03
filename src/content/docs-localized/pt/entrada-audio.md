---
title: Entrada, áudio e interface
description: Associação de ações, controles, atalhos globais, reprodução de áudio e widgets TGUI.
order: 8
category: Sistemas
---

<span id="una-acción-varias-entradas" aria-hidden="true"></span>

## Uma ação, várias entradas

O InputManager usa identificadores inteiros de ação e um `unordered_multimap` de bindings. Uma ação pode ser associada a mais de uma entrada. `Pressed(action)` retorna verdadeiro quando alguma das associações está pressionada.

Os tipos de binding da revisão de referência são:

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

Esses tipos pertencem ao namespace `Input`. A consulta verifica o estado atual, não detecta automaticamente o instante em que um botão foi pressionado. Para eventos discretos, as cenas também dispõem de `OnEvent`.

Os eixos são normalizados dividindo seu valor por 100 e comparados com o limiar positivo ou negativo configurado. O Engine limpa os bindings ao mudar de cena; cada jogo deve configurar os seus novamente ao iniciar.

<span id="mandos-y-cursor" aria-hidden="true"></span>

## Controles e cursor

O código contém tabelas de botões lógicos para Xbox e PlayStation. Ele seleciona a tabela Xbox ao identificar o fabricante Microsoft e usa a tabela PlayStation nos demais casos. Essa heurística não garante o mesmo mapeamento para todos os controles.

Os gatilhos L2/R2 não têm botão na tabela Xbox: sua entrada aparece como indisponível nesse mapeamento de botões. Eixos são um tipo de binding independente.

O CursorManager permite mover o cursor com o analógico, respeitando `joystickDeadzone`. Ele também converte a posição do mouse para as coordenadas de uma vista. O GuiManager transforma o botão lógico South em eventos de clique para os widgets.

<span id="atajos-globales" aria-hidden="true"></span>

## Atalhos globais

| Entrada | Ação |
| --- | --- |
| F12 | Salvar uma captura PNG. |
| R | Reiniciar a cena ativa. |
| Escape / Start do controle | Alternar a sobreposição de pausa. |
| M / Select do controle | Solicitar `Menu`; essa cena não está registrada na revisão documentada. |

Os atalhos são processados em `EngineVisitor`. A perda de foco pausa a cena. Ao recuperar o foco, ela só é retomada se a sobreposição não continuar aberta.

<span id="audio-de-la-revisión-de-referencia" aria-hidden="true"></span>

## Áudio da revisão de referência

AudioManager controla o volume global e os níveis Music/Effect. ResourceManager fornece buffers compartilhados e música; cada cena administra suas fontes.

```cpp
void AudioManager::SetGlobalVolume(float volume) {
  sf::Listener::setGlobalVolume(volume);
}
```

<span id="trabajo-local-en-desarrollo" aria-hidden="true"></span>

<span id="grupos-de-audio" aria-hidden="true"></span>

### Grupos de áudio

`AudioManager::CreateGroup` cria um `AudioGroup` para os sons e a música de uma cena. O grupo pausa e retoma apenas as fontes que estavam tocando e permite parar ou ajustar canais. Runner e Bounce o utilizam.

Mantenha o grupo na cena para conservar suas fontes; por exemplo:

```cpp
auto sound = audioGroup.AddSound(ctx.resources.AcquireSound("RunnerJump.wav"), 20.f);
if (sound) audioGroup.Play(*sound);
```

<span id="interfaz-tgui" aria-hidden="true"></span>

## Interface TGUI

O GuiManager conecta o TGUI à janela SFML. Ele carrega `Content/Themes/Dark.txt`, aplica a fonte `Relidux.otf`, habilita a navegação por Tab e fornece métodos para adicionar ou remover widgets.

A sobreposição cria botões a partir de `OverlaySelection` usando `magic_enum`. A seleção é consumida uma vez, e o Engine executa a ação correspondente. A GUI é desenhada após o pós-processamento da cena.

<span id="fuentes" aria-hidden="true"></span>

## Fontes

- [Tipos de entrada](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Include/utils/InputBindings.h).
- [Consulta de bindings](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/InputManager.cpp).
- [Mapeamento de controles](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Utils/InputBindings.cpp).
- [AudioManager](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/AudioManager.cpp).
- [GuiManager](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/GuiManager.cpp).

- [AudioGroup](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Include/Managers/AudioGroup.h).
