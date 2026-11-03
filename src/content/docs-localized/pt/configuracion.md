---
title: Configuração
description: Valores da janela, tempo, áudio e cursor, e limites da configuração JSON atual.
order: 3
category: Primeiros passos
---

<span id="el-archivo-de-configuración" aria-hidden="true"></span>

## O arquivo de configuração

O motor lê `Content/Config.json` ao construir o objeto global `gConfig`. Este é o conteúdo da revisão de referência:

```json
{
  "windowTitle": "Awesome Engine",
  "windowSize": [800, 800],
  "frameRateLimit": 120,
  "disableSfmlLogs": true,
  "maximumDeltaTime": 0.03,
  "globalVolume": 100,
  "backgroundColor": [100, 100, 100],
  "cursorRadius": 5,
  "cursorSpeed": 800,
  "cursorColor": [255, 100, 0],
  "joystickDeadzone": 0.1
}
```

<span id="qué-controla-cada-valor" aria-hidden="true"></span>

## O que cada valor controla

| Chave | Efeito |
| --- | --- |
| `windowTitle` | Título da janela SFML. |
| `windowSize` | Tamanho inicial e referência para os alvos de renderização e vários cálculos dos jogos. |
| `frameRateLimit` | Limite de quadros solicitado à janela; por padrão, 120 se a chave não existir. |
| `disableSfmlLogs` | Silencia o fluxo de erros do SFML quando definido como `true`. |
| `maximumDeltaTime` | Delta máximo de simulação, em segundos, fornecido pelo TimeManager por quadro. |
| `globalVolume` | Volume global aplicado ao listener do SFML. |
| `backgroundColor` | Tonalidade RGB do fundo usado pelo RenderManager. |
| `cursorRadius` | Raio do cursor circular personalizado. |
| `cursorSpeed` | Velocidade do cursor ao movê-lo com o controle. |
| `cursorColor` | Cor RGB do cursor. |
| `joystickDeadzone` | Limiar usado para ignorar pequenos deslocamentos do analógico ao mover o cursor. |

O limite de 120 quadros é uma configuração, **não uma medição de desempenho**. Também não implica que a simulação use um passo de tempo fixo: o tempo varia por quadro e é limitado por `maximumDeltaTime`.

<span id="cambiar-la-configuración" aria-hidden="true"></span>

## Alterar a configuração

Modifique o JSON com o aplicativo fechado e execute-o novamente a partir da raiz do repositório. A configuração é carregada na inicialização; não há recarregamento automático do arquivo nem painel de preferências que escreva esses valores.

Preserve as chaves e os tipos do exemplo. O parser não implementa um esquema de validação nem valores alternativos para todos os campos. Um arquivo ausente, JSON inválido ou uma chave obrigatória incorreta pode impedir a inicialização.

Alterar `windowSize` também afeta o código de jogo que usa `gConfig.windowSize`. Isso não equivale a ter um sistema completo de resolução dinâmica. O evento de redimensionamento não reconstrói automaticamente as texturas de pós-processamento.

<span id="configuración-de-cada-juego" aria-hidden="true"></span>

## Configuração de cada jogo

Os parâmetros específicos ficam em `Games/Include/Config`: `BounceConfig.h`, `ClickerConfig.h`, `MemoryCardConfig.h`, `TicTacToeConfig.h`, `MineSweeperConfig.h`, `RunnerConfig.h` e `TetrisConfig.h`.

São constantes C++; suas alterações exigem recompilação. A cena inicial também não é escolhida em `Config.json`: ela é definida por `ChangeScene("Tetris")` no construtor de `Engine`.

<span id="preferencias-del-sitio-y-del-motor" aria-hidden="true"></span>

## Preferências do site e do motor

O seletor claro, escuro ou sistema deste site altera apenas sua interface web. O motor configura o TGUI com `Content/Themes/Dark.txt`; a documentação não pressupõe que o seletor web exista dentro do executável.

<span id="fuentes" aria-hidden="true"></span>

## Fontes

- [Valores originais de Config.json](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Content/Config.json).
- [Leitura do EngineConfig](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Core/EngineConfig.cpp).
- [Cálculo do delta time](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/TimeManager.cpp).
