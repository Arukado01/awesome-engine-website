---
title: 安装与编译
description: 准备 CMake 和 C++20 编译器，构建可执行文件，并从正确的目录启动。
order: 2
category: 入门
---

<span id="requisitos-del-proyecto" aria-hidden="true"></span>

## 项目要求

| 工具 | 已确认的要求 |
| --- | --- |
| C++ 编译器 | 支持 C++20 以及所用的标准库功能，包括 `std::format`。 |
| CMake | 3.28 或更高版本。 |
| Git | 用于克隆项目，以及通过 FetchContent 下载 SFML。 |
| Ninja | 如果采用本指南命令中的生成器，则需要安装。 |
| 网络连接 | 首次配置会下载依赖项。 |

`.vscode` 中的环境配置使用 Windows、MinGW GCC、Ninja 和 GDB。以下命令来自 `CMakeLists.txt` 和该配置，并不代表经过认证的构建兼容性矩阵。

<span id="obtener-el-código" aria-hidden="true"></span>

## 获取代码

在工具已加入 `PATH` 的终端中执行：

```sh
git clone https://github.com/Arukado01/AwesomeEngine.git
cd AwesomeEngine
```

要查看与本文档完全一致的代码，可以在新克隆的副本中切换到已审查的修订：

```sh
git checkout f0e88edffae35efb3cc208e8eea651d1b559cbaa
```

最后一条命令会将工作副本切换到特定提交。如果准备开发改动，请在开始前创建自己的分支。文档中的源码链接也指向该修订，方便与后续更新比较。

<span id="configurar-y-compilar" aria-hidden="true"></span>

## 配置与编译

```sh
cmake -S . -B Build -G Ninja -DCMAKE_BUILD_TYPE=Debug
cmake --build Build --parallel
```

CMake 将 `Engine/Source` 和 `Games/Source` 中的 `.cpp` 文件构建为名为 `AwesomeEngine` 的单一可执行文件。依赖项通过 `FetchContent` 获取：

- SFML 3.1.0。
- nlohmann/json 3.12.0。
- spdlog 1.16.0。
- TGUI 1.13.0。
- magic_enum 0.9.8。

如需独立的 Release 构建：

```sh
cmake -S . -B BuildRelease -G Ninja -DCMAKE_BUILD_TYPE=Release
cmake --build BuildRelease --parallel
```

项目也考虑了 MSVC 编译器选项，但上述步骤使用 Ninja 和当前环境中的编译器。不要在同一个构建目录中混用生成器或编译器。

<span id="ejecutar-en-windows" aria-hidden="true"></span>

## 在 Windows 上运行

让终端保持在**仓库根目录**，即 `Content` 所在的目录：

```powershell
.\Build\AwesomeEngine.exe
```

本文描述的修订将 **Tetris** 指定为初始场景。该修订没有注册可用的游戏选择器，初始场景在 `Engine.cpp` 中定义。

工作目录很重要。配置、着色器、字体及其他资源通过 `Content/Config.json` 等相对路径加载。从 `Build` 目录启动可能导致引擎找不到资源。

<span id="trabajo-con-vs-code" aria-hidden="true"></span>

## 使用 VS Code

仓库包含构建任务以及使用 GDB 的调试配置。可执行文件路径为 `Build/AwesomeEngine.exe`，工作目录保持为仓库根目录。

部分编辑器选项包含作者电脑上的绝对路径。请根据本机安装位置调整编译器和工具路径，不要将这些路径当成通用要求直接复制。

<span id="si-la-compilación-o-el-arranque-fallan" aria-hidden="true"></span>

## 编译或启动失败时

请参阅[故障排查](/zh/docs/problemas/)，其中分别说明工具、依赖下载、资源和代码已知限制方面的问题。本指南不提供安装程序或跨平台二进制文件。

<span id="fuentes" aria-hidden="true"></span>

## 源码参考

- [CMakeLists.txt](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/CMakeLists.txt)。
- [构建任务](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/.vscode/tasks.json)。
- [调试与工作目录](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/.vscode/launch.json)。
