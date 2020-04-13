# レプリカセット設定
mongo <<EOF
rs.initiate(
  {
    _id: "rep",
    members: [{ _id: 0, host: "127.0.0.1:27017" }]
  }
)
EOF

# 3秒待ってchatデータベースを作成する
sleep 3
mongo <<EOF
use chat
db.createCollection('tmp')
use chat_test
db.createCollection('tmp');
EOF