import type { LucideIcon } from "lucide-react";

export type NavItem = {
  key: string;
  path: string;
  icon: LucideIcon;
  isContentType: boolean;
};

/**
 * 顶部导航配置。
 * 本阶段（Part 3）清空为 []，由后续阶段按新游戏重建；
 * 结构保持不变，SiteHeader 仍读取 item.key / item.path / item.isContentType。
 */
export const NAVIGATION_CONFIG: NavItem[] = [];

export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map((item) => item.path.replace(/^\//, ""));
