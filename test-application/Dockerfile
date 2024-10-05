# syntax=docker/dockerfile:1.9


################################################################################
#### assemble-packages: ライブラリであるnode_modulesを作成
################################################################################
FROM --platform=linux/arm64 node:22 AS assemble-packages
WORKDIR /test-application
# install node_modules dependencies
COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
RUN npm ci


################################################################################
#### development: 開発環境 ローカルのソースコードをマウントしているため、変更が即時反映される
################################################################################
FROM assemble-packages AS development
# Assumble everything into the container, including package.json, package-lock.json, node_modules, vite.config.ts etc., which are necessary when boot the application
# [NOTE] app/ folder is mounted by local source code afterward! See compose-dev.yml
COPY . .
RUN chmod +x ./entrypoint.sh
# NOTE: server port is exposed via vite.config.ts. That's why we don't need to expose it here.
CMD [ "npm", "run", "dev" ]
ENTRYPOINT ["/bin/bash", "./entrypoint.sh"]


################################################################################
#### production: 本番相当のアプリケーションをビルド・デプロイ
################################################################################
FROM assemble-packages AS production
RUN --mount=type=bind,source=./app,target=/frontend/app \
  --mount=type=bind,source=./package.json,target=/frontend/package.json \
  --mount=type=bind,source=./package-lock.json,target=/frontend/package-lock.json \
  --mount=type=bind,source=./vite.config.ts,target=/frontend/vite.config.ts \
  npm run build
COPY ./entrypoint.sh /frontend/entrypoint.sh
RUN chmod +x ./entrypoint.sh
ENV PORT=3000
CMD [ "npm", "run", "start" ]
ENTRYPOINT ["/bin/bash", "./entrypoint.sh"]
