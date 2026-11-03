---
title: 設定
description: ウィンドウ、時間、音声、カーソルの値と、現在の JSON 設定の制限を説明します。
order: 3
category: はじめに
---

<span id="el-archivo-de-configuración" aria-hidden="true"></span>

## 設定ファイル

エンジンはグローバルオブジェクト `gConfig` の構築時に `Content/Config.json` を読み込みます。基準リビジョンの内容は次のとおりです。

```json
{
  "windowTitle": "Awesome Engine",
  "windowSize": [800, 800],
  "frameRateLimit": 120,
  "disableSfmlLogs": true,
  "maximumDeltaTime": 0.03,
  "globalVolume": 100,
  "backgroundColor": [100, 100, 100],
  "cursorRadius": 5,
  "cursorSpeed": 800,
  "cursorColor": [255, 100, 0],
  "joystickDeadzone": 0.1
}
```

<span id="qué-controla-cada-valor" aria-hidden="true"></span>

## 各設定値の役割

| キー | 効果 |
| --- | --- |
| `windowTitle` | SFML ウィンドウのタイトル。 |
| `windowSize` | 初期サイズ。描画ターゲットやゲーム内の各種計算の基準にもなります。 |
| `frameRateLimit` | ウィンドウに指定するフレーム上限。キーがない場合の既定値は 120 です。 |
| `disableSfmlLogs` | `true` のとき、SFML のエラーストリームの出力を抑制します。 |
| `maximumDeltaTime` | TimeManager が各フレームで渡すシミュレーションの最大デルタ時間。単位は秒です。 |
| `globalVolume` | SFML のリスナーに適用する全体音量。 |
| `backgroundColor` | RenderManager が使用する背景の RGB 色。 |
| `cursorRadius` | カスタムの円形カーソルの半径。 |
| `cursorSpeed` | コントローラーで移動させる場合のカーソル速度。 |
| `cursorColor` | カーソルの RGB 色。 |
| `joystickDeadzone` | カーソル移動時にスティックの微小な変位を無視するためのしきい値。 |

120 フレームという上限は設定値であり、**性能の測定結果ではありません**。シミュレーションが固定タイムステップを使うことも意味しません。時間はフレームごとに変動し、`maximumDeltaTime` で制限されます。

<span id="cambiar-la-configuración" aria-hidden="true"></span>

## 設定を変更する

アプリケーションを終了した状態で JSON を編集し、リポジトリのルートから再起動します。設定は起動時に読み込まれます。ファイルの自動再読み込みや、これらの値を書き込む設定パネルはありません。

例と同じキーと型を保ってください。パーサーには検証用スキーマも、すべての項目に対する代替値もありません。ファイルが存在しない場合、JSON が不正な場合、必須キーが不正な場合は、起動できないことがあります。

`windowSize` の変更は `gConfig.windowSize` を使用するゲームコードにも影響します。完全な動的解像度システムがあるという意味ではありません。サイズ変更イベントはポストプロセス用テクスチャを自動で再構築しません。

<span id="configuración-de-cada-juego" aria-hidden="true"></span>

## 各ゲームの設定

個別のパラメーターは `Games/Include/Config` にあります。ファイル名は `BounceConfig.h`、`ClickerConfig.h`、`MemoryCardConfig.h`、`TicTacToeConfig.h`、`MineSweeperConfig.h`、`RunnerConfig.h`、`TetrisConfig.h` です。

これらは C++ の定数なので、変更後は再ビルドが必要です。初期シーンも `Config.json` からは選べず、`Engine` のコンストラクターで `ChangeScene("Tetris")` により固定されています。

<span id="preferencias-del-sitio-y-del-motor" aria-hidden="true"></span>

## サイトとエンジンの設定の違い

このサイトのライト、ダーク、システムの選択は、Web インターフェースだけを変更します。エンジンは `Content/Themes/Dark.txt` で TGUI を設定します。Web 側の選択機能が実行ファイルにも存在するとは想定していません。

<span id="fuentes" aria-hidden="true"></span>

## 参照ソース

- [Config.json の元の値](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Content/Config.json)。
- [EngineConfig の読み込み](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Core/EngineConfig.cpp)。
- [デルタ時間の計算](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/TimeManager.cpp)。
