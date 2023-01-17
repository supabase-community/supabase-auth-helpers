import {
  createBrowserSupabaseClient,
  type CookieOptions,
  type SupabaseClientOptions
} from '@supabase/auth-helpers-shared';
import { setConfig } from './config';
import { PKG_NAME, PKG_VERSION } from './constants';
import type { TypedSupabaseClient } from './types';

export function createClient(
  supabaseUrl: string,
  supabaseKey: string,
  options?: SupabaseClientOptions<App.Supabase['SchemaName']>,
  cookieOptions?: CookieOptions
) {
  const opts: SupabaseClientOptions<App.Supabase['SchemaName']> = {
    ...options,
    global: {
      ...options?.global,
      headers: {
        ...options?.global?.headers,
        'X-Client-Info': `${PKG_NAME}@${PKG_VERSION}`
      }
    }
  };

  const globalInstance: TypedSupabaseClient = createBrowserSupabaseClient({
    supabaseUrl,
    supabaseKey,
    options: opts,
    cookieOptions
  });

  setConfig({
    globalInstance,
    supabaseUrl,
    supabaseKey,
    options: opts,
    cookieOptions: {
      name: 'supabase-auth-token',
      path: '/',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 365,
      ...cookieOptions
    }
  });

  return globalInstance;
}
