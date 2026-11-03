---
title: 引擎架构
description: 了解主循环、EngineContext、对象所有权以及各个系统之间的关系。
order: 4
category: 引擎核心
---

<span id="de-la-entrada-al-frame" aria-hidden="true"></span>

## 从输入到一帧画面

`main()` 构造一个 `Engine`，并在窗口保持打开时重复执行三个操作。以下片段来自参考代码：

```cpp
while (engine.IsRunning()) {
  engine.ProcessEvent();
  engine.Update();

  if (!engine.HasFocus()) {
    sf::sleep(sf::milliseconds(10));
    continue;
  }

  engine.Render();
}
```

失去焦点时，循环仍然处理事件并更新时钟，但跳过渲染并休眠 10 ms。`Engine::Update` 在推进场景之前也会检查焦点。

<span id="responsabilidades-de-engine" aria-hidden="true"></span>

## Engine 的职责

`Engine` 拥有窗口、`EngineContext`、场景注册表、活动场景引用以及暂停覆盖层，负责协调这些元素。

```text
Engine
├── sf::RenderWindow
├── EngineContext
│   ├── renderer · resources · particles
│   ├── animations · collisions
│   ├── input · cursor · gui
│   ├── audio · time · random
│   └── scenes · save · screenshot · clipboard
├── SceneFactory::Scenes
│   └── 名称 → unique_ptr<Scene>
├── currentScene → 活动 Scene
└── Overlay → TGUI 控件
```

上下文通过引用传给每个场景。游戏因此可以访问 `ctx.renderer`、`ctx.input` 或 `ctx.resources`，而不必重复构造服务。

<span id="procesamiento-de-eventos" aria-hidden="true"></span>

## 事件处理

在 `ProcessEvent` 开始时，引擎先处理待执行的场景切换，然后从 `sf::RenderWindow` 取出事件并分发：

1. `EngineVisitor` 处理关闭、焦点、尺寸、手柄和全局快捷键。
2. `GuiManager` 将事件发送给 TGUI。
3. 覆盖层隐藏时，场景接收 `OnEvent`。
4. 引擎处理覆盖层中的选择，并同步暂停状态。

GUI 与场景参与同一个处理流程；本文描述的代码没有独立的事件总线。

<span id="actualización-y-tiempo" aria-hidden="true"></span>

## 更新与时间

`TimeManager` 计算上一帧至今的经过时间，并用 `gConfig.maximumDeltaTime` 限制它。之后更新光标；若覆盖层隐藏，则调用 `Scene::Update`。

系统没有实现固定步长累加器。每个游戏自行决定如何使用时间增量和自己的计时器。

`TimeManager` 区分真实时间与游戏时间。Engine 随场景暂停游戏时钟；关联的 `Cooldown` 默认使用该时钟。独立的冷却计时器使用真实时钟。

关联的冷却计时器默认使用游戏时间：

```cpp
auto cooldown = ctx.time.CreateCooldown(1.f, TimeDomain::Game);
```

<span id="renderizado-y-capas" aria-hidden="true"></span>

## 渲染与图层

场景绘制到 `sf::RenderTexture`。RenderManager 应用效果链并返回最终纹理。Engine 将它显示到窗口，再在其上绘制 GUI 和光标。

```text
Scene::Render
     ↓
RenderManager / RenderTexture
     ↓
Bloom → Monitor
     ↓
窗口 → GUI → Cursor → display
```

只有 `sf::Shader::isAvailable()` 返回真时才会加入效果。GUI 和光标在后处理完成后绘制。有关 Bloom 的各个渲染阶段，请参阅[渲染](/zh/docs/renderizado/)。

<span id="propiedad-y-memoria" aria-hidden="true"></span>

## 所有权与内存

- 场景存储在值为 `unique_ptr<Scene>` 的 `unordered_map` 中。
- 效果存储在 `unique_ptr<Effect>` 的向量中。
- 活动场景使用不拥有对象的指针；对象仍归注册表所有。
- 各管理器作为值成员属于 `EngineContext`。
- ResourceManager 按值保存纹理和字体，并使用 `shared_ptr` 共享声音缓冲区。

项目使用 RAII 和标准容器，没有自定义内存管理器或通用 ECS。所有注册场景都在 `CreateScenes` 中构造，切换场景不会在每次过渡时创建新实例。

<span id="organización-del-código" aria-hidden="true"></span>

## 代码组织

| 目录 | 内容 |
| --- | --- |
| `Engine/Include` | 核心、管理器、场景、效果和工具的接口约定与类型。 |
| `Engine/Source` | 实现及程序入口。 |
| `Games/Include` | 游戏类、类型及配置常量。 |
| `Games/Source` | 游戏逻辑与渲染。 |
| `Content` | 图形和音频资源、字体、着色器、主题及 JSON。 |

<span id="fuentes" aria-hidden="true"></span>

## 源码参考

- [主循环](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Main.cpp)。
- [Engine 协调逻辑](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Core/Engine.cpp)。
- [EngineContext 定义](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Include/Core/EngineContext.h)。
- [场景所有权](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Include/Scene/SceneFactory.h)。
