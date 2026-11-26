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
ctest --test-dir Build -R '^core[.]collision([.]|$)' --output-on-failure --no-tests=error
```

`core.collision` verifica os seis casos sem abrir uma janela. `core.collision.detects_failure` força uma falha com `AE_TEST_FORCE_FAIL` e verifica se o executável retorna um código diferente de zero.

[Código dos testes](https://github.com/Arukado01/AwesomeEngine/blob/61a3244690f7763d41a8f0ba6f0f2ac3deb53ee2/Tests/Core/CollisionTests.cpp) · [Registro no CTest](https://github.com/Arukado01/AwesomeEngine/blob/61a3244690f7763d41a8f0ba6f0f2ac3deb53ee2/Tests/CMakeLists.txt)
