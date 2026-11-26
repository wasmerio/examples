import { siteConfigSchema } from '../lib/schema';

//ここを編集してください。
export const USER_SETTINGS = {
    siteTitle: "My Illust Site",    //サイトのタイトルを入力してください
    description: "イラストポートフォリオサイトです。",  // サイトの要約文を入力してください
    ogImage: "",    //OGP画像を相対パスで指定してください。画像はpublicフォルダに入れてください
    header: "/cover.png",
    themeColor: "#585858", // テーマカラー（背景やタグ、SNSアイコンなどに反映されます）
    author: {
        name: "YourName",   //著者名を入力してください
        icon: "/icon.png",     //アイコン画像を指定できます。画像はpublicフォルダに置き、相対パスを指定してください。
        //簡単な自己紹介文を設定できます。5文字以上で入力してください。
        introduction: "ここに短い自己紹介文が入ります。この文章はダミーです。文字の大きさ、量、字間、行間等を確認するために入れています。",
    },
    sns: {
        //お持ちの各SNSのURLを入力してください。持ってない場合は、""と空白のままにしてください。
        x: "https://x.com/",
        bluesky:"https://bsky.app/",
        instagram: "https://instagram.com/",
        pixiv: "https://www.pixiv.net/",
        pinterest:"https://jp.pinterest.com/",
        youtube: "https://www.youtube.com/",
    }
};

// バリデーションの実行 / 以下は触らないでください
export const SITE_CONF = siteConfigSchema.parse(USER_SETTINGS);