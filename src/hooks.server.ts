// import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'
// import { createServerClient } from '@supabase/ssr'
// import type { Handle } from '@sveltejs/kit'

// export const handle: Handle = async ({ event, resolve }) => {
//   event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
//     cookies: {
//       get: (key) => event.cookies.get(key),
//       /**
//        * Note: You have to add the `path` variable to the
//        * set and remove method due to sveltekit's cookie API
//        * requiring this to be set, setting the path to an empty string
//        * will replicate previous/standard behaviour (https://kit.svelte.dev/docs/types#public-types-cookies)
//        */
//       set: (key, value, options) => {
//         event.cookies.set(key, value, { ...options, path: '/' })
//       },
//       remove: (key, options) => {
//         event.cookies.delete(key, { ...options, path: '/' })
//       },
//     },
//   })

//   /**
//    * a little helper that is written for convenience so that instead
//    * of calling `const { data: { session } } = await supabase.auth.getSession()`
//    * you just call this `await getSession()`
//    */
//   event.locals.getSession = async () => {
//     const {
//       data: { session },
//     } = await event.locals.supabase.auth.getSession()
//     return session
//   }

//   return resolve(event, {
//     filterSerializedResponseHeaders(name) {
//       return name === 'content-range'
//     },
//   })
// }

// src/routes/hooks.server.ts
// SvelteKit v2
import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
} from "$env/static/public";
import { createServerClient } from "@supabase/ssr";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => event.cookies.getAll(),
        /**
         * SvelteKit's cookies API requires `path` to be explicitly set in
         * the cookie options. Setting `path` to `/` replicates previous/
         * standard behavior.
         */
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            event.cookies.set(name, value, { ...options, path: "/" });
          });
        },
      },
    }
  );

  event.locals.safeGetSession = async () => {
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession();
    if (!session) {
      return { session: null, user: null };
    }

    const {
      data: { user },
      error,
    } = await event.locals.supabase.auth.getUser();
    if (error) {
      // JWT validation has failed
      return { session: null, user: null };
    }
    return { session, user };
  };

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range' || name === 'x-supabase-api-version';
    },
  });
};
