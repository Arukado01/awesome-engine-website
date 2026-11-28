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

<span id="animación-de-sprites" aria-hidden="true"></span>

### 精灵动画

十个用例覆盖初始状态、帧推进、完整循环、`Once` 模式结束、暂停与恢复、重置、通过回调取消推进、每帧矩形、无效参数以及模式切换。

若只编译并运行此套件，请使用 `ae_sprite_animator_tests` 目标并按名称筛选。

```sh
cmake --build Build --target ae_sprite_animator_tests --parallel
ctest --test-dir Build -R '^core[.]sprite_animator$' --output-on-failure --no-tests=error
```

`core.sprite_animator` 无需打开窗口即可检查十个用例：以 `Loop` 和 `Once` 模式播放、暂停时保留帧进度、忽略无效的时长或速度，并通过 `FrameRect` 计算活动帧的矩形。

[测试源码](https://github.com/Arukado01/AwesomeEngine/blob/34702d1447e3252b156df7e71cda3030dd80cdf9/Tests/Core/SpriteAnimatorTests.cpp) · [CTest 注册配置](https://github.com/Arukado01/AwesomeEngine/blob/34702d1447e3252b156df7e71cda3030dd80cdf9/Tests/CMakeLists.txt)

<span id="guardado-y-persistencia" aria-hidden="true"></span>

### 保存与持久化

七个用例在临时目录中刻画 SaveManager：无文件时的空对象、`Set` 后析构时创建 `Save.json`、修改时保留其他键、在多个键中删除一个、两个已记录的已知问题（删除最后一个键和 `Clear` 不会持久化），以及损坏的 JSON 会传播解析异常。

若只编译并运行此套件，请使用 `ae_save_manager_tests` 目标并按名称筛选。

```sh
cmake --build Build --target ae_save_manager_tests --parallel
ctest --test-dir Build -R '^core[.]save_manager$' --output-on-failure --no-tests=error
```

`core.save_manager` 无需打开窗口即可检查七个用例。每个用例都在自己的临时目录中工作，不会触碰你真实的 `Content/Save.json`。

[测试源码](https://github.com/Arukado01/AwesomeEngine/blob/c72ae6fef8a324b4cfd5e73e2e4928d2201a81b3/Tests/Core/SaveManagerTests.cpp) · [CTest 注册配置](https://github.com/Arukado01/AwesomeEngine/blob/c72ae6fef8a324b4cfd5e73e2e4928d2201a81b3/Tests/CMakeLists.txt)

<span id="configuración-del-motor" aria-hidden="true"></span>

### 引擎配置

两个用例通过 `AE_CONFIG_CASE` 变量选择的夹具检查 `Config.json` 的加载：`valid` 场景覆盖包含两个游戏和 60 FPS 限制的完整文件；`minimal` 场景确认默认值，包括 120 FPS 和 24 px 光标。

若只编译并运行此套件，请使用 `ae_engine_config_tests` 目标并按名称筛选。

```sh
cmake --build Build --target ae_engine_config_tests --parallel
ctest --test-dir Build -R '^core[.]engine_config[.]' --output-on-failure --no-tests=error
```

`core.engine_config.valid` 和 `core.engine_config.minimal` 用例无需打开窗口，各自从 `Tests/Fixtures/Config` 中的夹具运行。

[测试源码](https://github.com/Arukado01/AwesomeEngine/blob/d20cf006b765bbc7c9f09c2726d99e5f34746610/Tests/Core/EngineConfigTests.cpp) · [CTest 注册配置](https://github.com/Arukado01/AwesomeEngine/blob/d20cf006b765bbc7c9f09c2726d99e5f34746610/Tests/CMakeLists.txt)
