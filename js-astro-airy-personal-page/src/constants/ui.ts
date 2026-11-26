// =============================================================================
// Bento 布局卡片
// =============================================================================

/** Bento 尺寸常量映射 */
export const BENTO_SIZE_MAP = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
    FULL: 'full',
} as const;

/** * Bento 布局卡片尺寸选项
 * - `small`: 1x1 比例
 * - `medium`: 2x1 比例
 * - `large`: 2x2 比例
 * - `full`: 整行宽度
 */
export const BENTO_SIZES = [BENTO_SIZE_MAP.SMALL, BENTO_SIZE_MAP.MEDIUM, BENTO_SIZE_MAP.LARGE, BENTO_SIZE_MAP.FULL] as const;

/** Bento 布局卡片尺寸类型 */
export type BentoSize = typeof BENTO_SIZES[number];

/** Bento 展示类型常量映射 */
export const BENTO_DISPLAY_TYPE_MAP = {
    GRID: 'grid',
    LINKS: 'links',
    TEXT: 'text',
} as const;

/** * Bento 布局卡片展示类型
 * - `grid`: 图标网格
 * - `links`: 链接列表
 * - `text`: 纯文本内容
 */
export const BENTO_DISPLAY_TYPES = [BENTO_DISPLAY_TYPE_MAP.GRID, BENTO_DISPLAY_TYPE_MAP.LINKS, BENTO_DISPLAY_TYPE_MAP.TEXT] as const;

/** Bento 布局卡片展示类型 */
export type BentoDisplayType = typeof BENTO_DISPLAY_TYPES[number];

// =============================================================================
// 公告组件
// =============================================================================

/** 公告类型常量映射 */
export const ANNOUNCEMENT_TYPE_MAP = {
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
} as const;

/** * 公告类型选项 (影响 UI 样式与语义颜色)
 * - `info`: 信息 (蓝色)
 * - `success`: 成功 (绿色)
 * - `warning`: 警告 (橙色)
 * - `error`: 错误 (红色)
 */
export const ANNOUNCEMENT_TYPES = [ANNOUNCEMENT_TYPE_MAP.INFO, ANNOUNCEMENT_TYPE_MAP.SUCCESS, ANNOUNCEMENT_TYPE_MAP.WARNING, ANNOUNCEMENT_TYPE_MAP.ERROR] as const;

/** 公告语义化类型 */
export type AnnouncementType = typeof ANNOUNCEMENT_TYPES[number];