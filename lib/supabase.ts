import { createClient, SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
    }

    client = createClient(url, key);
  }
  return client;
}

let serviceClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!serviceClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      throw new Error("Supabase 서비스 키가 설정되지 않았습니다.");
    }

    serviceClient = createClient(url, key);
  }
  return serviceClient;
}
