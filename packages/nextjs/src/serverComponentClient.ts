import {
	CookieAuthStorageAdapter,
	CookieOptions,
	CookieOptionsWithName,
	SupabaseClientOptionsWithoutAuth,
	createSupabaseClient
} from '@supabase/auth-helpers-shared';
import { cookies } from 'next/headers';
import { cache } from 'react';

import type { SupabaseClient } from '@supabase/supabase-js';
import type { GenericSchema } from '@supabase/supabase-js/dist/module/lib/types';

class NextServerComponentAuthStorageAdapter extends CookieAuthStorageAdapter {
	constructor(
		private readonly context: {
			cookies: () => ReturnType<typeof cookies>;
		},
		cookieOptions?: CookieOptions
	) {
		super(cookieOptions);
	}

	protected getCookie(name: string): string | null | undefined {
		const nextCookies = this.context.cookies();
		return nextCookies.get(name)?.value;
	}
	protected setCookie(name: string, value: string): void {
		// Server Components cannot set cookies. Must use Middleware, Server Action or Route Handler
		// https://github.com/vercel/next.js/discussions/41745#discussioncomment-5198848
	}
	protected deleteCookie(name: string): void {
		// Server Components cannot set cookies. Must use Middleware, Server Action or Route Handler
		// https://github.com/vercel/next.js/discussions/41745#discussioncomment-5198848
	}
}

export const createServerComponentClient = cache(
	<
		Database = any,
		SchemaName extends string & keyof Database = 'public' extends keyof Database
			? 'public'
			: string & keyof Database,
		Schema extends GenericSchema = Database[SchemaName] extends GenericSchema
			? Database[SchemaName]
			: any
	>(
		context: {
			cookies: () => ReturnType<typeof cookies>;
		},
		{
			supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL,
			supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
			options,
			cookieOptions
		}: {
			supabaseUrl?: string;
			supabaseKey?: string;
			options?: SupabaseClientOptionsWithoutAuth<SchemaName>;
			cookieOptions?: CookieOptionsWithName;
		} = {}
	): SupabaseClient<Database, SchemaName, Schema> => {
		if (!supabaseUrl || !supabaseKey) {
			throw new Error(
				'either NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY env variables or supabaseUrl and supabaseKey are required!'
			);
		}

		return createSupabaseClient<Database, SchemaName, Schema>(supabaseUrl, supabaseKey, {
			...options,
			global: {
				...options?.global,
				headers: {
					...options?.global?.headers,
					'X-Client-Info': `${PACKAGE_NAME}@${PACKAGE_VERSION}`
				}
			},
			auth: {
				storageKey: cookieOptions?.name,
				storage: new NextServerComponentAuthStorageAdapter(context, cookieOptions)
			}
		});
	}
);
