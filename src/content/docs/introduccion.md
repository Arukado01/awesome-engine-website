---
title: Introducción
description: Qué incluye Awesome Engine, qué puedes estudiar en su código y cómo leer el estado de cada sistema.
order: 1
category: Primeros pasos
---

## Un motor 2D que puedes recorrer por dentro

Awesome Engine es un motor de videojuegos escrito en **C++20**, construido sobre SFML. El núcleo conecta escenas con servicios de renderizado, recursos, entrada, audio, interfaces y persistencia. Los juegos del repositorio muestran cómo utilizar esos servicios desde código C++.

La documentación toma como referencia el [commit `5a6dfac`](https://github.com/Arukado01/AwesomeEngine/tree/5a6dfacd86414c4cdfaa7157b533330f173a3126). Describe lo que contiene esa revisión; los cambios observados únicamente en el árbol local aparecen identificados como **en desarrollo**.

## Lo que encontrarás

- **Siete escenas de juego:** Bounce, Clicker, MemoryCard, TicTacToe, MineSweeper, Runner y Tetris.
- **Renderizado 2D:** objetos dibujables de SFML, texturas intermedias y posprocesado Bloom y Monitor.
- **Entrada por acciones:** teclado, ratón y mandos, con múltiples asignaciones para una misma acción.
- **Servicios compartidos:** recursos, tiempo, audio, partículas, guardado JSON y capturas PNG.
- **Interfaz TGUI:** widgets y overlay de pausa integrados con los eventos de la ventana.

Estos sistemas se conectan mediante `EngineContext`. Cada juego implementa la interfaz `Scene` y mantiene sus propios objetos y reglas. No hay una arquitectura ECS ni un editor visual en la revisión documentada.

## El recorrido recomendado

1. [Instala y compila el proyecto](/docs/instalacion/).
2. [Revisa la configuración de ejecución](/docs/configuracion/).
3. [Sigue el ciclo del motor y sus dependencias](/docs/arquitectura/).
4. [Consulta el contrato de las escenas](/docs/escenas/).
5. Explora [renderizado](/docs/renderizado/), [recursos](/docs/recursos/) y [entrada y audio](/docs/entrada-audio/).

## Cómo interpretar los estados

| Estado | Significado en este sitio |
| --- | --- |
| Implementada | Hay código concreto en la revisión de referencia. No equivale a una certificación de todas las plataformas o todos los escenarios. |
| En desarrollo | Hay implementación o cambios en el árbol local que aún no forman parte del commit de referencia. |
| Experimental | El código existe, pero su integración está desactivada o no participa en el flujo normal descrito. |
| Planificada | Requiere una intención documentada por el proyecto. No se asignan funciones a este estado sin esa evidencia. |

`AudioGroup`, `SpriteAnimator`, `SweptAabb` y el reloj compartido para cooldowns se observaron como trabajo local. No debes esperar esas API al clonar la revisión de referencia.

## Alcance de la plataforma

El repositorio incluye configuración de trabajo para **Windows con MinGW, Ninja y GDB**. La auditoría no acredita compilación o ejecución en Linux, macOS, móviles o navegadores. Las bibliotecas utilizadas no bastan por sí solas para afirmar compatibilidad completa del motor.

El código del motor tiene [licencia MIT](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/LICENSE.md). Los nombres de las entradas del historial corresponden a commits reales, no a versiones de lanzamiento inventadas.

## Fuentes

- [Dependencias y opciones de compilación](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/CMakeLists.txt).
- [Registro de escenas](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Scene/SceneFactory.cpp).
- [Servicios de EngineContext](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Include/Core/EngineContext.h).