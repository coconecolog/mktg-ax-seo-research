# MKTG AX SEO記事機会マップをGitHub Pagesで公開する手順

このプロジェクトはReact + Viteの静的サイトです。GitHub Pagesで公開するには、Pagesをオンにするだけでなく、GitHub Actionsでビルドして`dist/public`を公開する設定が必要です。

> **重要**：現在の画面はロゴと3枚の画像を`/manus-storage/...`から参照しています。この相対パスはGitHub Pagesでは使えません。Pagesを公開する前に、画像をGitHubリポジトリの`client/public/assets/`へ置き、`Home.tsx`と`index.html`の画像パスを`/assets/...`に置き換えてください。画像対応を省くと、レポート自体は表示されますが、ロゴ・ヒーロー画像などが表示されません。

## 1. 事前準備

GitHubの対象リポジトリを開き、既定ブランチ名を確認してください。以下では`main`を例にします。もし既定ブランチが`master`などの場合、後述する`branches: [main]`をその名前へ変更します。

次に、GitHub Pagesはリポジトリ配下のURLで公開されるため、Viteのbaseパスを合わせます。たとえばリポジトリ名が`mktg-ax-seo-research`で、アカウント名が`coconecology`なら、公開URLは通常次の形式です。

```text
https://coconecology.github.io/mktg-ax-seo-research/
```

このケースでは、ビルド時に`base`を`/mktg-ax-seo-research/`に指定します。Viteでは、ルートサイト（`https://<ユーザー名>.github.io/`）以外は、リポジトリ名を含めたbaseパスが必要です。[1]

## 2. GitHub Pagesを有効化する

対象リポジトリで、次の順に操作します。

| 手順 | 操作 |
| --- | --- |
| 1 | リポジトリ上部の**Settings**を開きます。|
| 2 | 左サイドバーの**Pages**を開きます。|
| 3 | **Build and deployment**の**Source**で、**GitHub Actions**を選択します。|
| 4 | テンプレート選択画面が出た場合は、**Create your own**を選びます。|

GitHubの公式ドキュメントでも、Viteなどビルドが必要なサイトはGitHub Actionsを公開元として設定し、成果物をアップロード・デプロイする流れが案内されています。[2]

## 3. デプロイ用ワークフローを追加する

GitHubの**Code**タブで、**Add file → Create new file**を選びます。ファイル名を次のように入力してください。

```text
.github/workflows/deploy-pages.yml
```

以下を貼り付けます。`main`が既定ブランチでない場合は、8行目の`main`を読み替えてください。

```yaml
name: Deploy MKTG AX report to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - name: Set up pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      - name: Build static site
        run: pnpm exec vite build --base=/${{ github.event.repository.name }}/
      - name: Configure Pages
        uses: actions/configure-pages@v5
      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist/public
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

ファイル下部の**Commit changes**を押します。これは既定ブランチへワークフローを追加するコミットです。

## 4. デプロイの成功と公開URLを確認する

コミット後、リポジトリの**Actions**タブを開きます。`Deploy MKTG AX report to GitHub Pages`が実行され、緑のチェックマークになればデプロイ成功です。

次に、**Settings → Pages**へ戻ります。ページ上部に次の形式のURLが表示されます。

```text
https://<GitHubユーザー名>.github.io/<リポジトリ名>/
```

そのURLを新しいブラウザタブで開いてください。初回反映は数分かかる場合があります。以後、既定ブランチへ変更をコミットするたびに、同じURLが更新されます。[2]

## 5. 公開後の確認項目

| 確認項目 | 合格の目安 |
| --- | --- |
| 表示URL | `...github.io/<リポジトリ名>/`でレポートが開く。|
| 画面表示 | 100件の一覧、フィルター、展開詳細、90日プレイブックが見える。|
| 操作 | 検索、対象・段階・優先度フィルター、CSV保存が動く。|
| 画像 | ロゴ・ヒーロー・優先順位・ROI画像が欠けずに表示される。|
| モバイル | スマートフォン幅でタイトル、絞り込み、記事一覧が読める。|

## 参照

[1]: https://vite.dev/guide/static-deploy "Vite — Deploying a Static Site"
[2]: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site "GitHub Docs — Configuring a publishing source for your GitHub Pages site"
