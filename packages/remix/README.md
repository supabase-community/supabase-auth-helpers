# @supabase/auth-helpers-remix (BETA)

This submodule provides convenience helpers for implementing user authentication in Remix applications.

## Installation

Using [npm](https://npmjs.org):

```sh
npm install @supabase/auth-helpers-remix
```

Using [yarn](https://yarnpkg.com/):

```sh
yarn add @supabase/auth-helpers-remix
```

This library supports the following tooling versions:

- Remix: `>=1.7.2`

## Getting Started

### Configuration

Set up the following env vars. For local development you can set them in a `.env` file. See an example [here](../../examples/remix/.env.example)).

> Environment variables are handled differently for different runtimes. This is how it is done in Node.

```bash
# Find these in your Supabase project settings > API
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### Basic Setup

To pipe Supabase environment variables from the server to the browser, we need to return them from the `app/root.tsx` loader.

```jsx
// app/root.tsx
export const loader = () => {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;
  return json({
    env: {
      SUPABASE_URL,
      SUPABASE_ANON_KEY
    }
  });
};
```

> Again, these may not be stored in `process.env` for environments other than Node.

Next, we call the `useLoaderData` hook in our component to get the `env` object.

```jsx
// app/root.tsx
const { env } = useLoaderData();
```

And then, add a `<script>` tag to attach these environment variables to the `window`. This should be placed immediately before the `<Scripts />` component in `app/root.tsx`

```jsx
<script
  dangerouslySetInnerHTML={{
    __html: `window.env = ${JSON.stringify(env)}`
  }}
/>
```

Full example for Node:

```jsx
import { json, MetaFunction, LoaderFunction } from '@remix-run/node'; // change this import to whatever runtime you are using
import {
  Form,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from '@remix-run/react';
import { createSupabaseClient } from '@supabase/auth-helpers-remix';

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1'
});

export const loader: LoaderFunction = () => {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;
  return json({
    env: {
      SUPABASE_URL,
      SUPABASE_ANON_KEY
    }
  });
};

export default function App() {
  const { env } = useLoaderData();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify(env)}`
          }}
        />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
```

You can now call the `createSupabaseClient` function on the server - `Loader` and `Action` functions - or on the client - `useEffect`.

### Loader

Loaders run on the server immediately before the component is rendered. You can create an authenticated Supabase client by calling the `createSupabaseClient` function and passing it your `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and a `Request` and `Response`.

```jsx
import { LoaderFunction } from '@remix-run/node'; // change this import to whatever runtime you are using
import { createSupabaseClient } from '@supabase/auth-helpers-remix';

export const loader: LoaderFunction = async ({
  request
}: {
  request: Request
}) => {
  const response = new Response();
  const supabaseClient = createSupabaseClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    { request, response }
  );
  // send queries to Supabase here!
  // return results
};
```

Supabase will set cookie headers to manage the user's auth session, therefore, the `response.headers` must be returned from the `Loader` function.

```jsx
import { LoaderFunction, json } from '@remix-run/node'; // change this import to whatever runtime you are using
import { createSupabaseClient } from '@supabase/auth-helpers-remix';

export const loader: LoaderFunction = async ({
  request
}: {
  request: Request
}) => {
  const response = new Response();
  const supabaseClient = createSupabaseClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    { request, response }
  );

  // send queries to Supabase here!

  // in order for the set-cookie header to be set,
  // headers must be returned as part of the loader response
  return json(
    { data },
    {
      headers: response.headers
    }
  );
};
```

### Action

Actions are functions that run server-side. You can create an authenticated Supabase client in a Remix action by calling the `createSupabaseClient` function and passing it your `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and a `Request` and `Response`.

```jsx
import { ActionFunction } from '@remix-run/node'; // change this import to whatever runtime you are using
import { createSupabaseClient } from '@supabase/auth-helpers-remix';

export const action: ActionFunction = async ({
  request
}: {
  request: Request
}) => {
  const response = new Response();
  const supabaseClient = createSupabaseClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    { request, response }
  );
  // send queries to Supabase here!
  // return results
};
```

Supabase will set cookie headers to manage the user's auth session, therefore, the `response.headers` must be returned from the `Action` function.

```jsx
import { ActionFunction, json } from '@remix-run/node'; // change this import to whatever runtime you are using
import { createSupabaseClient } from '@supabase/auth-helpers-remix';

export const action: ActionFunction = async ({
  request
}: {
  request: Request
}) => {
  const response = new Response();
  const supabaseClient = createSupabaseClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    { request, response }
  );

  // send queries to Supabase here!

  // in order for the set-cookie header to be set,
  // headers must be returned as part of the action response
  return json(
    { data },
    {
      headers: response.headers
    }
  );
};
```

### Client-side

The Supabase client can be used client-side to subscribe to realtime events - data changing in the database.

```jsx
import { createSupabaseClient } from '@supabase/auth-helpers-remix';
import { useState, useEffect } from 'react';

export default function SubscribeToRealtime() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const supabaseClient = createSupabaseClient(
      window.env.SUPABASE_URL,
      window.env.SUPABASE_ANON_KEY
    );
    const channel = supabaseClient
      .channel('test')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'test' },
        (payload) => {
          setData((data) => [...data, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [session]);

  return <pre>{JSON.stringify({ data }, null, 2)}</pre>;
}
```

> Note: window.env is not automatically populated by Remix. Check out the [example in this repo](../../examples/remix/app/root.tsx) or [Remix docs](https://remix.run/docs/en/v1/guides/envvars#browser-environment-variables) for more info

In this example we are listening to `INSERT` events on the `test` table. Anytime new rows are added to Supabase's `test` table, our UI will automatically update new data.

### Protected page

Since loaders run immediately before rendering the page on the server, this is the perfect place to redirect a user to the login page if they are not signed in.

```jsx
import { json, LoaderFunction, redirect } from '@remix-run/node'; // change this import to whatever runtime you are using
import { useLoaderData } from '@remix-run/react';
import { createSupabaseClient } from '@supabase/auth-helpers-remix';

export const loader: LoaderFunction = async ({
  request
}: {
  request: Request
}) => {
  const response = new Response();

  const supabaseClient = createSupabaseClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    { request, response }
  );

  const {
    data: { session }
  } = await supabaseClient.auth.getSession();

  const user = session?.user;

  if (!user) {
    // there is no user, therefore, we are redirecting
    // to the landing page. we still need to return
    // response.headers to attach the set-cookie header
    return redirect('/', {
      headers: response.headers
    });
  }

  // in order for the set-cookie header to be set,
  // headers must be returned as part of the loader response
  return json(
    { user },
    {
      headers: response.headers
    }
  );
};

export default function ProtectedPage() {
  // by fetching the user in the loader, we ensure it is available
  // for first SSR render - no flashing of incorrect state
  const { user } = useLoaderData();

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
```

### Usage with TypeScript

You can pass types that were [generated with the Supabase CLI](https://supabase.com/docs/reference/cli/usage#supabase-gen-types-typescript) to the `createSupabaseClient` function to get enhanced type safety and auto completion on the `supabaseClient`:

```jsx
// Creating a new supabase client object:
import { Database } from '../db_types';
import { ActionFunction, LoaderFunction, json } from '@remix-run/node'; // change this import to whatever runtime you are using
import { createSupabaseClient } from '@supabase/auth-helpers-remix';

export const loader: LoaderFunction = async ({
  request
}: {
  request: Request
}) => {
  const response = new Response();
  const supabaseClient =
    createSupabaseClient <
    Database >
    (process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    { request, response });

  // send queries to Supabase here!
  // send response
};

export const action: ActionFunction = async ({
  request
}: {
  request: Request
}) => {
  const response = new Response();
  const supabaseClient =
    createSupabaseClient <
    Database >
    (process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    { request, response });

  // send queries to Supabase here!
  // send response
};

export default Component = () => {
  const supabaseClient =
    createSupabaseClient <
    Database >
    (window.env.SUPABASE_URL, window.env.SUPABASE_ANON_KEY);
  // return jsx
};
```

### Server-side data fetching to OAuth APIs using `provider_token`

When using third-party auth providers, sessions are initiated with an additional `provider_token` field which is persisted as an HTTPOnly cookie upon logging in to enabled usage on the server-side. The `provider_token` can be used to make API requests to the OAuth provider's API endpoints on behalf of the logged-in user. In the following example, we fetch the user's full profile from the third-party API during SSR using their id and auth token:

```js
import { User, createSupabaseClient } from '@supabase/auth-helpers-remix';
import { ActionFunction, json, redirect } from '@remix-run/node'; // change this import to whatever runtime you are using
import { createSupabaseClient } from '@supabase/auth-helpers-remix';

interface Profile {
  /* ... */
}

export const loader: LoaderFunction = async ({
  request
}: {
  request: Request
}) => {
  const response = new Response();
  const supabaseClient = createSupabaseClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    { request, response }
  );

  const {
    data: { session }
  } = await supabaseClient.auth.getSession();

  const user = session?.user;

  if (!user) {
    // there is no user, therefore, we are redirecting
    // to the landing page. we still need to return
    // response.headers to attach the set-cookie header
    return redirect('/', {
      headers: response.headers
    });
  }

  // Retrieve provider_token from cookies
  const provider_token = request.headers.get('sb-provider-token');

  // Get logged in user's third-party id from metadata
  const userId = user?.user_metadata.provider_id;
  const profile: Profile = await (
    await fetch(`https://api.example.com/users/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${provider_token}`
      }
    })
  ).json();

  // in order for the set-cookie header to be set,
  // headers must be returned as part of the action response
  return json(
    { user, profile },
    {
      headers: response.headers
    }
  );
};

export default function ProtectedPage({
  user,
  profile
}: {
  user: User,
  profile: Profile
}) {
  const { user, data } = useLoaderData();
  return <pre>{JSON.stringify({ user, data }, null, 2)}</pre>;
}
```
