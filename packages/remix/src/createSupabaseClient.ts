import {
	BrowserCookieAuthStorageAdapter,
	CookieAuthStorageAdapter,
	CookieOptions,
	CookieOptionsWithName,
	createSupabaseClient,
	parseCookies,
	serializeCookie,
	SupabaseClientOptionsWithoutAuth
} from '@supabase/auth-helpers-shared';
import { SupabaseClient } from '@supabase/supabase-js';
import { GenericSchema } from '@supabase/supabase-js/dist/module/lib/types';

/**
 * ## Authenticated Supabase client
 * ### Loader
 *
 * ```ts
 * import { createServerClient } from '@supabase/auth-helpers-remix';
 *
 * export const loader = async ({ request }: { request: Request }) => {
 *   const response = new Response();
 *
 *   const supabaseClient = createServerClient(
 *     process.env.SUPABASE_URL,
 *     process.env.SUPABASE_ANON_KEY,
 *     { request, response }
 *   );
 *
 *   const { data } = await supabaseClient.from('test').select('*');
 *
 *   return json(
 *    { data },
 *    { headers: response.headers }
 *   );
 * };
 * ```
 *
 * ### Action
 *
 * ```ts
 * import { createServerClient } from '@supabase/auth-helpers-remix';
 *
 * export const action = async ({ request }: { request: Request }) => {
 *   const response = new Response();
 *
 *   const supabaseClient = createServerClient(
 *     process.env.SUPABASE_URL,
 *     process.env.SUPABASE_ANON_KEY,
 *     { request, response }
 *   );
 *
 *   const { data } = await supabaseClient.from('test').select('*');
 *
 *   return json(
 *    { data },
 *    { headers: response.headers }
 *   );
 * };
 * ```
 *
 * ### Component
 *
 * ```ts
 * import { createBrowserClient } from '@supabase/auth-helpers-remix';
 *
 * useEffect(() => {
 *   const supabaseClient = createBrowserClient(
 *     window.env.SUPABASE_URL,
 *     window.env.SUPABASE_ANON_KEY
 *   );
 *
 *   const getData = async () => {
 *     const { data: supabaseData } = await supabaseClient
 *       .from('test')
 *       .select('*');
 *
 *     console.log({ data });
 *   };
 *
 *   getData();
 * }, []);
 * ```
 *
 * Note: window.env is not automatically populated by Remix
 * Check out the [example app](../../../../examples/remix/app/root.tsx) or
 * [Remix docs](https://remix.run/docs/en/v1/guides/envvars#browser-environment-variables) for more info
 */

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
	{
		options,
		cookieOptions
	}: {
		options?: SupabaseClientOptionsWithoutAuth<SchemaName>;
		cookieOptions?: CookieOptionsWithName;
	} = {}
): SupabaseClient<Database, SchemaName, Schema> {
	if (!supabaseUrl || !supabaseKey) {
		throw new Error(
			'supabaseUrl and supabaseKey are required to create a Supabase client! Find these under `Settings` > `API` in your Supabase dashboard.'
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
			storage: new BrowserCookieAuthStorageAdapter(cookieOptions)
		}
	});
}

class RemixServerAuthStorageAdapter extends CookieAuthStorageAdapter {
	constructor(
		private readonly request: Request,
		private readonly response: Response,
		cookieOptions?: CookieOptions
	) {
		super(cookieOptions);
	}

	protected getCookie(name: string): string | null | undefined {
		return parseCookies(this.request?.headers?.get('Cookie') ?? '')[name];
	}
	protected setCookie(name: string, value: string): void {
		const cookieStr = serializeCookie(name, value, {
			...this.cookieOptions,
			// Allow supabase-js on the client to read the cookie as well
			httpOnly: false
		});
		this.response.headers.append('set-cookie', cookieStr);
	}
	protected deleteCookie(name: string): void {
		const cookieStr = serializeCookie(name, '', {
			...this.cookieOptions,
			maxAge: 0,
			// Allow supabase-js on the client to read the cookie as well
			httpOnly: false
		});
		this.response.headers.append('set-cookie', cookieStr);
	}
}

export function createServerClient<
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
	{
		request,
		response,
		options,
		cookieOptions
	}: {
		request: Request;
		response: Response;
		options?: SupabaseClientOptionsWithoutAuth<SchemaName>;
		cookieOptions?: CookieOptionsWithName;
	}
): SupabaseClient<Database, SchemaName, Schema> {
	if (!supabaseUrl || !supabaseKey) {
		throw new Error(
			'supabaseUrl and supabaseKey are required to create a Supabase client! Find these under `Settings` > `API` in your Supabase dashboard.'
		);
	}

	if (!request || !response) {
		throw new Error(
			'request and response must be passed to createSupabaseClient function, when called from loader or action'
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
			storage: new RemixServerAuthStorageAdapter(request, response, cookieOptions)
		}
	});
}
