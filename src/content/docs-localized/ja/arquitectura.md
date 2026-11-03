---
title: エンジンのアーキテクチャ
description: メインループ、EngineContext、オブジェクトの所有権、各システムの関係をたどります。
order: 4
category: エンジンのコア
---

<span id="de-la-entrada-al-frame" aria-hidden="true"></span>

## 入力からフレームまで

`main()` は `Engine` を構築し、ウィンドウが開いている間、3 つの処理を繰り返します。次は基準コードからの抜粋です。

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

フォーカスがないときもイベント処理とクロックの更新は続きますが、描画は省略され、10 ms 待機します。`Engine::Update` もシーンを進める前にフォーカスを確認します。

<span id="responsabilidades-de-engine" aria-hidden="true"></span>

## Engine の責務

`Engine` はウィンドウ、`EngineContext`、シーンの登録表、アクティブなシーンへの参照、一時停止オーバーレイを所有し、これらの要素を調整します。

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
│   └── 名前 → unique_ptr<Scene>
├── currentScene → アクティブな Scene
└── Overlay → TGUI ウィジェット
```

コンテキストは各シーンに参照で渡されます。ゲームはサービスを重複して構築せずに `ctx.renderer`、`ctx.input`、`ctx.resources` を利用できます。

<span id="procesamiento-de-eventos" aria-hidden="true"></span>

## イベント処理

`ProcessEvent` の開始時に、エンジンは保留中のシーン変更を処理します。その後、`sf::RenderWindow` からイベントを取り出し、次のように配信します。

1. `EngineVisitor` が終了、フォーカス、サイズ、コントローラー、グローバルショートカットを処理します。
2. `GuiManager` がイベントを TGUI に渡します。
3. オーバーレイが非表示のとき、シーンが `OnEvent` を受け取ります。
4. エンジンがオーバーレイの選択内容を処理し、一時停止状態を同期します。

GUI とシーンは同じ処理フローに参加します。独立したイベントバスは、このリビジョンでは確認されていません。

<span id="actualización-y-tiempo" aria-hidden="true"></span>

## 更新と時間

`TimeManager` は前フレームからの経過時間を計算し、`gConfig.maximumDeltaTime` で制限します。その後、カーソルを更新し、オーバーレイが非表示であれば `Scene::Update` を呼び出します。

固定ステップを積み重ねるアキュムレーターは実装されていません。各ゲームがデルタ時間や独自のタイマーの使い方を決めます。

`TimeManager` は実時間とゲーム時間を区別します。Engine はシーンとともにゲームクロックを停止し、紐付いた `Cooldown` はデフォルトでそのクロックを使います。独立したクールダウンは実時間を使います。

紐付いたクールダウンはデフォルトでゲーム時間を使います。

```cpp
auto cooldown = ctx.time.CreateCooldown(1.f, TimeDomain::Game);
```

<span id="renderizado-y-capas" aria-hidden="true"></span>

## 描画とレイヤー

シーンは `sf::RenderTexture` に描画します。RenderManager はエフェクトチェーンを適用して最終テクスチャを返します。Engine はそれをウィンドウに表示し、その上に GUI とカーソルを描きます。

```text
Scene::Render
     ↓
RenderManager / RenderTexture
     ↓
Bloom → Monitor
     ↓
ウィンドウ → GUI → Cursor → display
```

エフェクトは `sf::Shader::isAvailable()` が真を返す場合だけ追加されます。GUI とカーソルはポストプロセスの後に描画されます。Bloom の各パスは[描画](/ja/docs/renderizado/)を参照してください。

<span id="propiedad-y-memoria" aria-hidden="true"></span>

## 所有権とメモリ

- シーンは `unique_ptr<Scene>` を値とする `unordered_map` に格納されます。
- エフェクトは `unique_ptr<Effect>` のベクターに格納されます。
- アクティブなシーンは所有権を持たないポインターです。オブジェクトの所有権は登録表に残ります。
- 各マネージャーは `EngineContext` の値メンバーです。
- ResourceManager はテクスチャとフォントを値として保持し、音声バッファーを `shared_ptr` で共有します。

プロジェクトは RAII と標準コンテナーを使用します。独自のメモリマネージャーや汎用 ECS はありません。登録されるシーンはすべて `CreateScenes` で構築され、シーン遷移のたびに新しいインスタンスを作ることはありません。

<span id="organización-del-código" aria-hidden="true"></span>

## コードの構成

| ディレクトリ | 内容 |
| --- | --- |
| `Engine/Include` | コア、マネージャー、シーン、エフェクト、ユーティリティの契約と型。 |
| `Engine/Source` | 実装とエントリーポイント。 |
| `Games/Include` | ゲームクラス、型、設定定数。 |
| `Games/Source` | ゲームのロジックと描画。 |
| `Content` | 画像、音声、フォント、シェーダー、テーマ、JSON。 |

<span id="fuentes" aria-hidden="true"></span>

## 参照ソース

- [メインループ](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Main.cpp)。
- [Engine による調整](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Core/Engine.cpp)。
- [EngineContext の定義](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Include/Core/EngineContext.h)。
- [シーンの所有権](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Include/Scene/SceneFactory.h)。
