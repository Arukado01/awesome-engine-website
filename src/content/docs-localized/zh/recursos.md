---
title: 资源与持久化
description: 了解纹理、音效、字体和音乐的加载，以及 JSON 存档和引擎截图。
order: 6
category: 系统
---

<span id="dónde-busca-los-archivos" aria-hidden="true"></span>

## 文件查找位置

ResourceManager 在特定目录中解析文件名。请传入相对于对应资源类别的文件名，而不是从仓库根目录开始的完整路径。

| API | 目录 | 返回值 |
| --- | --- | --- |
| `FetchTexture(filename)` | `Content/Textures/` | `sf::Texture*` |
| `FetchSound(filename)` | `Content/Sounds/` | `sf::SoundBuffer*` |
| `FetchFont(filename)` | `Content/Fonts/` | `sf::Font*` |
| `FetchMusic(filename)` | `Content/Musics/` | `std::optional<sf::Music>` |

这些路径相对于应用的工作目录。因此必须从存在 `Content` 的仓库根目录运行程序。

<span id="cómo-funciona-la-caché" aria-hidden="true"></span>

## 缓存如何工作

纹理、声音缓冲区和字体保存在以文件名索引的映射中。后续请求会查询已有条目。以下函数来自参考代码：

```cpp
sf::Texture *ResourceManager::FetchTexture(const std::string &filename) {
  if (!textures_.contains(filename)) {
    if (!textures_[filename].loadFromFile("Content/Textures/" + filename)) {
      LOG_ERROR("Failed to load texture: {}", filename);
      return nullptr;
    }
  }

  return &textures_.at(filename);
}
```

管理器保留这些对象的所有权。使用方不应删除收到的指针。系统也没有公开的资源卸载、缓存失效或自动重新加载操作。

使用前请检查结果。纹理和字体在加载前插入条目，失败后可能需要重启才能重试。`AcquireSound` 仅在成功加载后插入缓冲区，因此失败后可以重试。

<span id="música-y-sonido" aria-hidden="true"></span>

## 音乐与音效

短音效使用缓存的 `sf::SoundBuffer`。游戏在使用这些缓冲区时，创建并持有自己的 `sf::Sound` 音源。

`FetchMusic` 使用 `sf::Music` 对象打开文件，并通过 `optional` 返回；无法打开时返回 `std::nullopt`。ResourceManager 不缓存音乐：场景持有收到的对象，并控制播放。

项目中并非所有加载都经过管理器。RenderManager 的背景、着色器及部分核心资源由各自的类直接打开。

<span id="guardado-json" aria-hidden="true"></span>

## JSON 存档

SaveManager 在构造时读取 `Content/Save.json`；文件不存在时，从空对象开始。其接口提供 `Set`、`Get`、`Has`、`Erase` 和 `Clear`。

析构时，如果对象非空，就会写入数据。这可以持久化简单的游戏数据，但不是事务系统或云存档系统。

需要了解两个限制：

- 对于已有但无效的 JSON，没有通用恢复机制。
- `Clear()` 清空内存中的数据，但对象为空时析构函数不会覆盖文件。因此，它不一定会删除磁盘上的存档。

测试持久化改动时，请在修改文件之前备份数据。

<span id="capturas-de-pantalla" aria-hidden="true"></span>

## 屏幕截图

**F12** 调用 `ScreenshotManager::Take`。管理器把窗口复制到纹理、获取图像，并将 PNG 保存到 `Content/Screenshots`，必要时会创建目录。

文件名包含日期和精确到毫秒的时间。结果会记入日志，保存成功后播放提示音。应用需要对该目录具有写入权限。

<span id="fuentes" aria-hidden="true"></span>

## 源码参考

- [资源加载与缓存](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/ResourceManager.cpp)。
- [ResourceManager API](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Include/Managers/ResourceManager.h)。
- [SaveManager 持久化](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/SaveManager.cpp)。
- [PNG 截图](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/ScreenshotManager.cpp)。
