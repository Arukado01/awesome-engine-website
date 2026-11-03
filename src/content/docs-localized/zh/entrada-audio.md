---
title: 输入、音频与界面
description: 了解动作绑定、手柄、全局快捷键、音频播放和 TGUI 控件。
order: 8
category: 系统
---

<span id="una-acción-varias-entradas" aria-hidden="true"></span>

## 一个动作，多种输入

InputManager 使用整数动作标识符和存储绑定的 `unordered_multimap`。一个动作可以关联多个输入。只要其中一个绑定处于按下状态，`Pressed(action)` 就返回真。

参考修订中的绑定类型如下：

```cpp
struct Keyboard {
  sf::Keyboard::Scan key;
};
struct Mouse {
  sf::Mouse::Button button;
};
struct Gamepad {
  GamepadButton button;
  int id = 0;
};
struct Axis {
  sf::Joystick::Axis axis;
  float threshold = 0.5f;
  int id = 0;
};

using Binding = std::variant<Keyboard, Mouse, Gamepad, Axis>;
```

这些类型属于 `Input` 命名空间。查询返回的是当前状态，不会自动检测刚刚按下的瞬间。需要处理离散事件时，场景还可以使用 `OnEvent`。

轴值除以 100 进行归一化，然后与配置的正阈值或负阈值比较。Engine 在切换场景时清除绑定，因此各游戏必须在开始时重新设置自己的绑定。

<span id="mandos-y-cursor" aria-hidden="true"></span>

## 手柄与光标

代码中包含 Xbox 和 PlayStation 的逻辑按钮表。识别到 Microsoft 厂商标识时选择 Xbox 表，其他情况使用 PlayStation 表。这种启发式判断不能保证所有手柄具有相同映射。

Xbox 表中没有为 L2/R2 扳机分配按钮；在该按钮映射中，它们被标为不可用。轴是独立的绑定类型。

CursorManager 可以通过摇杆移动光标，并遵循 `joystickDeadzone`。它也能将鼠标位置转换为视图坐标。GuiManager 将逻辑 South 按钮转换成控件的点击事件。

<span id="atajos-globales" aria-hidden="true"></span>

## 全局快捷键

| 输入 | 操作 |
| --- | --- |
| F12 | 保存 PNG 截图。 |
| R | 重启活动场景。 |
| Escape / 手柄 Start | 切换暂停覆盖层。 |
| M / 手柄 Select | 请求 `Menu`；本文所述修订没有注册该场景。 |

快捷键由 `EngineVisitor` 处理。失去焦点会暂停场景。重新获得焦点后，只有覆盖层不再打开时才会恢复。

<span id="audio-de-la-revisión-de-referencia" aria-hidden="true"></span>

## 参考修订中的音频

AudioManager 管理全局音量和 Music/Effect 声道音量。ResourceManager 提供共享缓冲区和音乐；每个场景管理自己的音源。

```cpp
void AudioManager::SetGlobalVolume(float volume) {
  sf::Listener::setGlobalVolume(volume);
}
```

<span id="trabajo-local-en-desarrollo" aria-hidden="true"></span>

<span id="grupos-de-audio" aria-hidden="true"></span>

### 音频分组

`AudioManager::CreateGroup` 创建 `AudioGroup`，组织场景的声音和音乐。分组只暂停和恢复之前正在播放的音源，并可停止或调整声道。Runner 和 Bounce 使用了它。

在场景中保留分组以维持其音源，例如：

```cpp
auto sound = audioGroup.AddSound(ctx.resources.AcquireSound("RunnerJump.wav"), 20.f);
if (sound) audioGroup.Play(*sound);
```

<span id="interfaz-tgui" aria-hidden="true"></span>

## TGUI 界面

GuiManager 将 TGUI 与 SFML 窗口连接，加载 `Content/Themes/Dark.txt`，应用 `Relidux.otf` 字体，启用 Tab 导航，并提供添加或移除控件的方法。

覆盖层通过 `magic_enum` 根据 `OverlaySelection` 创建按钮。选择结果只被消费一次，随后由 Engine 执行对应操作。GUI 在场景后处理完成后绘制。

<span id="fuentes" aria-hidden="true"></span>

## 源码参考

- [输入类型](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Include/utils/InputBindings.h)。
- [绑定查询](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/InputManager.cpp)。
- [手柄映射](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Utils/InputBindings.cpp)。
- [AudioManager](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/AudioManager.cpp)。
- [GuiManager](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/GuiManager.cpp)。

- [AudioGroup](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Include/Managers/AudioGroup.h).
