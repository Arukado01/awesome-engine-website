---
title: シーンとライフサイクル
description: Scene の契約、ゲーム登録、遅延遷移、状態の後処理を説明します。
order: 7
category: エンジンのコア
---

<span id="el-contrato-de-una-escena" aria-hidden="true"></span>

## シーンの契約

シーンは `EngineContext` を参照で受け取り、開始、更新、描画の方法を定義します。基準リビジョンには次の契約があります。

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

`Start`、`Update`、`Render` は必須です。そのほかのコールバックには空の実装があり、ゲームが必要とするときだけオーバーライドします。

<span id="responsabilidades-por-etapa" aria-hidden="true"></span>

## 各段階の責務

| 段階 | 実行されるタイミング | ゲームでの用途 |
| --- | --- | --- |
| コンストラクター | 最初のシーン登録表を作るとき。 | インスタンスのオブジェクトとリソースを準備します。 |
| `Start` | シーンを有効化または再開始するとき。 | ゲームをリセットし、操作を登録します。 |
| `OnEvent` | オーバーレイが非表示の状態でイベントを受け取るとき。 | ゲームの個別イベントを処理します。 |
| `Update` | フォーカスがあり、オーバーレイが非表示の各フレーム。 | ロジック、移動、状態を進めます。 |
| `Render` | アクティブなシーンのフレームを描くとき。 | オブジェクトを `ctx.renderer` に渡します。 |
| `OnPause` | 一時停止状態が変わったとき。 | シーンが管理する要素を停止または再開します。 |
| `OnCleanup` | シーンを離れる、または再開始する前。 | 音声を止め、引き継ぐべきでない状態を片付けます。 |

コンストラクターと `Start` は同じではありません。インスタンスは登録表に残り、`Start` が何度も呼ばれることがあります。

<span id="registro-de-juegos" aria-hidden="true"></span>

## ゲームの登録

`SceneFactory::Scenes` は、名前と `unique_ptr<Scene>` を対応付ける `unordered_map` です。9本のゲームとメニューシーンを登録します。

```cpp
scenes.emplace("Bounce", std::make_unique<Bounce::Game>(context));
scenes.emplace("Clicker", std::make_unique<Clicker::Game>(context));
scenes.emplace("MemoryCard", std::make_unique<MemoryCard::Game>(context));
scenes.emplace("TicTacToe", std::make_unique<TicTacToe::Game>(context));
scenes.emplace("MineSweeper", std::make_unique<MineSweeper::Game>(context));
scenes.emplace("Runner", std::make_unique<Runner::Game>(context));
scenes.emplace("Tetris", std::make_unique<Tetris::Game>(context));
scenes.emplace("Pong", std::make_unique<Pong::Game>(context));
scenes.emplace("Breakout", std::make_unique<Breakout::Game>(context));
scenes.emplace("Menu", std::make_unique<Menu::Game>(context));
```

`Engine` は `Menu` から起動し、`Content/Config.json` の `games` から項目を読み込みます。登録済みの Bounce も追加できます。

<span id="transición-diferida" aria-hidden="true"></span>

## 遅延遷移

`SceneManager::ChangeScene` は、ほかの切り替えがまだ保留されていなければ要求された名前を保存します。Engine は次のイベント処理の開始時に、その要求を取り出します。

```text
ChangeScene(名前)
     ↓
保留中の要求
     ↓
次の ProcessEvent
     ↓
前のシーンの OnCleanup
     ↓
パーティクルと入力バインディングを消去
     ↓
アクティブなポインターを切り替え
     ↓
要求されたシーンの Start
     ↓
一時停止状態を同期
```

`RestartCurrentScene` は現在の名前で同じ仕組みを使います。オブジェクトを破棄して作り直すのではありません。そのため `Start` は、繰り返し呼ばれてもゲームを有効な状態に戻す必要があります。

<span id="explorar-una-implementación-real" aria-hidden="true"></span>

## 実際の実装を調べる

[Bounce](https://github.com/Arukado01/AwesomeEngine/blob/61a3244690f7763d41a8f0ba6f0f2ac3deb53ee2/Games/Source/Bounce.cpp) は、ゲームクラスがコンテキストを受け取り、パドルと統計値を準備し、効果音と音楽を要求して、シーンのコールバックを利用する方法を示しています。

自分のコピーにシーンを追加するには、既存の分離方法に従います。宣言は `Games/Include`、実装は `Games/Source`、明示的な登録は `SceneFactory.cpp` に置きます。CMake は `GLOB_RECURSE CONFIGURE_DEPENDS` でこれらのフォルダーの `.cpp` を検出します。実行時に読み込むシーンプラグインはありません。

<span id="limitación-del-acceso-al-menú" aria-hidden="true"></span>

<span id="メニューへのアクセス制限" aria-hidden="true"></span>

<span id="volver-al-menú-principal" aria-hidden="true"></span>

## メインメニューに戻る

ゲーム中はポーズパネルの **Menu**、**M** キー、またはコントローラーの **Select** でメインメニューに戻れます。

<span id="fuentes" aria-hidden="true"></span>

## 参照ソース

- [Scene の契約](https://github.com/Arukado01/AwesomeEngine/blob/61a3244690f7763d41a8f0ba6f0f2ac3deb53ee2/Engine/Include/Scene/Scene.h)。
- [SceneFactory の登録](https://github.com/Arukado01/AwesomeEngine/blob/61a3244690f7763d41a8f0ba6f0f2ac3deb53ee2/Engine/Source/Scene/SceneFactory.cpp)。
- [SceneManager の要求](https://github.com/Arukado01/AwesomeEngine/blob/61a3244690f7763d41a8f0ba6f0f2ac3deb53ee2/Engine/Source/Managers/SceneManager.cpp)。
- [Engine の遷移処理](https://github.com/Arukado01/AwesomeEngine/blob/61a3244690f7763d41a8f0ba6f0f2ac3deb53ee2/Engine/Source/Core/Engine.cpp)。
