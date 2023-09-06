import { createClient } from '@supabase/supabase-js';
import { mergeDeepRight } from 'ramda';
import { DEFAULT_COOKIE_OPTIONS, isBrowser } from './utils';
import { parse, serialize } from 'cookie';

import type { SupabaseClient } from '@supabase/supabase-js';
import type {
	GenericSchema,
	SupabaseClientOptions
} from '@supabase/supabase-js/dist/module/lib/types';
import type { BrowserCookieMethods, CookieOptionsWithName } from './types';

let cachedBrowserClient: SupabaseClient<any, string> | undefined;

export function createBrowserClient<
	Database = any,
	SchemaName extends string & keyof Database = 'public' extends keyof Database
		? 'public'
		: string & keyof Database,
	Schema extends GenericSchema = Database[SchemaName] extends GenericSchema
		? Database[SchemaName]
		: any
>(
	supabaseUrl: string,
	supabaseKey: string,
	options?: SupabaseClientOptions<SchemaName> & {
		cookies: BrowserCookieMethods;
		cookieOptions?: CookieOptionsWithName;
		isSingleton?: boolean;
	}
) {
	if (!supabaseUrl || !supabaseKey) {
		throw new Error(
			`Your project's URL and Key are required to create a Supabase client!\n\nCheck your Supabase project's API settings to find these values\n\nhttps://supabase.com/dashboard/project/_/settings/api`
		);
	}

	let cookies: BrowserCookieMethods = {};
	let isSingleton = true;
	let cookieOptions: CookieOptionsWithName | undefined;
	let userDefinedClientOptions;

	if (options) {
		({ cookies, isSingleton = true, cookieOptions, ...userDefinedClientOptions } = options);
	}

	const cookieClientOptions = {
		global: {
			headers: {
				'X-Client-Info': `${PACKAGE_NAME}@${PACKAGE_VERSION}`
			}
		},
		auth: {
			flowType: 'pkce',
			autoRefreshToken: isBrowser(),
			detectSessionInUrl: isBrowser(),
			persistSession: true,
			storage: {
				getItem: async (key: string) => {
					if (typeof cookies.get === 'function') {
						return (await cookies.get(key)) ?? null;
					}

					if (isBrowser()) {
						const cookie = parse(document.cookie);
						return cookie[key];
					}
				},
				setItem: async (key: string, value: string) => {
					if (typeof cookies.set === 'function') {
						return await cookies.set(key, value, {
							...DEFAULT_COOKIE_OPTIONS,
							...cookieOptions
						});
					}

					if (isBrowser()) {
						document.cookie = serialize(key, value, {
							...DEFAULT_COOKIE_OPTIONS,
							...cookieOptions
						});
					}
				},
				removeItem: async (key: string) => {
					if (typeof cookies.remove === 'function') {
						return await cookies.remove(key, {
							...DEFAULT_COOKIE_OPTIONS,
							maxAge: 0,
							...cookieOptions
						});
					}

					if (isBrowser()) {
						document.cookie = serialize(key, '', {
							...DEFAULT_COOKIE_OPTIONS,
							maxAge: 0,
							...cookieOptions
						});
					}
				}
			}
		}
	};

	// Overwrites default client config with any user defined options
	const clientOptions = mergeDeepRight(
		cookieClientOptions,
		userDefinedClientOptions
	) as SupabaseClientOptions<SchemaName>;

	if (isSingleton) {
		// The `Singleton` pattern is the default to simplify the instantiation
		// of a Supabase client in the browser - there must only be one

		const browser = isBrowser();

		if (browser && cachedBrowserClient) {
			return cachedBrowserClient as SupabaseClient<Database, SchemaName, Schema>;
		}

		const client = createClient<Database, SchemaName, Schema>(
			supabaseUrl,
			supabaseKey,
			clientOptions
		);

		if (browser) {
			// The client should only be cached in the browser
			cachedBrowserClient = client;
		}

		return client;
	}

	// This allows for multiple Supabase clients, which may be required when using
	// multiple schemas. The user will be responsible for ensuring a single
	// instance of Supabase is used for each schema in the browser.
	return createClient<Database, SchemaName, Schema>(supabaseUrl, supabaseKey, clientOptions);
}
