---
title: 简介
description: 了解 Awesome Engine 的组成、可以从源码中学习的内容，以及各个系统状态的含义。
order: 1
category: 入门
---

<span id="un-motor-2d-que-puedes-recorrer-por-dentro" aria-hidden="true"></span>

## 可以深入探索的 2D 引擎

Awesome Engine 是使用 **C++20** 编写、基于 SFML 构建的游戏引擎。其核心把场景与渲染、资源、输入、音频、界面和持久化服务连接起来。仓库中的游戏展示了如何通过 C++ 代码使用这些服务。

本文档以公开修订 [提交 `f0e88ed`](https://github.com/Arukado01/AwesomeEngine/tree/f0e88edffae35efb3cc208e8eea651d1b559cbaa) 为参考。

<span id="lo-que-encontrarás" aria-hidden="true"></span>

## 包含哪些内容

- **七个游戏场景：** Bounce、Clicker、MemoryCard、TicTacToe、MineSweeper、Runner 和 Tetris。
- **2D 渲染：** SFML 可绘制对象、中间纹理，以及 Bloom 和 Monitor 后处理。
- **基于动作的输入：** 支持键盘、鼠标和手柄，同一动作可绑定多个输入。
- **共享服务：** 资源、时间、音频、粒子、JSON 存档和 PNG 截图。
- **TGUI 界面：** 与窗口事件集成的控件和暂停覆盖层。

这些系统通过 `EngineContext` 连接。每个游戏实现 `Scene` 接口，并维护自己的对象和规则。本文档所述修订没有 ECS 架构或可视化编辑器。

<span id="el-recorrido-recomendado" aria-hidden="true"></span>

## 建议的阅读顺序

1. [安装并编译项目](/zh/docs/instalacion/)。
2. [检查运行配置](/zh/docs/configuracion/)。
3. [了解引擎循环及其依赖关系](/zh/docs/arquitectura/)。
4. [阅读场景接口约定](/zh/docs/escenas/)。
5. 探索[渲染](/zh/docs/renderizado/)、[资源](/zh/docs/recursos/)以及[输入与音频](/zh/docs/entrada-audio/)。

<span id="cómo-interpretar-los-estados" aria-hidden="true"></span>

## 如何理解状态

| 状态 | 在本站中的含义 |
| --- | --- |
| 已实现 | 参考修订中存在具体代码，但不代表已认证所有平台或所有使用场景。 |
| 开发中 | 本地工作树中存在尚未包含在参考提交中的实现或改动。 |
| 实验性 | 代码已经存在，但集成被禁用，或不参与本文描述的常规流程。 |
| 已计划 | 需要项目提供明确记录的计划依据。没有证据时，不会把功能归为此状态。 |

`AudioGroup`、`SpriteAnimator`、`CollisionManager`、`SweptAabb` 和共享时钟均包含在公开参考修订中。

<span id="alcance-de-la-plataforma" aria-hidden="true"></span>

## 平台范围

仓库包含适用于 **Windows、MinGW、Ninja 和 GDB** 的开发配置。本次审查未验证 Linux、macOS、移动设备或浏览器上的编译和运行情况。仅凭所用库支持这些平台，不能认定整个引擎完全兼容。

引擎代码采用 [MIT 许可证](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/LICENSE.md)。历史记录中的条目对应真实提交，并非虚构的发行版本。

<span id="fuentes" aria-hidden="true"></span>

## 源码参考

- [依赖项与编译选项](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/CMakeLists.txt)。
- [场景注册](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Scene/SceneFactory.cpp)。
- [EngineContext 服务](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Include/Core/EngineContext.h)。
