-- WagleMap 분석 결과 캐시 테이블
CREATE TABLE IF NOT EXISTS analysis_cache (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  neighborhood TEXT NOT NULL UNIQUE,
  result JSONB NOT NULL,
  analyzed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 검색 성능을 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_analysis_cache_neighborhood
  ON analysis_cache (neighborhood);

CREATE INDEX IF NOT EXISTS idx_analysis_cache_analyzed_at
  ON analysis_cache (analyzed_at DESC);

-- RLS (Row Level Security) 설정
ALTER TABLE analysis_cache ENABLE ROW LEVEL SECURITY;

-- 누구나 읽기 가능 (anon key)
CREATE POLICY "Anyone can read cache"
  ON analysis_cache FOR SELECT
  USING (true);

-- 서버에서만 쓰기 가능 (anon key로도 가능하게 설정, 필요 시 service_role로 변경)
CREATE POLICY "Anyone can insert cache"
  ON analysis_cache FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update cache"
  ON analysis_cache FOR UPDATE
  USING (true);
