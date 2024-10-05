#!/bin/bash
echo 'entrypoint!'

# FIXME: 立ち上げタイミングではコンテナ起動時にやりたいことの有無がわからなかったため、ひとまずentrypoint.shを実装している。
#        特にやることが見つからなければ、このスクリプトは削除してDockerfile内で完結させても良いかも。

# CMD で指定されたコマンドを実行する
exec "$@"