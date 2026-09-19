import type { LucideIcon } from "lucide-react";
import { BookOpen, Hammer, Landmark, Lightbulb, Video } from "lucide-react";

export type NavItem = {
  /** 翻译键，对应 src/locales/*.json 的 nav 命名空间 */
  key: string;
  /** URL 路径，必须与 content/<locale>/ 下的分类目录名一致 */
  path: `/${string}`;
  icon: LucideIcon;
  isContentType: boolean;
};

/**
 * 顶部导航配置。
 * 分类 slug 取自关键词.json 的 categories，并与 content/<locale>/ 下的文章子目录一一对应：
 * guide / construction / theories / history / media。
 * key 是翻译键、path 是 URL，二者不可混为一个字段。
 */
export const NAVIGATION_CONFIG = [
  { key: "guide", path: "/guide", icon: BookOpen, isContentType: true },
  { key: "construction", path: "/construction", icon: Hammer, isContentType: true },
  { key: "theories", path: "/theories", icon: Lightbulb, isContentType: true },
  { key: "history", path: "/history", icon: Landmark, isContentType: true },
  { key: "media", path: "/media", icon: Video, isContentType: true },
] satisfies readonly NavItem[];

export const CONTENT_TYPES: string[] = NAVIGATION_CONFIG.filter((item) => item.isContentType).map((item) => item.path.replace(/^\//, ""));
