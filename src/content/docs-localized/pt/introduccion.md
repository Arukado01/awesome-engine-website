---
title: Introdução
description: O que o Awesome Engine inclui, o que você pode estudar no código e como interpretar o estado de cada sistema.
order: 1
category: Primeiros passos
---

<span id="un-motor-2d-que-puedes-recorrer-por-dentro" aria-hidden="true"></span>

## Um motor 2D que você pode explorar por dentro

Awesome Engine é um motor de jogos escrito em **C++20**, construído sobre o SFML. O núcleo conecta cenas a serviços de renderização, recursos, entrada, áudio, interfaces e persistência. Os jogos do repositório mostram como usar esses serviços a partir de código C++.

A documentação usa o [commit `f0e88ed`](https://github.com/Arukado01/AwesomeEngine/tree/f0e88edffae35efb3cc208e8eea651d1b559cbaa) como referência pública.

<span id="lo-que-encontrarás" aria-hidden="true"></span>

## O que você encontrará

- **Sete cenas de jogo:** Bounce, Clicker, MemoryCard, TicTacToe, MineSweeper, Runner e Tetris.
- **Renderização 2D:** objetos desenháveis do SFML, texturas intermediárias e pós-processamento Bloom e Monitor.
- **Entrada por ações:** teclado, mouse e controles, com várias associações para uma mesma ação.
- **Serviços compartilhados:** recursos, tempo, áudio, partículas, salvamento em JSON e capturas PNG.
- **Interface TGUI:** widgets e sobreposição de pausa integrados aos eventos da janela.

Esses sistemas se conectam por meio de `EngineContext`. Cada jogo implementa a interface `Scene` e mantém seus próprios objetos e regras. A revisão documentada não tem arquitetura ECS nem editor visual.

<span id="el-recorrido-recomendado" aria-hidden="true"></span>

## Percurso recomendado

1. [Instale e compile o projeto](/pt/docs/instalacion/).
2. [Revise a configuração de execução](/pt/docs/configuracion/).
3. [Acompanhe o ciclo do motor e suas dependências](/pt/docs/arquitectura/).
4. [Consulte o contrato das cenas](/pt/docs/escenas/).
5. Explore [renderização](/pt/docs/renderizado/), [recursos](/pt/docs/recursos/) e [entrada e áudio](/pt/docs/entrada-audio/).

<span id="cómo-interpretar-los-estados" aria-hidden="true"></span>

## Como interpretar os estados

| Estado | Significado neste site |
| --- | --- |
| Implementada | Há código concreto na revisão de referência. Isso não equivale a uma certificação de todas as plataformas ou situações. |
| Em desenvolvimento | Há implementação ou alterações na árvore de trabalho local que ainda não fazem parte do commit de referência. |
| Experimental | O código existe, mas sua integração está desativada ou não participa do fluxo normal descrito. |
| Planejada | Exige uma intenção documentada pelo projeto. Nenhum recurso recebe esse estado sem essa evidência. |

`AudioGroup`, `SpriteAnimator`, `CollisionManager`, `SweptAabb` e os relógios compartilhados fazem parte da revisão pública de referência.

<span id="alcance-de-la-plataforma" aria-hidden="true"></span>

## Abrangência de plataformas

O repositório inclui configuração de trabalho para **Windows com MinGW, Ninja e GDB**. A auditoria não comprova compilação ou execução em Linux, macOS, dispositivos móveis ou navegadores. As bibliotecas utilizadas não bastam, por si só, para afirmar compatibilidade completa do motor.

O código do motor está sob a [licença MIT](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/LICENSE.md). Os nomes das entradas do histórico correspondem a commits reais, não a versões de lançamento inventadas.

<span id="fuentes" aria-hidden="true"></span>

## Fontes

- [Dependências e opções de compilação](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/CMakeLists.txt).
- [Registro de cenas](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Scene/SceneFactory.cpp).
- [Serviços do EngineContext](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Include/Core/EngineContext.h).
