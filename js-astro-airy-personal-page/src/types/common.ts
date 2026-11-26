import type { BentoSize, BentoDisplayType, AnnouncementType } from "@constants/ui";

export type { BentoSize, BentoDisplayType, AnnouncementType };

// =============================================================================
// UI 基础类型
// =============================================================================

/** 图标标识符 (兼容 Iconify 格式) */
export type IconName = string;

/** 通用链接项结构 */
export interface LinkItem {
    /** 显示名称 */
    name: string;
    /** 跳转链接 */
    url: string;
    /** 对应图标 (可选) */
    icon?: IconName;
}

/** Bento 布局卡片基础接口 */
export interface BentoBase {
    /** 模块唯一标识符 */
    id: string;
    /** 卡片标题 (可选) */
    title?: string;
    /** 描述内容或主文本内容 (可选) */
    content?: string;
    /** 卡片尺寸 */
    size?: BentoSize;
}

// =============================================================================
// Announcement 公告系统类型
// =============================================================================

/** 公告链接配置 */
export interface AnnouncementLink {
    url: string;
    text?: string;
    external?: boolean;
}

/** 单条公告配置 */
export interface AnnouncementItem {
    /** 唯一标识符，用于记录用户已读状态 */
    id: string;
    /** 公告标题 */
    title: string;
    /** 公告内容文字 */
    content?: string;
    /** 类型，影响样式颜色 */
    type?: AnnouncementType;
    /** 优先级数字，数值越大排序越靠前 */
    priority?: number;
    /** 自定义颜色，覆盖 type 默认色 */
    color?: string;
    /** 是否持久化已读状态 */
    persistent?: boolean;
    /** 发布日期，格式 'YYYY-MM-DD' */
    publishDate?: string;
    /** 开始显示时间，ISO 8601 格式 */
    startDate?: string;
    /** 结束显示时间 */
    endDate?: string;
    /** 相关链接 */
    link?: AnnouncementLink;
}

/** 公告组件 Props */
export interface AnnouncementProps {
    /** 公告列表数据 (通常来自 site.yaml) */
    announcements?: AnnouncementItem[];
}

/** 公告图标组件 Props */
export interface AnnouncementIconProps {
    /** 公告类型，决定显示的图标 */
    type?: AnnouncementType;
}
