# 技術ドキュメント — 関数の依存関係

## 1. 概要

本ドキュメントでは `index.js` および `utils.js` における関数の依存関係を定義します。

---

## 2. モジュール依存関係

`index.js` が依存しているモジュールの一覧です。

| # | モジュール | 種別 | 参照方法 | 用途 |
|---|----------|------|---------|------|
| 1 | `fs` | Node.js 標準 | `require("fs")` | ファイルの読み書き |
| 2 | `path` | Node.js 標準 | `require("path")` | ファイルパスの組み立て |
| 3 | `utils.js` | プロジェクト内 | `require("./utils")` | 日付フォーマット・統計処理 |

### 2.1 `utils.js` からのインポート

```javascript
const { formatDate, getStats } = require("./utils");
```

| # | 関数名 | 利用元 |
|---|--------|-------|
| 1 | `formatDate` | `listTodos()`, メイン処理 (`stats`) |
| 2 | `getStats` | メイン処理 (`stats`) |

---

## 3. 関数一覧

### 3.1 index.js の関数

| # | 関数名 | 定義行 | レイヤー | 役割 |
|---|--------|--------|---------|------|
| 1 | `loadTodos()` | L8-14 | データアクセス | TODO データの読み込み |
| 2 | `saveTodos(todos)` | L17-19 | データアクセス | TODO データの保存 |
| 3 | `addTodo(text)` | L22-32 | ビジネスロジック | TODO の追加 |
| 4 | `listTodos()` | L35-48 | ビジネスロジック | TODO の一覧表示 |
| 5 | `deleteTodo(id)` | L51-61 | ビジネスロジック | TODO の削除 |
| — | メイン処理 (switch) | L63-104 | エントリポイント | コマンド解析と関数呼び出し |

### 3.2 utils.js の関数

| # | 関数名 | 定義行 | レイヤー | 役割 |
|---|--------|--------|---------|------|
| 1 | `formatDate(isoString)` | L2-10 | ユーティリティ | ISO 日付を表示用に変換 |
| 2 | `getStats(todos)` | L13-24 | ユーティリティ | TODO の統計情報を算出 |

---

## 4. 関数間の依存関係

### 4.1 依存関係マトリクス

行の関数が、列の関数を **呼び出している** ことを示します。

| 呼び出し元 ＼ 呼び出し先 | loadTodos | saveTodos | formatDate | getStats |
|--------------------------|:---------:|:---------:|:----------:|:--------:|
| **addTodo** | ○ | ○ | | |
| **listTodos** | ○ | | ○ | |
| **deleteTodo** | ○ | ○ | | |
| **メイン処理 (stats)** | ○ | | ○ | ○ |

### 4.2 関数呼び出しの依存関係図

```mermaid
graph TD
    subgraph "レイヤー1: エントリポイント"
        MAIN["メイン処理 switch文<br/>L63-104"]
    end

    subgraph "レイヤー2: ビジネスロジック"
        ADD["addTodo(text)<br/>L22-32"]
        LIST["listTodos()<br/>L35-48"]
        DEL["deleteTodo(id)<br/>L51-61"]
        STATS["stats ケース<br/>L85-93"]
    end

    subgraph "レイヤー3: ユーティリティ (utils.js)"
        FMT["formatDate(isoString)<br/>L2-10"]
        GST["getStats(todos)<br/>L13-24"]
    end

    subgraph "レイヤー4: データアクセス"
        LOAD["loadTodos()<br/>L8-14"]
        SAVE["saveTodos(todos)<br/>L17-19"]
    end

    subgraph "外部リソース"
        FILE["todos.json"]
    end

    MAIN -->|"case add"| ADD
    MAIN -->|"case list"| LIST
    MAIN -->|"case delete"| DEL
    MAIN -->|"case stats"| STATS

    ADD --> LOAD
    ADD --> SAVE
    LIST --> LOAD
    LIST --> FMT
    DEL --> LOAD
    DEL --> SAVE
    STATS --> LOAD
    STATS --> GST
    STATS --> FMT

    LOAD --> FILE
    SAVE --> FILE
```

### 4.3 各関数の依存詳細

#### addTodo(text)

```mermaid
graph LR
    A["addTodo(text)"] --> B["loadTodos() L23"]
    A --> C["saveTodos(todos) L29"]
```

| # | 呼び出し先 | 呼び出し箇所 | 目的 |
|---|-----------|-------------|------|
| 1 | `loadTodos()` | L23 | 既存の TODO 配列を取得 |
| 2 | `saveTodos(todos)` | L29 | TODO 追加後の配列を保存 |

#### listTodos()

```mermaid
graph LR
    A["listTodos()"] --> B["loadTodos() L36"]
    A --> C["formatDate() L44"]
```

| # | 呼び出し先 | 呼び出し箇所 | 目的 |
|---|-----------|-------------|------|
| 1 | `loadTodos()` | L36 | 表示する TODO 配列を取得 |
| 2 | `formatDate()` | L44 | `createdAt` を `YYYY/MM/DD HH:mm` に変換 |

#### deleteTodo(id)

```mermaid
graph LR
    A["deleteTodo(id)"] --> B["loadTodos() L52"]
    A --> C["saveTodos(todos) L59"]
```

| # | 呼び出し先 | 呼び出し箇所 | 目的 |
|---|-----------|-------------|------|
| 1 | `loadTodos()` | L52 | 削除対象を検索するための配列を取得 |
| 2 | `saveTodos(todos)` | L59 | 削除後の配列を保存 |

#### メイン処理 stats ケース (L85-93)

```mermaid
graph LR
    A["stats ケース"] --> B["loadTodos() L86"]
    A --> C["getStats(todos) L87"]
    A --> D["formatDate() L91"]
```

| # | 呼び出し先 | 呼び出し箇所 | 目的 |
|---|-----------|-------------|------|
| 1 | `loadTodos()` | L86 | 統計算出用の配列を取得 |
| 2 | `getStats(todos)` | L87 | 件数と最新 TODO を算出 |
| 3 | `formatDate()` | L91 | 最新 TODO の日時を表示用に変換 |

---

## 5. レイヤー構造

関数は 4 つのレイヤーに分類されます。上位レイヤーは下位レイヤーに依存しますが、下位から上位への依存はありません。

```mermaid
block-beta
    columns 1
    block:L1["レイヤー1: エントリポイント"]
        MAIN["メイン処理 (switch文)<br/>コマンドライン引数の解析と振り分け"]
    end
    block:L2["レイヤー2: ビジネスロジック"]
        ADD["addTodo"] LIST["listTodos"] DEL["deleteTodo"]
    end
    block:L3["レイヤー3: ユーティリティ (utils.js)"]
        FMT["formatDate"] GST["getStats"]
    end
    block:L4["レイヤー4: データアクセス"]
        LOAD["loadTodos"] SAVE["saveTodos"]
    end

    L1 --> L2
    L2 --> L3
    L2 --> L4
    L1 --> L3
    L1 --> L4
```

### 5.1 レイヤー間の依存ルール

| # | ルール | 説明 |
|---|--------|------|
| 1 | 上位 → 下位のみ | レイヤー 1 は 2, 3, 4 を呼べる。逆方向の依存はない |
| 2 | 同一レイヤー間の依存なし | 例: `addTodo` は `listTodos` を呼ばない |
| 3 | レイヤー 3 と 4 は独立 | `formatDate` は `loadTodos` を呼ばない。逆も同様 |

---

## 6. 定数・グローバル変数

| # | 名前 | 定義行 | 型 | 値 | 依存先 |
|---|------|--------|-----|-----|--------|
| 1 | `DATA_FILE` | L5 | string | `<__dirname>/todos.json` | `path.join`, `__dirname` |
| 2 | `command` | L64 | string | `process.argv[2]` | `process.argv` |
| 3 | `argument` | L65 | string | `process.argv[3]` | `process.argv` |

`DATA_FILE` は `loadTodos()` と `saveTodos()` の両方から参照されるモジュールレベルの定数です。
