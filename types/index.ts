export type Tier = "Black" | "Gold" | "Silver" | "Bronze";
export type Role = "admin" | "user";

export interface User {
  id: string;
  kakao_id: string;
  nickname: string;
  profile_image: string | null;
  tier: Tier;
  role: Role;
  created_at: string;
}

export interface Post {
  id: string;
  author_id: string;
  content: string;
  image_url: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  author?: User;
  liked_by_me?: boolean;
}

export interface News {
  id: string;
  author_id: string;
  title: string;
  summary: string | null;
  external_url: string;
  thumbnail_url: string | null;
  created_at: string;
  author?: User;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
  author?: User;
  replies?: Comment[];
}
