# 技術ドキュメント — アーキテクチャと依存関係

## 1. 概要

本ドキュメントでは cc-mcp-test01 のアーキテクチャ、モジュール構成、関数間の依存関係を定義します。

---

## 2. レイヤー構造

アプリケーションは 4 つのレイヤーで構成されています。上位レイヤーは下位レイヤーに依存しますが、逆方向の依存はありません。

```mermaid
block-beta
    columns 1
    block:L1["レイヤー1: エントリポイント"]
        SRV["server.ts\nREST API サーバー"] IDX["index.ts\nCLI"]
    end
    block:L2["レイヤー2: ビジネスロジック"]
        SVC["service.ts\nTodoService"]
    end
    block:L3["レイヤー3: ユーティリティ"]
        UTL["utils.ts\nformatDate"]
    end
    block:L4["レイヤー4: データアクセス"]
        REP["repository.ts\nTodoRepository"]
    end

    L1 --> L2
    L1 --> L3
    L2 --> L4
    L1 --> L4
```

### 2.1 レイヤー間の依存ルール

| # | ルール | 説明 |
|---|--------|------|
| 1 | 上位 → 下位のみ | レイヤー 1 は 2, 3, 4 を呼べる。逆方向の依存はない |
| 2 | 同一レイヤー間の依存なし | server.ts と index.ts は互いに依存しない |
| 3 | ビジネスロジックは副作用を持たない | TodoService は純粋関数。I/O はレイヤー 1 で行う |

---

## 3. モジュール依存関係

### 3.1 各モジュールのインポート一覧

| # | モジュール | インポート先 | 種別 |
|---|----------|-------------|------|
| 1 | `server.ts` | `repository.ts`, `service.ts`, `utils.ts` | プロジェクト内 |
| 2 | `server.ts` | `express`, `swagger-jsdoc`, `swagger-ui-express` | 外部パッケージ |
| 3 | `index.ts` | `repository.ts`, `service.ts`, `utils.ts` | プロジェクト内 |
| 4 | `service.ts` | `types.ts` | プロジェクト内（型のみ） |
| 5 | `repository.ts` | `types.ts` | プロジェクト内（型のみ） |
| 6 | `repository.ts` | `fs`, `path` | Node.js 標準 |
| 7 | `utils.ts` | なし | 依存なし |
| 8 | `types.ts` | なし | 依存なし |

### 3.2 モジュール依存関係図

```mermaid
graph TD
    subgraph "レイヤー1: エントリポイント"
        SRV["server.ts<br/>REST API サーバー"]
        IDX["index.ts<br/>CLI"]
    end

    subgraph "レイヤー2: ビジネスロジック"
        SVC["service.ts<br/>TodoService"]
    end

    subgraph "レイヤー3: ユーティリティ"
        UTL["utils.ts<br/>formatDate"]
    end

    subgraph "レイヤー4: データアクセス"
        REP["repository.ts<br/>TodoRepository"]
    end

    subgraph "型定義"
        TYP["types.ts<br/>Todo, TodoStats"]
    end

    subgraph "外部パッケージ"
        EXP["express"]
        SWJ["swagger-jsdoc"]
        SWU["swagger-ui-express"]
    end

    subgraph "外部リソース"
        FILE["todos.json"]
    end

    SRV --> SVC
    SRV --> UTL
    SRV --> REP
    SRV --> EXP
    SRV --> SWJ
    SRV --> SWU

    IDX --> SVC
    IDX --> UTL
    IDX --> REP

    SVC --> TYP
    REP --> TYP
    REP --> FILE
```

---

## 4. server.ts — REST API サーバーの構造

### 4.1 処理フロー

```mermaid
graph TD
    REQ["HTTP リクエスト"] --> CORS["CORS ミドルウェア"]
    CORS --> ROUTE{"ルーティング"}

    ROUTE -->|"GET /api/todos"| GET_TODOS
    ROUTE -->|"POST /api/todos"| POST_TODO
    ROUTE -->|"DELETE /api/todos/:id"| DEL_TODO
    ROUTE -->|"GET /api/stats"| GET_STATS
    ROUTE -->|"GET /docs"| SWAGGER["Swagger UI"]
    ROUTE -->|"GET /swagger.json"| SPEC["OpenAPI JSON"]

    subgraph "GET /api/todos"
        GET_TODOS["repository.loadAll()"] --> FMT1["formatDate() で変換"] --> RES1["JSON レスポンス"]
    end

    subgraph "POST /api/todos"
        POST_TODO["バリデーション"] -->|OK| ADD["service.add()"]
        POST_TODO -->|NG| ERR1["400 エラー"]
        ADD --> SAVE1["repository.saveAll()"]
        SAVE1 --> FMT2["formatDate() で変換"]
        FMT2 --> RES2["201 レスポンス"]
    end

    subgraph "DELETE /api/todos/:id"
        DEL_TODO["service.delete()"] -->|成功| SAVE2["repository.saveAll()"]
        DEL_TODO -->|失敗| ERR2["404 エラー"]
        SAVE2 --> RES3["JSON レスポンス"]
    end

    subgraph "GET /api/stats"
        GET_STATS["repository.loadAll()"] --> STATS["service.getStats()"]
        STATS --> FMT3["formatDate() で変換"]
        FMT3 --> RES4["JSON レスポンス"]
    end
```

### 4.2 各エンドポイントの依存関係

| # | エンドポイント | TodoRepository | TodoService | formatDate |
|---|---------------|:--------------:|:-----------:|:----------:|
| 1 | GET /api/todos | loadAll | — | ○ |
| 2 | POST /api/todos | loadAll, saveAll | add | ○ |
| 3 | DELETE /api/todos/:id | loadAll, saveAll | delete | — |
| 4 | GET /api/stats | loadAll | getStats | ○ |

### 4.3 OpenAPI スキーマ生成フロー

```mermaid
graph LR
    ANN["@openapi アノテーション<br/>（server.ts 内の JSDoc）"] --> JSDOC["swagger-jsdoc"]
    DEF["スキーマ定義<br/>（components/schemas）"] --> JSDOC
    JSDOC --> SPEC["OpenAPI 3.0 JSON"]
    SPEC --> UI["Swagger UI<br/>/docs"]
    SPEC --> JSON["/swagger.json"]
    JSON --> CODEGEN["openapi-typescript-codegen<br/>（cc-mcp-test02）"]
    CODEGEN --> CLIENT["型付き API クライアント"]
```

---

## 5. index.ts — CLI の構造

### 5.1 処理フロー

```mermaid
graph TD
    ARGV["process.argv"] --> SW{"switch (command)"}

    SW -->|"add"| CMD_ADD
    SW -->|"list"| CMD_LIST
    SW -->|"delete"| CMD_DEL
    SW -->|"stats"| CMD_STATS
    SW -->|"default"| HELP["ヘルプ表示"]

    subgraph "add"
        CMD_ADD["repository.loadAll()"] --> ADD["service.add(todos, text)"]
        ADD --> SAVE_A["repository.saveAll()"]
    end

    subgraph "list"
        CMD_LIST["repository.loadAll()"] --> FMT_L["formatDate() で表示"]
    end

    subgraph "delete"
        CMD_DEL["repository.loadAll()"] --> DEL["service.delete(todos, id)"]
        DEL --> SAVE_D["repository.saveAll()"]
    end

    subgraph "stats"
        CMD_STATS["repository.loadAll()"] --> STAT["service.getStats(todos)"]
        STAT --> FMT_S["formatDate() で表示"]
    end
```

---

## 6. TodoService — ビジネスロジック詳細

### 6.1 メソッド一覧

| # | メソッド | 入力 | 出力 | 副作用 |
|---|---------|------|------|--------|
| 1 | `add(todos, text)` | 既存配列 + テキスト | 新配列 + 追加されたTODO | なし |
| 2 | `delete(todos, id)` | 既存配列 + ID | 新配列 + 削除されたTODO / エラー | なし |
| 3 | `getStats(todos)` | 既存配列 | 件数 + 最新TODO | なし |

### 6.2 設計方針

```mermaid
graph LR
    subgraph "純粋関数（TodoService）"
        IN["入力: Todo[]"] --> LOGIC["ビジネスロジック"]
        LOGIC --> OUT["出力: 新しい Todo[]"]
    end

    subgraph "副作用（エントリポイント）"
        READ["repository.loadAll()"] --> IN
        OUT --> WRITE["repository.saveAll()"]
    end
```

- **イミュータブル**: 元の配列を変更せず、常に新しい配列を返す
- **副作用の分離**: ファイル I/O はエントリポイント（server.ts / index.ts）が担当
- **エラー表現**: 例外ではなく戻り値の型で表現（`{ error: string }` の union 型）

### 6.3 ID 採番ロジック

```mermaid
graph LR
    IDS["既存 ID の配列<br/>[1, 3, 5]"] --> MAX["Math.max() → 5"]
    MAX --> NEXT["5 + 1 → 6"]
    EMPTY["空配列 []"] --> ONE["デフォルト → 1"]
```

削除後に ID の隙間ができても、最大値 + 1 で採番するため衝突しません。

---

## 7. TodoRepository — データアクセス詳細

### 7.1 データフロー

```mermaid
graph LR
    LOAD["loadAll()"] -->|読み込み| FILE["todos.json"]
    FILE -->|書き込み| SAVE["saveAll()"]

    LOAD -->|ファイルなし| EMPTY["空配列 []"]
    LOAD -->|ファイルあり| PARSE["JSON.parse()"]
```

### 7.2 テスタビリティ

コンストラクタで `dataFile` パスを注入可能です。テスト時に一時ファイルを指定することで、本番データに影響を与えずにテストできます。

```typescript
// 本番
const repo = new TodoRepository(); // → todos.json

// テスト
const repo = new TodoRepository("/tmp/test-todos.json");
```

---

## 8. クロスプロジェクト連携（cc-mcp-test02）

### 8.1 全体構成

```mermaid
graph LR
    subgraph "cc-mcp-test01（API サーバー）"
        SRV2["server.ts"] --> SPEC2["/swagger.json"]
        SRV2 --> API["REST API<br/>/api/todos, /api/stats"]
    end

    subgraph "cc-mcp-test02（Web UI）"
        SPEC2 -->|"openapi-typescript-codegen"| GEN["src/generated/<br/>型付きクライアント"]
        GEN --> APP["App.tsx"]
        APP -->|"HTTP リクエスト"| API
    end
```

### 8.2 スキーマ駆動開発フロー

```mermaid
graph TD
    A["1. server.ts に @openapi アノテーションを記述"] --> B["2. swagger-jsdoc が OpenAPI JSON を生成"]
    B --> C["3. /swagger.json からスキーマをダウンロード"]
    C --> D["4. openapi-typescript-codegen でクライアント生成"]
    D --> E["5. 型安全な API 呼び出し"]

    style A fill:#e1f5fe
    style E fill:#e8f5e9
```

| # | ステップ | 担当 | 成果物 |
|---|---------|------|--------|
| 1 | API 仕様定義 | cc-mcp-test01 | `@openapi` JSDoc アノテーション |
| 2 | スキーマ生成 | swagger-jsdoc | OpenAPI 3.0 JSON |
| 3 | スキーマ取得 | 手動 / CI | `swagger.json` ファイル |
| 4 | クライアント生成 | openapi-typescript-codegen | `src/generated/` |
| 5 | API 呼び出し | cc-mcp-test02 | 型安全な HTTP 通信 |
