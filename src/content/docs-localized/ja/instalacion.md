---
title: 導入とビルド
description: CMake と C++20 コンパイラーを準備し、実行ファイルをビルドして正しいディレクトリから起動します。
order: 2
category: はじめに
---

<span id="requisitos-del-proyecto" aria-hidden="true"></span>

## プロジェクトの必要条件

| ツール | 確認されている要件 |
| --- | --- |
| C++ コンパイラー | C++20 と、`std::format` を含む使用中の標準ライブラリ機能に対応していること。 |
| CMake | バージョン 3.28 以降。 |
| Git | プロジェクトのクローンと FetchContent による SFML の取得に必要です。 |
| Ninja | このガイドのコマンドで指定するジェネレーターを使う場合に必要です。 |
| インターネット接続 | 初回の構成時に依存ライブラリをダウンロードします。 |

`.vscode` の設定は Windows、MinGW GCC、Ninja、GDB を使用しています。以下のコマンドは `CMakeLists.txt` とその設定に基づくもので、認証済みのビルド対応表ではありません。

<span id="obtener-el-código" aria-hidden="true"></span>

## コードを取得する

各ツールを `PATH` から実行できるターミナルで、次を実行します。

```sh
git clone https://github.com/Arukado01/AwesomeEngine.git
cd AwesomeEngine
```

このドキュメントとまったく同じコードを確認するには、新しく取得したコピーで対象リビジョンを選択します。

```sh
git checkout f0e88edffae35efb3cc208e8eea651d1b559cbaa
```

最後のコマンドは作業コピーを特定のコミットに切り替えます。変更を開発する場合は、作業を始める前に自分のブランチを作成してください。各ソースへのリンクも同じリビジョンを指しているため、将来の更新との差分を比較できます。

<span id="configurar-y-compilar" aria-hidden="true"></span>

## 構成とビルド

```sh
cmake -S . -B Build -G Ninja -DCMAKE_BUILD_TYPE=Debug
cmake --build Build --parallel
```

CMake は `Engine/Source` と `Games/Source` の `.cpp` ファイルをまとめ、`AwesomeEngine` という単一の実行ファイルを作ります。依存ライブラリは `FetchContent` で取得します。

- SFML 3.1.0。
- nlohmann/json 3.12.0。
- spdlog 1.16.0。
- TGUI 1.13.0。
- magic_enum 0.9.8。

Release ビルドを別に作る場合は、次を実行します。

```sh
cmake -S . -B BuildRelease -G Ninja -DCMAKE_BUILD_TYPE=Release
cmake --build BuildRelease --parallel
```

プロジェクトには MSVC 向けのコンパイラーオプションもありますが、上記の手順では Ninja と環境内のコンパイラーを使用します。同じビルドディレクトリで異なるジェネレーターやコンパイラーを混在させないでください。

<span id="ejecutar-en-windows" aria-hidden="true"></span>

## Windows で実行する

ターミナルの作業ディレクトリを、`Content` がある**リポジトリのルート**に保ちます。

```powershell
.\Build\AwesomeEngine.exe
```

対象リビジョンは初期シーンとして **Tetris** を指定します。このリビジョンには動作するゲーム選択画面が登録されていません。初期シーンは `Engine.cpp` で定義されています。

作業ディレクトリは重要です。設定、シェーダー、フォントなどのリソースは `Content/Config.json` のような相対パスで読み込まれます。`Build` から起動すると、エンジンがそれらを見つけられないことがあります。

<span id="trabajo-con-vs-code" aria-hidden="true"></span>

## VS Code での作業

リポジトリにはビルドタスクと GDB によるデバッグ設定があります。実行ファイルのパスは `Build/AwesomeEngine.exe`、作業ディレクトリはルートです。

エディター設定の一部には作者の PC の絶対パスが含まれています。コンパイラーやツールのパスは自分の環境に合わせて変更してください。そのまますべての環境に適用できる要件ではありません。

<span id="si-la-compilación-o-el-arranque-fallan" aria-hidden="true"></span>

## ビルドや起動に失敗した場合

[トラブルシューティング](/ja/docs/problemas/)では、ツール、依存関係のダウンロード、リソース、コードの既知の制限を分けて説明しています。このガイドではインストーラーやマルチプラットフォームのバイナリは配布していません。

<span id="fuentes" aria-hidden="true"></span>

## 参照ソース

- [CMakeLists.txt](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/CMakeLists.txt)。
- [ビルドタスク](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/.vscode/tasks.json)。
- [デバッグと作業ディレクトリ](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/.vscode/launch.json)。
