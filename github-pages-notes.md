# GitHub Pages 公開メモ

## このプロジェクトで必要な設定

このレポートは Vite でビルドされ、静的成果物は `dist/public` に出力される。GitHub Pages の公開元は、リポジトリの **Settings → Pages → Build and deployment → Source → GitHub Actions** を選ぶ。

ユーザーまたは組織のルートサイトではなく通常のプロジェクトリポジトリとして公開する場合、Vite の `base` は `/<リポジトリ名>/` が必要になる。ビルドワークフローは、このbaseを指定してViteをビルドし、`dist/public` を GitHub Pages artifact としてアップロードする。

## 確認済みの公式資料

1. GitHub Docs: GitHub Pages は、ブランチまたは GitHub Actions のカスタムワークフローを公開元にできる。Actionsではcheckout、ビルド、artifact upload、deployを行う。
2. Vite Docs: `https://<owner>.github.io/<repo>/` で公開する場合は `base: '/<repo>/'` が必要。GitHub Actionsによるデプロイ例が公開されている。

## 参照

- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://vite.dev/guide/static-deploy
