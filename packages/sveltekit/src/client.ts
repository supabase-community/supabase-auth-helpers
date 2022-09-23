import { browser } from '$app/environment';
import { invalidateAll } from '$app/navigation';
import { page } from '$app/stores';
import type { AuthChangeEvent, User } from '@supabase/supabase-js';
import { onMount } from 'svelte';
import { getConfig } from './config';
import type { SupabaseSession } from './types';

const HANDLE_EVENTS: AuthChangeEvent[] = ['SIGNED_IN', 'SIGNED_OUT'];

/**
 * Setup session sync.
 * Sends the session to the server when it´s retrieved from a browser only authentication method
 * and calls `invalidateAll()` when the accessToken is about to expire to get the updated session from the server.
 */
export function startSupabaseSessionSync() {
  if (!browser) {
    return;
  }
  const {
    supabaseClient,
    tokenRefreshMargin,
    endpointPrefix,
    getSessionFromPageData
  } = getConfig();

  onMount(() => {
    let timeout: ReturnType<typeof setTimeout> | null;
    let expiresAt: number | undefined;

    const resetTimout = () => {
      timeout && clearTimeout(timeout);
      timeout = null;
    };
    let lastSession: SupabaseSession;

    const pageUnsub = page.subscribe(({ data }) => {
      const session = getSessionFromPageData(data);

      // skip duplicated runs
      if (lastSession === session) {
        return;
      }
      lastSession = session;

      // accessToken is undefined if there is no user
      if (!session.accessToken) {
        resetTimout();
        // @ts-expect-error this is a private method but we have to clear the session
        supabaseClient.auth._removeSession();
        return;
      }

      supabaseClient.auth.setAuth(session.accessToken);

      const exp = (session.user as User & { exp: number })?.exp;
      if (!exp) {
        resetTimout();
        return;
      }

      if (exp !== expiresAt) {
        expiresAt = exp;

        const timeNow = Math.round(Date.now() / 1000);
        const expiresIn = expiresAt - timeNow;
        const refreshDurationBeforeExpires =
          expiresIn > tokenRefreshMargin ? tokenRefreshMargin : 0.5;

        resetTimout();

        timeout = setTimeout(() => {
          // refresh token
          invalidateAll();
        }, (expiresIn - refreshDurationBeforeExpires) * 1000);
      }
    });

    const { data: subscription } = supabaseClient.auth.onAuthStateChange(
      (event, session) => {
        if (HANDLE_EVENTS.indexOf(event) === -1) return;

        fetch(`${endpointPrefix}/callback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event, session }),
          credentials: 'same-origin'
        }).then((response) => {
          if (response.ok) {
            invalidateAll();
          }
        });
      }
    );

    return () => {
      timeout && clearTimeout(timeout);
      pageUnsub();
      subscription?.unsubscribe();
    };
  });
}
