---
title: 故障排查
description: 针对编译、资源、控制、存档及已审查修订限制的具体诊断方法。
order: 9
category: 参考
---

<span id="cmake-no-configura-el-proyecto" aria-hidden="true"></span>

## CMake 无法配置项目

确认当前位于正确的仓库根目录，且 `cmake --version` 显示 3.28 或更高版本。如果选择了 `-G Ninja`，请确认终端中可以使用 Ninja 和编译器。

CMake 使用 FetchContent 下载依赖项。连接、代理或 Git 错误可能在编译引擎之前就中断该阶段。请保留原始错误消息，以区分下载失败和 C++ 错误。

如果需要更换生成器或编译器，请在新目录中配置，不要复用其他工具生成的缓存。

<span id="el-compilador-no-encuentra-funciones-de-c20" aria-hidden="true"></span>

## 编译器找不到 C++20 功能

项目要求 C++20，并使用 `std::format` 等标准库功能。选择语言标准不会为旧版编译器库补充缺失功能。请同时检查编译器及其标准库版本。

`.vscode` 中的路径来自作者的电脑。这些选项中的路径无效，并不意味着你必须把工具安装到同一位置。

<span id="el-ejecutable-no-encuentra-configjson-o-los-recursos" aria-hidden="true"></span>

## 可执行文件找不到 Config.json 或资源

从 `Content` 所在的根目录运行：

```powershell
.\Build\AwesomeEngine.exe
```

不要先切换到 `Build` 目录。配置、着色器、纹理、字体和音效都使用相对路径。还要确认名称与当前副本中的文件完全一致。

无效的 JSON 或缺少必填键可能阻止启动。请对照[参考文件](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Content/Config.json)，并保持预期的数据类型。

<span id="fallos-en-sistemas-sensibles-a-mayúsculas" aria-hidden="true"></span>

## 区分大小写的系统上出现错误

已审查修订中的 Git 路径与代码使用的路径存在差异。例如，目录树中是 `Engine/Include/utils`，但一些 include 使用 `Utils`。

Windows 的常见配置可能允许这种差异，其他系统则可能拒绝。本文档没有认证 Linux/macOS 兼容性，也没有声称已验证在这些系统上构建。

<span id="menu-o-la-tecla-m-detienen-la-aplicación" aria-hidden="true"></span>

## Menu 或 M 键使应用停止

Engine 请求名为 `Menu` 的场景，但 SceneFactory 没有注册该名称。Debug 配置下可能触发断言，其他配置下的映射查询也可能失败。

在此修订中，请避免使用 Menu 按钮、M 和手柄 Select。使用 Escape 继续、R 重启或 Quit 关闭。本文档无法推荐一个可正常工作的场景选择器。

<span id="el-juego-se-pausa-al-cambiar-de-ventana" aria-hidden="true"></span>

## 切换窗口时游戏暂停

这是已定义的行为：Engine 在失去焦点时暂停场景。没有焦点时，循环停止渲染但持续更新时钟。如果切回后覆盖层仍然可见，请使用 Resume 或 Escape。

在公开参考修订中，每个场景自行控制暂停响应。在电脑上发现的共享冷却时钟重构当时仍属于本地改动。

<span id="no-aparecen-los-efectos-o-cambia-su-aspecto-al-redimensionar" aria-hidden="true"></span>

## 效果未出现，或调整窗口尺寸后外观改变

只有 `sf::Shader::isAvailable()` 为真时才会配置效果链。创建后 Bloom 和 Monitor 启用；Glitch 和颜色反转没有连接到常规流程。

渲染纹理按配置尺寸构建。尺寸调整回调不会重建纹理，因此不应期待完整的动态分辨率系统。

<span id="un-mando-responde-de-forma-inesperada" aria-hidden="true"></span>

## 手柄响应异常

按钮映射识别 Microsoft 厂商，并为其他手柄使用另一张表。请检查 `InputBindings.cpp` 以及 SFML 提供的设备标识。没有发现通用控制器数据库或通过界面持久保存重新映射的功能。

<span id="el-guardado-no-se-borra-al-llamar-clear" aria-hidden="true"></span>

## 调用 Clear 后存档未删除

SaveManager 会清空内存数据，但只有析构时仍有数据才会写入。因此，`Clear` 不一定删除之前的文件。测试改动前，请备份 `Content/Save.json`，并在应用关闭时检查内容。

对于 JSON 无效的存档文件，也没有通用恢复机制。

<span id="no-se-guarda-una-captura" aria-hidden="true"></span>

## 截图没有保存

F12 将截图保存在 `Content/Screenshots`。请检查写入权限和可用空间。ScreenshotManager 会记录保存是否成功；只有保存操作返回成功时才播放截图提示音。

<span id="comunicar-un-problema-reproducible" aria-hidden="true"></span>

## 报告可复现的问题

在[仓库](https://github.com/Arukado01/AwesomeEngine)创建问题时，请提供所用提交、操作系统、编译器、执行命令、工作目录、错误消息和复现步骤。说明副本是否包含本地改动，以便区分已发布代码和仍在开发中的工作。

<span id="fuentes" aria-hidden="true"></span>

## 源码参考

- [构建配置](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/CMakeLists.txt)。
- [Engine 行为](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Core/Engine.cpp)。
- [实际场景注册](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Scene/SceneFactory.cpp)。
- [SaveManager 持久化](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/SaveManager.cpp)。
