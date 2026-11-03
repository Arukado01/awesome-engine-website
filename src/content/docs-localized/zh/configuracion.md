---
title: 配置
description: 了解窗口、时间、音频和光标的配置项，以及当前 JSON 配置的限制。
order: 3
category: 入门
---

<span id="el-archivo-de-configuración" aria-hidden="true"></span>

## 配置文件

引擎在构造全局对象 `gConfig` 时读取 `Content/Config.json`。参考修订中的内容如下：

```json
{
  "windowTitle": "Awesome Engine",
  "windowSize": [800, 800],
  "frameRateLimit": 120,
  "disableSfmlLogs": true,
  "maximumDeltaTime": 0.03,
  "globalVolume": 100,
  "backgroundColor": [100, 100, 100],
  "cursorRadius": 5,
  "cursorSpeed": 800,
  "cursorColor": [255, 100, 0],
  "joystickDeadzone": 0.1
}
```

<span id="qué-controla-cada-valor" aria-hidden="true"></span>

## 每个配置值控制什么

| 键 | 作用 |
| --- | --- |
| `windowTitle` | SFML 窗口标题。 |
| `windowSize` | 初始窗口尺寸，也是渲染目标和多种游戏计算的参考尺寸。 |
| `frameRateLimit` | 向窗口请求的帧率上限；缺少该键时默认为 120。 |
| `disableSfmlLogs` | 为 `true` 时屏蔽 SFML 的错误输出流。 |
| `maximumDeltaTime` | TimeManager 每帧提供的最大模拟时间增量，单位为秒。 |
| `globalVolume` | 应用于 SFML 监听器的全局音量。 |
| `backgroundColor` | RenderManager 使用的背景 RGB 颜色。 |
| `cursorRadius` | 自定义圆形光标的半径。 |
| `cursorSpeed` | 通过手柄移动光标时的速度。 |
| `cursorColor` | 光标的 RGB 颜色。 |
| `joystickDeadzone` | 移动光标时，用于忽略摇杆微小偏移的阈值。 |

120 帧的上限是配置值，**不是性能测量结果**。它也不表示模拟使用固定时间步长：每帧的时间会变化，并由 `maximumDeltaTime` 限制。

<span id="cambiar-la-configuración" aria-hidden="true"></span>

## 修改配置

关闭应用后编辑 JSON，然后从仓库根目录重新启动。配置只在启动时读取，没有自动重新加载文件的功能，也没有写入这些值的设置面板。

请保留示例中的键名和数据类型。解析器没有实现验证模式，也没有为所有字段提供备用值。文件缺失、JSON 无效或必填键错误都可能导致启动失败。

修改 `windowSize` 还会影响使用 `gConfig.windowSize` 的游戏代码。这并不等同于拥有完整的动态分辨率系统。窗口调整大小事件不会自动重建后处理纹理。

<span id="configuración-de-cada-juego" aria-hidden="true"></span>

## 各个游戏的配置

游戏专用参数位于 `Games/Include/Config`：`BounceConfig.h`、`ClickerConfig.h`、`MemoryCardConfig.h`、`TicTacToeConfig.h`、`MineSweeperConfig.h`、`RunnerConfig.h` 和 `TetrisConfig.h`。

它们是 C++ 常量，修改后需要重新编译。启动场景也不是从 `Config.json` 中选择，而是在 `Engine` 构造函数中通过 `ChangeScene("Tetris")` 固定指定。

<span id="preferencias-del-sitio-y-del-motor" aria-hidden="true"></span>

## 网站与引擎的偏好设置

本站的浅色、深色或跟随系统选项只影响网页界面。引擎通过 `Content/Themes/Dark.txt` 配置 TGUI。本文档不假定网页上的主题选择器也存在于可执行程序中。

<span id="fuentes" aria-hidden="true"></span>

## 源码参考

- [Config.json 原始值](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Content/Config.json)。
- [EngineConfig 读取逻辑](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Core/EngineConfig.cpp)。
- [时间增量计算](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/TimeManager.cpp)。
