# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TypeScript 製の TODO 管理ツール。CLI と REST API（Express + Swagger）の 2 つのインターフェースを提供する。

## Commands

```bash
# 開発サーバー起動（Swagger UI: http://localhost:3000/docs）
npm run dev

# CLI ツール
npm run cli -- add "TODO内容"
npm run cli -- list
npm run cli -- delete <ID>
npm run cli -- stats

# テスト
npm test              # 全テスト実行
npm run test:watch    # ウォッチモード

# ビルド
npm run build         # TypeScript → JavaScript (dist/)
```

## Architecture

TypeScript + ESModules で 4 層構造：

- **`src/types.ts`**: 型定義（`Todo`, `TodoStats`）
- **`src/service.ts`**: ビジネスロジック（`TodoService` クラス）— 純粋関数、副作用なし
- **`src/repository.ts`**: データアクセス（`TodoRepository` クラス）— `todos.json` の読み書き
- **`src/utils.ts`**: ユーティリティ（`formatDate`）
- **`src/server.ts`**: Express REST API + Swagger UI（`/docs`）
- **`src/index.ts`**: CLI エントリポイント

データフローは上位→下位のみ: server/index → service → repository。service は repository に依存しない（引数で受け取る）。

## Test

- テストフレームワーク: Vitest
- テストファイル: `tests/` ディレクトリに配置
- `service.test.ts`: ビジネスロジックのユニットテスト
- `utils.test.ts`: ユーティリティのユニットテスト

## API Endpoints

| Method | Path | 機能 |
|--------|------|------|
| GET | `/api/todos` | TODO 一覧取得 |
| POST | `/api/todos` | TODO 追加 |
| DELETE | `/api/todos/:id` | TODO 削除 |
| GET | `/api/stats` | 統計情報取得 |
| GET | `/docs` | Swagger UI |
| GET | `/swagger.json` | OpenAPI スキーマ |

## Data Format

`todos.json`（自動生成、gitignored）:
```json
[{ "id": 1, "text": "...", "createdAt": "ISO8601" }]
```

ID は `Math.max(...ids) + 1` で採番。削除後も ID は再利用しない。

## Conventions

- **言語**: TypeScript を使用する
- **コミュニケーション**: 日本語で行う（コミットメッセージ、コメント、ドキュメント）
- **可読性**: 関数は単一責務とし、明確な型定義を付ける
- **テスト可能性**: ビジネスロジックは副作用（ファイルI/O、console.log）から分離し、純粋関数として切り出す
- **モジュール形式**: ESModules（`"type": "module"`）

## Documentation

- `ARCHITECTURE.md`: 関数の依存関係図（Mermaid 形式）
- `MANUAL.md`: ユーザーマニュアル（コマンドリファレンス・関数 API）
- `PLAN.md`: 開発計画書・実行ログ
