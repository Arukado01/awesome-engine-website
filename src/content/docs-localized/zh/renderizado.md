---
title: 渲染与效果
description: 了解如何绘制 2D 场景、应用 Bloom 和 Monitor，以及控制视图和粒子。
order: 5
category: 系统
---

<span id="una-escena-una-textura-intermedia" aria-hidden="true"></span>

## 一个场景，一张中间纹理

RenderManager 提供 `Draw(const sf::Drawable&)` 来绘制场景中的 SFML 对象。它在内部将绘制操作发送至 `target_`，即按配置尺寸创建的 `sf::RenderTexture`。

每帧开始时，`BeginDrawing` 清空目标并绘制背景。`FinishDrawing` 完成纹理更新、应用效果，然后返回由 Engine 显示到窗口的纹理。场景不需要直接管理窗口。

<span id="cadena-de-posprocesado" aria-hidden="true"></span>

## 后处理链

参考代码选择了以下效果：

```cpp
// Post Process Effects
 effects_.emplace_back(std::make_unique<EffectBloom>());
 effects_.emplace_back(std::make_unique<EffectMonitor>());
 // effects_.emplace_back(std::make_unique<EffectGlitch>());
```

只有着色器可用时才会加入 Bloom 和 Monitor。为了应用多个效果，`FinishDrawing` 交替使用两个目标，将上一阶段的输出作为下一阶段的输入。

| 效果 | 状态 | 功能 |
| --- | --- | --- |
| Bloom | 已实现并启用 | 在一半分辨率下模糊图像，再将结果叠加到原图。 |
| Monitor | 已实现并启用 | 应用以分辨率和时间为参数的显示器着色器。 |
| Glitch | 实验性；已禁用 | 类和着色器存在，但加入管线的代码已注释。 |
| 颜色反转 | 实验性；未连接 | 类和着色器存在，但 RenderManager 没有将其加入效果链。 |

“实验性”描述的是当前集成状态，并不代表有预定的启用日期。

<span id="las-cuatro-etapas-de-bloom" aria-hidden="true"></span>

## Bloom 的四个阶段

```text
场景图像
       ↓
1. Downsample → 纹理 A，宽高各减半
       ↓
2. Blur（垂直） → 纹理 B
       ↓
3. Blur（水平） → 纹理 A
       ↓
4. 加法合成：原图 + 纹理 A
```

`EffectBloom` 从 `Content/Shaders` 加载 `Default.vert`、`Downsample.frag`、`Blur.frag` 和 `Additive.frag`。中间纹理的尺寸在构造效果时确定。

这一结构可以说明现有的渲染阶段，但没有已发布的测量数据可以据此给出性能提升百分比。

<span id="vistas-y-coordenadas" aria-hidden="true"></span>

## 视图与坐标

管理器提供两个简单操作：

```cpp
void RenderManager::SetView(const sf::View &view) {
  target_.setView(view);
}

void RenderManager::ResetView() {
  SetView(target_.getDefaultView());
}
```

它们用于访问 SFML 的 2D 视图。系统没有 `CameraManager`、3D 摄像机或自动跟随系统。`CursorManager` 可以查询转换到指定 `sf::View` 坐标下的光标位置。

Engine 的尺寸调整方法会记录新的窗口大小，但不会重建渲染目标。因此不能将其视为完整的动态分辨率支持。

<span id="partículas" aria-hidden="true"></span>

## 粒子

`ParticleManager` 管理具有位置、速度、加速度、寿命、尺寸和颜色的粒子。`Update` 推进运动并删除寿命结束的粒子；`Render` 绘制随时间逐渐透明的方块。

默认上限为 **128 个粒子**。向量会预留该容量；当没有空间或寿命无效时，`Emit` 会丢弃新粒子。该上限是实现配置，并非对引擎最大容量的测量。

场景决定何时更新和绘制粒子。Engine 在切换场景时清除它们。Runner 使用该系统呈现移动时的尘土。

<span id="fuentes" aria-hidden="true"></span>

## 源码参考

- [RenderManager 管线](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/RenderManager.cpp)。
- [Bloom 实现](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Graphics/Effects/EfflectBloom.cpp)。
- [Monitor 着色器](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Content/Shaders/Monitor.frag)。
- [粒子](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/ParticleManager.cpp)。
