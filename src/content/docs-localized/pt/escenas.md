---
title: Cenas e ciclo de vida
description: O contrato Scene, o registro de jogos, as transições adiadas e a limpeza de estado.
order: 7
category: Núcleo do motor
---

<span id="el-contrato-de-una-escena" aria-hidden="true"></span>

## O contrato de uma cena

Uma cena recebe `EngineContext` por referência e define como iniciar, atualizar e desenhar. Este contrato existe na revisão de referência:

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

`Start`, `Update` e `Render` são obrigatórios. Os demais callbacks têm implementação vazia e são especializados quando o jogo precisa deles.

## Responsabilidades por etapa

| Etapa | Quando ocorre | Uso dentro do jogo |
| --- | --- | --- |
| Construtor | Ao criar o registro inicial de cenas. | Preparar objetos e recursos da instância. |
| `Start` | Ao ativar ou reiniciar a cena. | Restabelecer a partida e registrar seus controles. |
| `OnEvent` | Ao receber eventos com a sobreposição oculta. | Tratar eventos discretos do jogo. |
| `Update` | Por quadro, com foco e sem sobreposição visível. | Avançar lógica, movimento e estado. |
| `Render` | Ao desenhar o quadro da cena ativa. | Enviar objetos para `ctx.renderer`. |
| `OnPause` | Quando o estado de pausa muda. | Pausar ou retomar os elementos controlados pela cena. |
| `OnCleanup` | Antes de sair da cena ou reiniciá-la. | Parar o áudio e limpar estados que não devem continuar. |

O construtor e `Start` não são equivalentes. As instâncias permanecem no registro e podem receber `Start` várias vezes.

<span id="registro-de-juegos" aria-hidden="true"></span>

## Registro de jogos

`SceneFactory::Scenes` é um `unordered_map` que associa nomes a `unique_ptr<Scene>`. A fábrica registra sete instâncias:

```cpp
scenes.emplace("Bounce", std::make_unique<Bounce::Game>(context));
scenes.emplace("Clicker", std::make_unique<Clicker::Game>(context));
scenes.emplace("MemoryCard", std::make_unique<MemoryCard::Game>(context));
scenes.emplace("TicTacToe", std::make_unique<TicTacToe::Game>(context));
scenes.emplace("MineSweeper", std::make_unique<MineSweeper::Game>(context));
scenes.emplace("Runner", std::make_unique<Runner::Game>(context));
scenes.emplace("Tetris", std::make_unique<Tetris::Game>(context));
```

A revisão documentada solicita Tetris no construtor do Engine. Os nomes são chaves exatas do registro; não há um caminho de recuperação implementado para uma cena desconhecida.

<span id="transición-diferida" aria-hidden="true"></span>

## Transição adiada

`SceneManager::ChangeScene` armazena o nome solicitado se ainda não houver outra mudança pendente. O Engine consome essa solicitação no início do próximo processamento de eventos.

```text
ChangeScene(nome)
     ↓
Solicitação pendente
     ↓
Próximo ProcessEvent
     ↓
OnCleanup da cena anterior
     ↓
Limpeza de partículas e bindings de entrada
     ↓
Troca do ponteiro ativo
     ↓
Start da cena solicitada
     ↓
Sincronização da pausa
```

`RestartCurrentScene` usa o mesmo mecanismo com o nome atual. Ele não destrói e reconstrói o objeto: por isso, `Start` deve deixar a partida em um estado válido mesmo quando repetido.

<span id="explorar-una-implementación-real" aria-hidden="true"></span>

## Explorar uma implementação real

[Bounce](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Games/Source/Bounce.cpp) mostra como uma classe de jogo recebe o contexto, prepara sua raquete e estatísticas, solicita som e música e usa os callbacks da cena.

Para adicionar uma cena à sua própria cópia, siga a separação existente: declaração em `Games/Include`, implementação em `Games/Source` e registro explícito em `SceneFactory.cpp`. O CMake descobre os arquivos `.cpp` dessas pastas com `GLOB_RECURSE CONFIGURE_DEPENDS`; não existe plugin de cenas carregado em tempo de execução.

<span id="limitación-del-acceso-al-menú" aria-hidden="true"></span>

## Limitação de acesso ao menu

A sobreposição inclui um botão **Menu**, e o atalho **M** chama o mesmo fluxo. O Engine solicita uma cena chamada `Menu`, mas a fábrica dessa revisão não a registra. Evite essa ação ao explorar esta versão: ela pode disparar uma asserção ou uma exceção por chave inexistente.

Esta documentação mantém essa limitação explícita; ela não apresenta o menu como um seletor de jogos disponível.

<span id="fuentes" aria-hidden="true"></span>

## Fontes

- [Contrato Scene](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Include/Scene/Scene.h).
- [Registro SceneFactory](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Scene/SceneFactory.cpp).
- [Solicitações do SceneManager](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/SceneManager.cpp).
- [Transições no Engine](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Core/Engine.cpp).
