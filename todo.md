# GitHub Pages 公開チェックリスト

- [ ] エクスポート先のGitHubリポジトリ名と既定ブランチを確認する。
- [ ] GitHub Pagesの公開元をGitHub Actionsに設定する。
- [ ] Viteプロジェクト用のGitHub Pagesデプロイワークフローを追加して、既定ブランチへ反映する。
- [ ] `actions/setup-node`によるpnpmキャッシュ設定より前にCorepackでpnpmを有効化する。
- [ ] pnpm Action側の`version`指定を削除し、package.jsonの`packageManager`指定のみを使用する。
- [ ] リポジトリ名を含むGitHub Pages URLと、Vite・Wouterのベースパスを一致させる。
- [ ] GitHub Pagesで参照可能な静的アセットへ画像パスを置き換える。
- [ ] `dist/public`をGitHub Pages artifactとしてアップロードするワークフローを検証する。
- [ ] Actionsのデプロイ成功を確認し、発行されたPages URLをブラウザで開く。
- [ ] 画像・フィルター・CSV保存・モバイル表示を公開URL上で確認する。
