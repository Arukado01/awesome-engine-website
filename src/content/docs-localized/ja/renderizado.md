---
title: 描画とエフェクト
description: 2D シーンの描画、Bloom と Monitor の適用、ビューとパーティクルの制御を説明します。
order: 5
category: システム
---

<span id="una-escena-una-textura-intermedia" aria-hidden="true"></span>

## 1 つのシーンと中間テクスチャ

RenderManager は、シーンの SFML オブジェクトを描くために `Draw(const sf::Drawable&)` を提供します。内部では、設定サイズで作られた `sf::RenderTexture` である `target_` に描画を送ります。

フレームの開始時、`BeginDrawing` はターゲットを消去して背景を描きます。`FinishDrawing` はテクスチャを確定し、エフェクトを適用して、Engine がウィンドウに表示するテクスチャを返します。シーンがウィンドウを直接管理する必要はありません。

<span id="cadena-de-posprocesado" aria-hidden="true"></span>

## ポストプロセスのチェーン

基準コードでは、次のエフェクトが選択されています。

```cpp
// Post Process Effects
 effects_.emplace_back(std::make_unique<EffectBloom>());
 effects_.emplace_back(std::make_unique<EffectMonitor>());
 // effects_.emplace_back(std::make_unique<EffectGlitch>());
```

Bloom と Monitor はシェーダーが利用できる場合だけ追加されます。複数のエフェクトを適用するとき、`FinishDrawing` は 2 つのターゲットを交互に使い、あるパスの出力を次のパスの入力にします。

| エフェクト | 状態 | 機能 |
| --- | --- | --- |
| Bloom | 実装済み・有効 | 半分の解像度で画像をぼかし、元の画像に加算します。 |
| Monitor | 実装済み・有効 | 解像度と時間をパラメーターとするモニターシェーダーを適用します。 |
| Glitch | 実験的・無効 | クラスとシェーダーは存在しますが、パイプラインへの追加はコメントアウトされています。 |
| 色反転 | 実験的・未接続 | クラスとシェーダーは存在しますが、RenderManager はチェーンに追加しません。 |

実験的という表示は現在の統合状態を説明するもので、有効化の予定日を示すものではありません。

<span id="las-cuatro-etapas-de-bloom" aria-hidden="true"></span>

## Bloom の 4 段階

```text
シーンの画像
       ↓
1. Downsample → テクスチャ A、幅と高さは半分
       ↓
2. Blur（垂直） → テクスチャ B
       ↓
3. Blur（水平） → テクスチャ A
       ↓
4. 加算合成：元画像 + テクスチャ A
```

`EffectBloom` は `Content/Shaders` から `Default.vert`、`Downsample.frag`、`Blur.frag`、`Additive.frag` を読み込みます。中間テクスチャのサイズはエフェクト構築時に決まります。

この構成から実装済みのパスは説明できますが、性能向上率を示せる公開測定値はありません。

<span id="vistas-y-coordenadas" aria-hidden="true"></span>

## ビューと座標

マネージャーは次の 2 つの簡単な操作を提供します。

```cpp
void RenderManager::SetView(const sf::View &view) {
  target_.setView(view);
}

void RenderManager::ResetView() {
  SetView(target_.getDefaultView());
}
```

これは SFML の 2D ビューへのアクセスです。`CameraManager`、3D カメラ、自動追従システムはありません。`CursorManager` では、カーソル位置を `sf::View` の座標に変換して取得できます。

Engine のサイズ変更メソッドは新しいウィンドウサイズを記録しますが、描画ターゲットを作り直しません。完全な動的解像度対応と解釈しないでください。

<span id="partículas" aria-hidden="true"></span>

## パーティクル

`ParticleManager` は位置、速度、加速度、寿命、サイズ、色を持つパーティクルを管理します。`Update` は移動を進め、寿命が尽きたものを削除します。`Render` は時間とともに透明になる四角形を描きます。

既定の上限は **128 個のパーティクル**です。ベクターはその容量を予約し、空きがない場合や寿命が無効な場合、`Emit` は新しいパーティクルを破棄します。この上限は実装上の設定であり、エンジンの最大能力の測定結果ではありません。

シーンがパーティクルの更新と描画のタイミングを決めます。Engine はシーン変更時にそれらを消去します。Runner は移動時の砂ぼこりにこのシステムを利用しています。

`EmitBurst` は `ParticleEmitterConfig` と `RandomManager` を使って粒子を生成します。範囲を検証し、使用可能な容量内に生成数を制限します。

<span id="animación-y-colisiones" aria-hidden="true"></span>

## アニメーションと衝突

`SpriteAnimator` はループまたは一回限りのクリップを進め、通過したフレームを通知し、スプライトシートの矩形を計算します。`AnimationManager` は識別子、グループ、一時停止を管理します。Runner はアニメーターを取得して走行クリップを直接進めます。

`CollisionManager` は軸平行矩形の `Intersect` と `Sweep` を提供します。掃引は接触時刻、法線、初期重なりを返し、Runner と Bounce は一部の衝突に使用します。汎用物理エンジンではありません。

アニメーターは一度作成・設定し、グループを保持して更新ごとに進めます。

```cpp
const AnimationGroup group = 1;
const AnimationHandle handle = ctx.animations.Create(group);
ctx.animations.Configure(handle, {0, 6, 12.f}, SpritePlaybackMode::Loop);
ctx.animations.AdvanceGroup(group, ctx.time.GetDeltaTime());
```

<span id="fuentes" aria-hidden="true"></span>

## 参照ソース

- [RenderManager のパイプライン](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/RenderManager.cpp)。
- [Bloom の実装](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Graphics/Effects/EfflectBloom.cpp)。
- [Monitor シェーダー](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Content/Shaders/Monitor.frag)。
- [パーティクル](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Source/Managers/ParticleManager.cpp)。

- [AnimationManager](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Include/Managers/AnimationManager.h).
- [SpriteAnimator](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Include/Graphics/SpriteAnimator/SpriteAnimator.h).
- [CollisionManager](https://github.com/Arukado01/AwesomeEngine/blob/f0e88edffae35efb3cc208e8eea651d1b559cbaa/Engine/Include/Managers/CollisionManager.h).
