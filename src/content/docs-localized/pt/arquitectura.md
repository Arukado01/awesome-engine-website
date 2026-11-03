---
title: Arquitetura do motor
description: Acompanhe o loop principal, o EngineContext, a propriedade dos objetos e a relação entre os sistemas.
order: 4
category: Núcleo do motor
---

<span id="de-la-entrada-al-frame" aria-hidden="true"></span>

## Da entrada ao quadro

`main()` constrói um `Engine` e repete três operações enquanto a janela permanece aberta. Este trecho vem do código de referência:

```cpp
while (engine.IsRunning()) {
  engine.ProcessEvent();
  engine.Update();

  if (!engine.HasFocus()) {
    sf::sleep(sf::milliseconds(10));
    continue;
  }

  engine.Render();
}
```

Sem foco, o loop continua processando eventos e atualizando o relógio; ele ignora a renderização e espera 10 ms. `Engine::Update` também verifica o foco antes de avançar a cena.

<span id="responsabilidades-de-engine" aria-hidden="true"></span>

## Responsabilidades do Engine

`Engine` possui a janela, um `EngineContext`, o registro de cenas, a referência à cena ativa e uma sobreposição de pausa. Sua função é coordenar esses elementos.

```text
Engine
├── sf::RenderWindow
├── EngineContext
│   ├── renderer · resources · particles
│   ├── animations · collisions
│   ├── input · cursor · gui
│   ├── audio · time · random
│   └── scenes · save · screenshot · clipboard
├── SceneFactory::Scenes
│   └── nome → unique_ptr<Scene>
├── currentScene → Scene ativa
└── Overlay → widgets TGUI
```

O contexto é passado por referência a cada cena. Assim, um jogo acessa `ctx.renderer`, `ctx.input` ou `ctx.resources` sem construir serviços duplicados.

<span id="procesamiento-de-eventos" aria-hidden="true"></span>

## Processamento de eventos

No início de `ProcessEvent`, o motor consome a mudança de cena pendente. Depois, obtém os eventos de `sf::RenderWindow` e os distribui:

1. `EngineVisitor` trata fechamento, foco, tamanho, controles e atalhos globais.
2. `GuiManager` envia o evento ao TGUI.
3. A cena recebe `OnEvent` quando a sobreposição está oculta.
4. O motor processa qualquer seleção da sobreposição e sincroniza o estado de pausa.

A GUI e a cena participam do mesmo processamento; não há um barramento de eventos separado documentado.

<span id="actualización-y-tiempo" aria-hidden="true"></span>

## Atualização e tempo

`TimeManager` calcula o tempo decorrido desde o quadro anterior e o limita a `gConfig.maximumDeltaTime`. Em seguida, o cursor é atualizado e, se a sobreposição estiver oculta, `Scene::Update` é chamado.

O sistema não implementa um acumulador de passos fixos. Os jogos decidem como usar o delta de tempo e seus próprios temporizadores.

`TimeManager` distingue tempo real e tempo de jogo. Engine pausa o relógio de jogo com a cena; um `Cooldown` vinculado usa esse relógio por padrão. Um cooldown independente mantém seu relógio real.

Um cooldown vinculado usa tempo de jogo por padrão:

```cpp
auto cooldown = ctx.time.CreateCooldown(1.f, TimeDomain::Game);
```

<span id="renderizado-y-capas" aria-hidden="true"></span>

## Renderização e camadas

A cena desenha em uma `sf::RenderTexture`. O RenderManager aplica a cadeia de efeitos e retorna a textura final. O Engine a apresenta na janela e desenha a GUI e o cursor por cima.

```text
Scene::Render
     ↓
RenderManager / RenderTexture
     ↓
Bloom → Monitor
     ↓
Janela → GUI → Cursor → display
```

Os efeitos só são adicionados quando `sf::Shader::isAvailable()` retorna verdadeiro. A GUI e o cursor são desenhados após o pós-processamento. Consulte [Renderização](/pt/docs/renderizado/) para acompanhar as passagens de Bloom.

<span id="propiedad-y-memoria" aria-hidden="true"></span>

## Propriedade e memória

- As cenas são armazenadas em um `unordered_map` de `unique_ptr<Scene>`.
- Os efeitos são armazenados em um vetor de `unique_ptr<Effect>`.
- A cena ativa é um ponteiro sem propriedade; seu objeto continua pertencendo ao registro.
- Os managers fazem parte de `EngineContext` por valor.
- ResourceManager guarda texturas e fontes por valor e compartilha buffers de som com `shared_ptr`.

O projeto usa RAII e contêineres padrão. Não há um gerenciador de memória personalizado nem um ECS genérico. Todas as cenas registradas são construídas em `CreateScenes`; a mudança de cena não constrói uma nova instância a cada transição.

<span id="organización-del-código" aria-hidden="true"></span>

## Organização do código

| Diretório | Conteúdo |
| --- | --- |
| `Engine/Include` | Contratos e tipos do núcleo, managers, cenas, efeitos e utilitários. |
| `Engine/Source` | Implementações e ponto de entrada. |
| `Games/Include` | Classes de jogo, tipos e constantes de configuração. |
| `Games/Source` | Lógica e renderização dos jogos. |
| `Content` | Recursos gráficos e sonoros, fontes, shaders, tema e JSON. |

<span id="fuentes" aria-hidden="true"></span>

## Fontes

- [Loop principal](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Main.cpp).
- [Coordenação do Engine](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Core/Engine.cpp).
- [Definição de EngineContext](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Include/Core/EngineContext.h).
- [Propriedade das cenas](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Include/Scene/SceneFactory.h).
