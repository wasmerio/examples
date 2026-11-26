//デモ用コンフィグファイル
import { siteConfigSchema } from '../lib/schema';

export const USER_SETTINGS = {
    siteTitle: "My Illust Site",
    description: "Astroのテーマ「Vault」のデモサイトです。",
    ogImage: "/og-demo.jpg",
    header: "/cover.png",
    themeColor:"#585858",
    author: {
        name: "YourName",
        icon: "/icon.png",
        introduction: "ここに短い自己紹介文が入ります。この文章はダミーです。文字の大きさ、量、字間、行間等を確認するために入れています。",
    },
    sns: {
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