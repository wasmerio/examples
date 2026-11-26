import { z } from 'astro/zod';

//スキーマの定義
export const siteConfigSchema = z.object({
    siteTitle: z.string().min(1,"サイトタイトルは必須です。"),
    description: z.string().min(1,"サイトの要約文は必須です。"),
    ogImage: z.string().optional(),
    header: z.string().min(1,"ヘッダー画像は必須です。パスを指定してください。"),
    themeColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "有効なカラーコードを入力してください。").transform(v => v.toLowerCase()).default("#60a5ff"),
    author: z.object({
        name: z.string().min(1,"名前は必須です。"),
        icon: z.string().min(1,"アイコン画像は必須です。パスを指定してください。"),
        introduction: z.string().min(5,"自己紹介は5文字以上で入力してください。")
    }),
    sns: z.object({
        x: z.string().url().or(z.literal("")).optional(),
        bluesky: z.string().url().or(z.literal("")).optional(),
        instagram: z.string().url().or(z.literal("")).optional(),
        pixiv: z.string().url().or(z.literal("")).optional(),
        pinterest: z.string().url().or(z.literal("")).optional(),
        youtube: z.string().url().or(z.literal("")).optional(),
    }).partial().default({}),
});

//型の抽出
export type SiteConfig = z.infer<typeof siteConfigSchema>;