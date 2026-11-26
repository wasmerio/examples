/**
 * Starread Theme Component Type Declarations
 * 
 * 星阅主题组件类型声明
 * 
 * This file provides type definitions for all theme components,
 * including props and exported types.
 */

import type { AstroComponentFactory } from 'astro';

/**
 * ArticleInfo Component Props
 * 
 * 文章信息组件属性
 */
export interface ArticleInfoProps {
  /** Article title / 文章标题 */
  title: string;

  /** Article cover image URL / 文章封面图片 URL */
  cover?: string;

  /** Article date / 文章日期 */
  date?: string;

  /** Article author / 文章作者 */
  author?: {
    name: string;
    avatar?: string;
  };

  /** Article categories / 文章分类 */
  categories?: string[];

  /** Article tags / 文章标签 */
  tags?: string[];

  /** Article view count / 文章浏览次数 */
  views?: number;

  /** Article reading time / 文章阅读时间 */
  readingTime?: number;

  /** Article word count / 文章字数 */
  wordCount?: number;
}

/**
 * ArticleNav Component Props
 * 
 * 文章导航组件属性
 */
export interface ArticleNavProps {
  /** Previous article / 上一篇文章 */
  prev?: {
    title: string;
    cover?: string;
    date?: string;
    id: string;
  };

  /** Next article / 下一篇文章 */
  next?: {
    title: string;
    cover?: string;
    date?: string;
    id: string;
  };
}

/**
 * ArticleSection Component Props
 * 
 * 文章段落组件属性
 */
export interface ArticleSectionProps {
  /** Article content / 文章内容 */
  content?: string;

  /** Whether to show table of contents / 是否显示目录 */
  showToc?: boolean;
}

/**
 * ArticleTOC Component Props
 * 
 * 文章目录组件属性
 */
export interface ArticleTOCProps {
  /** Article headings / 文章标题列表 */
  headings?: Array<{
    level: number;
    title: string;
    slug: string;
  }>;

  /** Whether to collapse / 是否折叠 */
  collapsible?: boolean;
}

/**
 * Banner Component Props
 * 
 * 横幅组件属性
 */
export interface BannerProps {
  /** Banner title / 横幅标题 */
  title?: string;

  /** Banner background image / 横幅背景图片 */
  backgroundImage?: string;

  /** Banner tags / 横幅标签 */
  tags?: string[];
}

/**
 * Carousel Component Props
 * 
 * 轮播图组件属性
 */
export interface CarouselProps {
  /** Carousel title / 轮播图标题 */
  title?: string;

  /** Carousel layout / 轮播图布局 */
  layout?: 'horizontal' | 'vertical';

  /** Carousel items / 轮播图项目 */
  items?: Array<{
    title: string;
    cover: string;
    date?: string;
    id: string;
  }>;
}

/**
 * Comment Component Props
 * 
 * 评论组件属性
 */
export interface CommentProps {
  /** Comment service type / 评论服务类型 */
  type?: string;

  /** Comment configuration / 评论配置 */
  config?: Record<string, unknown>;
}

/**
 * HeroSection Component Props
 * 
 * Hero 区域组件属性
 */
export interface HeroSectionProps {
  /** Whether hero is enabled / 是否启用 */
  enabled?: boolean;

  /** Background image / 背景图片 */
  backgroundImage?: string;

  /** Title configuration / 标题配置 */
  title?: {
    mode?: 'text' | 'jinrishici';
    content?: string;
  };

  /** Effect configuration / 效果配置 */
  effect?: {
    gradient?: {
      enabled?: boolean;
      colors?: string[];
    };
    typing?: {
      enabled?: boolean;
      repeat?: boolean;
      cursor?: boolean;
      cursorStyle?: 'line' | 'block';
    };
  };
}

/**
 * LatestArticle Component Props
 * 
 * 最新文章组件属性
 */
export interface LatestArticleProps {
  /** Load type / 加载类型 */
  type?: 'button' | 'auto';

  /** Layout type / 布局类型 */
  layout?: 'horizontal' | 'vertical';

  /** Default limit / 默认最大加载数量 */
  defaultLimit?: number;

  /** Initial load count / 初始加载数量 */
  initialLoad?: number;

  /** Load more count / 每次加载数量 */
  loadMore?: number;

  /** Columns count / 分栏数 */
  columns?: number;

  /** Default aspect ratio / 默认宽高比 */
  defaultAspectRatio?: string;

  /** Horizontal height / 横版封面高度 */
  horizontalHeight?: string;
}

/**
 * NavBar Component Props
 * 
 * 导航栏组件属性
 */
export interface NavBarProps {
  /** Navbar items / 导航栏项目 */
  items?: Array<{
    name?: string;
    href?: string;
    icon?: string;
    items?: Array<{
      text?: string;
      items?: Array<{
        text: string;
        link: string;
        icon?: string;
      }>;
    }>;
  }>;

  /** Whether navbar is transparent / 导航栏是否透明 */
  transparent?: boolean;
}

/**
 * PostCard Component Props
 * 
 * 文章卡片组件属性
 */
export interface PostCardProps {
  /** Article title / 文章标题 */
  title: string;

  /** Article cover / 文章封面 */
  cover?: string;

  /** Article date / 文章日期 */
  date?: string;

  /** Article author / 文章作者 */
  author?: {
    name: string;
    avatar?: string;
  };

  /** Article categories / 文章分类 */
  categories?: string[];

  /** Article tags / 文章标签 */
  tags?: string[];

  /** Article ID / 文章 ID */
  id: string;

  /** Card layout / 卡片布局 */
  layout?: 'horizontal' | 'vertical';

  /** Whether to show excerpt / 是否显示摘要 */
  showExcerpt?: boolean;

  /** Article excerpt / 文章摘要 */
  excerpt?: string;
}

/**
 * Search Component Props
 * 
 * 搜索组件属性
 */
export interface SearchProps {
  /** Search placeholder / 搜索占位符 */
  placeholder?: string;

  /** Whether to enable keyboard shortcuts / 是否启用键盘快捷键 */
  enableShortcuts?: boolean;
}

/**
 * Widget Component Props
 * 
 * 小部件组件属性
 */
export interface WidgetProps {
  /** Widget configuration / 小部件配置 */
  config?: Record<string, unknown>;
}

/**
 * AuthorWidget Component Props
 * 
 * 作者小部件组件属性
 */
export interface AuthorWidgetProps extends WidgetProps {
  /** Author name / 作者名称 */
  name?: string;

  /** Author description / 作者描述 */
  description?: string;

  /** Author avatar / 作者头像 */
  avatar?: string;

  /** Author social links / 作者社交媒体链接 */
  social?: Record<string, string>;
}

/**
 * AdWidget Component Props
 * 
 * 广告小部件组件属性
 */
export interface AdWidgetProps extends WidgetProps {
  /** Ad title / 广告标题 */
  title?: string;

  /** Ad description / 广告描述 */
  description?: string;

  /** Ad button text / 广告按钮文本 */
  buttonText?: string;

  /** Ad link / 广告链接 */
  link?: string;
}

/**
 * TagCloud Component Props
 * 
 * 标签云组件属性
 */
export interface TagCloudProps extends WidgetProps {
  /** Tags / 标签列表 */
  tags?: Array<{
    name: string;
    count?: number;
  }>;
}

/**
 * Statistic Component Props
 * 
 * 统计组件属性
 */
export interface StatisticProps extends WidgetProps {
  /** Site founded date / 站点建立日期 */
  foundedDate?: string;

  /** Total posts / 总文章数 */
  totalPosts?: number;
}

/**
 * Progress Widget Props
 * 
 * 进度条小部件属性
 */
export interface ProgressProps {
  /** Current progress / 当前进度 */
  current?: number;

  /** Total progress / 总进度 */
  total?: number;
}

/**
 * Component type exports
 * 
 * 组件类型导出
 */
export type ArticleInfoComponent = AstroComponentFactory<ArticleInfoProps>;
export type ArticleNavComponent = AstroComponentFactory<ArticleNavProps>;
export type ArticleSectionComponent = AstroComponentFactory<ArticleSectionProps>;
export type ArticleTOCComponent = AstroComponentFactory<ArticleTOCProps>;
export type BannerComponent = AstroComponentFactory<BannerProps>;
export type CarouselComponent = AstroComponentFactory<CarouselProps>;
export type CommentComponent = AstroComponentFactory<CommentProps>;
export type HeroSectionComponent = AstroComponentFactory<HeroSectionProps>;
export type LatestArticleComponent = AstroComponentFactory<LatestArticleProps>;
export type NavBarComponent = AstroComponentFactory<NavBarProps>;
export type PostCardComponent = AstroComponentFactory<PostCardProps>;
export type SearchComponent = AstroComponentFactory<SearchProps>;

export type AuthorWidgetComponent = AstroComponentFactory<AuthorWidgetProps>;
export type AdWidgetComponent = AstroComponentFactory<AdWidgetProps>;
export type TagCloudComponent = AstroComponentFactory<TagCloudProps>;
export type StatisticComponent = AstroComponentFactory<StatisticProps>;
export type ProgressComponent = AstroComponentFactory<ProgressProps>;