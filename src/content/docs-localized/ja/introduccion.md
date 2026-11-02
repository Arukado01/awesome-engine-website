---
title: はじめに
description: Awesome Engine の構成、ソースコードから学べること、各システムの状態の読み方を紹介します。
order: 1
category: はじめに
---

<span id="un-motor-2d-que-puedes-recorrer-por-dentro" aria-hidden="true"></span>

## 内部をたどって学べる 2D エンジン

Awesome Engine は、SFML を基盤とする **C++20** 製のゲームエンジンです。コアはシーンと、描画、リソース、入力、音声、UI、永続化のサービスを結び付けます。リポジトリ内のゲームは、それらのサービスを C++ コードから利用する方法を示しています。

このドキュメントは [コミット `5a6dfac`](https://github.com/Arukado01/AwesomeEngine/tree/5a6dfacd86414c4cdfaa7157b533330f173a3126) を基準としています。そのリビジョンに含まれる機能を説明し、ローカルの作業ツリーだけで確認された変更は **開発中** と明記します。

<span id="lo-que-encontrarás" aria-hidden="true"></span>

## 含まれているもの

- **7 つのゲームシーン：** Bounce、Clicker、MemoryCard、TicTacToe、MineSweeper、Runner、Tetris。
- **2D 描画：** SFML の描画可能オブジェクト、中間テクスチャ、Bloom と Monitor のポストプロセス。
- **アクションベースの入力：** キーボード、マウス、コントローラー。同じアクションに複数の入力を割り当てられます。
- **共有サービス：** リソース、時間、音声、パーティクル、JSON 保存、PNG スクリーンショット。
- **TGUI インターフェース：** ウィンドウイベントと統合されたウィジェットと一時停止オーバーレイ。

これらのシステムは `EngineContext` を介して接続されます。各ゲームは `Scene` インターフェースを実装し、独自のオブジェクトとルールを管理します。対象リビジョンには ECS アーキテクチャやビジュアルエディターはありません。

<span id="el-recorrido-recomendado" aria-hidden="true"></span>

## おすすめの学習順序

1. [プロジェクトを導入してビルドする](/ja/docs/instalacion/)。
2. [実行時の設定を確認する](/ja/docs/configuracion/)。
3. [エンジンのライフサイクルと依存関係をたどる](/ja/docs/arquitectura/)。
4. [シーンの契約を確認する](/ja/docs/escenas/)。
5. [描画](/ja/docs/renderizado/)、[リソース](/ja/docs/recursos/)、[入力と音声](/ja/docs/entrada-audio/)を調べる。

<span id="cómo-interpretar-los-estados" aria-hidden="true"></span>

## 状態表示の意味

| 状態 | このサイトでの意味 |
| --- | --- |
| 実装済み | 基準リビジョンに具体的なコードがあります。すべてのプラットフォームや利用状況で動作が認証されているという意味ではありません。 |
| 開発中 | 基準コミットにまだ含まれていない実装や変更がローカルの作業ツリーにあります。 |
| 実験的 | コードは存在しますが、統合が無効になっているか、説明対象の通常の処理フローに参加していません。 |
| 計画中 | プロジェクトによる明文化された意思が必要です。その根拠なしに機能をこの状態に分類することはありません。 |

`AudioGroup`、`SpriteAnimator`、`SweptAabb`、クールダウン用の共有クロックは、ローカルでの作業として確認されています。基準リビジョンをクローンしても、これらの API は含まれていません。

<span id="alcance-de-la-plataforma" aria-hidden="true"></span>

## プラットフォームの対応範囲

リポジトリには **Windows、MinGW、Ninja、GDB** 向けの作業設定が含まれています。今回の調査では、Linux、macOS、モバイル、ブラウザーでのビルドや実行は確認していません。利用ライブラリの対応範囲だけを根拠に、エンジン全体が対応しているとは判断できません。

エンジンのコードは [MIT ライセンス](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/LICENSE.md)です。履歴の項目名は実際のコミットに対応しており、架空のリリースバージョンではありません。

<span id="fuentes" aria-hidden="true"></span>

## 参照ソース

- [依存関係とビルドオプション](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/CMakeLists.txt)。
- [シーンの登録](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Source/Scene/SceneFactory.cpp)。
- [EngineContext のサービス](https://github.com/Arukado01/AwesomeEngine/blob/5a6dfacd86414c4cdfaa7157b533330f173a3126/Engine/Include/Core/EngineContext.h)。
