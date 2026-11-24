---
title: 配置
description: 了解窗口、时间、音频和光标的配置项，以及当前 JSON 配置的限制。
order: 3
category: 入门
---

<span id="el-archivo-de-configuración" aria-hidden="true"></span>

## 配置文件

引擎在启动时读取 `Content/Config.json`。示例仅展示一条 `games` 记录。

```json
{
  "windowTitle": "Awesome Engine",
  "windowSize": [800, 800],
  "frameRateLimit": 120,
  "disableSfmlLogs": true,
  "maximumDeltaTime": 0.03,
  "globalVolume": 100,
  "backgroundColor": [100, 100, 100],
  "cursorSize": 21,
  "cursorSpeed": 800,
  "joystickDeadzone": 0.1,
  "games": [
    {
      "name": "Clicker",
      "title": "Clicker",
      "controls": "Hit: Left Click / South"
    }
  ]
}
```

<span id="qué-controla-cada-valor" aria-hidden="true"></span>

## 每个配置值控制什么

| 键 | 作用 |
| --- | --- |
| `windowTitle` | SFML 窗口标题。 |
| `windowSize` | 窗口模式下的初始尺寸，也是游戏区域的逻辑尺寸。 |
| `frameRateLimit` | 向窗口请求的帧率上限；缺少该键时默认为 120。 |
| `disableSfmlLogs` | 为 `true` 时屏蔽 SFML 的错误输出流。 |
| `maximumDeltaTime` | TimeManager 每帧提供的最大模拟时间增量，单位为秒。 |
| `globalVolume` | 应用于 SFML 监听器的全局音量。 |
| `backgroundColor` | RenderManager 使用的背景 RGB 颜色。 |
| `cursorSize` | 使用 `Icon.png` 的光标最长边的像素尺寸，默认值为 24。 |
| `cursorSpeed` | 通过手柄移动光标时的速度。 |
| `joystickDeadzone` | 移动光标时，用于忽略摇杆微小偏移的阈值。 |

120 帧的上限是配置值，**不是性能测量结果**。它也不表示模拟使用固定时间步长：每帧的时间会变化，并由 `maximumDeltaTime` 限制。

<span id="cambiar-la-configuración" aria-hidden="true"></span>

## 修改配置

关闭应用后编辑 JSON，然后从仓库根目录重新启动。配置只在启动时读取，没有自动重新加载文件的功能，也没有写入这些值的设置面板。

请保留示例中的键名和数据类型。解析器没有实现验证模式，也没有为所有字段提供备用值。文件缺失、JSON 无效或必填键错误都可能导致启动失败。

`windowSize` 设置游戏使用的设计尺寸。窗口尺寸变化时，引擎会按实际尺寸调整渲染，并保留设计坐标和比例。

<span id="configuración-de-cada-juego" aria-hidden="true"></span>

## 各个游戏的配置

`games` 决定菜单中显示的游戏及其顺序。`name` 必须与 `SceneFactory` 的注册键一致，`title` 是显示名称，`controls` 是操作说明。请至少保留一项，修改后重启引擎。

游戏规则位于 `Games/Include/Config`，修改后需要重新编译。`Engine` 启动 `Menu` 场景。

<span id="preferencias-del-sitio-y-del-motor" aria-hidden="true"></span>

## 网站与引擎的偏好设置

本站的浅色、深色或跟随系统选项只影响网页界面。引擎通过 `Content/Themes/Dark.txt` 配置 TGUI。本文档不假定网页上的主题选择器也存在于可执行程序中。

<span id="fuentes" aria-hidden="true"></span>

## 源码参考

- [Config.json 原始值](https://github.com/Arukado01/AwesomeEngine/blob/60ce8139fbd36713821bf85debd96bf0bd1c8bb3/Content/Config.json)。
- [EngineConfig 读取逻辑](https://github.com/Arukado01/AwesomeEngine/blob/60ce8139fbd36713821bf85debd96bf0bd1c8bb3/Engine/Source/Core/EngineConfig.cpp)。
- [时间增量计算](https://github.com/Arukado01/AwesomeEngine/blob/60ce8139fbd36713821bf85debd96bf0bd1c8bb3/Engine/Source/Managers/TimeManager.cpp)。
