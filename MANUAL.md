# TODO 管理ツール — ユーザーマニュアル

## 1. 概要

TODO の追加・一覧表示・削除・統計表示を提供するツールです。
2 つのインターフェースを備えています。

| # | インターフェース | 説明 |
|---|-----------------|------|
| 1 | CLI（コマンドライン） | `npx tsx src/index.ts` で直接操作 |
| 2 | REST API サーバー | Express + Swagger UI による HTTP API |

---

## 2. 動作環境

| 項目 | 要件 |
|------|------|
| Node.js | v18 以上 |
| OS | Windows / macOS / Linux |

---

## 3. セットアップ

### 3.1 リポジトリのクローン

```bash
git clone https://github.com/bosawa/cc-mcp-test01.git
cd cc-mcp-test01
```

### 3.2 依存パッケージのインストール

```bash
npm install
```

---

## 4. CLI コマンド一覧

| # | コマンド | 機能 | 引数 |
|---|---------|------|------|
| 1 | `npm run cli add "内容"` | TODO を追加 | 必須: TODO の内容（文字列） |
| 2 | `npm run cli list` | TODO 一覧を表示 | なし |
| 3 | `npm run cli delete <ID>` | TODO を削除 | 必須: TODO の ID（数値） |
| 4 | `npm run cli stats` | 統計情報を表示 | なし |
| 5 | `npm run cli` | ヘルプを表示 | なし |

### 4.1 実行例

```bash
$ npm run cli add "買い物に行く"
✅ TODO を追加しました: "買い物に行く" (ID: 1)

$ npm run cli list
📋 TODO 一覧:
----------------------------------------
  [1] 買い物に行く  (2026/02/16 17:30)
----------------------------------------
合計: 1 件

$ npm run cli stats
📊 TODO 統計:
  合計: 1 件
  最新: "買い物に行く" (2026/02/16 17:30)

$ npm run cli delete 1
🗑️  TODO を削除しました: "買い物に行く" (ID: 1)
```

---

## 5. REST API サーバー

### 5.1 サーバーの起動

```bash
npm run dev
```

起動後のエンドポイント:

| # | URL | 説明 |
|---|-----|------|
| 1 | http://localhost:3000 | API ルート |
| 2 | http://localhost:3000/docs | Swagger UI（インタラクティブな API ドキュメント） |
| 3 | http://localhost:3000/swagger.json | OpenAPI 3.0 仕様 JSON |

### 5.2 API エンドポイント一覧

| # | メソッド | パス | 説明 | リクエストボディ | レスポンス |
|---|---------|------|------|-----------------|-----------|
| 1 | GET | `/api/todos` | TODO 一覧を取得 | なし | `Todo[]` |
| 2 | POST | `/api/todos` | TODO を追加 | `{ text: string }` | `Todo`（201） |
| 3 | DELETE | `/api/todos/:id` | TODO を削除 | なし | `Todo`（200） |
| 4 | GET | `/api/stats` | 統計情報を取得 | なし | `TodoStats` |

### 5.3 API リクエスト・レスポンス例

#### GET /api/todos — TODO 一覧を取得

```bash
$ curl http://localhost:3000/api/todos
```

```json
[
  {
    "id": 1,
    "text": "買い物に行く",
    "createdAt": "2026-02-16T08:30:00.000Z",
    "createdAtFormatted": "2026/02/16 17:30"
  }
]
```

#### POST /api/todos — TODO を追加

```bash
$ curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"text": "レポートを書く"}'
```

```json
{
  "id": 2,
  "text": "レポートを書く",
  "createdAt": "2026-02-16T08:31:00.000Z",
  "createdAtFormatted": "2026/02/16 17:31"
}
```

エラー時（text 未指定）:

```json
{ "error": "text は必須です" }
```

#### DELETE /api/todos/:id — TODO を削除

```bash
$ curl -X DELETE http://localhost:3000/api/todos/1
```

```json
{
  "id": 1,
  "text": "買い物に行く",
  "createdAt": "2026-02-16T08:30:00.000Z"
}
```

エラー時（存在しない ID）:

```json
{ "error": "ID: 99 の TODO は見つかりません" }
```

#### GET /api/stats — 統計情報を取得

```bash
$ curl http://localhost:3000/api/stats
```

```json
{
  "count": 2,
  "latest": {
    "id": 2,
    "text": "レポートを書く",
    "createdAt": "2026-02-16T08:31:00.000Z",
    "createdAtFormatted": "2026/02/16 17:31"
  }
}
```

### 5.4 CORS 設定

API サーバーは全オリジンからのアクセスを許可しています（`Access-Control-Allow-Origin: *`）。
cc-mcp-test02 などの別オリジンのフロントエンドから利用できます。

### 5.5 OpenAPI スキーマ定義

API 仕様は `src/server.ts` 内の `@openapi` JSDoc アノテーションで定義されています。
`swagger-jsdoc` がこのアノテーションから OpenAPI 3.0 仕様を自動生成し、以下で公開しています:

- Swagger UI: http://localhost:3000/docs
- JSON: http://localhost:3000/swagger.json

外部プロジェクトはこの JSON を取得し、`openapi-typescript-codegen` 等で型付き API クライアントを自動生成できます。

---

## 6. 型定義

### 6.1 Todo

```typescript
interface Todo {
  id: number;        // TODO の識別番号（自動採番）
  text: string;      // TODO の内容
  createdAt: string;  // 作成日時（ISO 8601 形式）
}
```

### 6.2 TodoStats

```typescript
interface TodoStats {
  count: number;       // TODO の合計件数
  latest: Todo | null;  // 最も新しい TODO（0 件の場合は null）
}
```

### 6.3 API レスポンスの拡張フィールド

REST API のレスポンスでは、上記に加えて `createdAtFormatted`（表示用の日時文字列、例: `2026/02/16 17:30`）が付与されます。

---

## 7. データファイル

### 7.1 todos.json

TODO データは `todos.json` に JSON 形式で保存されます。

**ファイルの場所**: プロジェクトルート

**データ構造**:

```json
[
  {
    "id": 1,
    "text": "買い物に行く",
    "createdAt": "2026-02-16T08:30:00.000Z"
  }
]
```

**注意事項**:
- 初回の TODO 追加時に自動生成されます
- `.gitignore` で Git 管理対象外にしています

---

## 8. ファイル構成

```
cc-mcp-test01/
├── src/
│   ├── server.ts       # REST API サーバー（Express + Swagger）
│   ├── index.ts        # CLI エントリポイント
│   ├── service.ts      # ビジネスロジック（TodoService）
│   ├── repository.ts   # データアクセス層（TodoRepository）
│   ├── utils.ts        # ユーティリティ関数
│   └── types.ts        # 型定義
├── tests/
│   ├── service.test.ts # TodoService のテスト（10 件）
│   └── utils.test.ts   # formatDate のテスト（3 件）
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── todos.json          # データファイル（自動生成・Git 管理外）
```

### 8.1 各ファイルの役割

| # | ファイル | レイヤー | 役割 |
|---|---------|---------|------|
| 1 | `src/server.ts` | エントリポイント | REST API サーバー。Express ルーティング・Swagger 定義・CORS |
| 2 | `src/index.ts` | エントリポイント | CLI。コマンドライン引数の解析と振り分け |
| 3 | `src/service.ts` | ビジネスロジック | TodoService クラス。純粋関数による TODO 操作 |
| 4 | `src/repository.ts` | データアクセス | TodoRepository クラス。todos.json の読み書き |
| 5 | `src/utils.ts` | ユーティリティ | formatDate 関数。日付フォーマット変換 |
| 6 | `src/types.ts` | 型定義 | Todo, TodoStats インターフェース |

---

## 9. サービス層リファレンス

### 9.1 TodoService（src/service.ts）

ビジネスロジックを担当するクラスです。**純粋関数**として実装されており、副作用（ファイル I/O）を持ちません。

| # | メソッド | 引数 | 戻り値 | 説明 |
|---|---------|------|--------|------|
| 1 | `add(todos, text)` | `todos: Todo[]`, `text: string` | `{ todos: Todo[], added: Todo }` | 新しい TODO を作成し、追加後の配列と追加された TODO を返す |
| 2 | `delete(todos, id)` | `todos: Todo[]`, `id: number` | `{ todos: Todo[], removed: Todo }` or `{ error: string }` | 指定 ID の TODO を削除。見つからない場合はエラーを返す |
| 3 | `getStats(todos)` | `todos: Todo[]` | `TodoStats` | TODO の件数と最新の TODO を返す |

#### add の動作詳細

- ID は `Math.max(...既存ID) + 1` で採番（削除後も ID が衝突しない）
- 元の配列は変更せず、新しい配列を返す（イミュータブル）

```typescript
const result = service.add([{ id: 1, text: "既存", createdAt: "..." }], "新規");
// result.todos → [{ id: 1, ... }, { id: 2, text: "新規", ... }]
// result.added → { id: 2, text: "新規", createdAt: "..." }
```

#### delete の動作詳細

- 成功時: 削除後の配列と削除された TODO を返す
- 失敗時: `{ error: string }` を返す（例外ではなく戻り値でエラーを表現）

```typescript
const result = service.delete(todos, 1);
if ("error" in result) {
  // ID が見つからなかった場合
} else {
  // result.todos → 削除後の配列
  // result.removed → 削除された TODO
}
```

#### getStats の動作詳細

- `createdAt` の降順ソートで最新の TODO を特定
- 0 件の場合は `{ count: 0, latest: null }` を返す

```typescript
const stats = service.getStats(todos);
// stats.count → 2
// stats.latest → { id: 2, text: "最新のTODO", ... }
```

### 9.2 TodoRepository（src/repository.ts）

データの永続化を担当するクラスです。

| # | メソッド | 引数 | 戻り値 | 説明 |
|---|---------|------|--------|------|
| 1 | `constructor(dataFile?)` | `dataFile?: string` | — | データファイルのパスを指定。省略時は `todos.json` |
| 2 | `loadAll()` | なし | `Todo[]` | 全 TODO を読み込む。ファイルがなければ空配列 |
| 3 | `saveAll(todos)` | `todos: Todo[]` | `void` | 全 TODO を JSON 形式で保存 |

### 9.3 formatDate（src/utils.ts）

| # | 関数 | 引数 | 戻り値 | 説明 |
|---|------|------|--------|------|
| 1 | `formatDate(isoString)` | `isoString: string` | `string` | ISO 8601 日付を `YYYY/MM/DD HH:mm` 形式に変換 |

```
入力: "2026-02-16T08:30:00.000Z"
出力: "2026/02/16 17:30"（ローカルタイムゾーンに変換）
```

---

## 10. テスト

### 10.1 テストの実行

```bash
npm test
```

### 10.2 テスト一覧

| # | ファイル | テスト数 | 対象 |
|---|---------|---------|------|
| 1 | `tests/service.test.ts` | 10 | TodoService の add / delete / getStats |
| 2 | `tests/utils.test.ts` | 3 | formatDate |
