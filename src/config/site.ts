export interface SiteConfig {
  name: string;
  shortName: string;
  logoText: string;
  tagline: string;
  description: string;
  url: string;
  supportEmail: string;
  gameUrl?: string;
  heroVideoId?: string;
  social?: {
    discord?: string;
    youtube?: string;
    twitter?: string;
    tiktok?: string;
  };
  locales: readonly string[];
  defaultLocale: string;
}

export const siteConfig: SiteConfig = {
  name: "Build the Pyramids Wiki",
  shortName: "Build the Pyramids",
  logoText: "BP",
  tagline: "Complete Guides, Codes, Building Tips & Progression",
  description: "Build the Pyramids Wiki provides Roblox guides, pyramid building tips, gameplay strategies, updates, and resources to help players master the ancient building simulator.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://build-the-pyramids.wiki",
  supportEmail: `support@${new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://build-the-pyramids.wiki").hostname.replace(/^www\./, "")}`,
  gameUrl: "https://www.roblox.com/games/123720558354386/Build-the-Pyramid",
  heroVideoId: "RReauXU-Od4", // Build the Pyramid! (Roblox) full gameplay walkthrough — RobloMine
  // 00基础信息.md 第 1 节把官方 Discord / Reddit / YouTube 全部标记为「待补充」——
  // 该游戏（universeId 10765012427，开发者 Janitors Studios）没有独立官方社交账号。
  // 因此这里只填真实可验证的官方归属：开发者官方 Roblox 群组 + Roblox 官方 YouTube，
  // 不虚构 discord.gg/xxx 之类的假邀请链接。
  social: {
    discord: "https://www.roblox.com/communities/907940218/Janitors-Studios",
    youtube: "https://www.youtube.com/@roblox",
  },
  // 语言集合的唯一真相源是 src/i18n/routing.ts，此处仅为镜像取值；
  // 模板旧值含已移除的 "fr"，与 routing.locales 对齐（当前无消费者）。
  locales: ["en", "es", "pt", "de"],
  defaultLocale: "en",
};
