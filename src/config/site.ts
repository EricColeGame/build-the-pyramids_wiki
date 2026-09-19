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
  locales: ["en", "es", "pt", "de", "fr"],
  defaultLocale: "en",
};
