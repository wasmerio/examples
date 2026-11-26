// 表单友好的配置形状：拍平镜像 schema v2（名字/头衔/介绍/头像 + 链接/作品/数据 + 更多设置）。
// 所有标量默认空串、所有列表恒存在，方便 UI 直接 map / 增删；不含 normalizeSite 派生的键，也不带默认值。

export interface EditLink {
  label: string;
  url: string;
}

export interface EditWork {
  name: string;
  desc: string;
  link: string;
  source: string;
  image: string;
  date: string;
  via: string;
  group: string;
  star: boolean;
}

export interface EditStat {
  label: string;
  // 值可为字符串（"30+"、"自动"）或数字（导入的 YAML 里可能是纯数字）；两者都保留，往返不失真
  value: string | number;
}

export interface EditConfig {
  name: string;
  title: string;
  intro: string;
  avatar: string;
  links: EditLink[];
  works: EditWork[];
  stats: EditStat[];
  url: string;
  color: string;
  theme: string;
  appearance: string;
  opensource: string;
  opensourceSince: string;
  starLine: string;
  opensourceMax: string;
  // 开源节仓库名→显示名/描述映射。编辑器无专用 UI，仅原样往返保留（进阶字段，一般直接改 YAML）。
  opensourceNames: Record<string, string>;
  opensourceDescriptions: Record<string, string>;
  opensourceExclude: string[]; // 排除的仓库列表，元素可以是裸仓库名或完整 GitHub 网址；原样往返保留（无专用 UI）
  footer: string;
  mark: string;
  lang: string;
}

/** 空白最小模板：名字起步、作品零条。所有标量空串、所有列表空数组。 */
export function emptyConfig(): EditConfig {
  return {
    name: "",
    title: "",
    intro: "",
    avatar: "",
    links: [],
    works: [],
    stats: [],
    url: "",
    color: "",
    theme: "",
    appearance: "",
    opensource: "",
    opensourceSince: "",
    starLine: "",
    opensourceMax: "",
    opensourceNames: {},
    opensourceDescriptions: {},
    opensourceExclude: [],
    footer: "",
    mark: "",
    lang: "",
  };
}

/** 新增一条空作品：star 默认 false，「更多」字段全空。 */
export function emptyWork(): EditWork {
  return { name: "", desc: "", link: "", source: "", image: "", date: "", via: "", group: "", star: false };
}
