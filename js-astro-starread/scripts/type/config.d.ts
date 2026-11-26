/**
 * Starread Theme Configuration Interface
 * 
 * 星阅主题配置接口
 * 
 * Following VuePress 2's i18n pattern:
 * - Site-level locales for title, description, lang
 * - Theme-level locales for navbar, sidebar texts, etc.
 * - Top-level themeConfig for global settings
 * 
 * Configuration Structure:
 * 1. Global settings (lang, favicon, logo, etc.)
 * 2. Navigation bar configuration
 * 3. Sidebar configuration
 * 4. Widget configurations
 * 5. Dynamic effects
 * 6. Multi-language configurations (locales, themeLocales)
 * 
 * @see {@link https://star.iglooblog.top/configure.html} I18n Guide
 */

/**
 * Site-level locale configuration
 * 
 * 站点级语言环境配置
 */
export interface SiteLocale {
  /** Language code (BCP47 format) / 语言代码（BCP47格式） */
  lang?: string;

  /** Site title / 站点标题 */
  title?: string;

  /** Site description / 站点描述 */
  description?: string;

  /** Footer text / 页脚文本 */
  footer?: {
    text?: string;
  };
}

/**
 * Theme-level locale configuration
 * 
 * 主题级语言环境配置
 */
export interface ThemeLocale {
  /** Language label displayed in selector / 语言选择器中显示的标签 */
  selectLanguageName?: string;

  /** Language flag emoji / 语言国旗表情符号 */
  flag?: string;

  /** Widget-specific text / 小部件文本 */
  widget?: {
    author?: {
      name?: string;
      description?: string;
    };
    ad?: {
      title?: string;
      description?: string;
      buttonText?: string;
    };
    categories?: Array<{
      name: string;
      title: string;
    }>;
    carousel?: {
      title?: string;
    };
    banner?: {
      title?: string;
      tags?: string[];
    };
  };

  /** Navigation bar items (overrides global navbar) / 导航栏项目 */
  navbar?: Array<{
    /** 图标名称（@lucide/astro 图标名）或 unicode 字符 */
    icon?: string;
    /** 菜单显示名称 */
    name: string;
    /** 链接地址（href），如果没有则为父菜单 */
    href?: string;
    /** 缩进层级，0=一级菜单，1=二级菜单，2=三级菜单 */
    indent?: number;
  }>;

  /** Sidebar widget text labels / 侧边栏组件文本标签 */
  sidebar?: {
    progress?: string;
    author?: string;
    ad?: string;
    tagcloud?: string;
    statistic?: string;
    toc?: string;
  };

  /** Search component text / 搜索组件文本 */
  search?: {
    placeholder?: string;
    noResults?: string;
    loading?: string;
    initialTip?: string;
    clear?: string;
    viewDetails?: string;
    shortcuts?: {
      open?: string;
      browse?: string;
      select?: string;
      close?: string;
    };
  };
}

/**
 * Theme configuration interface
 * 
 * 主题配置接口
 * 
 * Flat structure following VuePress 2 pattern:
 * - No nested site object
 * - Global settings at top level
 * - Multi-language settings at the end
 */
export interface StarreadThemeConfig {
  /**
   * 默认语言代码（BCP47格式）
   * 
   * @default 'zh'
   */
  lang?: string;

  /** 站点图标 URL */
  favicon: string;

  /** 默认封面图片 URL */
  defaultCover: string;

  /** 站点建立日期（用于统计建站天数） */
  foundedDate?: string;

  /** 登录页面 URL */
  loginUrl?: string;

  /** Logo 配置 */
  logo: {
    /** 浅色模式 Logo 图片 URL */
    image: string;
    /** 深色模式 Logo 图片 URL */
    darkImage: string;
    /** Logo 文字 */
    text: string;
    /** Logo 替代文本 */
    alt: string;
  };

  /** Hero 区域配置（首页全屏展示区域） */
  hero?: HeroConfig;

  /** 导航栏配置 */
  navbar: NavItem[];

  /** 侧边栏组件显示控制配置 */
  sidebar: SidebarConfig;

  /** 小部件配置 */
  widget: WidgetConfig;

  /** 动态效果配置 */
  dynamicEffect?: DynamicEffectConfig;

  /** Markdown 语法扩展配置 */
  markdown?: MarkdownConfig;

  /**
   * 站点级语言环境配置
   * 
   * Key格式: '/' 表示默认语言，'/en/' 表示英语等
   * 包含站点级设置如标题、描述等
   */
  locales?: Record<string, SiteLocale>;

  /**
   * 主题级语言环境配置
   * 
   * Key格式: '/' 表示默认语言，'/en/' 表示英语等
   * 包含各语言的UI文本如小部件、侧边栏、搜索等
   */
  themeLocales?: Record<string, ThemeLocale>;
}

/**
 * Hero section configuration interface
 * 
 * Hero 区域配置接口（首页全屏展示区域）
 */
export interface HeroConfig {
  /** 是否显示 Hero 区域 */
  enabled?: boolean;
  /** 导航栏是否透明 */
  navbarTransparent?: boolean;
  /** 背景图片URL */
  backgroundImage?: string;
  title?: {
    /** 显示模式：text 自定义文字，jinrishici 自动加载每日诗词 */
    mode?: 'text' | 'jinrishici';
    /** 自定义文字内容 */
    content?: string;
  };
  effect?: {
    gradient?: {
      /** 是否启用渐变效果 */
      enabled?: boolean;
      /** 渐变颜色数组 */
      colors?: string[];
    };
    typing?: {
      /** 是否启用打字动画 */
      enabled?: boolean;
      /** 是否重复播放 */
      repeat?: boolean;
      /** 是否显示光标 */
      cursor?: boolean;
      /** 光标样式：line 竖线，block 方块 */
      cursorStyle?: 'line' | 'block';
    };
  };
}

/**
 * Markdown syntax extension configuration interface
 *
 * Markdown 语法扩展配置接口
 *
 * 对应 scripts/markdown/ 下的 remark 转换插件，
 * 后续新增语法扩展时在此接口追加开关字段。
 */
export interface MarkdownConfig {
  /** 是否启用 GFM 风味警告框（> [!note] / [!tip] / [!important] / [!warning] / [!caution]） */
  alert?: boolean;
}

/**
 * Widget configuration interface
 * 
 * 小部件配置接口
 */
export interface WidgetConfig {
  /** 最新文章组件配置 */
  LatestArticle: {
    /** 加载类型：button 点击按钮加载，auto 自动滚动加载 */
    type: 'button' | 'auto';
    /** 布局类型：horizontal 水平布局，vertical 垂直布局 */
    layout: 'horizontal' | 'vertical';
    /** 默认最大加载数量 */
    defaultLimit: number;
    /** 初始加载数量 */
    initialLoad: number;
    /** 每次加载更多的数量 */
    loadMore: number;
    /** 分栏数 */
    columns: number;
    /** 默认封面图片宽高比 */
    defaultAspectRatio: string;
    /** 横版封面高度 */
    horizontalHeight: string;
  };

  /** 作者信息配置 */
  author: {
    /** 头像图片URL */
    avatar: string;
    /** 社交平台链接 */
    social: Record<string, string>;
  };

  /** 广告配置 */
  ad: {
    /** 广告链接地址 */
    link: string;
  };

  /** 分类配置 */
  categories: Array<{
    /** 分类标识（用于URL路径） */
    name: string;
  }>;

  /** 轮播图配置 */
  carousel: {
    /** 布局方向：horizontal 水平，vertical 垂直 */
    layout: 'horizontal' | 'vertical';
  };

  /** 横幅配置 */
  banner: {
    /** 背景图片URL */
    backgroundImage: string;
  };
}

/**
 * Navigation item interface
 * 
 * 导航菜单项配置接口
 * 
 * 支持 Markdown 多级列表方式配置，通过 indent 字段控制层级：
 * - indent: 0 = 一级菜单（顶级导航）
 * - indent: 1 = 二级菜单（子菜单）
 * - indent: 2 = 三级菜单（孙子菜单）
 * 
 * 示例：
 * ```typescript
 * navbar: [
 *   { icon: 'Home', name: '首页', href: '/', indent: 0 },
 *   { icon: 'Database', name: '软件资源', indent: 0 },
 *   { icon: 'Database', name: 'Windows工具', href: '/software/windows', indent: 1 },
 *   { icon: 'Database', name: 'Mac工具', href: '/software/mac', indent: 1 },
 *   { icon: 'Book', name: '教程指南', indent: 0 },
 *   { icon: 'Code', name: '前端开发', href: '/tutorial/frontend', indent: 1 },
 * ]
 * ```
 */
export interface NavItem {
  /** 图标名称（@lucide/astro 图标名）或 unicode 字符 */
  icon?: string;
  /** 菜单显示名称 */
  name: string;
  /** 链接地址（href），如果没有则为父菜单 */
  href?: string;
  /** 缩进层级，0=一级菜单，1=二级菜单，2=三级菜单 */
  indent?: number;
}

/**
 * Dynamic effect configuration interface
 * 
 * 动态效果配置接口
 */
export interface DynamicEffectConfig {
  /** 是否在文章页面顶部显示波浪动画效果 */
  postTopWave: boolean;
}

/**
 * Sidebar configuration interface
 * 
 * 侧边栏组件显示控制配置接口
 */
export interface SidebarConfig {
  home: {
    /** 是否显示字数统计进度条 */
    progress: boolean;
    /** 是否显示统计小部件 */
    statsWidget: boolean;
    /** 是否显示作者信息卡片 */
    authorWidget: boolean;
    /** 是否显示广告小部件 */
    adWidget: boolean;
    /** 是否显示标签云 */
    tag: boolean;
    /** 是否显示推荐文章 */
    recommendedArticles: boolean;
    /** 是否显示站点统计 */
    statistic: boolean;
  };
  article: {
    /** 是否显示作者信息卡片 */
    authorWidget: boolean;
    /** 是否显示标签云 */
    tag: boolean;
    /** 是否显示文章目录 */
    toc: boolean;
  };
}