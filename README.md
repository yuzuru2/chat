## いつちゃ オープンチャット

## このリポジトリは何？

web チャットのポートフォリオです。<br />
シングルページアプリケーション(SPA)です。

## 機能

- グループチャット
- 既読機能
- 画像アップロード機能
- 部屋追放機能
- 部屋人数上限設定機能
- ギミック機能
  - サイコロと入力する → サイコロを振る
  - おみくじと入力 → おみくじをひく

## 開発環境

- centos7
- docker <br/>
- docker-compose <br/>

## 使用ライブラリ周り

### フロントエンド

- typescript
- react
- redux
- styled-components
- parcel

### バックエンド

- typescript
- nodejs
- pm2
- jwt
- socket.io
- mongodb
- redis
- nginx

## テスト

- jest

## set up

```
git clone https://github.com/yuzuru2/chat.git chat
cd chat

.envを編集　※portの開放は各自で設定してください
SERVER_IP   →　サーバのIP
NGINX_PORT  →  フロントエンドサーバのポート番号 (お好きな番号を選んでください)
BACKEND_PORT →  バックエンドサーバのポート番号 (お好きな番号を選んでください)

# react・バックエンドnodejsをビルド
sudo docker-compose -f docker-compose.build.yml up
sudo docker-compose -f docker-compose.build.yml down -v

# chatサーバを立ち上げる
sudo docker-compose up -d --build

# ブラウザでアクセスする
http://お使いのサーバのIP:NGINX_PORT

# chatサーバを落とす
sudo docker-compose down -v
```

## test

```
sudo docker exec -it nodejs sh -c "cd server && npm test"
```

## 注意事項

アプリの使用は自己責任でお願いします。
