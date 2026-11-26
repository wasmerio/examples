import type { ImageMetadata } from "astro";
import type { IconName, LinkItem, BentoBase } from "./common";
import type { getSiteConfig } from "@utils/config";
import { BENTO_DISPLAY_TYPE_MAP } from "@constants/ui";

/** 网站全局配置类型 (从配置获取函数推断) */
export type SiteConfig = Awaited<ReturnType<typeof getSiteConfig>>;

/**
 * 站点全局配置相关类型 (基于 site.yaml)
 */

// =============================================================================
// 1. 布局组件 Props
// =============================================================================

/** 基础布局组件 Props */
export interface BaseLayoutProps {
  /** 页面 SEO 标题 */
  title?: string;
  /** 页面 SEO 描述 (可选) */
  description?: string;
  /** 社交分享图片路径 (可选，/public 下路径) */
  ogImage?: string;
  /** 
   * 分栏比例：左侧 Banner 占比百分比 
   * @default 50
   */
  splitRatio?: number;
}

// =============================================================================
// 2. 首页组件 Props
// =============================================================================

/** 个人资料卡片组件 Props */
export interface ProfileCardProps {
  /** 头像图片 (支持 Astro 资源引用) (可选) */
  avatar?: ImageMetadata;
  /** 作者/昵称名称 */
  author: string;
  /** 个性签名 (支持 null) */
  slogan?: string | null;
  /** 地址信息 (支持 null) */
  address?: string | null;
}

/** 导航项配置结构 */
export interface NavItem {
  /** 链接展示名称 */
  name: string;
  /** 链接跳转路径 (内部或外部 URL) */
  path?: string;
  /** 链接对应图标 (支持 Iconify 格式) */
  icon?: IconName;
  /** 子菜单项列表 (可选) */
  children?: NavItem[];
}

/** 导航链接列表组件 Props */
export interface NavLinksProps {
  /** 导航项数组，将渲染在首页主要位置 */
  items: NavItem[];
}

// =============================================================================
// 3. 关于页组件 Props
// =============================================================================

/** 关于页个人简介区块 Props */
export interface AboutProfileProps {
  /** 个人资料简要信息 */
  profile: {
    /** 姓名/作者名 */
    name: string;
    /** 头像 (资源引用) (可选) */
    avatar?: ImageMetadata;
    /** 自我介绍描述文本 */
    description: string;
  };
}

/** 文本卡片 */
export interface BentoTextItem extends BentoBase {
  type: typeof BENTO_DISPLAY_TYPE_MAP.TEXT;
  /** 文本项内容设为必需 */
  content: string;
}

/** 技术栈网格卡片项 */
export interface TechIconItem {
  /** 工具/语言名称 */
  name: string;
  /** 图标名称 (支持 Iconify 格式) */
  icon: IconName;
}

/** 技术栈网格卡片 */
export interface BentoGridItem extends BentoBase {
  type: typeof BENTO_DISPLAY_TYPE_MAP.GRID;
  /** 图标列表 */
  items: TechIconItem[];
}

/** 社交链接卡片 */
export interface BentoLinksItem extends BentoBase {
  type: typeof BENTO_DISPLAY_TYPE_MAP.LINKS;
  /** 社交链接列表 */
  links: LinkItem[];
}

/** 关于页 Bento 卡片项数据定义 (辨析联合类型) */
export type BentoItemData = BentoTextItem | BentoGridItem | BentoLinksItem;

/** BentoGrid 容器组件 Props */
export interface BentoGridProps {
  /** Bento 数据列表 */
  bento: BentoItemData[];
}

/** BentoItem 单个卡片组件 Props */
export interface BentoItemProps {
  /** 卡片数据对象 */
  item: BentoItemData;
}
