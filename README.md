# TODO 管理ツール

コマンドラインで使えるシンプルな TODO 管理ツールです。

## セットアップ

```bash
git clone https://github.com/bosawa/cc-mcp-test01.git
cd cc-mcp-test01
```

## 使い方

### TODO を追加

```bash
node index.js add "買い物に行く"
node index.js add "レポートを書く"
```

### TODO 一覧を表示

```bash
node index.js list
```

## ファイル構成

```
cc-mcp-test01/
├── index.js        # メインアプリケーション
├── package.json    # プロジェクト設定
├── todos.json      # TODOデータ（自動生成）
└── README.md       # このファイル
```
