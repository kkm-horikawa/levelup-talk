# レベルアップトーク

会話を盛り上げる質問カードゲームWebアプリ

## 🚀 クイックスタート

```bash
# リポジトリをクローン
git clone https://github.com/kkm-horikawa/levelup-talk.git
cd levelup-talk

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

## 📦 デプロイ

```bash
# ビルド
npm run build

# GitHub Pagesにデプロイ
npm run deploy
```

デプロイ先: https://kkm-horikawa.github.io/levelup-talk/

## 🛠 技術スタック

- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.7
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS 4.1.14
- **UI Components**: Swiper 12.0.2 (カードスライダー)
- **Linter/Formatter**: Biome 2.2.5
- **Git Hooks**: Husky 9.1.7
- **Deployment**: gh-pages 6.3.0

## 📚 導入ライブラリ

### Tailwind CSS v4

**設定ファイル**: なし（v4では不要）

**導入方法**:
```bash
npm install @tailwindcss/vite
```

**設定箇所**:
- `vite.config.ts`: Viteプラグインとして追加
- `src/index.css`: `@import "tailwindcss";` のみ記述

**備考**:
- Tailwind v4では `tailwind.config.js` が不要
- よりシンプルな設定でCSSフレームワークを利用可能
- Viteプラグインで自動的に最適化

### Swiper

**設定ファイル**: なし

**導入方法**:
```bash
npm install swiper
```

**使用箇所**:
- `src/components/CardSwiper.tsx`: 質問カードのスライダーUI
- `src/App.tsx`: その他のゲーム紹介画面

**インポート例**:
```typescript
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';
```

**備考**:
- EffectCardsモジュールでカードスタック風のUI実装
- タッチ/マウスでのスワイプ操作をサポート

### Biome

**設定ファイル**: `biome.json`

**導入方法**:
```bash
npm install --save-dev @biomejs/biome
```

**設定内容**:
```json
{
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "always",
      "trailingCommas": "es5"
    }
  }
}
```

**実行コマンド**:
```bash
# Lint & Formatチェック
npm run lint

# 自動修正
npm run lint:fix

# Format
npm run format
```

**備考**:
- ESLint + Prettierの代替
- 25-100倍高速（Rust製）
- 単一ツールでlintとformatを実行可能

### gh-pages

**設定ファイル**: `package.json`, `vite.config.ts`

**導入方法**:
```bash
npm install --save-dev gh-pages
```

**設定箇所**:

`package.json`:
```json
{
  "scripts": {
    "deploy": "gh-pages -d dist"
  }
}
```

`vite.config.ts`:
```typescript
export default defineConfig({
  base: '/levelup-talk/', // リポジトリ名を指定
  plugins: [react(), tailwindcss()],
});
```

**備考**:
- `npm run deploy` で自動的に `gh-pages` ブランチにデプロイ
- `base` パスの設定が必須（サブディレクトリでの公開のため）

### Husky

**設定ファイル**: `.husky/pre-commit`, `package.json`

**導入方法**:
```bash
npm install --save-dev husky
npx husky init
```

**設定箇所**:

`.husky/pre-commit`:
```bash
npm run lint:fix
```

`package.json`:
```json
{
  "scripts": {
    "prepare": "husky"
  }
}
```

**備考**:
- コミット前に自動的にBiomeのlint & formatを実行
- `npm install` 時に自動的にGit hooksがインストールされる
- 他の開発者は `npm install` するだけで設定完了

## 📁 プロジェクト構成

```
src/
├── components/
│   └── CardSwiper.tsx        # カードスワイプコンポーネント
├── data/
│   ├── questions.ts          # レベル別質問データ（280問）
│   ├── categoryQuestions.ts  # カテゴリ別質問データ（170問）
│   └── otherGames.ts         # その他のゲームルール（3種類）
├── App.tsx                   # メインアプリケーション
├── main.tsx                  # エントリーポイント
└── index.css                 # Tailwind CSSインポート
```

## 🎮 ゲームモード

1. **レベルアップモード**: レベル1から始めて段階的にレベルアップ
2. **レベル選択モード**: 好きなレベルを選んで質問を表示
3. **マニュアルモード**: カードをスワイプして質問を選択
4. **カテゴリ選択モード**: 10カテゴリから選んで質問を表示
5. **その他の会話ゲーム**: システムサポート不要な3つのゲームルール紹介

## 🔧 開発備忘録

### Tailwind CSS v4の導入

- v3までの `tailwind.config.js` は不要
- `@import "tailwindcss";` のみで動作
- Viteプラグインとして導入することで自動最適化

### Biomeの導入理由

- ESLint + Prettierより高速
- 設定ファイルが1つで済む
- TypeScriptのサポートが標準で充実

### Swiperの実装ポイント

- `EffectCards` モジュールでカードスタック風UI
- `grabCursor` でカーソルがグラブアイコンに変化
- `allowTouchMove` でモードごとのスワイプ制御

### 制限時間機能の実装

- `useEffect` でカウントダウンタイマーを実装
- `remainingTime` が3秒以下で警告スタイル（赤色＋点滅）
- 制限時間なし/5秒/10秒/15秒から選択可能

### GitHub Pagesデプロイ

- `vite.config.ts` で `base` パスを設定
- リポジトリ名と一致させる必要あり
- 初回デプロイ後、Settings > Pages で `gh-pages` ブランチを設定

### Huskyによるコミット前チェック

- `.husky/pre-commit` でコミット前に `npm run lint:fix` を実行
- コードの品質を自動的に保証
- 他の開発者は `npm install` するだけで自動的にフックがセットアップされる

## 📊 データ構成

### 質問データ

- **レベル1（アイスブレイク）**: 40問
- **レベル2（価値観）**: 120問
- **レベル3（深い話）**: 120問
- **カテゴリ別**: 170問（10カテゴリ）

### カテゴリ一覧

1. 学生時代の思い出
2. 恋愛
3. 未来の話
4. 仕事
5. 趣味
6. 家族
7. 友人関係
8. 人生観
9. 秘密
10. 性の話

## 🎯 その他の会話ゲーム

1. **ネバーハブアイエバー**: 経験したことがないことを言い合うゲーム
2. **トゥルース・オア・ドリンク**: 答えるか飲むかを選ぶゲーム
3. **21（トゥエンティワン）**: 21を言った人が飲む数字ゲーム

## 📝 スクリプト一覧

```bash
npm run dev          # 開発サーバー起動
npm run build        # プロダクションビルド
npm run preview      # ビルド結果のプレビュー
npm run lint         # Lintチェック
npm run lint:fix     # Lint自動修正
npm run format       # フォーマット
npm run format:check # フォーマットチェック
npm run deploy       # GitHub Pagesにデプロイ
```

## 📄 ライセンス

MIT
