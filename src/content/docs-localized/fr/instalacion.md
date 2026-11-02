---
title: Installation et compilation
description: Préparez CMake et un compilateur C++20, construisez l’exécutable et lancez-le depuis le bon répertoire.
order: 2
category: Premiers pas
---

<span id="requisitos-del-proyecto" aria-hidden="true"></span>

## Prérequis du projet

| Outil | Prérequis vérifié |
| --- | --- |
| Compilateur C++ | Prise en charge de C++20 et de la bibliothèque standard utilisée, notamment `std::format`. |
| CMake | Version 3.28 ou ultérieure. |
| Git | Nécessaire pour cloner le projet et télécharger SFML avec FetchContent. |
| Ninja | Nécessaire si vous choisissez le générateur des commandes de ce guide. |
| Connexion Internet | La configuration initiale télécharge les dépendances. |

L’environnement défini dans `.vscode` utilise Windows, MinGW GCC, Ninja et GDB. Les commandes suivantes sont tirées de `CMakeLists.txt` et de cette configuration ; elles ne constituent pas une matrice de compilations certifiées.

<span id="obtener-el-código" aria-hidden="true"></span>

## Récupérer le code

Dans un terminal où les outils sont disponibles dans `PATH` :

```sh
git clone https://github.com/Arukado01/AwesomeEngine.git
cd AwesomeEngine
```

Pour consulter exactement le code décrit ici, vous pouvez sélectionner la révision auditée dans une nouvelle copie :

```sh
git checkout 5a6dfacd86414c4cdfaa7157b533330f173a3126
```

Cette dernière commande place la copie sur un commit précis. Si vous souhaitez développer des changements, créez votre propre branche avant de travailler. Chaque source de la documentation pointe aussi vers cette révision afin de permettre des comparaisons avec les mises à jour futures.

<span id="configurar-y-compilar" aria-hidden="true"></span>

## Configurer et compiler

```sh
cmake -S . -B Build -G Ninja -DCMAKE_BUILD_TYPE=Debug
cmake --build Build --parallel
```

CMake rassemble les fichiers `.cpp` d’`Engine/Source` et de `Games/Source` dans un seul exécutable nommé `AwesomeEngine`. Les dépendances sont obtenues avec `FetchContent` :

- SFML 3.1.0.
- nlohmann/json 3.12.0.
- spdlog 1.16.0.
- TGUI 1.13.0.
- magic_enum 0.9.8.

Pour une compilation Release séparée :

```sh
cmake -S . -B BuildRelease -G Ninja -DCMAKE_BUILD_TYPE=Release
cmake --build BuildRelease --parallel
```

Le projet prévoit également des options du compilateur MSVC, mais les étapes ci-dessus utilisent Ninja et le compilateur disponible dans votre environnement. Ne mélangez pas générateurs et compilateurs dans le même répertoire de compilation.

<span id="ejecutar-en-windows" aria-hidden="true"></span>

## Exécuter sous Windows

Gardez le terminal à la **racine du dépôt**, à côté de `Content` :

```powershell
.\Build\AwesomeEngine.exe
```

La révision documentée demande **Tetris** comme scène initiale. Aucun sélecteur de jeux fonctionnel n’y est enregistré : la scène de départ est définie dans `Engine.cpp`.

Le répertoire de travail est important. La configuration, les shaders, la police et les autres ressources sont chargés avec des chemins relatifs tels que `Content/Config.json`. Un lancement depuis `Build` peut empêcher le moteur de les trouver.

<span id="trabajo-con-vs-code" aria-hidden="true"></span>

## Travailler avec VS Code

Le dépôt contient des tâches de compilation et une configuration de débogage avec GDB. L’exécutable se trouve dans `Build/AwesomeEngine.exe` et le répertoire de travail reste la racine.

Certaines options de l’éditeur contiennent des chemins absolus propres à l’ordinateur de l’auteur. Adaptez les chemins du compilateur et des outils à votre installation ; ne les traitez pas comme des exigences universelles.

<span id="si-la-compilación-o-el-arranque-fallan" aria-hidden="true"></span>

## En cas d’échec de la compilation ou du lancement

Consultez le [Dépannage](/fr/docs/problemas/) : les problèmes d’outils, de téléchargement des dépendances, de ressources et les limites connues du code y sont distingués. Aucun installateur ni binaire multiplateforme n’est publié dans le cadre de ce guide.

<span id="fuentes" aria-hidden="true"></span>

## Sources

- [CMakeLists.txt](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/CMakeLists.txt).
- [Tâches de compilation](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/.vscode/tasks.json).
- [Débogage et répertoire de travail](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/.vscode/launch.json).
