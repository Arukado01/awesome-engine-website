---
title: Instalação e compilação
description: Prepare o CMake e um compilador C++20, compile o executável e execute-o a partir do diretório correto.
order: 2
category: Primeiros passos
---

<span id="requisitos-del-proyecto" aria-hidden="true"></span>

## Requisitos do projeto

| Ferramenta | Requisito verificado |
| --- | --- |
| Compilador C++ | Compatibilidade com C++20 e com a biblioteca padrão utilizada, incluindo `std::format`. |
| CMake | Versão 3.28 ou posterior. |
| Git | Necessário para clonar o projeto e baixar o SFML por meio de FetchContent. |
| Ninja | Necessário se você escolher o gerador dos comandos deste guia. |
| Conexão com a Internet | A configuração inicial baixa as dependências. |

O ambiente configurado em `.vscode` usa Windows, MinGW GCC, Ninja e GDB. Os comandos abaixo derivam do `CMakeLists.txt` e dessa configuração; não representam uma matriz de compilações certificada.

<span id="obtener-el-código" aria-hidden="true"></span>

## Obter o código

Em um terminal com as ferramentas disponíveis no `PATH`:

```sh
git clone https://github.com/Arukado01/AwesomeEngine.git
cd AwesomeEngine
```

Para consultar exatamente o código descrito nesta documentação, você pode selecionar a revisão auditada em uma cópia nova:

```sh
git checkout f0e88edffae35efb3cc208e8eea651d1b559cbaa
```

Esse último comando deixa a cópia em um commit específico. Se você pretende desenvolver alterações, crie sua própria branch antes de trabalhar. A documentação também vincula cada fonte a essa revisão para permitir comparações com futuras atualizações.

<span id="configurar-y-compilar" aria-hidden="true"></span>

## Configurar e compilar

```sh
cmake -S . -B Build -G Ninja -DCMAKE_BUILD_TYPE=Debug
cmake --build Build --parallel
```

O CMake reúne os arquivos `.cpp` de `Engine/Source` e `Games/Source` em um único executável chamado `AwesomeEngine`. As dependências são obtidas por meio de `FetchContent`:

- SFML 3.1.0.
- nlohmann/json 3.12.0.
- spdlog 1.16.0.
- TGUI 1.13.0.
- magic_enum 0.9.8.

Para uma compilação Release separada:

```sh
cmake -S . -B BuildRelease -G Ninja -DCMAKE_BUILD_TYPE=Release
cmake --build BuildRelease --parallel
```

O projeto também inclui opções do compilador MSVC, mas os passos acima usam Ninja e o compilador disponível no seu ambiente. Não misture geradores nem compiladores no mesmo diretório de compilação.

<span id="ejecutar-en-windows" aria-hidden="true"></span>

## Executar no Windows

Mantenha o terminal na **raiz do repositório**, ao lado de `Content`:

```powershell
.\Build\AwesomeEngine.exe
```

A revisão documentada solicita **Tetris** como cena inicial. Não existe um seletor de jogos funcional registrado nessa revisão: a cena inicial é definida em `Engine.cpp`.

O diretório de trabalho importa. A configuração, os shaders, a fonte e os demais recursos são carregados por caminhos relativos, como `Content/Config.json`. Executar a partir de `Build` pode impedir que o motor os encontre.

<span id="trabajo-con-vs-code" aria-hidden="true"></span>

## Trabalhar com o VS Code

O repositório contém tarefas de compilação e uma configuração de depuração com GDB. O caminho do executável é `Build/AwesomeEngine.exe`, e o diretório de trabalho permanece na raiz.

Algumas opções do editor contêm caminhos absolutos do computador do autor. Adapte os caminhos do compilador e das ferramentas à sua instalação; não os copie como requisitos universais.

<span id="si-la-compilación-o-el-arranque-fallan" aria-hidden="true"></span>

## Se a compilação ou a inicialização falhar

Consulte [Solução de problemas](/pt/docs/problemas/): ela separa problemas de ferramentas, download de dependências, recursos e limitações conhecidas do código. Nenhum instalador ou binário multiplataforma é publicado como parte deste guia.

<span id="fuentes" aria-hidden="true"></span>

## Fontes

- [CMakeLists.txt](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/CMakeLists.txt).
- [Tarefas de compilação](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/.vscode/tasks.json).
- [Depuração e diretório de trabalho](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/.vscode/launch.json).
