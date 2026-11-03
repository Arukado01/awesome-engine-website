---
title: Instalación y compilación
description: Prepara CMake y un compilador C++20, construye el ejecutable y ejecútalo desde el directorio correcto.
order: 2
category: Primeros pasos
---

## Requisitos del proyecto

| Herramienta | Requisito comprobado |
| --- | --- |
| Compilador C++ | Compatibilidad con C++20 y la biblioteca estándar utilizada, incluido `std::format`. |
| CMake | Versión 3.28 o posterior. |
| Git | Necesario para clonar el proyecto y descargar SFML mediante FetchContent. |
| Ninja | Necesario si eliges el generador de los comandos de esta guía. |
| Conexión a Internet | La configuración inicial descarga las dependencias. |

El entorno configurado en `.vscode` utiliza Windows, MinGW GCC, Ninja y GDB. Los comandos siguientes se derivan del `CMakeLists.txt` y de esa configuración; no representan una matriz de compilaciones certificada.

## Obtener el código

En una terminal con las herramientas disponibles en `PATH`:

```sh
git clone https://github.com/Arukado01/AwesomeEngine.git
cd AwesomeEngine
```

Para consultar exactamente el código descrito en esta documentación, puedes seleccionar la revisión auditada en una copia nueva:

```sh
git checkout f0e88edffae35efb3cc208e8eea651d1b559cbaa
```

Este último comando deja la copia en un commit concreto. Si vas a desarrollar cambios, crea tu propia rama antes de trabajar. La documentación también enlaza cada fuente con esa revisión para que puedas comparar con futuras actualizaciones.

## Configurar y compilar

```sh
cmake -S . -B Build -G Ninja -DCMAKE_BUILD_TYPE=Debug
cmake --build Build --parallel
```

CMake reúne los archivos `.cpp` de `Engine/Source` y `Games/Source` en un único ejecutable llamado `AwesomeEngine`. Las dependencias se obtienen mediante `FetchContent`:

- SFML 3.1.0.
- nlohmann/json 3.12.0.
- spdlog 1.16.0.
- TGUI 1.13.0.
- magic_enum 0.9.8.

Para una compilación Release independiente:

```sh
cmake -S . -B BuildRelease -G Ninja -DCMAKE_BUILD_TYPE=Release
cmake --build BuildRelease --parallel
```

El proyecto también contempla opciones del compilador MSVC, pero los pasos anteriores usan Ninja y el compilador disponible en tu entorno. No mezcles generadores ni compiladores dentro del mismo directorio de compilación.

## Ejecutar en Windows

Mantén la terminal en la **raíz del repositorio**, junto a `Content`:

```powershell
.\Build\AwesomeEngine.exe
```

La revisión documentada solicita **Tetris** como escena inicial. No existe un selector de juegos operativo registrado en esta revisión: el cambio de escena inicial está definido en `Engine.cpp`.

El directorio de trabajo importa. La configuración, los shaders, la fuente y los demás recursos se cargan mediante rutas relativas como `Content/Config.json`. Ejecutar desde `Build` puede impedir que el motor los encuentre.

## Trabajo con VS Code

El repositorio contiene tareas de construcción y una configuración de depuración con GDB. La ruta del ejecutable es `Build/AwesomeEngine.exe`, y el directorio de trabajo se mantiene en la raíz.

Algunas opciones del editor contienen rutas absolutas del equipo del autor. Adapta las rutas de compilador y herramientas a tu instalación; no las copies como requisitos universales.

## Si la compilación o el arranque fallan

Revisa [Solución de problemas](/docs/problemas/): ahí se separan problemas de herramientas, descarga de dependencias, recursos y limitaciones conocidas del código. No se publica un instalador ni un binario multiplataforma como parte de esta guía.

## Fuentes

- [CMakeLists.txt](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/CMakeLists.txt).
- [Tareas de construcción](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/.vscode/tasks.json).
- [Depuración y directorio de trabajo](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/.vscode/launch.json).