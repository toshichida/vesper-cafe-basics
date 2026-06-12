# 03-github-basics-v1 デモシナリオ

## 目的

GitHub リモートとの連携（`clone` / `push` / `pull`）と Issue 作成を、Vesper Cafe アプリ上で実演する。

## 台本対応（パート名・該当箇所）

- 第3部「GitHub と繋ぐ — リモートの幹」（3-1〜3-3）
- 第4部 Issue 入門（4-1）

## 事前準備

- `gh auth login` 済みであること
- GitHub ユーザー: `toshichida`
- 作業ディレクトリ: `03-github-basics-v1/vesper-cafe/`

## 手順（コマンド付き）

### ステップ 0: 認証確認（台本 3-3）

**やること**: GitHub CLI の認証状態を確認する。

```bash
gh auth status
# 未認証の場合
gh auth login
```

**見せたいポイント**: 認証の沼は `gh auth login` 一発。git の認証情報も自動設定される。

---

### ステップ 1: GitHub リポジトリを作成して接続（台本 3-2 パターンB）

**やること**: ローカルで `git init` 済みの Vesper Cafe を GitHub に送る。

```bash
cd 03-github-basics-v1/vesper-cafe
git init
git add .
git commit -m "Initial commit: Vesper Cafe for GitHub basics"

# 新規リポジトリ作成 + push（初回）
gh repo create vesper-cafe-basics --public --source=. --remote=origin --push
```

既にリポジトリがある場合:

```bash
git remote add origin https://github.com/toshichida/vesper-cafe-basics.git
git push -u origin main
```

**見せたいポイント**: push ＝ ローカルの変更をリモートへ送る。バックアップ兼デプロイの起点。

---

### ステップ 2: push の確認（台本 3-2）

**やること**: GitHub 上でファイルが反映されていることをブラウザで確認する。

```bash
gh repo view --web
git remote -v
git log --oneline
```

**見せたいポイント**: commit は PC の金庫、push は GitHub にセーブデータを送るイメージ。

---

### ステップ 3: feature ブランチを push（台本 3-2）

**やること**: feature ブランチで軽微な変更をリモートに送る。

```bash
git switch -c feature/add-favorites-badge
# index.html の placeholder に「お気に入り機能準備中」を追記するなど
git add .
git commit -m "お気に入りバッジ追加の準備文言を追加"
git push -u origin feature/add-favorites-badge
```

**見せたいポイント**: `-u` 付き初回 push 以降は `git push` だけで OK。Vercel 連携時は Preview の伏線（第5部）。

---

### ステップ 4: Issue を作成（台本 4-1）

**やること**: 流れない要件データベースとして Issue を1件登録する。

```bash
gh issue create \
  --title "お気に入りボタンがスマホで見切れる" \
  --body "$(cat <<'EOF'
## 期待する入力
メニューカードが一覧表示された状態

## 期待する出力
お気に入りボタンが画面幅内に収まり、タップしやすい

## 関連ファイル
- index.html
- css/style.css

## 補足
Vesper Cafe のモバイル表示改善
EOF
)" \
  --label "bug"
```

**見せたいポイント**: 1 Issue ＝ 1 テーマ。曖昧な Issue は曖昧な実装になる。後で PR から `#N` で参照できる。

---

### ステップ 4 のあと — Issue を解決するのはどんな場面？（口頭補足）

**このデモでここまで**: 第3部〜4-1 は「リモートに送る」「Issue を残す」まで。実際に直して main に取り込む流れ（PR → Merge → Issue クローズ）は **第4部後半** および **`04-github-practice-v2`** で扱う。

#### チーム開発のとき

よくある流れは次のとおり。

1. **誰かが Issue を立てる** — QA・デザイナー・別メンバーが「スマホでボタンが見切れる」と報告（今回の `#1` と同じ形式）
2. **担当者が Issue を拾う** — `gh issue list` や GitHub の Projects / 看板で「未対応」を確認
3. **修正用ブランチを切る** — 例: `fix/mobile-favorite-button`（ステップ 3 の `feature/add-favorites-badge` とは **別ブランチ**。1 Issue ＝ 1 修正が原則）
4. **直して PR を出す** — 本文に `Fixes #1` と書くと、マージ時に Issue が自動クローズ
5. **レビューして merge** — 差分を見て OK なら Squash merge。main に取り込まれる

> 🎤 「チームだと Issue が **チーム共通の TODO リスト** になる。Slack で『あれ直して』が流れない代わりに、GitHub 上に要件が残る。」

#### 個人開発のとき（今回のデモに近い）

チームがなくても同じサイクルは有効。

- **報告も修正も自分** — 機能追加（ステップ 3）のあと、実機確認でバグに気づき、自分で Issue を立てる（今回の `#1`）
- **Issue ＝ 未来の自分へのメモ** — 「直す内容・期待する結果・関連ファイル」が残るので、数日後や別 PC でも再開しやすい
- **PR は自分への安全弁** — レビュアーがいなくても、Files changed で「意図した修正か」を確認してから merge する関所になる（AI 生成コードの承認ポイントにもなる）

> 🎤 「Issue はチーム専用ではない。**個人でも要件 DB 兼 TODO** として使う。第5部では、ここに書いた内容を AI が読む前提にも触れる。」

#### 今回の Vesper Cafe での位置づけ

| 要素 | 役割 | このシナリオでの状態 |
|------|------|----------------------|
| `feature/add-favorites-badge` | お気に入り機能の **追加** | ステップ 3 で push 済み（意図的にモバイルバグあり） |
| Issue `#1` | 見切れバグの **記録** | ステップ 4 で作成 |
| `fix/...` ブランチ + PR | バグの **修正と取り込み** | 次のパート（`04-github-practice-v2`）で実演 |

機能追加 PR とバグ修正 Issue は **別の関心事**。混ぜずに、Issue → 修正ブランチ → PR → Merge の順で回すのが実務の型。

---

### ステップ 5: clone / pull の流れ（台本 3-2・収録では省略可）

**やること**: 別マシン想定の手順を口頭または資料で補足する。

```bash
# 別の作業ディレクトリで
git clone https://github.com/toshichida/vesper-cafe-basics.git
cd vesper-cafe-basics
# 誰かが push した変更を取り込む
git pull
```

**見せたいポイント**: clone ＝ 丸ごと複製、pull ＝ リモートの変更を取り込む。

---

## 受講者に見せたいポイント

- push ＝ 送る、pull ＝ 取り込む、clone ＝ 丸ごと複製
- push はバックアップであり、デプロイの起点でもある
- Issue ＝ 流れない要件 DB。期待入力・出力・関連ファイルを書く
- Issue の解決は **チームでも個人でも** 同じ型（拾う → ブランチ → 修正 → PR → merge）。このパートでは Issue 登録まで、修正取り込みは次パート

## よくあるつまずき

- commit と push の違いが曖昧
- 認証エラー（`gh auth login` で解決）

## リセット方法（次の収録前）

```bash
# GitHub 上のリポジトリを削除する場合
gh repo delete toshichida/vesper-cafe-basics --yes

# ローカル
cd 03-github-basics-v1/vesper-cafe
rm -rf .git
git init && git add . && git commit -m "Initial commit: Vesper Cafe for GitHub basics"
```
