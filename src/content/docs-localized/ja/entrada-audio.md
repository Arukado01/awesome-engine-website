---
title: 入力・音声・インターフェース
description: アクション割り当て、コントローラー、グローバルショートカット、音声再生、TGUI ウィジェットを説明します。
order: 8
category: システム
---

<span id="una-acción-varias-entradas" aria-hidden="true"></span>

## 1 つのアクションに複数の入力

InputManager は整数のアクション ID と、バインディングを保持する `unordered_multimap` を使用します。1 つのアクションに複数の入力を関連付けられます。`Pressed(action)` は、いずれかの割り当てが押されているときに真を返します。

基準リビジョンのバインディング型は次のとおりです。

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

これらの型は `Input` 名前空間に属します。この問い合わせは現在の状態を調べるもので、押した瞬間を自動検出するものではありません。個別のイベントには、シーンの `OnEvent` も使用できます。

軸は値を 100 で割って正規化し、設定された正または負のしきい値と比較します。Engine はシーン変更時にバインディングを消去するため、各ゲームは開始時に自分の割り当てを再設定する必要があります。

<span id="mandos-y-cursor" aria-hidden="true"></span>

## コントローラーとカーソル

コードには Xbox と PlayStation の論理ボタン表があります。Microsoft のベンダー ID を検出すると Xbox 表を選び、それ以外は PlayStation 表を使います。この判定方法は、すべてのコントローラーで同じマッピングになることを保証しません。

Xbox 表では L2/R2 トリガーにボタンの割り当てがなく、このボタンマッピングでは利用不可とされています。軸は独立したバインディング型です。

CursorManager は `joystickDeadzone` を考慮してスティックでカーソルを移動させます。マウス位置をビュー座標に変換することもできます。GuiManager は論理ボタン South をウィジェットへのクリックイベントに変換します。

<span id="atajos-globales" aria-hidden="true"></span>

## グローバルショートカット

| 入力 | 操作 |
| --- | --- |
| F12 | PNG スクリーンショットを保存します。 |
| R | アクティブなシーンを再開始します。 |
| Escape / コントローラーの Start | 一時停止オーバーレイを切り替えます。 |
| M / コントローラーの Select | `Menu` を要求します。このシーンは対象リビジョンには登録されていません。 |

ショートカットは `EngineVisitor` が処理します。フォーカスを失うとシーンは一時停止します。フォーカスが戻っても、オーバーレイが開いていない場合だけ再開します。

<span id="audio-de-la-revisión-de-referencia" aria-hidden="true"></span>

## 基準リビジョンの音声

AudioManager は全体音量と Music/Effect チャンネルの音量を管理します。ResourceManager は共有バッファーと音楽を提供し、各シーンが音源を管理します。

```cpp
void AudioManager::SetGlobalVolume(float volume) {
  sf::Listener::setGlobalVolume(volume);
}
```

<span id="trabajo-local-en-desarrollo" aria-hidden="true"></span>

<span id="grupos-de-audio" aria-hidden="true"></span>

### 音声グループ

`AudioManager::CreateGroup` はシーンの効果音と音楽をまとめる `AudioGroup` を作成します。再生中だった音源だけを一時停止・再開し、チャンネルの停止や調整ができます。Runner と Bounce で使用されています。

音源を保持するため、グループをシーン内で保持します。例えば次のように使います。

```cpp
auto sound = audioGroup.AddSound(ctx.resources.AcquireSound("RunnerJump.wav"), 20.f);
if (sound) audioGroup.Play(*sound);
```

<span id="interfaz-tgui" aria-hidden="true"></span>

## TGUI インターフェース

GuiManager は TGUI を SFML ウィンドウに接続します。`Content/Themes/Dark.txt` を読み込み、`Relidux.otf` フォントを適用し、Tab 操作を有効にして、ウィジェットを追加・削除するメソッドを提供します。

オーバーレイは `magic_enum` を使い、`OverlaySelection` からボタンを作成します。選択は一度だけ取り出され、Engine が対応する操作を実行します。GUI はシーンのポストプロセス後に描画されます。

<span id="fuentes" aria-hidden="true"></span>

## 参照ソース

- [入力の型](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Include/utils/InputBindings.h)。
- [バインディングの問い合わせ](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/InputManager.cpp)。
- [コントローラーのマッピング](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Utils/InputBindings.cpp)。
- [AudioManager](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/AudioManager.cpp)。
- [GuiManager](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/GuiManager.cpp)。

- [AudioGroup](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Include/Managers/AudioGroup.h).
