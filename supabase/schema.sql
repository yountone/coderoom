-- 뮤지컬 커뮤니티 플랫폼 스키마

-- 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kakao_id TEXT UNIQUE NOT NULL,
  nickname TEXT NOT NULL,
  profile_image TEXT,
  tier TEXT NOT NULL DEFAULT 'Bronze'
    CHECK (tier IN ('Black', 'Gold', 'Silver', 'Bronze')),
  role TEXT NOT NULL DEFAULT 'user'
    CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 게시글 테이블
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id);

-- 뉴스 테이블 (관리자 전용)
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  summary TEXT,
  external_url TEXT NOT NULL,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_news_created ON news(created_at DESC);

-- 댓글 테이블 (대댓글은 parent_id로 지원)
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id, created_at);

-- 좋아요 테이블
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

CREATE INDEX IF NOT EXISTS idx_likes_post ON likes(post_id);

-- RLS 설정
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- 읽기: 모두 허용
CREATE POLICY "public_read_users" ON users FOR SELECT USING (true);
CREATE POLICY "public_read_posts" ON posts FOR SELECT USING (true);
CREATE POLICY "public_read_news" ON news FOR SELECT USING (true);
CREATE POLICY "public_read_comments" ON comments FOR SELECT USING (true);
CREATE POLICY "public_read_likes" ON likes FOR SELECT USING (true);

-- 쓰기: API 레이어에서 인증 확인 후 서비스 키로 수행
CREATE POLICY "auth_insert_posts" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "auth_insert_comments" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "auth_insert_likes" ON likes FOR INSERT WITH CHECK (true);
CREATE POLICY "auth_delete_posts" ON posts FOR DELETE USING (true);
CREATE POLICY "auth_delete_comments" ON comments FOR DELETE USING (true);
CREATE POLICY "auth_delete_likes" ON likes FOR DELETE USING (true);
CREATE POLICY "auth_insert_news" ON news FOR INSERT WITH CHECK (true);
CREATE POLICY "auth_delete_news" ON news FOR DELETE USING (true);
CREATE POLICY "auth_insert_users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "auth_update_users" ON users FOR UPDATE USING (true);
CREATE POLICY "auth_update_posts" ON posts FOR UPDATE USING (true);

-- 좋아요 수 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_likes_count
AFTER INSERT OR DELETE ON likes
FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();

-- 댓글 수 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_comments_count
AFTER INSERT OR DELETE ON comments
FOR EACH ROW EXECUTE FUNCTION update_post_comments_count();
