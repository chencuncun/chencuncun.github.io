
export interface PortfolioItem {
  id: string;
  url: string;
  title: string;
  category: string;
  width?: number;
  height?: number;
  isAiGenerated?: boolean;
  isCover?: boolean;
}

export type FilterType = string;

export interface GenerationConfig {
  aspectRatio: '1:1' | '3:4' | '4:3' | '16:9';
}

export interface SiteConfig {
  siteName: string;
  description: string;
  categories: string[];
  items: PortfolioItem[];
}
