---
title: Testes do motor
description: Como executar os testes com CMake e CTest e consultar o que cada suíte cobre.
order: 10
category: Testes
---

<span id="compilar-y-ejecutar-las-pruebas" aria-hidden="true"></span>

## Compilar e executar os testes

Na raiz do repositório, habilite os testes no CMake, compile e execute o CTest.

```sh
cmake -S . -B Build -G Ninja -DCMAKE_BUILD_TYPE=Debug -DBUILD_TESTING=ON
cmake --build Build --parallel
ctest --test-dir Build --output-on-failure --no-tests=error
```

<span id="suites-disponibles" aria-hidden="true"></span>

## Suítes disponíveis

<span id="colisiones-2d" aria-hidden="true"></span>

### Colisões 2D

Seis casos cobrem interseção, caixas separadas, sobreposição inicial, impacto em movimento, varredura sem impacto e contato em um canto.

Para compilar e executar apenas esta suíte, use o alvo `ae_collision_tests` e filtre pelo nome.

```sh
cmake --build Build --target ae_collision_tests --parallel
ctest --test-dir Build -R '^core[.]collision(\.|$)' --output-on-failure --no-tests=error
```

Para executar apenas o teste principal (sem o teste negativo), use `-R '^core[.]collision$'`.

`core.collision` verifica os seis casos sem abrir uma janela. `core.collision.detects_failure` força uma falha com `AE_TEST_FORCE_FAIL` e verifica se o executável retorna um código diferente de zero.

[Código dos testes](https://github.com/Arukado01/AwesomeEngine/blob/61a3244690f7763d41a8f0ba6f0f2ac3deb53ee2/Tests/Core/CollisionTests.cpp) · [Registro no CTest](https://github.com/Arukado01/AwesomeEngine/blob/61a3244690f7763d41a8f0ba6f0f2ac3deb53ee2/Tests/CMakeLists.txt)

<span id="animación-de-sprites" aria-hidden="true"></span>

### Animação de sprites

Dez casos cobrem o estado inicial, o avanço de quadros, o ciclo completo, o término do modo `Once`, a pausa e a retomada, o reinício, o cancelamento do avanço por um callback, o retângulo de cada quadro, os parâmetros inválidos e a mudança de modo.

Para compilar e executar apenas esta suíte, use o alvo `ae_sprite_animator_tests` e filtre pelo nome.

```sh
cmake --build Build --target ae_sprite_animator_tests --parallel
ctest --test-dir Build -R '^core[.]sprite_animator$' --output-on-failure --no-tests=error
```

`core.sprite_animator` verifica os dez casos sem abrir uma janela: reproduz nos modos `Loop` e `Once`, conserva a fração de quadro em pausa, ignora durações ou velocidades inválidas e calcula o retângulo do quadro ativo com `FrameRect`.

[Código dos testes](https://github.com/Arukado01/AwesomeEngine/blob/34702d1447e3252b156df7e71cda3030dd80cdf9/Tests/Core/SpriteAnimatorTests.cpp) · [Registro no CTest](https://github.com/Arukado01/AwesomeEngine/blob/34702d1447e3252b156df7e71cda3030dd80cdf9/Tests/CMakeLists.txt)

<span id="guardado-y-persistencia" aria-hidden="true"></span>

### Salvamento e persistência

Sete casos caracterizam o SaveManager em um diretório temporário: o objeto vazio sem arquivo, a criação de `Save.json` ao destruir depois de `Set`, chaves conservadas ao modificar, apagar uma chave entre várias, dois problemas conhecidos documentados (apagar a última chave e `Clear` não persistem) e um JSON corrompido que propaga a exceção de parse.

Para compilar e executar apenas esta suíte, use o alvo `ae_save_manager_tests` e filtre pelo nome.

```sh
cmake --build Build --target ae_save_manager_tests --parallel
ctest --test-dir Build -R '^core[.]save_manager$' --output-on-failure --no-tests=error
```

`core.save_manager` verifica os sete casos sem abrir uma janela. Cada caso trabalha em seu próprio diretório temporário, então nunca toca no seu `Content/Save.json` real.

[Código dos testes](https://github.com/Arukado01/AwesomeEngine/blob/c72ae6fef8a324b4cfd5e73e2e4928d2201a81b3/Tests/Core/SaveManagerTests.cpp) · [Registro no CTest](https://github.com/Arukado01/AwesomeEngine/blob/c72ae6fef8a324b4cfd5e73e2e4928d2201a81b3/Tests/CMakeLists.txt)

<span id="configuración-del-motor" aria-hidden="true"></span>

### Configuração do motor

Dois casos verificam o carregamento do `Config.json` por meio de fixtures escolhidos com a variável `AE_CONFIG_CASE`: o cenário `valid` cobre um arquivo completo com dois jogos e limite de 60 FPS; o cenário `minimal` confirma os valores padrão, incluindo 120 FPS e cursor de 24 px.

Para compilar e executar apenas esta suíte, use o alvo `ae_engine_config_tests` e filtre pelo nome.

```sh
cmake --build Build --target ae_engine_config_tests --parallel
ctest --test-dir Build -R '^core[.]engine_config[.]' --output-on-failure --no-tests=error
```

Os casos `core.engine_config.valid` e `core.engine_config.minimal` rodam sem abrir uma janela, cada um a partir de seu fixture em `Tests/Fixtures/Config`.

[Código dos testes](https://github.com/Arukado01/AwesomeEngine/blob/d20cf006b765bbc7c9f09c2726d99e5f34746610/Tests/Core/EngineConfigTests.cpp) · [Registro no CTest](https://github.com/Arukado01/AwesomeEngine/blob/d20cf006b765bbc7c9f09c2726d99e5f34746610/Tests/CMakeLists.txt)
