# GitHub ゼロベース体験 — 全体計画書

## 概要

空のディレクトリから GitHub リポジトリの作成・コード開発・更新・参照までを
一通り体験するハンズオンです。

---

## 前提条件

| 項目 | 必要なもの |
|------|-----------|
| Git | インストール済みであること |
| GitHub CLI (`gh`) | インストール済み & `gh auth login` 済みであること |
| Node.js | インストール済みであること |
| GitHub アカウント | 作成済みであること |

---

## ステップ一覧

| Step | タイトル | 概要 | 状態 |
|------|---------|------|------|
| 0 | 環境確認 | 必要なツールが使えるか確認 | ✅ 完了 |
| 1 | Git 初期化 | ローカルリポジトリを作成 | ✅ 完了 |
| 2 | サンプルコード作成 | Node.js の簡単なアプリを作成 | ✅ 完了 |
| 3 | 初回コミット | コードを Git に記録 | ✅ 完了 |
| 4 | GitHub リポジトリ作成 & プッシュ | リモートリポジトリを作成して公開 | ✅ 完了 |
| 5 | コード更新 | 機能を追加してコミット & プッシュ | ✅ 完了 |
| 6 | リポジトリ参照 & コード追加 | GitHub 上の情報を参照して追加開発 | ✅ 完了 |
| 7 | 確認 & クリーンアップ | 最終確認と振り返り | 未着手 |

---

## 各ステップの詳細

### Step 0: 環境確認 ✅

**目的**: 必要なツールがすべて使える状態か確認する

| # | 作業 | コマンド | 結果 |
|---|------|---------|------|
| 1 | Git のバージョン確認 | `git --version` | v2.45.1 ✅ |
| 2 | GitHub CLI のインストール | `winget install --id GitHub.cli` | v2.86.0 インストール ✅ |
| 3 | GitHub CLI の認証確認 | `gh auth status` | アカウント `bosawa` で認証済み ✅ |
| 4 | Node.js のバージョン確認 | `node --version` | v22.16.0 ✅ |

**成果物**: なし（確認のみ）

---

### Step 1: Git 初期化 ✅

**目的**: 現在のディレクトリを Git リポジトリにする

| # | 作業 | コマンド/ファイル | 結果 |
|---|------|-----------------|------|
| 1 | Git リポジトリの初期化 | `git init` | 空リポジトリ作成 ✅ |
| 2 | `.gitignore` ファイル作成 | `.gitignore` を新規作成 | node_modules, .env 等を除外 ✅ |
| 3 | 状態確認 | `git status` | 未追跡ファイル 2 件を確認 ✅ |

**成果物**:
- `.git/` ディレクトリ（Git 管理情報）
- `.gitignore`

---

### Step 2: サンプルコード作成 ✅

**目的**: GitHub にプッシュするためのサンプルアプリを作成する

| # | 作業 | コマンド/ファイル | 結果 |
|---|------|-----------------|------|
| 1 | `package.json` 生成 | `npm init -y` | プロジェクト設定ファイル作成 ✅ |
| 2 | メインアプリ作成 | `index.js` を新規作成 | TODO 管理ツール（add / list） ✅ |
| 3 | README 作成 | `README.md` を新規作成 | プロジェクト説明書 ✅ |
| 4 | `.gitignore` 更新 | `.gitignore` を編集 | `todos.json` を除外に追加 ✅ |
| 5 | 動作確認 | `node index.js` 等 | add / list 正常動作 ✅ |

**成果物**:
- `package.json`
- `index.js`（add / list 機能）
- `README.md`

---

### Step 3: 初回コミット ✅

**目的**: 作成したコードを Git に記録する

| # | 作業 | コマンド | 結果 |
|---|------|---------|------|
| 1 | コミット対象の確認 | `git status` | 未追跡ファイル 5 件 ✅ |
| 2 | ステージングに追加 | `git add .gitignore PLAN.md README.md index.js package.json` | 5 ファイルをステージ ✅ |
| 3 | ステージング状態の確認 | `git status` | 5 ファイルがコミット予定 ✅ |
| 4 | コミット実行 | `git commit -m "Initial commit: TODO管理ツール"` | ハッシュ `34e6529` ✅ |
| 5 | コミット履歴の確認 | `git log --oneline` | 1 件のコミットを確認 ✅ |

**成果物**: Git の初回コミット (`34e6529`)

---

### Step 4: GitHub リポジトリ作成 & プッシュ ✅

**目的**: GitHub 上にリモートリポジトリを作成し、コードを公開する

| # | 作業 | コマンド | 結果 |
|---|------|---------|------|
| 1 | GitHub にリポジトリ作成 | `gh repo create cc-mcp-test01 --public --source=. --push` | リポジトリ作成成功、リモート登録でエラー ✅ |
| 2 | リモート設定の確認 | `git remote -v` | 古い URL が設定されていた ✅ |
| 3 | リモート URL の修正 | `git remote set-url origin ...` | 正しい URL に更新 ✅ |
| 4 | リモート URL の確認 | `git remote -v` | 更新を確認 ✅ |
| 5 | GitHub にプッシュ | `git push -u origin master` | master ブランチをプッシュ ✅ |
| 6 | GitHub 上のリポジトリ確認 | `gh repo view bosawa/cc-mcp-test01` | README が正しく表示 ✅ |

**成果物**: GitHub 上の公開リポジトリ (https://github.com/bosawa/cc-mcp-test01)

---

### Step 5: コード更新 ✅

**目的**: コードに機能を追加し、変更を GitHub に反映する

| # | 作業 | コマンド/ファイル | 結果 |
|---|------|-----------------|------|
| 1 | 削除機能の実装 | `index.js` を編集（3 箇所） | `deleteTodo()` 関数追加 ✅ |
| 2 | 動作確認（削除前の一覧） | `node index.js list` | 2 件の TODO を確認 ✅ |
| 3 | 動作確認（削除実行） | `node index.js delete 1` | ID:1 を削除成功 ✅ |
| 4 | 動作確認（削除後の一覧） | `node index.js list` | 1 件に減少を確認 ✅ |
| 5 | 動作確認（ヘルプ） | `node index.js` | delete コマンドが表示 ✅ |
| 6 | 変更差分の確認 | `git diff` | 意図通りの変更のみ ✅ |
| 7 | ステージング & コミット | `git add` → `git commit` | ハッシュ `6b4c68a` ✅ |
| 8 | GitHub にプッシュ | `git push` | GitHub に反映 ✅ |
| 9 | コミット履歴の確認 | `git log --oneline` | 2 件のコミットを確認 ✅ |

**成果物**: 削除機能が追加されたコード & GitHub 上の 2 つ目のコミット (`6b4c68a`)

---

### Step 6: リポジトリ参照 & コード追加 ✅

**目的**: GitHub 上のリポジトリ情報を参照し、それを元にコードを追加する

| # | 作業 | コマンド/ファイル | 結果 |
|---|------|-----------------|------|
| 1 | リポジトリ情報の参照 | `gh repo view --json` | 名前・URL・ブランチ等を取得 ✅ |
| 2 | ファイル一覧の参照 | `gh api repos/.../contents/` | 5 ファイルの存在を確認 ✅ |
| 3 | コミット履歴の参照 | `gh api repos/.../commits` | 2 コミットの履歴を確認 ✅ |
| 4 | ソースコードの参照 | `gh api repos/.../contents/index.js` | index.js の全コードを取得 ✅ |
| 5 | `utils.js` 作成 | `utils.js` を新規作成 | formatDate / getStats 関数 ✅ |
| 6 | `index.js` 更新 | `index.js` を編集（4 箇所） | utils 組み込み・stats コマンド追加 ✅ |
| 7 | 動作確認（一覧表示） | `node index.js list` | 日付表示が追加された ✅ |
| 8 | 動作確認（統計表示） | `node index.js stats` | 統計情報が正しく表示 ✅ |
| 9 | 動作確認（ヘルプ） | `node index.js` | stats コマンドが表示 ✅ |
| 10 | 変更差分の確認 | `git status` | 変更 1 件 + 新規 1 件を確認 ✅ |
| 11 | ステージング & コミット | `git add` → `git commit` | ハッシュ `476eea3` ✅ |
| 12 | GitHub にプッシュ | `git push` | GitHub に反映 ✅ |

**成果物**: `utils.js` & 更新された `index.js` & GitHub 上の 3 つ目のコミット (`476eea3`)

---

### Step 7: 確認 & クリーンアップ

**目的**: 全体の成果を確認し、振り返りを行う

| # | 作業 | コマンド | 目的 |
|---|------|---------|------|
| 1 | 全コミット履歴の確認 | `git log --oneline` | ローカルの全履歴を確認 |
| 2 | GitHub 上のコミット履歴確認 | `gh api repos/.../commits` | リモートと一致するか確認 |
| 3 | GitHub 上のファイル一覧確認 | `gh api repos/.../contents/` | 最終的なファイル構成を確認 |
| 4 | PLAN.md のコミット & プッシュ | `git add` → `git commit` → `git push` | 更新した計画書を GitHub に反映 |
| 5 | 体験の振り返り | — | 全ステップの成果をまとめ |

**成果物**: 完成したリポジトリ & 振り返りレポート

---

## 最終的なファイル構成

```
cc-mcp-test01/
├── .gitignore       # Git 除外設定
├── PLAN.md          # 体験の計画書（このファイル）
├── package.json     # Node.js プロジェクト設定
├── README.md        # プロジェクト説明
├── index.js         # メインアプリ（add / list / delete / stats）
└── utils.js         # ユーティリティ関数（formatDate / getStats）
```
