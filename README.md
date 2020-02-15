# scrape-connpass

## データベースのイベントIDがおかしいところの確認

## Firebaseの料金プラン

Blaze プラン(従量制)を選択すること
Blaze プランを使用しないと外部サイトのスクレイピングができないためです。
以下のアウトバウンド ネットワーキングの箇所が該当します。
[料金プラン](https://firebase.google.com/pricing?hl=ja)

Spark プランの無料使用量を含むので、課金されることはないと考えています。

## Cloud Firestoreのロケーション
初期設定でasia-northeast1を選択することをおすすめします。
ロケーションをasia-northeast1に揃えることで実行速度の向上が期待できます。

## GOOGLE_APPLICATION_CREDENTIALS
jsonを取得し以下を設定すること
以下は例
export GOOGLE_APPLICATION_CREDENTIALS="/home/tflare/attendance-management-v-b6929f4a63e5.json"

詳細はリンク先を参照ください。[SDK の初期化](https://firebase.google.com/docs/admin/setup?hl=ja#initialize_the_sdk)

## Todo
キャンセル枠の考慮
