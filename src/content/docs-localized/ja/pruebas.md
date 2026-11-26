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
