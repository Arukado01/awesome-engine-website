---
title: Installation and build
description: Set up CMake and a C++20 compiler, build the executable, and run it from the correct directory.
order: 2
category: Getting started
---

<span id="requisitos-del-proyecto" aria-hidden="true"></span>

## Project requirements

| Tool | Verified requirement |
| --- | --- |
| C++ compiler | Support for C++20 and the standard library features used, including `std::format`. |
| CMake | Version 3.28 or later. |
| Git | Required to clone the project and download SFML through FetchContent. |
| Ninja | Required if you choose the generator used in this guide's commands. |
| Internet connection | Initial configuration downloads dependencies. |

The environment configured in `.vscode` uses Windows, MinGW GCC, Ninja, and GDB. The following commands are derived from `CMakeLists.txt` and that configuration; they do not represent a certified build matrix.

<span id="obtener-el-código" aria-hidden="true"></span>

## Get the code

In a terminal with the tools available in `PATH`:

```sh
git clone https://github.com/Arukado01/AwesomeEngine.git
cd AwesomeEngine
```

To inspect exactly the code described in this documentation, you can select the audited revision in a fresh clone:

```sh
git checkout 5a6dfacd86414c4cdfaa7157b533330f173a3126
```

This last command leaves the clone at a specific commit. If you intend to develop changes, create your own branch before working. The documentation also links every source to that revision so you can compare it with future updates.

<span id="configurar-y-compilar" aria-hidden="true"></span>

## Configure and build

```sh
cmake -S . -B Build -G Ninja -DCMAKE_BUILD_TYPE=Debug
cmake --build Build --parallel
```

CMake collects the `.cpp` files from `Engine/Source` and `Games/Source` into a single executable named `AwesomeEngine`. Dependencies are fetched through `FetchContent`:

- SFML 3.1.0.
- nlohmann/json 3.12.0.
- spdlog 1.16.0.
- TGUI 1.13.0.
- magic_enum 0.9.8.

For a separate Release build:

```sh
cmake -S . -B BuildRelease -G Ninja -DCMAKE_BUILD_TYPE=Release
cmake --build BuildRelease --parallel
```

The project also includes MSVC compiler options, but the steps above use Ninja and the compiler available in your environment. Do not mix generators or compilers in the same build directory.

<span id="ejecutar-en-windows" aria-hidden="true"></span>

## Run on Windows

Keep the terminal at the **repository root**, next to `Content`:

```powershell
.\Build\AwesomeEngine.exe
```

The documented revision requests **Tetris** as its initial scene. No working game selector is registered in this revision: the initial scene is set in `Engine.cpp`.

The working directory matters. Configuration, shaders, the font, and other resources are loaded through relative paths such as `Content/Config.json`. Running from `Build` may prevent the engine from finding them.

<span id="trabajo-con-vs-code" aria-hidden="true"></span>

## Work with VS Code

The repository contains build tasks and a GDB debugging configuration. The executable path is `Build/AwesomeEngine.exe`, and the working directory remains at the root.

Some editor settings contain absolute paths from the author's computer. Adjust compiler and tool paths to your installation; do not copy them as universal requirements.

<span id="si-la-compilación-o-el-arranque-fallan" aria-hidden="true"></span>

## If building or startup fails

See [Troubleshooting](/en/docs/problemas/), which separates tool, dependency download, resource, and known code limitations. No installer or cross-platform binary is published as part of this guide.

<span id="fuentes" aria-hidden="true"></span>

## Sources

- [CMakeLists.txt](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/CMakeLists.txt).
- [Build tasks](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/.vscode/tasks.json).
- [Debugging and working directory](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/.vscode/launch.json).
