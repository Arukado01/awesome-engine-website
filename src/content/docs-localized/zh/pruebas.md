---
title: 引擎测试
description: 了解如何使用 CMake 和 CTest 运行测试，以及各测试套件的覆盖范围。
order: 10
category: 测试
---

<span id="compilar-y-ejecutar-las-pruebas" aria-hidden="true"></span>

## 编译并运行测试

在仓库根目录使用 CMake 启用测试，编译后运行 CTest。

```sh
cmake -S . -B Build -G Ninja -DCMAKE_BUILD_TYPE=Debug -DBUILD_TESTING=ON
cmake --build Build --parallel
ctest --test-dir Build --output-on-failure --no-tests=error
```

<span id="suites-disponibles" aria-hidden="true"></span>

## 可用测试套件

<span id="colisiones-2d" aria-hidden="true"></span>

### 2D 碰撞

六个用例覆盖边界框相交与分离、初始重叠、运动中发生碰撞、扫掠时无碰撞和角点接触。

若只编译并运行此套件，请使用 `ae_collision_tests` 目标并按名称筛选。

```sh
cmake --build Build --target ae_collision_tests --parallel
ctest --test-dir Build -R '^core[.]collision(\.|$)' --output-on-failure --no-tests=error
```

如需只运行主测试（不含负面测试），请使用 `-R '^core[.]collision$'`。

`core.collision` 无需打开窗口即可检查六个用例。`core.collision.detects_failure` 通过 `AE_TEST_FORCE_FAIL` 触发失败，并验证可执行文件返回非零退出码。

[测试源码](https://github.com/Arukado01/AwesomeEngine/blob/61a3244690f7763d41a8f0ba6f0f2ac3deb53ee2/Tests/Core/CollisionTests.cpp) · [CTest 注册配置](https://github.com/Arukado01/AwesomeEngine/blob/61a3244690f7763d41a8f0ba6f0f2ac3deb53ee2/Tests/CMakeLists.txt)
