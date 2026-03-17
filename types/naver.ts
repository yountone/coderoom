export interface NaverSearchItem {
  title: string;
  link: string;
  description: string;
  bloggername?: string;
  bloggerlink?: string;
  cafename?: string;
  cafeurl?: string;
  postdate: string;
}

export interface NaverSearchResponse {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: NaverSearchItem[];
}
