---
title: 场景与生命周期
description: 了解 Scene 接口约定、游戏注册、延迟切换和状态清理。
order: 7
category: 引擎核心
---

<span id="el-contrato-de-una-escena" aria-hidden="true"></span>

## 场景的接口约定

场景通过引用接收 `EngineContext`，并定义如何启动、更新和绘制。参考修订中的接口约定如下：

```cpp
class Scene {
protected:
  EngineContext &ctx;

public:
  Scene(EngineContext &context) : ctx(context) {}
  virtual ~Scene() = default;

  virtual void Start() = 0;
  virtual void Update() = 0;
  virtual void Render() const = 0;

  virtual void OnEvent(const sf::Event &) {};
  virtual void OnPause(bool /* pausa */) {};
  virtual void OnCleanup() {};
};
```

`Start`、`Update` 和 `Render` 必须实现。其余回调默认具有空实现，游戏需要时才对其进行定制。

<span id="responsabilidades-por-etapa" aria-hidden="true"></span>

## 各阶段的职责

| 阶段 | 发生时间 | 在游戏中的用途 |
| --- | --- | --- |
| 构造函数 | 创建初始场景注册表时。 | 准备实例的对象和资源。 |
| `Start` | 激活或重启场景时。 | 重置游戏并注册操作控制。 |
| `OnEvent` | 覆盖层隐藏时收到事件。 | 处理游戏中的离散事件。 |
| `Update` | 有焦点且覆盖层不可见时的每一帧。 | 推进逻辑、运动和状态。 |
| `Render` | 绘制活动场景的一帧时。 | 将对象提交给 `ctx.renderer`。 |
| `OnPause` | 暂停状态改变时。 | 暂停或恢复场景控制的元素。 |
| `OnCleanup` | 离开或重启场景之前。 | 停止音频并清理不应继续保留的状态。 |

构造函数与 `Start` 并不等价。实例会留在注册表中，并且可能多次接收 `Start`。

<span id="registro-de-juegos" aria-hidden="true"></span>

## 游戏注册

`SceneFactory::Scenes` 是将名称与 `unique_ptr<Scene>` 关联的 `unordered_map`。工厂注册了七个实例：

```cpp
scenes.emplace("Bounce", std::make_unique<Bounce::Game>(context));
scenes.emplace("Clicker", std::make_unique<Clicker::Game>(context));
scenes.emplace("MemoryCard", std::make_unique<MemoryCard::Game>(context));
scenes.emplace("TicTacToe", std::make_unique<TicTacToe::Game>(context));
scenes.emplace("MineSweeper", std::make_unique<MineSweeper::Game>(context));
scenes.emplace("Runner", std::make_unique<Runner::Game>(context));
scenes.emplace("Tetris", std::make_unique<Tetris::Game>(context));
```

本文描述的修订在 Engine 构造函数中请求 Tetris。名称必须与注册表的键完全一致；未知场景没有已实现的恢复路径。

<span id="transición-diferida" aria-hidden="true"></span>

## 延迟切换

如果当前没有其他待处理的切换，`SceneManager::ChangeScene` 会保存请求的场景名称。Engine 在下一次事件处理开始时消费该请求。

```text
ChangeScene(名称)
     ↓
待处理请求
     ↓
下一次 ProcessEvent
     ↓
上一场景的 OnCleanup
     ↓
清理粒子与输入绑定
     ↓
切换活动指针
     ↓
请求场景的 Start
     ↓
同步暂停状态
```

`RestartCurrentScene` 用当前名称调用同一机制，不会销毁并重新构造对象。因此，重复调用 `Start` 时，它必须将游戏恢复到有效状态。

<span id="explorar-una-implementación-real" aria-hidden="true"></span>

## 探索真实实现

[Bounce](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Games/Source/Bounce.cpp) 展示了游戏类如何接收上下文、准备挡板和统计信息、请求音效与音乐，以及使用场景回调。

要在自己的副本中添加场景，请遵循现有分工：在 `Games/Include` 中声明，在 `Games/Source` 中实现，并在 `SceneFactory.cpp` 中显式注册。CMake 使用 `GLOB_RECURSE CONFIGURE_DEPENDS` 发现这些目录中的 `.cpp` 文件。系统不存在运行时加载的场景插件。

<span id="limitación-del-acceso-al-menú" aria-hidden="true"></span>

## 菜单访问的限制

覆盖层包含 **Menu** 按钮，快捷键 **M** 也调用相同流程。Engine 会请求名为 `Menu` 的场景，但此修订的工厂没有注册它。探索该版本时请避免此操作，否则可能因键不存在而触发断言或异常。

本文档明确保留了这一限制，不将该菜单描述为可用的游戏选择器。

<span id="fuentes" aria-hidden="true"></span>

## 源码参考

- [Scene 接口约定](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Include/Scene/Scene.h)。
- [SceneFactory 注册](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Scene/SceneFactory.cpp)。
- [SceneManager 请求](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/SceneManager.cpp)。
- [Engine 中的切换](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Core/Engine.cpp)。
