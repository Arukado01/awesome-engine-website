---
title: Configuração
description: Valores da janela, tempo, áudio e cursor, e limites da configuração JSON atual.
order: 3
category: Primeiros passos
---

<span id="el-archivo-de-configuración" aria-hidden="true"></span>

## O arquivo de configuração

O motor lê `Content/Config.json` ao iniciar. O exemplo mostra uma única entrada de `games`.

```json
{
  "windowTitle": "Awesome Engine",
  "windowSize": [800, 800],
  "frameRateLimit": 120,
  "disableSfmlLogs": true,
  "maximumDeltaTime": 0.03,
  "globalVolume": 100,
  "backgroundColor": [100, 100, 100],
  "cursorSize": 21,
  "cursorSpeed": 800,
  "joystickDeadzone": 0.1,
  "games": [
    {
      "name": "Clicker",
      "title": "Clicker",
      "controls": "Hit: Left Click / South"
    }
  ]
}
```

<span id="qué-controla-cada-valor" aria-hidden="true"></span>

## O que cada valor controla

| Chave | Efeito |
| --- | --- |
| `windowTitle` | Título da janela SFML. |
| `windowSize` | Tamanho inicial em modo janela e tamanho lógico da área de jogo. |
| `frameRateLimit` | Limite de quadros solicitado à janela; por padrão, 120 se a chave não existir. |
| `disableSfmlLogs` | Silencia o fluxo de erros do SFML quando definido como `true`. |
| `maximumDeltaTime` | Delta máximo de simulação, em segundos, fornecido pelo TimeManager por quadro. |
| `globalVolume` | Volume global aplicado ao listener do SFML. |
| `backgroundColor` | Tonalidade RGB do fundo usado pelo RenderManager. |
| `cursorSize` | Tamanho em pixels do lado mais longo do cursor baseado em `Icon.png`. O padrão é 24. |
| `cursorSpeed` | Velocidade do cursor ao movê-lo com o controle. |
| `joystickDeadzone` | Limiar usado para ignorar pequenos deslocamentos do analógico ao mover o cursor. |

O limite de 120 quadros é uma configuração, **não uma medição de desempenho**. Também não implica que a simulação use um passo de tempo fixo: o tempo varia por quadro e é limitado por `maximumDeltaTime`.

<span id="cambiar-la-configuración" aria-hidden="true"></span>

## Alterar a configuração

Modifique o JSON com o aplicativo fechado e execute-o novamente a partir da raiz do repositório. A configuração é carregada na inicialização; não há recarregamento automático do arquivo nem painel de preferências que escreva esses valores.

Preserve as chaves e os tipos do exemplo. O parser não implementa um esquema de validação nem valores alternativos para todos os campos. Um arquivo ausente, JSON inválido ou uma chave obrigatória incorreta pode impedir a inicialização.

`windowSize` define o tamanho de referência usado pelos jogos. Ao redimensionar a janela, o motor adapta a renderização ao tamanho real e preserva as coordenadas e proporções do projeto.

<span id="configuración-de-cada-juego" aria-hidden="true"></span>

## Configuração de cada jogo

A lista `games` define os jogos do menu e sua ordem. `name` deve corresponder à chave em `SceneFactory`. `title` é o rótulo e `controls` é o texto de ajuda. Mantenha ao menos uma entrada e reinicie o motor após editar o arquivo.

As regras de cada jogo ficam em `Games/Include/Config` e exigem recompilação após mudanças. O `Engine` inicia a cena `Menu`.

<span id="preferencias-del-sitio-y-del-motor" aria-hidden="true"></span>

## Preferências do site e do motor

O seletor claro, escuro ou sistema deste site altera apenas sua interface web. O motor configura o TGUI com `Content/Themes/Dark.txt`; a documentação não pressupõe que o seletor web exista dentro do executável.

<span id="fuentes" aria-hidden="true"></span>

## Fontes

- [Valores originais de Config.json](https://github.com/Arukado01/AwesomeEngine/blob/60ce8139fbd36713821bf85debd96bf0bd1c8bb3/Content/Config.json).
- [Leitura do EngineConfig](https://github.com/Arukado01/AwesomeEngine/blob/60ce8139fbd36713821bf85debd96bf0bd1c8bb3/Engine/Source/Core/EngineConfig.cpp).
- [Cálculo do delta time](https://github.com/Arukado01/AwesomeEngine/blob/60ce8139fbd36713821bf85debd96bf0bd1c8bb3/Engine/Source/Managers/TimeManager.cpp).
