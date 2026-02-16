# TODO 管理ツール — ユーザーマニュアル

## 1. 概要

コマンドラインで動作するシンプルな TODO 管理ツールです。
TODO の追加・一覧表示・削除・統計表示ができます。

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

### 3.2 依存パッケージ

外部パッケージは不要です。Node.js の標準モジュール（`fs`, `path`）のみ使用しています。

---

## 4. コマンド一覧

| # | コマンド | 機能 | 引数 |
|---|---------|------|------|
| 1 | `node index.js add "内容"` | TODO を追加 | 必須: TODO の内容（文字列） |
| 2 | `node index.js list` | TODO 一覧を表示 | なし |
| 3 | `node index.js delete <ID>` | TODO を削除 | 必須: TODO の ID（数値） |
| 4 | `node index.js stats` | 統計情報を表示 | なし |
| 5 | `node index.js` | ヘルプを表示 | なし |

---

## 5. コマンド詳細

### 5.1 add — TODO を追加

**書式**:
```bash
node index.js add "TODOの内容"
```

**動作**:
- 新しい TODO を作成し、`todos.json` に保存します
- ID は自動採番されます（現在の件数 + 1）
- 作成日時（`createdAt`）が自動記録されます

**実行例**:
```bash
$ node index.js add "買い物に行く"
✅ TODO を追加しました: "買い物に行く" (ID: 1)

$ node index.js add "レポートを書く"
✅ TODO を追加しました: "レポートを書く" (ID: 2)
```

**エラー時**:
```bash
$ node index.js add
⚠️  使い方: node index.js add "TODOの内容"
```
内容を指定せずに実行すると、使い方を表示して終了します（終了コード: 1）。

---

### 5.2 list — TODO 一覧を表示

**書式**:
```bash
node index.js list
```

**動作**:
- 保存されているすべての TODO を一覧表示します
- 各 TODO の ID・内容・作成日時が表示されます
- 合計件数も表示されます

**実行例**:
```bash
$ node index.js list
📋 TODO 一覧:
----------------------------------------
  [1] 買い物に行く  (2026/02/16 17:30)
  [2] レポートを書く  (2026/02/16 17:31)
----------------------------------------
合計: 2 件
```

**TODO が 0 件の場合**:
```bash
$ node index.js list
📋 TODO はまだありません。
```

---

### 5.3 delete — TODO を削除

**書式**:
```bash
node index.js delete <ID>
```

**動作**:
- 指定した ID の TODO を `todos.json` から削除します
- 削除された TODO の内容が表示されます

**実行例**:
```bash
$ node index.js delete 1
🗑️  TODO を削除しました: "買い物に行く" (ID: 1)
```

**エラー時（ID 未指定）**:
```bash
$ node index.js delete
⚠️  使い方: node index.js delete <ID>
```

**エラー時（存在しない ID）**:
```bash
$ node index.js delete 99
⚠️  ID: 99 の TODO は見つかりません。
```

---

### 5.4 stats — 統計情報を表示

**書式**:
```bash
node index.js stats
```

**動作**:
- TODO の合計件数を表示します
- 最も新しく追加された TODO の内容と日時を表示します

**実行例**:
```bash
$ node index.js stats
📊 TODO 統計:
  合計: 2 件
  最新: "レポートを書く" (2026/02/16 17:31)
```

---

### 5.5 ヘルプ表示

**書式**:
```bash
node index.js
```

**動作**:
- 引数なし、または不明なコマンドを指定した場合、使い方を表示します

**実行例**:
```bash
$ node index.js
📝 TODO 管理ツール

使い方:
  node index.js add "TODOの内容"  - TODO を追加
  node index.js list              - TODO 一覧を表示
  node index.js delete <ID>       - TODO を削除
  node index.js stats             - 統計情報を表示
```

---

## 6. データファイル

### 6.1 todos.json

TODO データは `todos.json` に JSON 形式で保存されます。

**ファイルの場所**: `index.js` と同じディレクトリ

**データ構造**:
```json
[
  {
    "id": 1,
    "text": "買い物に行く",
    "createdAt": "2026-02-16T08:30:00.000Z"
  },
  {
    "id": 2,
    "text": "レポートを書く",
    "createdAt": "2026-02-16T08:31:00.000Z"
  }
]
```

**各フィールドの説明**:

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `id` | number | TODO の識別番号（自動採番） |
| `text` | string | TODO の内容 |
| `createdAt` | string | 作成日時（ISO 8601 形式） |

**注意事項**:
- `todos.json` は初回の `add` 実行時に自動生成されます
- 手動で編集することも可能ですが、JSON 形式を壊さないよう注意してください
- `.gitignore` で Git 管理対象外にしています

---

## 7. ファイル構成

```
cc-mcp-test01/
├── .gitignore       # Git 除外設定
├── MANUAL.md        # ユーザーマニュアル（このファイル）
├── PLAN.md          # 開発計画書
├── README.md        # プロジェクト概要
├── package.json     # Node.js プロジェクト設定
├── index.js         # メインアプリケーション
├── utils.js         # ユーティリティ関数
└── todos.json       # TODOデータ（自動生成・Git管理外）
```

### 7.1 各ファイルの役割

| # | ファイル | 役割 |
|---|---------|------|
| 1 | `index.js` | メインアプリケーション。コマンド解析と TODO 操作を担当 |
| 2 | `utils.js` | ユーティリティ関数。日付フォーマットと統計処理を担当 |
| 3 | `package.json` | Node.js プロジェクトの設定（名前・バージョン等） |
| 4 | `todos.json` | TODO データの永続化ファイル（自動生成） |

---

## 8. 内部関数リファレンス

### 8.1 index.js の関数

| # | 関数名 | 引数 | 戻り値 | 説明 |
|---|--------|------|--------|------|
| 1 | `loadTodos()` | なし | `Array` | `todos.json` から TODO 配列を読み込む。ファイルが存在しない場合は空配列を返す |
| 2 | `saveTodos(todos)` | `todos`: Array | なし | TODO 配列を `todos.json` に JSON 形式で保存する |
| 3 | `addTodo(text)` | `text`: string | なし | 新しい TODO を作成して保存する |
| 4 | `listTodos()` | なし | なし | 全 TODO を一覧表示する |
| 5 | `deleteTodo(id)` | `id`: string | なし | 指定 ID の TODO を削除する |

### 8.2 utils.js の関数

| # | 関数名 | 引数 | 戻り値 | 説明 |
|---|--------|------|--------|------|
| 1 | `formatDate(isoString)` | `isoString`: string（ISO 8601） | `string`（`YYYY/MM/DD HH:mm`） | ISO 日付を読みやすい形式に変換する |
| 2 | `getStats(todos)` | `todos`: Array | `{ count, latest }` | TODO の件数と最新の TODO を返す |

#### formatDate の入出力例

```
入力: "2026-02-16T08:30:00.000Z"
出力: "2026/02/16 17:30"（日本時間に変換）
```

#### getStats の入出力例

```javascript
// TODO が存在する場合
入力: [{ id: 1, text: "買い物", createdAt: "2026-02-16T08:30:00.000Z" }]
出力: { count: 1, latest: { id: 1, text: "買い物", createdAt: "..." } }

// TODO が 0 件の場合
入力: []
出力: { count: 0, latest: null }
```
