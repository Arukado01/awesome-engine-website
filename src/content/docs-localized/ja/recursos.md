---
title: リソースと永続化
description: テクスチャ、効果音、フォント、音楽の読み込み、JSON 保存、エンジンのスクリーンショットを説明します。
order: 6
category: システム
---

<span id="dónde-busca-los-archivos" aria-hidden="true"></span>

## ファイルの検索先

ResourceManager は特定のディレクトリ内でファイル名を解決します。ルートからの完全なパスではなく、対象カテゴリーからの相対的なファイル名を渡してください。

| API | ディレクトリ | 戻り値 |
| --- | --- | --- |
| `FetchTexture(filename)` | `Content/Textures/` | `sf::Texture*` |
| `FetchSound(filename)` | `Content/Sounds/` | `sf::SoundBuffer*` |
| `FetchFont(filename)` | `Content/Fonts/` | `sf::Font*` |
| `FetchMusic(filename)` | `Content/Musics/` | `std::optional<sf::Music>` |

パスはアプリケーションの作業ディレクトリに対する相対パスです。そのため `Content` があるリポジトリのルートから実行する必要があります。

<span id="cómo-funciona-la-caché" aria-hidden="true"></span>

## キャッシュの仕組み

テクスチャ、サウンドバッファー、フォントは、ファイル名をキーとするマップに保存されます。同じリソースを再度要求すると、既存の項目を参照します。次の関数は基準コードからの抜粋です。

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

これらのオブジェクトの所有権はマネージャーが保持します。利用側は受け取ったポインターを削除してはいけません。公開されたアンロード、キャッシュ無効化、自動再読み込みの操作もありません。

利用前に戻り値を確認してください。最初の読み込みに失敗すると `nullptr` を返します。この実装は読み込みを試す前に項目を挿入するため、後で同じ名前を要求しても自動で再試行しません。現在の実装では、不足していたファイルを補った後にアプリケーションの再起動が必要になることが一般的です。

<span id="música-y-sonido" aria-hidden="true"></span>

## 音楽と効果音

短い効果音はキャッシュされた `sf::SoundBuffer` を使用します。ゲームはそのバッファーを使用する間、音源となる `sf::Sound` を作成して保持します。

`FetchMusic` は `sf::Music` オブジェクトでファイルを開き、`optional` に包んで返します。開けない場合は `std::nullopt` を返します。音楽は ResourceManager のキャッシュには保存されず、受け取ったオブジェクトをシーンが保持し、再生を制御します。

プロジェクト内のすべての読み込みがマネージャーを経由するわけではありません。RenderManager の背景、シェーダー、コアの一部リソースは、それぞれのクラスから直接開かれます。

<span id="guardado-json" aria-hidden="true"></span>

## JSON による保存

SaveManager は構築時に `Content/Save.json` を読み込みます。ファイルがなければ空のオブジェクトで開始します。インターフェースには `Set`、`Get`、`Has`、`Erase`、`Clear` があります。

破棄時に、オブジェクトが空でなければ値を書き込みます。単純なゲームデータの永続化には使えますが、トランザクション対応やクラウド保存のシステムではありません。

次の 2 つの制限に注意してください。

- 既存の JSON が不正な場合、汎用的な復旧処理は実装されていません。
- `Clear()` はメモリ上の値を空にしますが、オブジェクトが空の場合、デストラクターはファイルを上書きしません。ディスク上の保存データを消すことと同じとは限りません。

永続化の変更を試す前に、ファイルを編集する前のデータをバックアップしてください。

<span id="capturas-de-pantalla" aria-hidden="true"></span>

## スクリーンショット

**F12** は `ScreenshotManager::Take` を呼び出します。マネージャーはウィンドウをテクスチャにコピーし、画像を取得して `Content/Screenshots` に PNG を保存します。必要に応じてディレクトリも作成します。

ファイル名には日付とミリ秒単位の時刻が含まれます。結果がログに記録され、保存に成功すると音が鳴ります。アプリケーションには対象ディレクトリへの書き込み権限が必要です。

<span id="fuentes" aria-hidden="true"></span>

## 参照ソース

- [リソースの読み込みとキャッシュ](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/ResourceManager.cpp)。
- [ResourceManager の API](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Include/Managers/ResourceManager.h)。
- [SaveManager の永続化](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/SaveManager.cpp)。
- [PNG スクリーンショット](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Managers/ScreenshotManager.cpp)。
