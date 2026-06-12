# Vesper Cafe

夕暮れ時のスペシャルティコーヒーがコンセプトの架空カフェ Web サイト。実在の店舗とは無関係です。

## 機能

- ヒーロー・メニュー・店舗情報のホーム画面
- メニュー一覧（`data/menu-mock.json`）
- お気に入り登録（`localStorage`）

## ローカルで確認

```bash
cd vesper-cafe
python3 -m http.server 8765
# http://localhost:8765/
```

## Vercel へデプロイ

1. [Vercel](https://vercel.com) で GitHub リポジトリ `vesper-cafe-basics` を Import
2. **Root Directory** を `vesper-cafe` に設定（またはリポジトリルートの `vercel.json` で `/` から配信）
3. Deploy — ビルドコマンド不要（静的 HTML）

```bash
# CLI の場合（vesper-cafe ディレクトリで）
npx vercel --prod
```

## 関連 Issue

- `#1` お気に入りボタンがスマホで見切れる — 丸型ボタン + タップ領域 44px 相当で対応
