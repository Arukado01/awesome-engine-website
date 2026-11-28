---
title: エンジンのテスト
description: CMake と CTest でテストを実行する方法と、各テストスイートの対象を確認します。
order: 10
category: テスト
---

<span id="compilar-y-ejecutar-las-pruebas" aria-hidden="true"></span>

## テストのビルドと実行

リポジトリのルートで、テストを有効にして CMake を設定し、ビルドしてから CTest を実行します。

```sh
cmake -S . -B Build -G Ninja -DCMAKE_BUILD_TYPE=Debug -DBUILD_TESTING=ON
cmake --build Build --parallel
ctest --test-dir Build --output-on-failure --no-tests=error
```

<span id="suites-disponibles" aria-hidden="true"></span>

## 利用できるテストスイート

<span id="colisiones-2d" aria-hidden="true"></span>

### 2D 衝突判定

AABB の交差と分離、初期の重なり、移動中の衝突、衝突しない掃引、角での接触の6ケースを確認します。

このスイートだけをビルドして実行するには、`ae_collision_tests` ターゲットを使い、名前で絞り込みます。

```sh
cmake --build Build --target ae_collision_tests --parallel
ctest --test-dir Build -R '^core[.]collision(\.|$)' --output-on-failure --no-tests=error
```

メインテストのみ（ネガティブテストを除く）を実行するには、`-R '^core[.]collision$'` を使用してください。

`core.collision` はウィンドウを開かずに6ケースを確認します。`core.collision.detects_failure` は `AE_TEST_FORCE_FAIL` で意図的に失敗させ、実行ファイルが0以外の終了コードを返すことを確認します。

[テストのソースコード](https://github.com/Arukado01/AwesomeEngine/blob/61a3244690f7763d41a8f0ba6f0f2ac3deb53ee2/Tests/Core/CollisionTests.cpp) · [CTest への登録](https://github.com/Arukado01/AwesomeEngine/blob/61a3244690f7763d41a8f0ba6f0f2ac3deb53ee2/Tests/CMakeLists.txt)

<span id="animación-de-sprites" aria-hidden="true"></span>

### スプライトアニメーション

初期状態、フレームの進行、ループ一周、`Once` モードの終了、一時停止と再開、リセット、コールバックによる進行の中断、各フレームの矩形、無効な引数、モード変更の10ケースを確認します。

このスイートだけをビルドして実行するには、`ae_sprite_animator_tests` ターゲットを使い、名前で絞り込みます。

```sh
cmake --build Build --target ae_sprite_animator_tests --parallel
ctest --test-dir Build -R '^core[.]sprite_animator$' --output-on-failure --no-tests=error
```

`core.sprite_animator` はウィンドウを開かずに10ケースを確認します。`Loop` と `Once` の両モードで再生し、一時停止中はフレーム位置を保持し、無効な時間や速度を無視し、`FrameRect` でアクティブフレームの矩形を計算することを確認します。

[テストのソースコード](https://github.com/Arukado01/AwesomeEngine/blob/34702d1447e3252b156df7e71cda3030dd80cdf9/Tests/Core/SpriteAnimatorTests.cpp) · [CTest への登録](https://github.com/Arukado01/AwesomeEngine/blob/34702d1447e3252b156df7e71cda3030dd80cdf9/Tests/CMakeLists.txt)

<span id="guardado-y-persistencia" aria-hidden="true"></span>

### セーブと永続化

7ケースが一時ディレクトリで SaveManager を特徴づけます。ファイルがない空オブジェクト、`Set` 後のデストラクタで `Save.json` を作成、変更時に他のキーを保持、複数キーからの1キー削除、既知の2つの不具合（最後のキーの削除と `Clear` は永続化されない）、そして壊れた JSON がパース例外を伝播することを確認します。

このスイートだけをビルドして実行するには、`ae_save_manager_tests` ターゲットを使い、名前で絞り込みます。

```sh
cmake --build Build --target ae_save_manager_tests --parallel
ctest --test-dir Build -R '^core[.]save_manager$' --output-on-failure --no-tests=error
```

`core.save_manager` はウィンドウを開かずに7ケースを確認します。各ケースは専用の一時ディレクトリで動作するため、実際の `Content/Save.json` には触れません。

[テストのソースコード](https://github.com/Arukado01/AwesomeEngine/blob/c72ae6fef8a324b4cfd5e73e2e4928d2201a81b3/Tests/Core/SaveManagerTests.cpp) · [CTest への登録](https://github.com/Arukado01/AwesomeEngine/blob/c72ae6fef8a324b4cfd5e73e2e4928d2201a81b3/Tests/CMakeLists.txt)

<span id="configuración-del-motor" aria-hidden="true"></span>

### エンジンの設定

2ケースが `AE_CONFIG_CASE` 変数で選んだフィクスチャにより `Config.json` の読み込みを確認します。`valid` シナリオは2つのゲームと60 FPS制限を含む完全なファイルをカバーし、`minimal` シナリオは120 FPSや24 pxカーソルなど既定値を確認します。

このスイートだけをビルドして実行するには、`ae_engine_config_tests` ターゲットを使い、名前で絞り込みます。

```sh
cmake --build Build --target ae_engine_config_tests --parallel
ctest --test-dir Build -R '^core[.]engine_config[.]' --output-on-failure --no-tests=error
```

`core.engine_config.valid` と `core.engine_config.minimal` の各ケースはウィンドウを開かず、`Tests/Fixtures/Config` のそれぞれのフィクスチャから実行されます。

[テストのソースコード](https://github.com/Arukado01/AwesomeEngine/blob/d20cf006b765bbc7c9f09c2726d99e5f34746610/Tests/Core/EngineConfigTests.cpp) · [CTest への登録](https://github.com/Arukado01/AwesomeEngine/blob/d20cf006b765bbc7c9f09c2726d99e5f34746610/Tests/CMakeLists.txt)
