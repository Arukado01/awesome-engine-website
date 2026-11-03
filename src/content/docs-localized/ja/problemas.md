---
title: トラブルシューティング
description: ビルド、リソース、操作、保存、および対象リビジョンの制限に関する具体的な診断方法です。
order: 9
category: リファレンス
---

<span id="cmake-no-configura-el-proyecto" aria-hidden="true"></span>

## CMake でプロジェクトを構成できない

正しいルートディレクトリにいることと、`cmake --version` が 3.28 以降を示すことを確認してください。`-G Ninja` を選んだ場合は、Ninja とコンパイラーをターミナルから実行できることも確認します。

CMake は FetchContent を使用して依存関係をダウンロードします。接続、プロキシ、Git のエラーがあると、エンジンをコンパイルする前にこの段階で停止することがあります。ダウンロードの失敗と C++ のエラーを区別できるよう、元のメッセージを残してください。

ジェネレーターやコンパイラーを変更する場合は、新しいディレクトリで構成してください。別のツールで生成されたキャッシュを再利用しないでください。

<span id="el-compilador-no-encuentra-funciones-de-c20" aria-hidden="true"></span>

## コンパイラーが C++20 の機能を見つけられない

プロジェクトは C++20 を要求し、`std::format` などの標準ライブラリ機能を使用します。言語標準を選択しても、古いコンパイラー付属ライブラリに欠けている機能は追加されません。コンパイラーと標準ライブラリの両方のバージョンを確認してください。

`.vscode` のパスは作者の PC のものです。設定内のパスが無効だからといって、同じ場所にツールをインストールする必要はありません。

<span id="el-ejecutable-no-encuentra-configjson-o-los-recursos" aria-hidden="true"></span>

## 実行ファイルが Config.json やリソースを見つけられない

`Content` があるルートから実行します。

```powershell
.\Build\AwesomeEngine.exe
```

先に `Build` ディレクトリへ移動しないでください。設定、シェーダー、テクスチャ、フォント、音声は相対パスを使います。名前がローカルのファイルと完全に一致するかも確認します。

不正な JSON や必須キーの欠落は起動を妨げることがあります。[基準ファイル](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Content/Config.json)と比較し、想定される型を保ってください。

<span id="fallos-en-sistemas-sensibles-a-mayúsculas" aria-hidden="true"></span>

## 大文字と小文字を区別する環境での失敗

対象リビジョンには、Git 上のパスとコード内で使われるパスに違いがあります。たとえばツリーには `Engine/Include/utils` がありますが、いくつかの include は `Utils` を使っています。

一般的な Windows 設定では許容されることがありますが、ほかのシステムでは拒否される場合があります。このドキュメントでは Linux/macOS への対応やビルドを検証済みとはしていません。

<span id="menu-o-la-tecla-m-detienen-la-aplicación" aria-hidden="true"></span>

## Menu や M キーでアプリが停止する

Engine は `Menu` というシーンを要求しますが、SceneFactory にはその名前が登録されていません。Debug ではアサーションが発生する場合があり、ほかの構成でもマップの参照が失敗する可能性があります。

このリビジョンでは Menu ボタン、M、コントローラーの Select を避けてください。続行は Escape、再開始は R、終了は Quit を使います。このドキュメントで案内できる動作中のシーン選択画面はありません。

<span id="el-juego-se-pausa-al-cambiar-de-ventana" aria-hidden="true"></span>

## ウィンドウを切り替えるとゲームが一時停止する

これは定義された動作です。Engine はフォーカスを失うとシーンを一時停止します。フォーカスがない間は描画を止め、クロックの更新は続けます。戻ったときにオーバーレイが表示されていれば、Resume または Escape を使ってください。

一時停止中はゲームクロックと紐付いたクールダウンが停止し、実時間のクロックは進み続けます。独立した `Cooldown` は実時間を使います。

<span id="no-aparecen-los-efectos-o-cambia-su-aspecto-al-redimensionar" aria-hidden="true"></span>

## エフェクトが表示されない、またはサイズ変更で見え方が変わる

エフェクトチェーンは `sf::Shader::isAvailable()` が真の場合だけ設定されます。作成時には Bloom と Monitor が有効で、Glitch と色反転は通常の処理フローには接続されていません。

描画テクスチャは設定サイズで構築されます。サイズ変更コールバックは再構築を行わないため、完全な動的解像度システムを期待しないでください。

<span id="un-mando-responde-de-forma-inesperada" aria-hidden="true"></span>

## コントローラーが予想と異なる反応をする

ボタンマッピングは Microsoft のベンダーを識別し、それ以外のコントローラーには別の表を使用します。`InputBindings.cpp` と SFML が返す識別情報を確認してください。汎用のコントローラーデータベースや、UI 上で保存できる再割り当て機能は確認されていません。

<span id="el-guardado-no-se-borra-al-llamar-clear" aria-hidden="true"></span>

## Clear を呼んでも保存データが消えない

SaveManager はメモリ内のデータを空にしますが、破棄時に値が残っている場合だけ書き込みます。そのため `Clear` は以前のファイルを必ずしも削除しません。変更を試す前に `Content/Save.json` のコピーを保存し、アプリケーションを終了した状態で内容を確認してください。

保存ファイルの JSON が不正な場合も、汎用の復旧処理は実装されていません。

<span id="no-se-guarda-una-captura" aria-hidden="true"></span>

## スクリーンショットが保存されない

F12 は `Content/Screenshots` に保存します。書き込み権限と空き容量を確認してください。ScreenshotManager は画像の保存結果を記録します。撮影音は保存処理が成功を返した場合だけ鳴ります。

<span id="comunicar-un-problema-reproducible" aria-hidden="true"></span>

## 再現可能な問題を報告する

[リポジトリ](https://github.com/Arukado01/AwesomeEngine)で issue を作るときは、使用したコミット、OS、コンパイラー、実行コマンド、作業ディレクトリ、エラーメッセージ、再現手順を含めてください。ローカルの変更があるかも明記すると、公開コードと開発中の作業を区別できます。

<span id="fuentes" aria-hidden="true"></span>

## 参照ソース

- [ビルド設定](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/CMakeLists.txt)。
- [Engine の動作](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Core/Engine.cpp)。
- [実際のシーン登録](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Scene/SceneFactory.cpp)。
- [SaveManager の永続化](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/SaveManager.cpp)。
